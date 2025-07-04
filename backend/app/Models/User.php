<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'telegram_id',
        'telegram_username',
        'telegram_first_name',
        'telegram_last_name',
        'telegram_photo_url',
        'telegram_language_code',
        'phone',
        'phone_verified_at',
        'auth_provider',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Найти пользователя по Telegram ID
     */
    public static function findByTelegramId($telegramId)
    {
        return static::where('telegram_id', $telegramId)->first();
    }

    /**
     * Найти пользователя по номеру телефона
     */
    public static function findByPhone($phone)
    {
        return static::where('phone', $phone)->first();
    }

    /**
     * Получить полное имя пользователя
     */
    public function getFullNameAttribute()
    {
        if ($this->telegram_first_name || $this->telegram_last_name) {
            return trim($this->telegram_first_name . ' ' . $this->telegram_last_name);
        }
        
        return $this->name;
    }

    /**
     * Проверить, авторизован ли пользователь через Telegram
     */
    public function isTelegramUser()
    {
        return $this->auth_provider === 'telegram' && !empty($this->telegram_id);
    }

    /**
     * Проверить, авторизован ли пользователь через телефон
     */
    public function isPhoneUser()
    {
        return $this->auth_provider === 'phone' && !empty($this->phone);
    }
}
