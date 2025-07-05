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
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo">Dialist</h1>
              <p className="tagline">переставай забывать</p>
            </div>
            
            <div className="user-welcome">
              {user.telegram_photo_url && (
                <img 
                  src={user.telegram_photo_url} 
                  alt="Profile" 
                  className="profile-photo-small"
                />
              )}
              <span className="welcome-text">Привет, {user.name}!</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="user-dashboard">
            <div className="user-info-card">
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Шапка */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">Dialist</h1>
            <p className="tagline">переставай забывать</p>
          </div>
          
          <div className="auth-button-wrapper">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <TelegramLogin
              botUsername={botUsername}
              onAuth={handleTelegramAuth}
              buttonSize="large"
            />
          </div>
        </div>
      </header>

      {/* Контентный блок */}
      <main className="main-content">
        <div className="masonry-grid">
          {/* Главная карточка */}
          <div className="card card-hero">
            <div className="card-content">
              <h1 className="hero-title">Dialist</h1>
              <p className="hero-subtitle">Твой ежедневник, созданный с помощью AI помощников</p>
              <div className="hero-features">
                <span className="feature-tag">✨ AI-помощник</span>
                <span className="feature-tag">📱 Telegram-бот</span>
                <span className="feature-tag">👥 Совместная работа</span>
              </div>
            </div>
          </div>

          {/* Карточка трекинга задач */}
          <div className="card card-feature">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <h3>Трекинг задач</h3>
              <p>Управляйте задачами, объединяйте их в проекты, устанавливайте приоритет и сроки.</p>
            </div>
          </div>

          {/* Карточка совместного доступа */}
          <div className="card card-feature card-tall">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>Совместный доступ</h3>
              <p>Вы можете пригласить в проекты до 5 человек, чтобы иметь общие списки дел</p>
              <div className="collaboration-preview">
                <div className="avatar-group">
                  <div className="avatar">👤</div>
                  <div className="avatar">👤</div>
                  <div className="avatar">👤</div>
                  <div className="avatar-more">+2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Карточка Telegram */}
          <div className="card card-feature">
            <div className="card-icon">📱</div>
            <div className="card-content">
              <h3>Интеграция с Telegram</h3>
              <p>Доступен Telegram-бот с упрощенным интерфейсом для быстрого доступа к самому важному</p>
            </div>
          </div>

          {/* Карточка тарифов */}
          <div className="card card-pricing">
            <div className="card-content">
              <div className="pricing-icon">💰</div>
              <h3>Гибкие тарифы</h3>
              <p>Расширенный функционал по цене кружки кофе</p>
              <div className="price-tag">
                <span className="price">7 дней</span>
                <span className="price-label">бесплатно</span>
              </div>
            </div>
          </div>

          {/* Карточка социальных сетей */}
          <div className="card card-social">
            <div className="card-content">
              <h3>Следите за разработкой</h3>
              <div className="social-links-compact">
                <a href="https://dzen.ru/dialist_ya" target="_blank" rel="noopener noreferrer" className="social-link-compact">
                  <span className="social-icon">📰</span>
                  <span>Дзен</span>
                </a>
                <a href="https://x.com/dialist_x" target="_blank" rel="noopener noreferrer" className="social-link-compact">
                  <span className="social-icon">🐦</span>
                  <span>X</span>
                </a>
                <a href="https://t.me/dialist_tg" target="_blank" rel="noopener noreferrer" className="social-link-compact">
                  <span className="social-icon">📢</span>
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Карточка статистики */}
          <div className="card card-stats">
            <div className="card-content">
              <h3>Уже используют</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">пользователей</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5000+</div>
                  <div className="stat-label">задач создано</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
