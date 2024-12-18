import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';

window.addEventListener('load', function () {
  init();
});

function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

  camera.position.z = 100;

  /** 큐브맵 텍스처를 이용한 3차원 공간 표현 */
  // const controls = new OrbitControls(camera, renderer.domElement);
  //
  // controls.minDistance = 5;
  // controls.maxDistance = 100;
  //
  // const textureLoader = new THREE.TextureLoader().setPath('assets/textures/Yokohama/');
  //
  // //positive, negative 양의 방향 음의 방향 x축에 대한 양의방향 음의 방향 을 뜻함
  // const images = [
  //   'posx.jpg', 'negx.jpg',
  //   'posy.jpg', 'negy.jpg',
  //   'posz.jpg', 'negz.jpg',
  // ];
  //
  //
  // const geometry = new THREE.BoxGeometry(5000, 5000,5000);
  // // const material = new THREE.MeshPhongMaterial({
  // //   color: 0xaaccee,
  // //   side:  THREE.BackSide,
  // // });
  //
  // //MeshPhong으로 하면 빛의 영향을 받아 모서리 부분이 음영이 진다. 그래서 빛의 영향을 받지 않는 MeshBasic으로 변경
  // const materials = images.map(image => new THREE.MeshBasicMaterial({
  //   map: textureLoader.load(image),
  //   side: THREE.BackSide,
  // }));
  //
  // //material 을 배열로 보내줄 수 있다. [material1, material2 ,,,,]
  // const skybox = new THREE.Mesh(geometry, materials);
  // scene.add(skybox);

  /** 큐브맵 텍스처를 이용한 3차원 공간 표현2 */

  // const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('assets/textures/Yokohama/');
  //
  // const images = [
  //   'posx.jpg', 'negx.jpg',
  //   'posy.jpg', 'negy.jpg',
  //   'posz.jpg', 'negz.jpg',
  // ];
  //
  // const cubeTexture = cubeTextureLoader.load(images);
  //
  // scene.background = cubeTexture;
  //
  // new OrbitControls(camera, renderer.domElement);

  /** 360 파노라마 텍스처를 이용한 3차원 공간 표현 */

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  const textureLoader = new THREE.TextureLoader();

  const texture =  textureLoader.load('assets/textures/village.jpeg');

  // EquirectangularReflectionMapping  EquirectangularRefractionMapping 두가지가 있ㄷ다
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;

  const sphereGeometry = new THREE.SphereGeometry(30);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    envMap: texture,
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  scene.add(sphere);

  gui
    .add(texture, 'mapping', {
      Reflection: THREE.EquirectangularReflectionMapping,
      Refraction: THREE.EquirectangularRefractionMapping
    })
    .onChange(() => {
      sphereMaterial.needsUpdate = true;
    })

  gui
    .add(sphereMaterial, 'refractionRatio')
    .min(0)
    .max(1)
    .step(0.01);

  gui
    .add(sphereMaterial, 'reflectivity')
    .min(0)
    .max(1)
    .step(0.01);

  render();

  function render() {

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', handleResize);
}
