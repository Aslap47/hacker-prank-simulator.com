document.addEventListener('DOMContentLoaded', () => {
    // Element referansları
    const bootSequence = document.getElementById('boot-sequence');
    const bootText = document.getElementById('boot-text');
    const progressBar = document.querySelector('.progress-bar-inner');
    const terminalWindow = document.getElementById('terminal-window');
    const terminalOutput = document.getElementById('terminal-output');
    const inputLine = document.querySelector('.input-line');
    const promptSpan = inputLine.querySelector('.prompt');
    const cursorSpan = inputLine.querySelector('.cursor');

    // Matrix efekti (Aynı)
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops = Array.from({ length: columns }).fill(1);
    const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0'; ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) { rainDrops[i] = 0; }
            rainDrops[i]++;
        }
    };
    setInterval(drawMatrix, 33);

    // --- 1. Aşama: Boot Animasyonu ---
    function startBootSequence() {
        const bootMessages = [
            'Ana menü envanterleri geri yükleniyor...',
            'Bellek blokları taranıyor...',
            'Çekirdek modülleri yükleniyor...',
            'Arayüz başlatılıyor...'
        ];
        let messageIndex = 0;
        let progress = 0;

        const progressInterval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;

            if (progress >= (messageIndex + 1) * 25 && messageIndex < bootMessages.length -1) {
                messageIndex++;
                bootText.textContent = bootMessages[messageIndex];
            }

            if (progress >= 100) {
                clearInterval(progressInterval);
                bootText.textContent = "Sistem hazır. Arayüz yükleniyor...";
                setTimeout(showTerminal, 1000);
            }
        }, 40);
    }

    // --- 2. Aşama: Terminali Göster ---
    function showTerminal() {
        bootSequence.style.opacity = '0';
        bootSequence.addEventListener('transitionend', () => {
            bootSequence.classList.add('hidden');
            terminalWindow.classList.remove('hidden');
            // Terminal açılış yazısı
            const welcomeMessage = "Terminal bağlantısı aktif. Komut bekleniyor...";
            typeWriter(welcomeMessage, () => {
                enableTerminalInput();
            });
        }, { once: true });
    }

    // --- 3. Aşama: Terminal Input & Komutlar ---
    const hackCommands = [
        "// Running vulnerability scanner 'Nmap'...",
        "ssh root@192.168.1.254 -p 22",
        "[+] Bypassing firewall...",
        "SELECT * FROM user_credentials;",
        "// Decrypting password hashes...",
        "rm -rf /logs --no-preserve-root",
        "[SUCCESS] System compromised. Gaining shell access.",
        "cat /etc/shadow",
        "// Covering tracks...",
        "execute exploit 'CVE-2025-0525.exe'",
        "Downloading confidential files... [2.5GB/8.1GB]",
        "find / -name '*.bak' -delete"
    ];
    let commandIndex = 0;

    // ÖZEL METNİN
    const specialText = `input1=f.readlines()

input1 = commands.getoutput('zcat ' + file).splitlines(True)

input1 = subprocess.Popen(["cat",file],
                              stdout=subprocess.PIPE,bufsize=1)   işte bu kodları yazacaksın tek sıra halinde
`;
    let specialTextPointer = 0;

    function enableTerminalInput() {
        inputLine.style.display = "flex";
        specialTextPointer = 0;
        updateInputLine();
    }

    function updateInputLine() {
        // Prompt > özel metnin harfleri + cursor
        inputLine.querySelectorAll('span:not(.prompt):not(.cursor)').forEach(e => e.remove());
        const inputSpan = document.createElement('span');
        inputSpan.textContent = specialText.substring(0, specialTextPointer);
        inputLine.insertBefore(inputSpan, cursorSpan);
    }

    // Klavye kontrolü
    document.addEventListener('keydown', (event) => {
        if (terminalWindow.classList.contains('hidden')) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        // ENTER: komutu gönder ve cevap yazdır
        if (event.key === "Enter") {
            const inputToShow = specialText.substring(0, specialTextPointer);
            const lineDiv = document.createElement('div');
            lineDiv.innerHTML = `<span class="prompt">&gt;</span> ${escapeHTML(inputToShow)}`;
            terminalOutput.appendChild(lineDiv);

            // Sistem cevap satırı
            const command = hackCommands[commandIndex];
            commandIndex = (commandIndex + 1) % hackCommands.length;

            const sysDiv = document.createElement('div');
            sysDiv.innerHTML = `<span style="color: #ff5f56;">[SYSTEM_RESPONSE]:</span> `;

            terminalOutput.appendChild(sysDiv);

            // Her komut sonrası input sıfırlanır
            specialTextPointer = 0;
            updateInputLine();

            // Son satıra scroll
            terminalWindow.querySelector('#terminal-content').scrollTop = terminalWindow.querySelector('#terminal-content').scrollHeight;

            // Komut satırını harf harf yazar
            typeWriter(command, () => {
                enableTerminalInput();
            }, sysDiv);

        } else if (event.key === "Backspace") {
            // Geri silme: bir harf geri
            if (specialTextPointer > 0) {
                specialTextPointer--;
                updateInputLine();
            }
        } else if (event.key.length === 1) {
            // Her tuşta bir harf ekle (kullanıcı hangi tuşa basarsa bassın sıradaki harf)
            if (specialTextPointer < specialText.length) {
                specialTextPointer++;
                updateInputLine();
            }
        }
    });

    // Yazı yazma efekti fonksiyonu
    function typeWriter(text, callback, element) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += escapeHTML(text.charAt(i));
                terminalWindow.querySelector('#terminal-content').scrollTop = terminalWindow.querySelector('#terminal-content').scrollHeight;
                i++;
                setTimeout(type, 15);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Güvenli HTML gösterimi
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, function (tag) {
            const charsToReplace = {
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            };
            return charsToReplace[tag] || tag;
        });
    }

    // Başlat!
    startBootSequence();
});