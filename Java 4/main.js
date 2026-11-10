import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 6, 12);
camera.lookAt(0, 3, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);

ground.rotation.x = -Math.PI / 2;

const grid = new THREE.GridHelper(20, 20);
scene.add(ground, grid);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(ambientLight, dirLight);

// Base
const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Shoulder
const shoulders = new THREE.Group();
shoulders.position.y = 0.5;
base.add(shoulders);

const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    baseMaterial
);
shoulders.add(shoulderJoint);

// Upper arm
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const upperArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    armMaterial
);
upperArm.position.y = 1.5;
shoulders.add(upperArm);

// Elbow
const elbow = new THREE.Group();
elbow.position.y = 3;
shoulders.add(elbow);

const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    baseMaterial
);
elbow.add(elbowJoint);

// Forearm
const forearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 3, 0.7),
    armMaterial
);
forearm.position.y = 1.5;
elbow.add(forearm);

// Wrist
const wrist = new THREE.Group();
wrist.position.y = 3;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    baseMaterial
);
wrist.add(wristJoint);

// Palm
const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.5, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xffaa55 })
);
palm.position.y = 1;
wrist.add(palm);

const fingers = new THREE.Group();
fingers.position.y = 0.5;
palm.add(fingers);
const fingerGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa55 });
for (let i = -2; i <= 2; i++) {
    const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
    finger.position.x = i * 0.3;
    finger.position.y = 0.5;
    fingers.add(finger);
}
// Initial rotations
shoulders.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);

// Keyboard controls
window.addEventListener('keydown', function (event) {
    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulders.rotation.z += rotationStep;
    } else if (key === 'a') {
        shoulders.rotation.z -= rotationStep;
    } else if (key === 'w') {
        elbow.rotation.z += rotationStep;
    } else if (key === 's') {
        elbow.rotation.z -= rotationStep;
    } else if (key === 'e') {
        wrist.rotation.z += rotationStep;
    } else if (key === 'd') {
        wrist.rotation.z -= rotationStep;
    }
});

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.update();

// Resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();