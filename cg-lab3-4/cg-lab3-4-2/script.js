// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.CylinderGeometry(1, 1, 2, 64);

const lightAmbient = new THREE.AmbientLight(0xffffff, 0.2);
const lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
lightDirectional.position.set(13, 2, 2);
scene.add(lightAmbient);
scene.add(lightDirectional);

const colors = {
    'green': 0x00ff00,
    'blue': 0x0000ff,
    'magenta': 0xff00ff,
}
const materials = [
    new THREE.MeshPhongMaterial({ color: colors.blue }), // side
    new THREE.MeshPhongMaterial({ color: colors.green }), // top/bottom
    new THREE.MeshPhongMaterial({ color: colors.magenta }), // top/bottom
];

const cylinder = new THREE.Mesh(geometry, materials);
scene.add(cylinder);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderScene();
});

const renderScene = () => {
    renderer.render(scene, camera);
}

const animate = () => {
    requestAnimationFrame(animate);
    cylinder.rotation.x += 0.01;
    cylinder.rotation.y += 0.01;
    renderScene();
}
animate();
