<?php

use App\Http\Controllers\Api\TelegramAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Публичные маршруты
Route::prefix('auth')->group(function () {
    Route::post('/telegram', [TelegramAuthController::class, 'login']);
});

// Защищенные маршруты
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [TelegramAuthController::class, 'me']);
    Route::post('/logout', [TelegramAuthController::class, 'logout']);
    
    // Здесь будут маршруты для основного функционала приложения
    Route::prefix('dialist')->group(function () {
        // TODO: Добавить маршруты для дневника
    });
});

// Проверка работоспособности API
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'Dialist API'
    ]);
});