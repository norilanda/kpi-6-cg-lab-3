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

const vertexShader = `
uniform float step;
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  float factor = (sin(step * 0.05) + 2.0) / 2.0;
  gl_Position.x *= factor ;
  gl_Position.y *= factor ;

  gl_Position.x -= sin(step * 0.05) * 0.05;
  gl_Position.y += sin(step * 0.05) * 0.5;
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
        },
        step: { value: 0 }
      },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
})

const materials = [
    gradientMaterial, // side
    gradientMaterial,
    gradientMaterial,
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

let step = 1;

const animate = () => {
    requestAnimationFrame(animate);
    cylinder.rotation.x += 0.007;
    cylinder.rotation.y += 0.007;

    const newTopColor = new THREE.Color(colors.magenta);
    newTopColor.r += Math.sin(step * 0.05);
    
    const newBottomColor = new THREE.Color(colors.green);
    newBottomColor.r += Math.sin(step * 0.05);

    gradientMaterial.uniforms.topColor.value = newTopColor;
    gradientMaterial.uniforms.bottomColor.value = newBottomColor;
    gradientMaterial.uniforms.step.value = step;
    step += 0.5;
    renderScene();
}
animate();
