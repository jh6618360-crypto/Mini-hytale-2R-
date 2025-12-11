// ============================================================
//                MUNDO 3D COMPLETO – THREE.JS
//         Funciona no GitHub Pages, Mobile e PC
// ============================================================

// Carrega Three.js da CDN
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/PointerLockControls.js";

// ------------------------------------------------------------
//                  CENA, CÂMERA, RENDER
// ------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // céu azul

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("gameCanvas").replaceWith(renderer.domElement);

// ------------------------------------------------------------
//                          LUZ
// ------------------------------------------------------------
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// ------------------------------------------------------------
//                     TERRENO 3D PRONTO
// ------------------------------------------------------------
const size = 500;
const divisions = 120;

const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
const position = geometry.attributes.position;

for (let i = 0; i < position.count; i++) {
    position.setZ(i, Math.random() * 10); // Cria montanhas
}

geometry.computeVertexNormals();

const material = new THREE.MeshPhongMaterial({
    color: 0x55aa55,
    flatShading: false
});

const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

// ------------------------------------------------------------
//                       ÁRVORES SIMPLES
// ------------------------------------------------------------
function addTree(x, z) {
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 4, 8),
        new THREE.MeshPhongMaterial({ color: 0x8B4513 })
    );
    trunk.position.set(x, 2, z);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(3, 6, 8),
        new THREE.MeshPhongMaterial({ color: 0x228B22 })
    );
    leaves.position.set(x, 6, z);

    scene.add(trunk, leaves);
}

for (let i = 0; i < 80; i++) {
    addTree(
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size
    );
}

// ------------------------------------------------------------
//                     CONTROLES DO JOGADOR
// ------------------------------------------------------------
const controls = new PointerLockControls(camera, document.body);
camera.position.set(0, 5, 0);

document.body.addEventListener("click", () => {
    controls.lock();
});

// Movimento
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
    const speed = 0.3;

    if (keys["w"]) controls.moveForward(speed);
    if (keys["s"]) controls.moveForward(-speed);
    if (keys["a"]) controls.moveRight(-speed);
    if (keys["d"]) controls.moveRight(speed);
}

// ------------------------------------------------------------
//                 LOOP PRINCIPAL DO JOGO
// ------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    movePlayer();

    renderer.render(scene, camera);
}

animate();

// ------------------------------------------------------------
//                  RESIZE DA TELA
// ------------------------------------------------------------
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
