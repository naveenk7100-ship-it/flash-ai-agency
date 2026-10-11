"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      // Graceful fallback for environments lacking WebGL
      return;
    }

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020106, 0.05);

    // 2. CAMERA SETUP
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 3. RENDERER WITH POST-PROCESSING ANTIALIASING
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    currentMount.appendChild(renderer.domElement);

    // 4. MAIN HIERARCHICAL COMPOSITION GROUP
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- A. CENTRAL METALLIC CHROME CORE (Icosahedron / Quantum Core) ---
    const coreGeometry = new THREE.IcosahedronGeometry(1.65, 3);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x181028,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // --- B. INNER GEOMETRIC CRYSTAL CAGE (Glass Polyhedron) ---
    const cageGeometry = new THREE.DodecahedronGeometry(2.35, 1);
    const cageMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x863bff,
      emissive: 0xa855f7,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.3,
      transmission: 0.85, // Glass refractive transmission
      thickness: 1.2,
      transparent: true,
      opacity: 0.55,
      wireframe: true
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    mainGroup.add(cageMesh);

    // --- C. DUAL ORBITING NEURAL ACCELERATOR RINGS ---
    // Ring 1: Thick Torus Ring
    const ring1Geo = new THREE.TorusGeometry(3.1, 0.045, 32, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x863bff,
      emissiveIntensity: 1.0,
      roughness: 0.2,
      metalness: 0.8
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    // Ring 2: Tilted Torus Ring
    const ring2Geo = new THREE.TorusGeometry(3.6, 0.035, 32, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.9
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    mainGroup.add(ring2);

    // --- D. FLOATING CYBER DATA NODES (Orbiting Spheres) ---
    const nodesGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 3.1;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, 0);
      ring1.add(node);
      nodePositions.push(new THREE.Vector3(x, y, 0));
    }

    // --- E. VOLUMETRIC DEEP-SPACE PARTICLES ---
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const violetColor = new THREE.Color(0xa855f7);
    const cyanColor = new THREE.Color(0x38bdf8);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);

      const mixVal = Math.random();
      const pColor =
        mixVal > 0.6 ? violetColor : mixVal > 0.3 ? cyanColor : whiteColor;
      particleColors[i] = pColor.r;
      particleColors[i + 1] = pColor.g;
      particleColors[i + 2] = pColor.b;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 5. CINEMATIC LIGHTING SUITE ---
    const ambientLight = new THREE.AmbientLight(0x0f0b18, 2.5);
    scene.add(ambientLight);

    // Vivid Violet Key Light
    const keyLight = new THREE.PointLight(0xa855f7, 28, 25);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Electric Cyan Rim Light
    const rimLight = new THREE.PointLight(0x38bdf8, 20, 25);
    rimLight.position.set(-5, -4, 4);
    scene.add(rimLight);

    // Intense Violet Core Light
    const centerPoint = new THREE.PointLight(0x863bff, 12, 10);
    centerPoint.position.set(0, 0, 0);
    mainGroup.add(centerPoint);

    // --- 6. INTERACTIVE MOUSE / GYROSCOPE TRACKING ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 1.2;
      mouseY = -y * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --- 7. ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Interpolated smooth mouse follow
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        mainGroup.rotation.y = elapsedTime * 0.2 + targetX;
        mainGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15 + targetY;

        // Counter-rotations for mechanical complexity
        coreMesh.rotation.y = -elapsedTime * 0.35;
        coreMesh.rotation.z = elapsedTime * 0.15;

        cageMesh.rotation.x = elapsedTime * 0.25;
        cageMesh.rotation.y = elapsedTime * 0.3;

        ring1.rotation.z = elapsedTime * 0.45;
        ring2.rotation.z = -elapsedTime * 0.35;

        particleSystem.rotation.y = -elapsedTime * 0.06;
      }

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
      coreGeometry.dispose();
      coreMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full pointer-events-auto" />
      {/* Cinematic subtle edge vignetting & vertical gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020106] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020106]/40 to-[#020106]/90 pointer-events-none" />
    </div>
  );
}
