import React, { useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  const [showGrid, setShowGrid] = useState(false);

  const handleChange = () => {
    setShowGrid(!showGrid);
  }

  const camX = -29.006165995455433;
  const camY = 5.17025867238635;
  const camZ = 32.18589175393335;

  // https://youtu.be/Q7AOvWpIVHU
  // the tutorial is using vanilla javascript, and runs the script after canvas element
  // so I added useEffect to achieve the same effect. Otherwise the ID #bg will be null
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
    })

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.x = camX;
    camera.position.y = camY;
    camera.position.z = camZ;

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(pointLight, ambientLight);

    if(showGrid){
      const gridHelper = new THREE.GridHelper(200, 50);
      scene.add(gridHelper);
    }
    

    const controls = new OrbitControls(camera, renderer.domElement);

    function addStar() {
      const geometry = new THREE.SphereGeometry(0.25);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);
      const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

      star.position.set(x, y, z);
      scene.add(star);
    }

    Array(500).fill().forEach(addStar);

    const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
    scene.background = spaceTexture;

    const earthTexture = new THREE.TextureLoader().load('images/earth_texture.jpg');
    const earthNormals = new THREE.TextureLoader().load('images/earth_normals.tif');

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        normalMap: earthNormals
      })
    )

    earth.position.z = 30;
    earth.position.setX(-10);

    scene.add(earth);

    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;

      camera.position.z =  camZ + t * 0.01;
      camera.position.x =  camX + t * 0.0002;
      camera.position.y =  camY + t * 0.0002;
    }

    document.body.onscroll = moveCamera;

    function animate() {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      torus.rotation.z += 0.01;

      earth.rotation.x += 0.005;
      earth.rotation.y += 0.0075;
      earth.rotation.z += 0.005;

      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  })

  const a = new Array(250).fill(1);

  return (
    <>
      <canvas id="bg"></canvas>

      <main>
        <h1>Tip: you can pretend scrolling through a website by scrolling inside this blue area</h1>
        <h1>Or look freely around by dragging outside the blue area</h1>
        <FormControlLabel 
          control={<Checkbox checked={showGrid} onChange={handleChange} />}
          label="Show grid"
        />
        {a.map(() => <div><Button variant="contained" style={{margin: 10}}>asdf</Button><br /></div>)}
      </main>
    </>
  )
}

export default App
