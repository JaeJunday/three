"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";

function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 1);

    // 마우스 컨트롤러
    const controls = new OrbitControls(camera, canvas);

    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    const initialPolarAngle = Math.PI / 4; // 45도
    const initialAzimuthalAngle = 0; // 초기 수평 각도

    // 초기 카메라 화각 설정
    controls.getPolarAngle = () => initialPolarAngle;
    controls.getAzimuthalAngle = () => initialAzimuthalAngle;

    // 최소 및 최대 줌 레벨 설정
    controls.minDistance = 3;
    controls.maxDistance = 10;

    // 최소 및 최대 화각 설정 (라디안 단위)
    controls.minPolarAngle = Math.PI / 6; // 30도
    controls.maxPolarAngle = Math.PI / 2; // 90도

    // const cubeGeometry = new THREE.BoxGeometry();
    // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // scene.add(cube);

    // const planeGeometry = new THREE.PlaneGeometry(2, 2);
    // const planeMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide,
    // });
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // scene.add(plane);

    const loader = new GLTFLoader();
    loader.load("/assets/scene.gltf", (gltf) => {
      scene.add(gltf.scene);

      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    });

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen absolute bottom-100 left-100"
    ></canvas>
  );
}

export default Home;
