import React, { useState, useEffect } from 'react';
import TelegramLogin from './components/TelegramLogin';
import './App.css';

interface User {
  id: number;
  name: string;
  telegram_username?: string;
  telegram_photo_url?: string;
  auth_provider: string;
  phone?: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  auth_date: number;
  hash: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const botUsername = process.env.REACT_APP_TELEGRAM_BOT_USERNAME || 'your_bot_username';
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Проверяем, есть ли сохраненный токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramAuth = async (telegramUser: TelegramUser) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramUser),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        // Перенаправляем на главную страницу приложения
        window.location.href = '/main';
      } else {
        setError(data.message || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(`${apiUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="user-info">
            {user.telegram_photo_url && (
              <img 
                src={user.telegram_photo_url} 
                alt="Profile" 
                className="profile-photo"
              />
            )}
            <h2>Добро пожаловать, {user.name}!</h2>
            <p>Авторизация через: {user.auth_provider}</p>
            {user.telegram_username && (
              <p>Telegram: @{user.telegram_username}</p>
            )}
            {user.phone && (
              <p>Телефон: {user.phone}</p>
            )}
          </div>
          <div className="actions">
            <button 
              onClick={() => window.location.href = '/main'}
              className="main-button"
            >
              Перейти к дневнику
            </button>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Выйти
            </button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-section">
          <h1>📔 Dialist</h1>
          <p>Ваш персональный цифровой дневник</p>
        </div>
        
        <div className="auth-section">
          <h2>Войти в систему</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="telegram-auth">
            <p>Войдите через Telegram для быстрого доступа:</p>
            <TelegramLogin
              botUsername={botUsername}
              onAuth={handleTelegramAuth}
              buttonSize="large"
            />
          </div>
          
          <div className="alternative-auth">
            <p>Или используйте другие способы входа:</p>
            <button className="phone-auth-button" disabled>
              📱 Вход по номеру телефона (скоро)
            </button>
          </div>
        </div>
        
        <div className="features">
          <h3>Возможности Dialist:</h3>
          <ul>
            <li>📝 Ведение личного дневника</li>
            <li>📅 Планирование дел и событий</li>
            <li>🔒 Безопасное хранение записей</li>
            <li>📱 Доступ с любого устройства</li>
            <li>🔍 Поиск по записям</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
