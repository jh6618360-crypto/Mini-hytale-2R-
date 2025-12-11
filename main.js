// =========================
// MAIN.JS – SUPORTE MOBILE
// =========================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajusta o tamanho para celular e PC
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Jogador
let player = {
    x: 200,
    y: 200,
    size: 30,
    speed: 3
};

// Movimentação PC
let keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// =============================
//       JOYSTICK MOBILE
// =============================
let joy = {
    active: false,
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0
};

// Detecta toque na tela
canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    joy.active = true;
    joy.startX = t.clientX;
    joy.startY = t.clientY;
});

canvas.addEventListener("touchmove", e => {
    const t = e.touches[0];
    joy.moveX = t.clientX - joy.startX;
    joy.moveY = t.clientY - joy.startY;
});

canvas.addEventListener("touchend", () => {
    joy.active = false;
    joy.moveX = 0;
    joy.moveY = 0;
});

// =============================
//   ATUALIZA MOVIMENTO
// =============================
function updateMovement() {

    // --- PC (teclado) ---
    if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
    if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
    if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;

    // --- MOBILE (joystick) ---
    if (joy.active) {
        const max = 40; // limite do joystick
        let dx = joy.moveX;
        let dy = joy.moveY;

        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > max) {
            dx = (dx / dist) * max;
            dy = (dy / dist) * max;
        }

        player.x += dx * 0.1;
        player.y += dy * 0.1;
    }
}

// =============================
//   DESENHA JOYSTICK
// =============================
function drawJoystick() {
    if (!joy.active) return;

    // círculo base
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.arc(joy.startX, joy.startY, 40, 0, Math.PI * 2);
    ctx.stroke();

    // botão que move
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.arc(joy.startX + joy.moveX, joy.startY + joy.moveY, 20, 0, Math.PI * 2);
    ctx.fill();
}

// =============================
//   LOOP DO JOGO
// =============================
function update() {
    updateMovement();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // jogador
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // joystick
    drawJoystick();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
