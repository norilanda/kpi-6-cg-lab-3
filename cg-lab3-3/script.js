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

let initialStepFactor = 1.0;

const baseVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
}`;

const calcXCoord = `color.x = color.x + sin(stepFactor);`

const gradientFragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float stepFactor;

varying vec2 vUv;

void main() {
  vec3 color = mix(bottomColor, topColor, vUv.y);
  ${calcXCoord}
  gl_FragColor = vec4(color, 1.0);
}`;

const solidFragmentShader = `
uniform vec3 baseColor;
uniform float stepFactor;

void main() {
  vec3 color = mix(baseColor, baseColor, 1.0);
  ${calcXCoord}
  gl_FragColor = vec4(color, 1.0);
}`;

const gradientMaterial = new THREE.ShaderMaterial({ 
    uniforms: {
        topColor: {
          value: new THREE.Color(colors.red)
        },
        bottomColor: {
          value: new THREE.Color(colors.yellow)
        },
        stepFactor: {
          value: initialStepFactor
        }
      },
    vertexShader: baseVertexShader,
    fragmentShader: gradientFragmentShader
});

const solidMaterialRed = new THREE.ShaderMaterial({
    uniforms: {
        baseColor: {
            value: new THREE.Color(colors.red)
        },
        stepFactor: {
          value: initialStepFactor
        }
    },
    vertexShader: baseVertexShader,
    fragmentShader: solidFragmentShader
});

const solidMaterialYellow = new THREE.ShaderMaterial({
  uniforms: {
      baseColor: {
          value: new THREE.Color(colors.yellow)
      },
      stepFactor: {
        value: initialStepFactor
      }
  },
  vertexShader: baseVertexShader,
  fragmentShader: solidFragmentShader
});

const materials = [
    gradientMaterial, // right
    gradientMaterial, // left
    solidMaterialRed, // top
    solidMaterialYellow, // bottom
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

const incrementStep = 0.03;

const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    gradientMaterial.uniforms.stepFactor.value += incrementStep;
    solidMaterialRed.uniforms.stepFactor.value += incrementStep;
    solidMaterialYellow.uniforms.stepFactor.value += incrementStep;
    renderScene();
}
animate();
