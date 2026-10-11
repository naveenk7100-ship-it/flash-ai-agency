"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 12.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Sophisticated Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 1.7);
    scene.add(ambientLight);

    // Key Light: Sharp specular reflections on metallic facets
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(6, 8, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Sage Fill Light: Soft natural green illumination
    const sageFill = new THREE.PointLight(0x5f8861, 36, 25);
    sageFill.position.set(-6, -4, 5);
    scene.add(sageFill);

    // Metallic Specular Rim: Edge crispness
    const rimLight = new THREE.DirectionalLight(0xa7c3a8, 2.2);
    rimLight.position.set(-5, 6, -5);
    scene.add(rimLight);

    const bottomReflect = new THREE.PointLight(0xcbdccb, 20, 20);
    bottomReflect.position.set(4, -5, 3);
    scene.add(bottomReflect);

    // 3. Main FLASH.Ai 3D Brand Energy Sculpture
    const sculptureGroup = new THREE.Group();
    sculptureGroup.scale.set(0.88, 0.88, 0.88);
    // Set initial natural 3D isometric presentation angle
    sculptureGroup.rotation.y = -0.22;
    sculptureGroup.rotation.x = 0.08;
    scene.add(sculptureGroup);

    // Create 2D Lightning Polygon Shape from authentic FLASH logo coordinates
    const boltShape = new THREE.Shape();
    boltShape.moveTo(-2.08, 3.67);   // 1. Top-left start
    boltShape.lineTo(2.73, 3.67);    // 2. Top-right horizontal
    boltShape.lineTo(1.48, 1.92);    // 3. Right inner corner
    boltShape.lineTo(3.38, 1.92);    // 4. Right step outer
    boltShape.lineTo(0.57, -3.73);   // 5. Bottom lightning tip
    boltShape.lineTo(0.23, -1.90);   // 6. Vertical inner notch
    boltShape.lineTo(-2.03, -1.90);  // 7. Left lower step
    boltShape.lineTo(-0.78, 0.22);   // 8. Left middle inner corner
    boltShape.lineTo(-3.55, 0.22);   // 9. Left middle step outer
    boltShape.lineTo(-2.08, 3.67);   // Back to top-left start

    // Extrusion settings with refined metallic beveling
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.07
    };

    const boltGeo = new THREE.ExtrudeGeometry(boltShape, extrudeSettings);
    boltGeo.center();

    // Primary Metallic Material: Polished Chrome with Deep Sage Sheen
    const chromeSageMat = new THREE.MeshStandardMaterial({
      color: 0x3b563d,
      emissive: 0x223524,
      emissiveIntensity: 0.35,
      metalness: 0.94,
      roughness: 0.14
    });

    const boltMesh = new THREE.Mesh(boltGeo, chromeSageMat);
    boltMesh.castShadow = true;
    boltMesh.receiveShadow = true;
    sculptureGroup.add(boltMesh);

    // Edge Accent Glow Lines highlighting the precise geometric bevels
    const edgesGeo = new THREE.EdgesGeometry(boltGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x86c289,
      transparent: true,
      opacity: 0.75
    });
    const edgesLines = new THREE.LineSegments(edgesGeo, edgesMat);
    sculptureGroup.add(edgesLines);

    // Layer 2: Inner Floating Luminous Core Plate (Offset front)
    const innerBoltGeo = new THREE.ExtrudeGeometry(boltShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    innerBoltGeo.center();

    const innerLuminousMat = new THREE.MeshStandardMaterial({
      color: 0x5f8861,
      emissive: 0x496d4b,
      emissiveIntensity: 0.65,
      metalness: 0.88,
      roughness: 0.16
    });

    const innerMeshFront = new THREE.Mesh(innerBoltGeo, innerLuminousMat);
    innerMeshFront.position.z = 0.28;
    innerMeshFront.scale.set(0.78, 0.78, 0.78);
    sculptureGroup.add(innerMeshFront);

    // Layer 3: Sleek Titanium Backplate Layer
    const backMesh = new THREE.Mesh(innerBoltGeo, new THREE.MeshStandardMaterial({
      color: 0x223024,
      metalness: 0.95,
      roughness: 0.2
    }));
    backMesh.position.z = -0.28;
    backMesh.scale.set(0.85, 0.85, 0.85);
    sculptureGroup.add(backMesh);

    // 4. Concentric Orbital Metallic Rings
    const ring1Geo = new THREE.TorusGeometry(3.3, 0.022, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x5f8861,
      metalness: 0.9,
      roughness: 0.16
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.2;
    ring1.rotation.y = Math.PI / 7;
    sculptureGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.8, 0.016, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x3b563d,
      metalness: 0.95,
      roughness: 0.12
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.6;
    ring2.rotation.y = Math.PI / 2.6;
    sculptureGroup.add(ring2);

    // Orbiting Satellite Spheres on Rings
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x5f8861,
      emissive: 0x3b563d,
      emissiveIntensity: 0.5,
      metalness: 0.92,
      roughness: 0.18
    });
    const sat1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), sphereMat);
    const sat2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), sphereMat);
    sculptureGroup.add(sat1);
    sculptureGroup.add(sat2);

    // 5. Atmospheric Floating Micro-Particles
    const particleCount = 130;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cSage = new THREE.Color(0x5f8861);
    const cDeep = new THREE.Color(0x3b563d);
    const cIvory = new THREE.Color(0xa7c3a8);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.2 + Math.random() * 2.5;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const col = i % 3 === 0 ? cSage : i % 2 === 0 ? cDeep : cIvory;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    sculptureGroup.add(particles);

    // 6. Contact Shadow Beneath Sculpture
    const shadowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(59, 86, 61, 0.16)");
      grad.addColorStop(0.5, "rgba(59, 86, 61, 0.05)");
      grad.addColorStop(1, "rgba(59, 86, 61, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.4;
    scene.add(shadowPlane);

    // 7. Interactive Mouse Parallax & Scroll Integration
    let mouseX = 0;
    let mouseY = 0;
    let baseRotationY = -0.22;
    let scrollProgress = 0;
    let isVisible = true;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.35;
      mouseY = y * 0.28;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Perform immediate initial render so canvas is never blank
    renderer.render(scene, camera);

    // Respect reduced motion settings gracefully without freezing the scene completely
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = prefersReducedMotion ? 0.45 : 1.0;

    // 8. Continuous Render Loop with Real, Visible, Fluid Motion
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Only pause when scrolled deeply past the hero section (>1200px)
      if (typeof window !== "undefined" && window.scrollY > 1200) {
        return;
      }

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // 1. Ambient rotation & pointer parallax
      const ambientY = Math.sin(elapsedTime * 0.7) * 0.22 * motionScale;
      const ambientX = Math.cos(elapsedTime * 0.9) * 0.08 * motionScale;
      const scrollRotation = scrollProgress * 0.85;
      const scrollTilt = (scrollProgress - 0.5) * 0.35;

      sculptureGroup.rotation.y += (baseRotationY + ambientY + scrollRotation + mouseX - sculptureGroup.rotation.y) * 0.06;
      sculptureGroup.rotation.x += (0.08 + ambientX + mouseY * 0.35 + scrollTilt - sculptureGroup.rotation.x) * 0.06;

      // 2. Visible levitation float on the 3D lightning sculpture (~15px visible floating height)
      const floatY = Math.sin(elapsedTime * 1.8) * 0.22 * motionScale;
      boltMesh.position.y = floatY;
      innerMeshFront.position.y = floatY;
      backMesh.position.y = floatY;
      edgesLines.position.y = floatY;

      // 3. Dynamic energy breathing pulse on the inner luminous core plate
      innerLuminousMat.emissiveIntensity = 0.55 + Math.sin(elapsedTime * 2.4) * 0.22 * motionScale;

      // 4. Orbital rings continuous visible 3D rotation
      ring1.rotation.z = elapsedTime * 0.45 * motionScale;
      ring2.rotation.z = -elapsedTime * 0.35 * motionScale;

      // 5. Orbiting satellite spheres along their 3D orbital planes
      const sat1Angle = elapsedTime * 0.9 * motionScale;
      sat1.position.set(Math.cos(sat1Angle) * 3.3, Math.sin(sat1Angle) * 1.5, Math.sin(sat1Angle) * 2.2);

      const sat2Angle = (-elapsedTime * 0.75 + 2.0) * motionScale;
      sat2.position.set(Math.cos(sat2Angle) * 2.8, -Math.sin(sat2Angle) * 2.2, Math.cos(sat2Angle) * 2.4);

      // 6. Atmospheric micro-particles dynamic 3D swirl and drift
      particles.rotation.y = elapsedTime * 0.12 * motionScale;
      particles.rotation.x = Math.sin(elapsedTime * 0.5) * 0.06 * motionScale;

      renderer.render(scene, camera);

      if (typeof window !== "undefined") {
        (window as any).__FLASH_HERO__ = {
          frameCount: (((window as any).__FLASH_HERO__?.frameCount) || 0) + 1,
          elapsedTime,
          sculptureRotationY: sculptureGroup.rotation.y,
          sculptureRotationX: sculptureGroup.rotation.x,
          ring1Z: ring1.rotation.z,
          ring2Z: ring2.rotation.z,
          boltY: boltMesh.position.y,
          particleRotY: particles.rotation.y
        };
      }
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 100 && h > 100) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      boltGeo.dispose();
      innerBoltGeo.dispose();
      edgesGeo.dispose();
      chromeSageMat.dispose();
      innerLuminousMat.dispose();
      edgesMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      sphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[500px] lg:max-w-[540px] aspect-[5/4] sm:aspect-square mx-auto flex items-center justify-center select-none overflow-hidden sm:overflow-visible">
      {/* Ambient Warm Sage Halo Behind 3D Brand Sculpture */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-[#cbdccb]/40 blur-3xl animate-pulse-halo" />
        <div className="w-64 h-64 rounded-full bg-[#e5ede5]/60 blur-2xl" />
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing z-0"
      />
    </div>
  );
}
