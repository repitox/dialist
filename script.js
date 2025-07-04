// Функция для показа сообщения
function showMessage() {
    const messageElement = document.getElementById('message');
    const button = document.querySelector('.start-button');
    
    // Показываем сообщение
    messageElement.classList.remove('hidden');
    
    // Изменяем текст кнопки
    button.textContent = 'Спасибо! 🎉';
    button.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    
    // Добавляем эффект конфетти (эмуляция)
    createConfetti();
    
    // Возвращаем кнопку в исходное состояние через 3 секунды
    setTimeout(() => {
        button.textContent = 'Начать работу';
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 3000);
}

// Функция для создания эффекта конфетти
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            // Удаляем элемент после анимации
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// Добавляем CSS анимацию для падающих элементов
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Добавляем интерактивность при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🗓️ Dialist загружен успешно!');
    
    // Добавляем эффект печатания для заголовка
    const title = document.querySelector('.welcome-card h2');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Запускаем эффект печатания через небольшую задержку
    setTimeout(typeWriter, 500);
});

// Добавляем обработчик для клавиши Enter
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        showMessage();
    }
});

// Функция для получения текущего времени
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('ru-RU');
}

// Выводим время загрузки в консоль
console.log(`Страница загружена: ${getCurrentTime()}`);