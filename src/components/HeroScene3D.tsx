"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Helper: Generate crisp 2D canvas texture for Websites panel
function createWebsiteCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card with glass frosting
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 340);

  // Top browser header
  ctx.fillStyle = "#f4f7f4";
  ctx.fillRect(0, 0, 512, 54);

  // Window dots
  ctx.fillStyle = "#e58e82";
  ctx.beginPath(); ctx.arc(28, 27, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#eed27f";
  ctx.beginPath(); ctx.arc(48, 27, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#86c289";
  ctx.beginPath(); ctx.arc(68, 27, 6, 0, Math.PI * 2); ctx.fill();

  // URL bar
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(100, 12, 310, 30, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText("🔒 flashai.agency/web", 116, 32);

  // Status tag
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath();
  ctx.roundRect(422, 14, 76, 26, 6);
  ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("LIVE 99%", 436, 31);

  // Panel Body
  ctx.strokeStyle = "#e7e2d8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 54); ctx.lineTo(512, 54);
  ctx.stroke();

  // Category Tag
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 12px monospace";
  ctx.fillText("SYSTEM // HIGH-CONVERSION WEB", 28, 86);

  // Headline Wireframe
  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 22px -apple-system, sans-serif";
  ctx.fillText("Bespoke Web Platforms", 28, 118);

  // Body preview lines
  ctx.fillStyle = "#78716c";
  ctx.font = "14px -apple-system, sans-serif";
  ctx.fillText("Sub-second Core Web Vitals • Next.js 15 App Router", 28, 146);

  // UI mock blocks
  ctx.fillStyle = "#f7f4ee";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;

  // Mock hero banner
  ctx.beginPath(); ctx.roundRect(28, 168, 270, 110, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 12px -apple-system, sans-serif";
  ctx.fillText("Dynamic Workflow Engine", 46, 204);
  ctx.fillStyle = "#57534e";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("Deterministic state management", 46, 226);
  ctx.fillStyle = "#5f8861";
  ctx.fillText("→ Integrated API Gateway", 46, 246);

  // Metrics Box
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(314, 168, 170, 110, 10); ctx.fill();
  ctx.strokeStyle = "#cbdccb"; ctx.stroke();

  ctx.fillStyle = "#78716c";
  ctx.font = "bold 11px monospace";
  ctx.fillText("PERFORMANCE", 330, 196);
  ctx.fillStyle = "#3b563d";
  ctx.font = "extrabold 32px monospace";
  ctx.fillText("99/100", 330, 236);
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("● Zero Layout Shift", 330, 260);

  // Border frame
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 3;
  ctx.strokeRect(1, 1, 510, 338);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

// Helper: Generate crisp 2D canvas texture for Instagram Automation panel
function createInstagramCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 340);

  // Header
  ctx.fillStyle = "#f4f7f4";
  ctx.fillRect(0, 0, 512, 54);

  // Instagram Icon / Badge
  ctx.fillStyle = "#d85a6a";
  ctx.beginPath(); ctx.roundRect(24, 12, 30, 30, 8); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.fillText("📸", 29, 33);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.fillText("@client_brand", 64, 30);
  ctx.fillStyle = "#78716c";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("Instagram Publishing Pipeline", 64, 45);

  // Live status badge
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(386, 14, 102, 26, 6); ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("● AUTO-SYNC", 400, 31);

  // Divider
  ctx.strokeStyle = "#e7e2d8";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 54); ctx.lineTo(512, 54); ctx.stroke();

  // Content
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 12px monospace";
  ctx.fillText("SOCIAL AUTOMATION // GRAPH API", 28, 86);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 20px -apple-system, sans-serif";
  ctx.fillText("Autonomous Content Pipeline", 28, 116);

  // Pipeline Workflow Grid
  ctx.fillStyle = "#f7f4ee";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(28, 142, 456, 76, 10); ctx.fill(); ctx.stroke();

  // Pipeline Steps inside
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 12px monospace";
  ctx.fillText("TRIGGER: Calendar → AI Asset Gen → Human Sign-off → Scheduled Post", 42, 172);

  ctx.fillStyle = "#78716c";
  ctx.font = "12px -apple-system, sans-serif";
  ctx.fillText("Scheduled: 09:00 AM Today • Meta Verified Webhook", 42, 198);

  // Metrics Row
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(28, 234, 218, 76, 8); ctx.fill();
  ctx.strokeStyle = "#cbdccb"; ctx.stroke();
  ctx.fillStyle = "#78716c";
  ctx.font = "bold 10px monospace";
  ctx.fillText("CYCLE TIME SAVED", 42, 258);
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 22px monospace";
  ctx.fillText("18h → 3h / wk", 42, 288);

  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(266, 234, 218, 76, 8); ctx.fill();
  ctx.strokeStyle = "#cbdccb"; ctx.stroke();
  ctx.fillStyle = "#78716c";
  ctx.font = "bold 10px monospace";
  ctx.fillText("PUBLISH RELIABILITY", 280, 258);
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 22px monospace";
  ctx.fillText("100% Zero-Loss", 280, 288);

  // Border frame
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 3;
  ctx.strokeRect(1, 1, 510, 338);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

// Helper: Generate crisp 2D canvas texture for AI Agents panel
function createAgentCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 340);

  // Header
  ctx.fillStyle = "#f4f7f4";
  ctx.fillRect(0, 0, 512, 54);

  // Terminal Bot Icon
  ctx.fillStyle = "#3b563d";
  ctx.beginPath(); ctx.roundRect(24, 12, 30, 30, 8); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.fillText("⚡", 31, 33);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.fillText("Autonomous Agent Router", 64, 30);
  ctx.fillStyle = "#78716c";
  ctx.font = "11px monospace";
  ctx.fillText("Deterministic Schema Guard", 64, 45);

  // Latency badge
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(390, 14, 98, 26, 6); ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("< 850ms SLA", 404, 31);

  // Divider
  ctx.strokeStyle = "#e7e2d8";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 54); ctx.lineTo(512, 54); ctx.stroke();

  // Content
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 12px monospace";
  ctx.fillText("ENGINEERING // MULTI-AGENT ORCHESTRATION", 28, 86);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 20px -apple-system, sans-serif";
  ctx.fillText("Self-Healing n8n & API Pipelines", 28, 116);

  // Code / Execution block
  ctx.fillStyle = "#1c1917";
  ctx.beginPath(); ctx.roundRect(28, 138, 456, 108, 10); ctx.fill();

  ctx.fillStyle = "#86c289";
  ctx.font = "bold 12px monospace";
  ctx.fillText("$ agent.route({ intent: 'lead_qualification' })", 44, 168);
  ctx.fillStyle = "#cbdccb";
  ctx.font = "11px monospace";
  ctx.fillText("✔ RAG Context Ingest: Vector Store Grounded", 44, 192);
  ctx.fillText("✔ JSON Schema: 100% Strict Type Pass", 44, 212);
  ctx.fillText("✔ Dual Dead-Letter Failover: Active", 44, 232);

  // Bottom tags
  ctx.fillStyle = "#f4f7f4";
  ctx.beginPath(); ctx.roundRect(28, 260, 456, 50, 8); ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 12px monospace";
  ctx.fillText("ZERO DATA LOSS • HUMAN-IN-THE-LOOP REVIEWS", 52, 290);

  // Border frame
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 3;
  ctx.strokeRect(1, 1, 510, 338);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) return;
    } catch {
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 13.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(7, 9, 8);
    scene.add(keyLight);

    const sageFill = new THREE.PointLight(0x5f8861, 38, 30);
    sageFill.position.set(-7, -4, 6);
    scene.add(sageFill);

    const rimLight = new THREE.DirectionalLight(0xa7c3a8, 2.4);
    rimLight.position.set(-6, 6, -6);
    scene.add(rimLight);

    const bottomReflect = new THREE.PointLight(0xcbdccb, 22, 22);
    bottomReflect.position.set(4, -5, 4);
    scene.add(bottomReflect);

    // 3. Main Master Scene Group (Isometric presentation)
    const masterGroup = new THREE.Group();
    masterGroup.rotation.y = -0.15;
    masterGroup.rotation.x = 0.08;
    scene.add(masterGroup);

    // =========================================================
    // A. CENTRAL INTELLIGENT WORKFLOW CORE (FLASH.Ai Brand Node)
    // =========================================================
    const coreGroup = new THREE.Group();
    masterGroup.add(coreGroup);

    // Lightning polygon coordinate definition from authentic brand logo
    const boltShape = new THREE.Shape();
    boltShape.moveTo(-1.66, 2.94);
    boltShape.lineTo(2.18, 2.94);
    boltShape.lineTo(1.18, 1.54);
    boltShape.lineTo(2.70, 1.54);
    boltShape.lineTo(0.46, -2.98);
    boltShape.lineTo(0.18, -1.52);
    boltShape.lineTo(-1.62, -1.52);
    boltShape.lineTo(-0.62, 0.18);
    boltShape.lineTo(-2.84, 0.18);
    boltShape.lineTo(-1.66, 2.94);

    const boltGeo = new THREE.ExtrudeGeometry(boltShape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    boltGeo.center();

    // Metallic polished chrome sage material
    const chromeSageMat = new THREE.MeshStandardMaterial({
      color: 0x3b563d,
      emissive: 0x243826,
      emissiveIntensity: 0.45,
      metalness: 0.94,
      roughness: 0.14
    });

    const boltMesh = new THREE.Mesh(boltGeo, chromeSageMat);
    boltMesh.castShadow = true;
    coreGroup.add(boltMesh);

    // Precise edge lines highlighting core geometry
    const edgesGeo = new THREE.EdgesGeometry(boltGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x86c289,
      transparent: true,
      opacity: 0.85
    });
    const edgesLines = new THREE.LineSegments(edgesGeo, edgesMat);
    coreGroup.add(edgesLines);

    // Inner Luminous Core Plate (Offset front)
    const innerBoltGeo = new THREE.ExtrudeGeometry(boltShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    innerBoltGeo.center();

    const innerLuminousMat = new THREE.MeshStandardMaterial({
      color: 0x5f8861,
      emissive: 0x496d4b,
      emissiveIntensity: 0.7,
      metalness: 0.88,
      roughness: 0.16
    });

    const innerMeshFront = new THREE.Mesh(innerBoltGeo, innerLuminousMat);
    innerMeshFront.position.z = 0.26;
    innerMeshFront.scale.set(0.78, 0.78, 0.78);
    coreGroup.add(innerMeshFront);

    // Central Hexagonal Processing Ring Housing
    const hexHousingGeo = new THREE.CylinderGeometry(2.35, 2.35, 0.15, 6, 1, false);
    const hexHousingMat = new THREE.MeshStandardMaterial({
      color: 0x1f2e21,
      metalness: 0.92,
      roughness: 0.22,
      transparent: true,
      opacity: 0.7
    });
    const hexHousing = new THREE.Mesh(hexHousingGeo, hexHousingMat);
    hexHousing.rotation.x = Math.PI / 2;
    hexHousing.position.z = -0.25;
    coreGroup.add(hexHousing);

    // Hex housing edges
    const hexEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(hexHousingGeo),
      new THREE.LineBasicMaterial({ color: 0x5f8861, opacity: 0.65, transparent: true })
    );
    hexEdges.rotation.x = Math.PI / 2;
    hexEdges.position.z = -0.25;
    coreGroup.add(hexEdges);

    // =========================================================
    // B. THREE CONNECTED FLOATING GLASS PANELS (WORK-RELEVANT)
    // =========================================================
    const panelMatCommon = {
      transparent: true,
      opacity: 0.94,
      roughness: 0.18,
      metalness: 0.12,
      side: THREE.DoubleSide
    };

    const panelGeo = new THREE.PlaneGeometry(3.1, 2.05);

    // 1. Websites & Web Platforms Panel (Top-Left / Forefront)
    const webTex = createWebsiteCanvasTexture();
    const webMat = new THREE.MeshStandardMaterial({
      map: webTex,
      ...panelMatCommon
    });
    const webPanel = new THREE.Mesh(panelGeo, webMat);
    webPanel.position.set(-3.3, 1.8, 0.8);
    webPanel.rotation.y = 0.24;
    webPanel.rotation.x = -0.06;
    masterGroup.add(webPanel);

    // 2. Instagram & Social Automation Panel (Right-Middle)
    const igTex = createInstagramCanvasTexture();
    const igMat = new THREE.MeshStandardMaterial({
      map: igTex,
      ...panelMatCommon
    });
    const igPanel = new THREE.Mesh(panelGeo, igMat);
    igPanel.position.set(3.4, 0.7, 0.5);
    igPanel.rotation.y = -0.28;
    igPanel.rotation.x = 0.04;
    masterGroup.add(igPanel);

    // 3. AI Agents & Autonomous Pipelines Panel (Bottom-Left / Midground)
    const agentTex = createAgentCanvasTexture();
    const agentMat = new THREE.MeshStandardMaterial({
      map: agentTex,
      ...panelMatCommon
    });
    const agentPanel = new THREE.Mesh(panelGeo, agentMat);
    agentPanel.position.set(-3.0, -1.9, 0.6);
    agentPanel.rotation.y = 0.22;
    agentPanel.rotation.x = 0.08;
    masterGroup.add(agentPanel);

    // =========================================================
    // C. 3D CURVED DATA SPLINE PATHS & MOVING DATA PACKETS
    // =========================================================
    // Spline 1: Core -> Websites Panel
    const curveWeb = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(-1.4, 1.0, 0.3),
      new THREE.Vector3(-2.4, 1.6, 0.6),
      new THREE.Vector3(-3.1, 1.8, 0.8)
    ]);

    // Spline 2: Core -> Instagram Panel
    const curveIg = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(1.6, 0.3, 0.2),
      new THREE.Vector3(2.5, 0.5, 0.4),
      new THREE.Vector3(3.2, 0.7, 0.5)
    ]);

    // Spline 3: Core -> AI Agents Panel
    const curveAgent = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, -0.6, 0),
      new THREE.Vector3(-1.2, -1.2, 0.2),
      new THREE.Vector3(-2.1, -1.6, 0.4),
      new THREE.Vector3(-2.8, -1.9, 0.6)
    ]);

    const splineMat = new THREE.LineBasicMaterial({
      color: 0x86c289,
      transparent: true,
      opacity: 0.65,
      linewidth: 2
    });

    const createSplineLine = (curve: THREE.CatmullRomCurve3) => {
      const points = curve.getPoints(50);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geom, splineMat);
    };

    masterGroup.add(createSplineLine(curveWeb));
    masterGroup.add(createSplineLine(curveIg));
    masterGroup.add(createSplineLine(curveAgent));

    // Moving Data Packet Spheres along each curve
    const packetGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const packetMat = new THREE.MeshStandardMaterial({
      color: 0x86c289,
      emissive: 0x5f8861,
      emissiveIntensity: 1.0,
      metalness: 0.5,
      roughness: 0.2
    });

    const webPackets = [new THREE.Mesh(packetGeo, packetMat), new THREE.Mesh(packetGeo, packetMat)];
    const igPackets = [new THREE.Mesh(packetGeo, packetMat), new THREE.Mesh(packetGeo, packetMat)];
    const agentPackets = [new THREE.Mesh(packetGeo, packetMat), new THREE.Mesh(packetGeo, packetMat)];

    [...webPackets, ...igPackets, ...agentPackets].forEach((p) => masterGroup.add(p));

    // =========================================================
    // D. ATMOSPHERIC FLOATING DATA PARTICLES
    // =========================================================
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cSage = new THREE.Color(0x5f8861);
    const cDeep = new THREE.Color(0x3b563d);
    const cIvory = new THREE.Color(0xa7c3a8);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.0 + Math.random() * 3.8;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      particlePositions[i * 3 + 2] = r * Math.cos(phi) * 0.8;

      const col = i % 3 === 0 ? cSage : i % 2 === 0 ? cDeep : cIvory;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particles);

    // =========================================================
    // E. INTERACTIVE MOUSE PARALLAX & CONTINUOUS ANIMATION LOOP
    // =========================================================
    let mouseX = 0;
    let mouseY = 0;
    let baseRotationY = -0.15;
    let scrollProgress = 0;

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

    // Render immediately
    renderer.render(scene, camera);

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = prefersReducedMotion ? 0.4 : 1.0;

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (typeof window !== "undefined" && window.scrollY > 1300) {
        return;
      }

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // 1. Scene Parallax and Natural Ambient Oscillation
      const ambientY = Math.sin(elapsedTime * 0.6) * 0.16 * motionScale;
      const ambientX = Math.cos(elapsedTime * 0.8) * 0.06 * motionScale;
      const scrollRotation = scrollProgress * 0.75;
      const scrollTilt = (scrollProgress - 0.5) * 0.28;

      masterGroup.rotation.y += (baseRotationY + ambientY + scrollRotation + mouseX - masterGroup.rotation.y) * 0.05;
      masterGroup.rotation.x += (0.08 + ambientX + mouseY * 0.35 + scrollTilt - masterGroup.rotation.x) * 0.05;

      // 2. Central Core Floating Levitation and Energy Pulse
      const coreFloatY = Math.sin(elapsedTime * 1.8) * 0.18 * motionScale;
      coreGroup.position.y = coreFloatY;
      innerLuminousMat.emissiveIntensity = 0.55 + Math.sin(elapsedTime * 2.4) * 0.2 * motionScale;

      // 3. Floating Glass Panels Gentle Phased Levitation
      webPanel.position.y = 1.8 + Math.sin(elapsedTime * 1.5 + 0.5) * 0.12 * motionScale;
      webPanel.rotation.z = Math.sin(elapsedTime * 1.2) * 0.02 * motionScale;

      igPanel.position.y = 0.7 + Math.sin(elapsedTime * 1.6 + 2.0) * 0.14 * motionScale;
      igPanel.rotation.z = Math.cos(elapsedTime * 1.3) * 0.02 * motionScale;

      agentPanel.position.y = -1.9 + Math.sin(elapsedTime * 1.4 + 3.8) * 0.12 * motionScale;
      agentPanel.rotation.z = Math.sin(elapsedTime * 1.1) * 0.02 * motionScale;

      // 4. Data Packets Movement along Curves
      const t1 = (elapsedTime * 0.45) % 1.0;
      const t1b = (elapsedTime * 0.45 + 0.5) % 1.0;
      webPackets[0].position.copy(curveWeb.getPoint(t1));
      webPackets[1].position.copy(curveWeb.getPoint(t1b));

      const t2 = (elapsedTime * 0.42 + 0.2) % 1.0;
      const t2b = (elapsedTime * 0.42 + 0.7) % 1.0;
      igPackets[0].position.copy(curveIg.getPoint(t2));
      igPackets[1].position.copy(curveIg.getPoint(t2b));

      const t3 = (elapsedTime * 0.48 + 0.35) % 1.0;
      const t3b = (elapsedTime * 0.48 + 0.85) % 1.0;
      agentPackets[0].position.copy(curveAgent.getPoint(t3));
      agentPackets[1].position.copy(curveAgent.getPoint(t3b));

      // 5. Atmospheric Data Particles Swirl
      particles.rotation.y = elapsedTime * 0.08 * motionScale;

      renderer.render(scene, camera);

      if (typeof window !== "undefined") {
        (window as any).__FLASH_HERO__ = {
          frameCount: (((window as any).__FLASH_HERO__?.frameCount) || 0) + 1,
          elapsedTime,
          masterRotationY: masterGroup.rotation.y,
          coreFloatY,
          webPanelY: webPanel.position.y,
          igPanelY: igPanel.position.y,
          agentPanelY: agentPanel.position.y
        };
      }
    };

    animate();

    // Resize Observer
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
      hexHousingGeo.dispose();
      panelGeo.dispose();
      packetGeo.dispose();
      particleGeo.dispose();
      webTex.dispose();
      igTex.dispose();
      agentTex.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[540px] lg:max-w-[620px] aspect-[5/4] sm:aspect-square mx-auto flex items-center justify-center select-none overflow-hidden sm:overflow-visible">
      {/* Ambient Warm Sage Halo Behind 3D Workflow Ecosystem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-full bg-[#cbdccb]/45 blur-3xl animate-pulse-halo" />
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
