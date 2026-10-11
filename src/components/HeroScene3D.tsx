"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for combined animation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Core Torus Knot (Cinematic Violet & Chrome Wireframe)
    const geometry = new THREE.TorusKnotGeometry(1.0, 0.32, 128, 32, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x863bff,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: true,
      emissive: 0x3b0764,
      emissiveIntensity: 0.3
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    group.add(torusKnot);

    // 2. Inner Glowing Core
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: false,
      transparent: true,
      opacity: 0.4
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // 3. Floating Particle Cloud
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xd8b4fe,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightViolet = new THREE.PointLight(0xa855f7, 4, 10);
    pointLightViolet.position.set(3, 4, 3);
    scene.add(pointLightViolet);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 3, 10);
    pointLightCyan.position.set(-3, -3, 2);
    scene.add(pointLightCyan);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.5;
      mouseY = -(y / rect.height) * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      group.rotation.y = elapsedTime * 0.25 + targetX;
      group.rotation.x = elapsedTime * 0.15 + targetY;

      particles.rotation.y = -elapsedTime * 0.1;
      core.rotation.y = elapsedTime * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[540px] flex items-center justify-center pointer-events-none select-none">
      <div ref={mountRef} className="w-full h-full pointer-events-auto" />
      {/* Decorative radial overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050508]/40 to-[#050508] pointer-events-none" />
    </div>
  );
}
