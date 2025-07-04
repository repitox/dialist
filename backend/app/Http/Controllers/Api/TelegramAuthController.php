<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TelegramAuthController extends Controller
{
    /**
     * Авторизация через Telegram
     */
    public function login(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'first_name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'photo_url' => 'nullable|url',
            'language_code' => 'nullable|string|max:10',
            'auth_date' => 'required|integer',
            'hash' => 'required|string',
        ]);

        // Проверяем подлинность данных от Telegram
        if (!$this->verifyTelegramAuth($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'Неверные данные авторизации Telegram'
            ], 401);
        }

        // Ищем существующего пользователя
        $user = User::findByTelegramId($request->id);

        if (!$user) {
            // Создаем нового пользователя
            $user = User::create([
                'name' => $request->first_name . ($request->last_name ? ' ' . $request->last_name : ''),
                'telegram_id' => $request->id,
                'telegram_username' => $request->username,
                'telegram_first_name' => $request->first_name,
                'telegram_last_name' => $request->last_name,
                'telegram_photo_url' => $request->photo_url,
                'telegram_language_code' => $request->language_code,
                'auth_provider' => 'telegram',
                'is_active' => true,
                'last_login_at' => now(),
            ]);
        } else {
            // Обновляем данные существующего пользователя
            $user->update([
                'telegram_username' => $request->username,
                'telegram_first_name' => $request->first_name,
                'telegram_last_name' => $request->last_name,
                'telegram_photo_url' => $request->photo_url,
                'telegram_language_code' => $request->language_code,
                'last_login_at' => now(),
            ]);
        }

        // Создаем токен для API
        $token = $user->createToken('telegram-auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Авторизация успешна',
            'user' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'telegram_username' => $user->telegram_username,
                'telegram_photo_url' => $user->telegram_photo_url,
                'auth_provider' => $user->auth_provider,
                'phone' => $user->phone,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Получить информацию о текущем пользователе
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'telegram_username' => $user->telegram_username,
                'telegram_photo_url' => $user->telegram_photo_url,
                'auth_provider' => $user->auth_provider,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at,
            ]
        ]);
    }

    /**
     * Выход из системы
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Выход выполнен успешно'
        ]);
    }

    /**
     * Проверка подлинности данных от Telegram
     */
    private function verifyTelegramAuth(array $data)
    {
        $botToken = config('services.telegram.bot_token');
        
        if (!$botToken) {
            return false;
        }

        $checkHash = $data['hash'];
        unset($data['hash']);

        $dataCheckArr = [];
        foreach ($data as $key => $value) {
            if ($value !== null && $value !== '') {
                $dataCheckArr[] = $key . '=' . $value;
            }
        }
        
        sort($dataCheckArr);
        $dataCheckString = implode("\n", $dataCheckArr);
        
        $secretKey = hash('sha256', $botToken, true);
        $hash = hash_hmac('sha256', $dataCheckString, $secretKey);

        // Проверяем, что данные не старше 24 часов
        $authDate = $data['auth_date'] ?? 0;
        if (time() - $authDate > 86400) {
            return false;
        }

        return hash_equals($hash, $checkHash);
    }
}
