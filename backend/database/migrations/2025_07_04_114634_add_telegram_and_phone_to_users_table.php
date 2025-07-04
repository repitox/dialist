<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Telegram данные
            $table->bigInteger('telegram_id')->nullable()->unique()->after('email');
            $table->string('telegram_username')->nullable()->after('telegram_id');
            $table->string('telegram_first_name')->nullable()->after('telegram_username');
            $table->string('telegram_last_name')->nullable()->after('telegram_first_name');
            $table->string('telegram_photo_url')->nullable()->after('telegram_last_name');
            $table->string('telegram_language_code', 10)->nullable()->after('telegram_photo_url');
            
            // Телефон
            $table->string('phone')->nullable()->unique()->after('telegram_language_code');
            $table->timestamp('phone_verified_at')->nullable()->after('phone');
            
            // Дополнительные поля
            $table->enum('auth_provider', ['telegram', 'phone', 'email'])->default('email')->after('phone_verified_at');
            $table->boolean('is_active')->default(true)->after('auth_provider');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            
            // Делаем email необязательным для Telegram авторизации
            $table->string('email')->nullable()->change();
            $table->string('password')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
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
                'last_login_at'
            ]);
            
            // Возвращаем обязательность полей
            $table->string('email')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });
    }
};
