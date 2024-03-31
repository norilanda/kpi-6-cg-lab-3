// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const colors = {
    'yellow': 0xFFFF00,
    'red': 0xFF0000,
}
const gradientMaterial = new THREE.ShaderMaterial({ 
    uniforms: {
        topColor: {
          value: new THREE.Color(colors.red)
        },
        bottomColor: {
          value: new THREE.Color(colors.yellow)
        }
      },
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;

      gl_Position = projectionPosition;
    }
    `,
    fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
    }
    `
});

const materials = [
    gradientMaterial, // right
    gradientMaterial, // left
    new THREE.MeshBasicMaterial({ color: colors.red }), // top
    new THREE.MeshBasicMaterial({ color: colors.yellow }), // bottom
    gradientMaterial, // front
    gradientMaterial  // back
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderScene();
}
animate();
