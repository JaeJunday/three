"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";

function smoothCameraAnimation(
  startPosition: THREE.Vector3,
  endPosition: THREE.Vector3,
  duration: number,
  controls: OrbitControls
) {
  let startTime: number;

  function animate(time: number) {
    if (!startTime) startTime = time;

    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const newPosition = new THREE.Vector3().lerpVectors(
      startPosition,
      endPosition,
      progress
    );
    controls.object.position.copy(newPosition);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

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

    // 마우스 컨트롤러
    const controls = new OrbitControls(camera, canvas);

    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // 최소 및 최대 줌 레벨 설정
    controls.minDistance = 3;
    controls.maxDistance = 10;

    // 최소 및 최대 화각 설정 (라디안 단위)
    controls.minPolarAngle = Math.PI / 6; // 30도
    controls.maxPolarAngle = Math.PI / 2; // 90도

    const initialPosition = new THREE.Vector3(0, 20, 0);
    const targetPosition = new THREE.Vector3(0, 0, 10);

    smoothCameraAnimation(initialPosition, targetPosition, 3000, controls); // 1초 동안 애니메이션

    // 큐브에 텍스트를 입히는 부분
    const cubeGeometry = new THREE.BoxGeometry();

    // 캔버스 생성
    const cubeCanvas = document.createElement("canvas");
    const cubeText = cubeCanvas.getContext("2d");

    // 텍스트 설정
    if (cubeText) {
      cubeText.font = "Bold 50px Arial";
      cubeText.fillStyle = "#FFE490"; // fillStyle에 색상 문자열을 넣어줘야 합니다.
      cubeText.fillText("JaeJunday", 15, 70);
    }

    // CanvasTexture 생성
    const texture = new THREE.CanvasTexture(cubeCanvas);

    // 큐브 메쉬 생성
    const cubeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      color: "white",
    });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, (cubeGeometry.parameters.height / 6) * 5, 0);

    // 큐브를 씬에 추가
    scene.add(cube);

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

  return <canvas ref={canvasRef} className="w-full h-screen"></canvas>;
}

export default Home;
