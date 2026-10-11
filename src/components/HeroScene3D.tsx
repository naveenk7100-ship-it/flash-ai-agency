"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Helper: Generate crisp 2D canvas texture for Responsive Website Development panel
function createWebsiteCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card - high contrast clean white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 420);

  // Top browser chrome header
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 0, 640, 58);

  // Window dots (coral, gold, sage)
  ctx.fillStyle = "#e58e82";
  ctx.beginPath(); ctx.arc(28, 29, 6.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#eed27f";
  ctx.beginPath(); ctx.arc(50, 29, 6.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#5f8861";
  ctx.beginPath(); ctx.arc(72, 29, 6.5, 0, Math.PI * 2); ctx.fill();

  // URL bar
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(104, 13, 340, 32, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#293a2b";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText("🔒 flashai.agency/digital-platform", 122, 34);

  // Status badge
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath();
  ctx.roundRect(460, 14, 154, 30, 6);
  ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("● PRODUCTION RELEASE", 474, 33);

  // Divider line
  ctx.strokeStyle = "#e7e2d8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 58); ctx.lineTo(640, 58);
  ctx.stroke();

  // Category Tag
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 12px monospace";
  ctx.fillText("SYSTEM // RESPONSIVE WEB ARCHITECTURE", 28, 92);

  // Headline
  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 24px -apple-system, sans-serif";
  ctx.fillText("High-Conversion Web Platforms", 28, 126);

  // Tech stack subtitle
  ctx.fillStyle = "#57534e";
  ctx.font = "14px -apple-system, sans-serif";
  ctx.fillText("Next.js App Router • TypeScript • Tailwind CSS • Edge Distributed", 28, 152);

  // --- Visual Responsive Wireframe Mockups ---
  // 1. Desktop Browser Mockup Frame (Left)
  ctx.fillStyle = "#fdfbf7";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(28, 176, 380, 156, 10);
  ctx.fill();
  ctx.stroke();

  // Desktop Mock Navbar wireframe
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(36, 184, 364, 22);
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 10px monospace";
  ctx.fillText("DESKTOP VIEWPORT [1440px]", 44, 199);

  // Desktop Mock Hero Layout wireframe
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(42, 218, 180, 20, 4); ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 10px -apple-system, sans-serif";
  ctx.fillText("Dynamic Workflow Engine", 50, 232);

  ctx.fillStyle = "#cbdccb";
  ctx.beginPath(); ctx.roundRect(42, 246, 140, 10, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(42, 262, 110, 10, 3); ctx.fill();

  // CTA Buttons wireframe
  ctx.fillStyle = "#3b563d";
  ctx.beginPath(); ctx.roundRect(42, 284, 80, 22, 6); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px -apple-system, sans-serif";
  ctx.fillText("Launch Flow", 54, 298);

  // Grid preview cards (Desktop right side)
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbdccb";
  ctx.beginPath(); ctx.roundRect(238, 218, 156, 96, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#78716c";
  ctx.font = "10px monospace";
  ctx.fillText("Component Matrix", 250, 238);
  ctx.fillStyle = "#5f8861";
  ctx.fillText("• API Contract Pass", 250, 258);
  ctx.fillText("• SSR Optimized", 250, 276);
  ctx.fillText("• Zero Shift", 250, 294);

  // 2. Mobile Device Mockup Frame (Right)
  ctx.fillStyle = "#fdfbf7";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(430, 176, 182, 156, 14);
  ctx.fill();
  ctx.stroke();

  // Mobile speaker notch
  ctx.fillStyle = "#cbdccb";
  ctx.beginPath(); ctx.roundRect(495, 182, 52, 4, 2); ctx.fill();

  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 9px monospace";
  ctx.fillText("MOBILE [390px]", 472, 202);

  // Mobile stacked layout mock
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.roundRect(444, 212, 154, 30, 4); ctx.fill();
  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 9px -apple-system, sans-serif";
  ctx.fillText("Fluid Touch UI", 454, 230);

  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(444, 250, 154, 30, 4); ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 9px -apple-system, sans-serif";
  ctx.fillText("Auto-Breakpoints", 454, 268);

  ctx.fillStyle = "#3b563d";
  ctx.beginPath(); ctx.roundRect(444, 288, 154, 24, 6); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px -apple-system, sans-serif";
  ctx.fillText("Full-Width CTA", 482, 303);

  // --- Footer Technical Capabilities Row ---
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 354, 640, 66);
  ctx.strokeStyle = "#e7e2d8";
  ctx.strokeRect(0, 354, 640, 66);

  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("⚡ Zero Hydration Drift", 30, 392);
  ctx.fillText("📱 Fluid Mobile-First Grid", 230, 392);
  ctx.fillText("🌐 Global Edge Delivery", 440, 392);

  // Outer border frame
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(1, 1, 638, 418);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// Helper: Generate crisp 2D canvas texture for Instagram Content Scheduling & Publishing panel
function createInstagramCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card - high contrast clean white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 420);

  // Top header
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 0, 640, 58);

  // Instagram gradient icon badge
  ctx.fillStyle = "#e1306c";
  ctx.beginPath(); ctx.roundRect(24, 14, 30, 30, 8); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText("IG", 31, 34);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.fillText("@flashai.agency", 64, 33);

  // Verified checkmark
  ctx.fillStyle = "#5f8861";
  ctx.beginPath(); ctx.arc(186, 29, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("✓", 183, 32);

  // Queue status badge
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath();
  ctx.roundRect(470, 14, 144, 30, 6);
  ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("● PUBLISHING QUEUE", 482, 33);

  // Divider
  ctx.strokeStyle = "#e7e2d8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 58); ctx.lineTo(640, 58);
  ctx.stroke();

  // Category Tag
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 12px monospace";
  ctx.fillText("WORKFLOW // CONTENT SCHEDULING & DISPATCH", 28, 92);

  // Headline
  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 24px -apple-system, sans-serif";
  ctx.fillText("Autonomous Instagram Pipeline", 28, 126);

  // Subtitle
  ctx.fillStyle = "#57534e";
  ctx.font = "14px -apple-system, sans-serif";
  ctx.fillText("Multi-format drafting, approval gateway & Meta Graph API publishing", 28, 152);

  // --- Scheduled Post Preview Card ---
  ctx.fillStyle = "#fdfbf7";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(28, 176, 584, 156, 10);
  ctx.fill();
  ctx.stroke();

  // Post Card Header
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 12px monospace";
  ctx.fillText("NEXT DISPATCH // SCHEDULED SLOT", 44, 204);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.fillText("Architecture Spotlight: Autonomous Multi-Agent Orchestration", 44, 230);

  // Metadata pills
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath(); ctx.roundRect(44, 244, 172, 26, 6); ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("Today • 17:30 IST Target", 54, 261);

  ctx.fillStyle = "#f4f7f4";
  ctx.strokeStyle = "#cbdccb";
  ctx.beginPath(); ctx.roundRect(228, 244, 194, 26, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#57534e";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("Reel & 5-Slide Carousel Ready", 238, 261);

  // Human Review & API Validation Bar
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(44, 282, 552, 38, 6); ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("✓ Human Editorial Review Approved", 56, 305);

  ctx.fillStyle = "#78716c";
  ctx.font = "11px monospace";
  ctx.fillText("Meta Graph API v21.0 • Container Verified", 304, 305);

  // --- Footer Technical Capabilities Row ---
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 354, 640, 66);
  ctx.strokeStyle = "#e7e2d8";
  ctx.strokeRect(0, 354, 640, 66);

  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("📅 Scheduled Calendar Automation", 30, 392);
  ctx.fillText("👥 Human-in-the-Loop Gateway", 250, 392);
  ctx.fillText("⚡ Meta Graph API Sync", 470, 392);

  // Outer border frame
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(1, 1, 638, 418);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// Helper: Generate crisp 2D canvas texture for AI Agent Workflows panel
function createAgentCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card - high contrast clean white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 420);

  // Top header
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 0, 640, 58);

  // Terminal Agent Icon
  ctx.fillStyle = "#3b563d";
  ctx.beginPath(); ctx.roundRect(24, 14, 30, 30, 8); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px -apple-system, sans-serif";
  ctx.fillText("⚡", 31, 35);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.fillText("Autonomous Agent Router", 64, 33);

  // Execution status badge
  ctx.fillStyle = "#e5ede5";
  ctx.beginPath();
  ctx.roundRect(476, 14, 138, 30, 6);
  ctx.fill();
  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("● ROUTING ACTIVE", 490, 33);

  // Divider
  ctx.strokeStyle = "#e7e2d8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 58); ctx.lineTo(640, 58);
  ctx.stroke();

  // Category Tag
  ctx.fillStyle = "#5f8861";
  ctx.font = "bold 12px monospace";
  ctx.fillText("ORCHESTRATION // DETERMINISTIC AI AGENTS", 28, 92);

  // Headline
  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 24px -apple-system, sans-serif";
  ctx.fillText("Scoped Autonomous Execution", 28, 126);

  // Subtitle
  ctx.fillStyle = "#57534e";
  ctx.font = "14px -apple-system, sans-serif";
  ctx.fillText("Structured memory, authorized tool calling, and deterministic JSON schemas", 28, 152);

  // --- High-Contrast Terminal Pipeline Box ---
  ctx.fillStyle = "#162218";
  ctx.strokeStyle = "#2b3e2e";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(28, 176, 584, 156, 10);
  ctx.fill();
  ctx.stroke();

  // Terminal Prompt & Steps
  ctx.fillStyle = "#86c289";
  ctx.font = "bold 11px monospace";
  ctx.fillText("$ agent.route({ trigger: 'inquiry.lead_qualification' })", 44, 204);

  ctx.fillStyle = "#cbdccb";
  ctx.font = "12px monospace";
  ctx.fillText("01. Context Ingest & SOP Knowledge Retrieval ... OK", 44, 230);
  ctx.fillText("02. Scoped API Tool Calling (CRM & Calendar API) ... OK", 44, 252);
  ctx.fillText("03. Deterministic JSON Schema Validation Pass ... 100%", 44, 274);

  // Escalation policy line
  ctx.fillStyle = "#e5ede5";
  ctx.font = "bold 11px monospace";
  ctx.fillText("04. Human Escalation Trigger: Zero Uncontrolled Execution", 44, 302);

  // --- Footer Technical Capabilities Row ---
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 354, 640, 66);
  ctx.strokeStyle = "#e7e2d8";
  ctx.strokeRect(0, 354, 640, 66);

  ctx.fillStyle = "#3b563d";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("🔒 Strict Execution Bounds", 30, 392);
  ctx.fillText("⚙️ Authorized CRM Tool Calling", 240, 392);
  ctx.fillText("📋 Auditable Transcripts", 470, 392);

  // Outer border frame
  ctx.strokeStyle = "#cbdccb";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(1, 1, 638, 418);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 540;
    let height = container.clientHeight || 540;
    let animationFrameId: number;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const isInitialMobile = width < 640;
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 1000);
    camera.position.set(0, 0, isInitialMobile ? 9.6 : 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const sageFill = new THREE.PointLight(0x5f8861, 26, 25);
    sageFill.position.set(-6, -3, 5);
    scene.add(sageFill);

    const rimLight = new THREE.DirectionalLight(0xa7c3a8, 2.0);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    const coreTopLight = new THREE.PointLight(0x86c289, 2.8, 8);
    coreTopLight.position.set(0.1, 1.4, 1.0);
    scene.add(coreTopLight);

    // 3. Main Master Scene Group (Isometric presentation)
    const masterGroup = new THREE.Group();
    masterGroup.position.set(0.35, 0, 0);
    masterGroup.rotation.y = -0.08;
    masterGroup.rotation.x = 0.05;
    scene.add(masterGroup);

    // =========================================================
    // A. REFINED CENTRAL AI AUTOMATION CORE (Compact Precision Hub)
    // =========================================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0.1, 0.05, -0.3);
    masterGroup.add(coreGroup);

    // 1. Precision Machined Base Plinth
    const plinthGeo = new THREE.CylinderGeometry(1.0, 1.18, 0.22, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1f2e21,
      metalness: 0.9,
      roughness: 0.22
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -0.3;
    coreGroup.add(plinthMesh);

    // Plinth Edge Ring
    const plinthEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(plinthGeo, 30),
      new THREE.LineBasicMaterial({ color: 0x86c289, opacity: 0.85, transparent: true })
    );
    plinthEdges.position.copy(plinthMesh.position);
    coreGroup.add(plinthEdges);

    // 2. Middle Ring Collar (Metallic Bronze/Sage)
    const collarGeo = new THREE.CylinderGeometry(0.78, 0.88, 0.14, 24);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x3b563d,
      emissive: 0x243826,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.2
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.y = -0.12;
    coreGroup.add(collarMesh);

    // 3. Central Luminous Chamber (Translucent Sage Glass)
    const chamberGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.65, 8);
    const chamberMat = new THREE.MeshStandardMaterial({
      color: 0x496d4b,
      emissive: 0x314633,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.18,
      transparent: true,
      opacity: 0.65
    });
    const chamberMesh = new THREE.Mesh(chamberGeo, chamberMat);
    chamberMesh.position.y = 0.25;
    coreGroup.add(chamberMesh);

    const chamberEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(chamberGeo),
      new THREE.LineBasicMaterial({ color: 0x86c289, opacity: 0.8, transparent: true })
    );
    chamberEdges.position.copy(chamberMesh.position);
    coreGroup.add(chamberEdges);

    // 4. Compact Floating Brand Emblem (Refined Lightning Symbol)
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
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.04,
      bevelThickness: 0.04
    });
    boltGeo.center();

    const boltMat = new THREE.MeshStandardMaterial({
      color: 0x86c289,
      emissive: 0x5f8861,
      emissiveIntensity: 0.65,
      metalness: 0.9,
      roughness: 0.14
    });
    const boltEmblem = new THREE.Mesh(boltGeo, boltMat);
    boltEmblem.scale.set(0.14, 0.14, 0.14);
    boltEmblem.position.set(0, 0.25, 0.15);
    coreGroup.add(boltEmblem);

    // 5. Three Radial Optical Conduit Couplers on Plinth
    const couplerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16);
    const couplerMat = new THREE.MeshStandardMaterial({
      color: 0x5f8861,
      emissive: 0x86c289,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2
    });

    // Coupler 1 (Points toward Web Panel at top-left)
    const coupler1 = new THREE.Mesh(couplerGeo, couplerMat);
    coupler1.position.set(-0.7, -0.15, 0.4);
    coupler1.rotation.z = Math.PI / 4;
    coreGroup.add(coupler1);

    // Coupler 2 (Points toward Instagram Panel at right)
    const coupler2 = new THREE.Mesh(couplerGeo, couplerMat);
    coupler2.position.set(0.85, -0.15, 0.2);
    coupler2.rotation.z = -Math.PI / 3;
    coreGroup.add(coupler2);

    // Coupler 3 (Points toward AI Agents Panel at bottom-left)
    const coupler3 = new THREE.Mesh(couplerGeo, couplerMat);
    coupler3.position.set(-0.35, -0.28, 0.65);
    coupler3.rotation.x = Math.PI / 3;
    coreGroup.add(coupler3);

    // =========================================================
    // B. THREE HIGH-CONTRAST DUAL-LAYER GLASS PANELS
    // =========================================================
    const panelWidth = 3.0;
    const panelHeight = 1.96;

    // Helper: Build a high-contrast floating hardware display terminal
    const buildHardwarePanel = (texture: THREE.CanvasTexture) => {
      const group = new THREE.Group();

      // 1. Front Screen Face: toneMapped=false guarantees 100% crisp contrast
      const screenGeo = new THREE.PlaneGeometry(panelWidth, panelHeight);
      const screenMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
        toneMapped: false
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      group.add(screenMesh);

      // 2. 3D Glass Chassis Backing: gives real physical thickness and bevel
      const chassisGeo = new THREE.BoxGeometry(panelWidth + 0.08, panelHeight + 0.08, 0.07);
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.16,
        metalness: 0.12,
        transparent: true,
        opacity: 0.94
      });
      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      chassisMesh.position.z = -0.045;
      group.add(chassisMesh);

      // 3. Glowing Chamfer Edge Border
      const edgeGeo = new THREE.EdgesGeometry(chassisGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x5f8861,
        transparent: true,
        opacity: 0.75
      });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLines.position.copy(chassisMesh.position);
      group.add(edgeLines);

      return { group, screenMat, chassisMat, edgeMat };
    };

    // 1. Websites & Digital Platform Panel (Top-Left / Prominent)
    const webTex = createWebsiteCanvasTexture();
    const webPanel = buildHardwarePanel(webTex);
    webPanel.group.position.set(-2.15, 1.22, 0.4);
    webPanel.group.rotation.set(0.06, 0.22, -0.02);
    masterGroup.add(webPanel.group);

    // 2. Instagram & Social Automation Panel (Right / Midground)
    const igTex = createInstagramCanvasTexture();
    const igPanel = buildHardwarePanel(igTex);
    igPanel.group.position.set(1.95, 0.35, 0.55);
    igPanel.group.rotation.set(-0.04, -0.26, 0.02);
    masterGroup.add(igPanel.group);

    // 3. AI Agents & Autonomous Pipelines Panel (Bottom / Foreground)
    const agentTex = createAgentCanvasTexture();
    const agentPanel = buildHardwarePanel(agentTex);
    agentPanel.group.position.set(-0.35, -1.52, 0.95);
    agentPanel.group.rotation.set(0.12, 0.05, -0.01);
    masterGroup.add(agentPanel.group);

    // =========================================================
    // C. 3D CURVED DATA SPLINE PATHS & MOVING DATA PACKETS
    // =========================================================
    // Spline 1: Core Coupler 1 -> Websites Panel anchor
    const curveWeb = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, -0.1, 0.1),
      new THREE.Vector3(-1.2, 0.55, 0.3),
      new THREE.Vector3(-1.7, 0.95, 0.35),
      new THREE.Vector3(-2.05, 1.22, 0.4)
    ]);

    // Spline 2: Core Coupler 2 -> Instagram Panel anchor
    const curveIg = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.8, -0.1, -0.1),
      new THREE.Vector3(1.3, 0.12, 0.2),
      new THREE.Vector3(1.65, 0.28, 0.4),
      new THREE.Vector3(1.9, 0.35, 0.55)
    ]);

    // Spline 3: Core Coupler 3 -> AI Agents Panel anchor
    const curveAgent = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, -0.25, 0.3),
      new THREE.Vector3(-0.3, -0.7, 0.55),
      new THREE.Vector3(-0.32, -1.15, 0.75),
      new THREE.Vector3(-0.35, -1.52, 0.95)
    ]);

    const splineMat = new THREE.LineBasicMaterial({
      color: 0x5f8861,
      transparent: true,
      opacity: 0.8,
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

    // Moving Luminous Data Packet Spheres
    const packetGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x86c289,
      toneMapped: false
    });
    const packetMatWhite = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false
    });

    const webPackets = [
      new THREE.Mesh(packetGeo, packetMat),
      new THREE.Mesh(packetGeo, packetMatWhite)
    ];
    const igPackets = [
      new THREE.Mesh(packetGeo, packetMat),
      new THREE.Mesh(packetGeo, packetMatWhite)
    ];
    const agentPackets = [
      new THREE.Mesh(packetGeo, packetMat),
      new THREE.Mesh(packetGeo, packetMatWhite)
    ];

    [...webPackets, ...igPackets, ...agentPackets].forEach((p) => masterGroup.add(p));

    // Ambient floating data dust particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8.5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4.0;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x86c289,
      size: 0.05,
      transparent: true,
      opacity: 0.55
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particles);

    // =========================================================
    // D. POINTER PARALLAX & REDUCED MOTION SUPPORT
    // =========================================================
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = prefersReducedMotion ? 0.15 : 1.0;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.18;
      targetMouseY = y * 0.14;
    };

    let scrollProgress = 0;
    const handleScroll = () => {
      scrollProgress = Math.min(window.scrollY / 600, 1.0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // =========================================================
    // E. 60FPS ANIMATION LOOP
    // =========================================================
    const startTime = performance.now();
    let lastTime = startTime;

    const animate = (now: number = performance.now()) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (now - startTime) * 0.001;
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      // Smooth pointer interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Master rotation & parallax
      masterGroup.rotation.y = -0.08 + currentMouseX * motionScale;
      masterGroup.rotation.x = 0.05 - currentMouseY * motionScale + scrollProgress * 0.08;

      // 1. Core Gentle Harmonic Levitation & Slow Rotation
      const coreFloatY = 0.05 + Math.sin(elapsedTime * 1.2 * motionScale) * 0.04;
      coreGroup.position.y = coreFloatY;
      collarMesh.rotation.y = elapsedTime * 0.15 * motionScale;
      chamberMesh.rotation.y = -elapsedTime * 0.2 * motionScale;
      boltEmblem.rotation.y = Math.sin(elapsedTime * 1.5 * motionScale) * 0.2;

      // 2. Subtle Harmonic Breathing on the 3 Hardware Panels
      webPanel.group.position.y = 1.22 + Math.sin(elapsedTime * 0.9 * motionScale + 0.2) * 0.04;
      igPanel.group.position.y = 0.35 + Math.sin(elapsedTime * 0.85 * motionScale + 1.8) * 0.04;
      agentPanel.group.position.y = -1.52 + Math.sin(elapsedTime * 0.95 * motionScale + 3.4) * 0.04;

      // 3. Data Packets Flowing Along Spline Conduits
      const t1 = (elapsedTime * 0.42) % 1.0;
      const t1b = (elapsedTime * 0.42 + 0.5) % 1.0;
      webPackets[0].position.copy(curveWeb.getPoint(t1));
      webPackets[1].position.copy(curveWeb.getPoint(t1b));

      const t2 = (elapsedTime * 0.38 + 0.2) % 1.0;
      const t2b = (elapsedTime * 0.38 + 0.7) % 1.0;
      igPackets[0].position.copy(curveIg.getPoint(t2));
      igPackets[1].position.copy(curveIg.getPoint(t2b));

      const t3 = (elapsedTime * 0.44 + 0.35) % 1.0;
      const t3b = (elapsedTime * 0.44 + 0.85) % 1.0;
      agentPackets[0].position.copy(curveAgent.getPoint(t3));
      agentPackets[1].position.copy(curveAgent.getPoint(t3b));

      // 4. Ambient Data Particles
      particles.rotation.y = elapsedTime * 0.04 * motionScale;

      renderer.render(scene, camera);

      if (typeof window !== "undefined") {
        (window as any).__FLASH_HERO__ = {
          frameCount: (((window as any).__FLASH_HERO__?.frameCount) || 0) + 1,
          elapsedTime,
          masterRotationY: masterGroup.rotation.y,
          coreFloatY,
          webPanelY: webPanel.group.position.y,
          igPanelY: igPanel.group.position.y,
          agentPanelY: agentPanel.group.position.y
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
        camera.position.z = w < 640 ? 9.6 : 8.2;
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
      plinthGeo.dispose();
      collarGeo.dispose();
      chamberGeo.dispose();
      boltGeo.dispose();
      couplerGeo.dispose();
      packetGeo.dispose();
      particleGeo.dispose();
      webTex.dispose();
      igTex.dispose();
      agentTex.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[580px] lg:max-w-[650px] aspect-[4/3] sm:aspect-square mx-auto flex items-center justify-center select-none overflow-visible">
      {/* Ambient Warm Sage Halo Behind 3D Workflow Ecosystem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-full bg-[#cbdccb]/40 blur-3xl animate-pulse-halo" />
        <div className="w-64 h-64 rounded-full bg-[#e5ede5]/55 blur-2xl" />
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing z-0"
      />
    </div>
  );
}
