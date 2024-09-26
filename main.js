import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';

// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Mesh -> Geometry, Material
let geometry = new THREE.BoxGeometry(6, 6, 6, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true }); 
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 15;

// Renderer
const canvas = document.querySelector('canvas'); 
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight; 
  camera.updateProjectionMatrix(); 
});

// lil-gui 
const gui = new GUI();

// GeometryFolder
const geometryFolder = gui.addFolder('Geometry');
// Geometry Types
const geometryTypes = ['Box', 'Sphere', 'Cone', 'Cylinder', 'Torus'];
// Geometry Params
const geometryParams = {
  type: 'Box',
  width: 1,
  height: 1,
  depth: 1,
  radius: 0.5,
  radialSegments: 32,
  heightSegments: 16,
  tubeRadius: 0.2,
};
function updateGeometry() {
  scene.remove(cube);
  switch (geometryParams.type) {
    case 'Box':
      geometry = new THREE.BoxGeometry(
        geometryParams.width,
        geometryParams.height,
        geometryParams.depth,
        geometryParams.heightSegments
      );
      break;
    case 'Sphere':
      geometry = new THREE.SphereGeometry(
        geometryParams.radius,
        geometryParams.radialSegments,
        geometryParams.heightSegments
      );
      break;
    case 'Cone':
      geometry = new THREE.ConeGeometry(
        geometryParams.radius,
        geometryParams.height,
        geometryParams.radialSegments
      );
      break;
    case 'Cylinder':
      geometry = new THREE.CylinderGeometry(
        geometryParams.radius,
        geometryParams.radius,
        geometryParams.height,
        geometryParams.radialSegments
      );
      break;
    case 'Torus':
      geometry = new THREE.TorusGeometry(
        geometryParams.radius,
        geometryParams.tubeRadius,
        geometryParams.radialSegments,
        geometryParams.heightSegments
      );
      break;
  }
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube)
  let objectType = geometryParams.type
  localStorage.setItem('objectType', objectType);
}

// GeometryFolder Add geometryParams
geometryFolder.add(geometryParams, 'type', geometryTypes).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'width', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'height', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'depth', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'radius', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'radialSegments', 3, 64, 1).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'heightSegments', 3, 64, 1).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'tubeRadius', 0.01, 1).onChange(updateGeometry);
geometryFolder.close();

// Material settings
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'wireframe');
materialFolder.add(material, 'roughness', 0, 1, 0.01);
materialFolder.add(material, 'metalness', 0, 1, 0.01);
materialFolder.add(material, 'opacity', 0, 1, 0.01);
materialFolder.add(material, 'transparent');
materialFolder.close();
// Mesh settings
const meshFolder = gui.addFolder('Mesh');
meshFolder.add(cube.position, 'x', -10, 10, 5).name('x position');
meshFolder.add(cube.position, 'y', -10, 10, 0.1).name('y position');
meshFolder.add(cube.position, 'z', -10, 10, 0.1).name('z position');
meshFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01).name('x rotation');
meshFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01).name('y rotation');
meshFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01).name('z rotation');
meshFolder.add(cube.scale, 'x', 0.1, 5, 0.1).name('x scale');
meshFolder.add(cube.scale, 'y', 0.1, 5, 0.1).name('y scale');
meshFolder.add(cube.scale, 'z', 0.1, 5, 0.1).name('z scale');
meshFolder.close();

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.autoRotate = true;

// Animation
function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
animate();