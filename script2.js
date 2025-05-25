// Matrix EFFECT
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const alphabet = 'アカサタナハマヤラワガザダバパイキシチニヒミリギジビウクスツヌフムユルグズブエケセテネヘメレゲゼベオコソトノホモヨロゴゾドボヴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 18;
let columns, rainDrops;
function setupMatrix() {
    columns = Math.floor(canvas.width / fontSize);
    rainDrops = Array.from({ length: columns }).fill(1);
}
setupMatrix();
window.addEventListener('resize', setupMatrix);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00'; ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) { rainDrops[i] = 0; }
        rainDrops[i]++;
    }
}
setInterval(drawMatrix, 37);

// Basit "veritabanı"
let userData = null;

// Giriş/Kayıt ekranı yönetimi
const authScreen = document.getElementById('auth-screen');
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginMessage = document.getElementById('login-message');
const registerFullname = document.getElementById('register-fullname');
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const registerPassword2 = document.getElementById('register-password2');
const registerBtn = document.getElementById('register-btn');
const registerMessage = document.getElementById('register-message');

showLoginBtn.onclick = () => {
    showLoginBtn.classList.add('active');
    showRegisterBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginMessage.textContent = '';
    registerMessage.textContent = '';
};
showRegisterBtn.onclick = () => {
    showLoginBtn.classList.remove('active');
    showRegisterBtn.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginMessage.textContent = '';
    registerMessage.textContent = '';
};

// Kayıt işlemi
registerBtn.onclick = () => {
    const fullname = registerFullname.value.trim();
    const username = registerUsername.value.trim();
    const password = registerPassword.value;
    const password2 = registerPassword2.value;

    if (!fullname || !username || !password || !password2) {
        showRegisterError("Tüm alanları doldurun.");
        return;
    }
    if (password.length < 4) {
        showRegisterError("Parola en az 4 karakter olmalı.");
        return;
    }
    if (password !== password2) {
        showRegisterError("Parolalar eşleşmiyor.");
        return;
    }
    if (userData && userData.username === username) {
        showRegisterError("Bu kullanıcı adı zaten kayıtlı.");
        return;
    }
    // Başarılı kayıt
    userData = { fullname, username, password };
    showRegisterSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    // Alanları temizle
    setTimeout(() => {
        showLoginBtn.click();
        loginUsername.value = username;
        loginPassword.value = '';
    }, 1100);
};

function showRegisterError(msg) {
    registerMessage.textContent = msg;
    registerMessage.classList.add("error");
}
function showRegisterSuccess(msg) {
    registerMessage.textContent = msg;
    registerMessage.classList.remove("error");
}

// Giriş işlemi
loginBtn.onclick = () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    if (!username || !password) {
        showLoginError("Tüm alanları doldurun.");
        return;
    }
    if (!userData || userData.username !== username || userData.password !== password) {
        showLoginError("Geçersiz kullanıcı adı veya parola!");
        return;
    }
    // Başarılı giriş: Animasyonlu boot ekranı + terminal göster
    showLoginSuccess("Giriş başarılı! Sistem açılıyor...");
    setTimeout(() => {
        authScreen.classList.add('hidden');
        startBootSequence();
    }, 800);
};

function showLoginError(msg) {
    loginMessage.textContent = msg;
    loginMessage.classList.add("error");
}
function showLoginSuccess(msg) {
    loginMessage.textContent = msg;
    loginMessage.classList.remove("error");
}

// BOOT ANIMATION
const bootSequence = document.getElementById('boot-sequence');
const bootText = document.getElementById('boot-text');
const progressBar = document.querySelector('.progress-bar-inner');
function startBootSequence() {
    bootSequence.classList.remove('hidden');
    const bootMessages = [
        'Sistem çekirdeğiyle bağlantı kuruluyor...',
        'Ana menü envanterleri geri yükleniyor...',
        'Bellek blokları taranıyor...',
        'Çekirdek modülleri yükleniyor...',
        'Arayüz başlatılıyor...'
    ];
    let messageIndex = 0, progress = 0;
    progressBar.style.width = '0%';
    bootText.textContent = bootMessages[0];
    const progressInterval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        if (progress >= (messageIndex + 1) * 20 && messageIndex < bootMessages.length - 1) {
            messageIndex++;
            bootText.textContent = bootMessages[messageIndex];
        }
        if (progress >= 100) {
            clearInterval(progressInterval);
            bootText.textContent = "Sistem hazır. Arayüz yükleniyor...";
            setTimeout(showTerminal, 900);
        }
    }, 35);
}

// TERMINAL
const terminalWindow = document.getElementById('terminal-window');
const terminalOutput = document.getElementById('terminal-output');
const inputLine = document.querySelector('.input-line');
const cursorSpan = inputLine.querySelector('.cursor');
const hackCommands = [
    "whoami",
    "ls -la /root",
    "cat /etc/passwd",
    "echo 'Welcome, agent.'",
    "nmap -p- localhost",
    "sudo rm -rf /",
    "cat flag.txt",
    "exit"
];
let commandIndex = 0;
let userInput = "";

function showTerminal() {
    bootSequence.classList.add('hidden');
    setTimeout(() => {
        terminalWindow.classList.remove('hidden');
        typeWriter("Terminal bağlantısı aktif. Komut bekleniyor...", enableTerminalInput);
    }, 350);
}

function enableTerminalInput() {
    inputLine.style.display = "flex";
    userInput = "";
    updateInputLine();
}

function updateInputLine() {
    inputLine.querySelectorAll('span:not(.prompt):not(.cursor)').forEach(e => e.remove());
    const inputSpan = document.createElement('span');
    inputSpan.textContent = userInput;
    inputLine.insertBefore(inputSpan, cursorSpan);
}

document.addEventListener('keydown', (event) => {
    if (terminalWindow.classList.contains('hidden')) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === "Enter") {
        const inputToShow = userInput;
        const lineDiv = document.createElement('div');
        lineDiv.innerHTML = `<span class="prompt">></span> ${escapeHTML(inputToShow)}`;
        terminalOutput.appendChild(lineDiv);
        const command = hackCommands[commandIndex % hackCommands.length];
        commandIndex++;
        const sysDiv = document.createElement('div');
        sysDiv.innerHTML = `<span style="color: #ff5f56;">[SYSTEM_RESPONSE]:</span> `;
        terminalOutput.appendChild(sysDiv);
        userInput = "";
        updateInputLine();
        terminalWindow.querySelector('#terminal-content').scrollTop = terminalWindow.querySelector('#terminal-content').scrollHeight;
        typeWriter(command, enableTerminalInput, sysDiv);
    } else if (event.key === "Backspace") {
        if (userInput.length > 0) {
            userInput = userInput.slice(0, -1);
            updateInputLine();
        }
    } else if (event.key.length === 1) {
        userInput += event.key;
        updateInputLine();
    }
});

function typeWriter(text, callback, element) {
    if (!element) {
        terminalOutput.innerHTML += '\n';
        element = document.createElement('div');
        terminalOutput.appendChild(element);
    }
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += escapeHTML(text.charAt(i));
            terminalWindow.querySelector('#terminal-content').scrollTop = terminalWindow.querySelector('#terminal-content').scrollHeight;
            i++;
            setTimeout(type, 11);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function (tag) {
        const charsToReplace = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        };
        return charsToReplace[tag] || tag;
    });
}

// Giriş ekranında klavye ile ENTER ile buton tetikleme
loginPassword.addEventListener('keydown', e => {
    if (e.key === "Enter") loginBtn.click();
});
registerPassword2.addEventListener('keydown', e => {
    if (e.key === "Enter") registerBtn.click();
});
