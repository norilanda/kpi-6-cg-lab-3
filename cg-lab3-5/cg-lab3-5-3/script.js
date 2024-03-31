// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const coneGeometry = new THREE.ConeGeometry(1, 2, 32);

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

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;

varying vec2 vUv;

void main() {
  
  gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
}`;

const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: {
          value: new THREE.Color(colors.green)
        },
        bottomColor: {
          value: new THREE.Color(colors.magenta)
        }
      },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
})

const materials = [
    gradientMaterial, // side
    new THREE.MeshPhongMaterial({ color: colors.green }), // top/bottom
    new THREE.MeshPhongMaterial({ color: colors.magenta }), // top/bottom
];

const cone1 = new THREE.Mesh(coneGeometry, materials);
const cone2 = new THREE.Mesh(coneGeometry, materials);
scene.add(cone1);
scene.add(cone2);

cone1.position.y = -0.3;
cone2.position.y = 0.3;
cone2.rotation.x = Math.PI;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderScene();
});

const renderScene = () => {
    renderer.render(scene, camera);
}

let step = 1;

const animate = () => {
    requestAnimationFrame(animate);

    const newTopColor = new THREE.Color(colors.magenta);
    newTopColor.r += Math.sin(step * 0.05);
    
    const newBottomColor = new THREE.Color(colors.green);
    newBottomColor.r += Math.sin(step * 0.05);

    gradientMaterial.uniforms.topColor.value = newTopColor;
    gradientMaterial.uniforms.bottomColor.value = newBottomColor;
    step++;
    renderScene();
}
animate();
