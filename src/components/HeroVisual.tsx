"use client";

import Image from "next/image";
import { Workflow, Bot, Share2, Target, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroVisual() {
  const capabilities = [
    {
      id: "agents",
      label: "Custom AI Agents",
      sub: "Deterministic Tools",
      icon: Bot,
      cx: 110,
      cy: 110,
      align: "left"
    },
    {
      id: "n8n",
      label: "n8n Orchestration",
      sub: "Self-Hosted Pipelines",
      icon: Share2,
      cx: 470,
      cy: 110,
      align: "right"
    },
    {
      id: "workflows",
      label: "Workflow Automation",
      sub: "ERP & Document Sync",
      icon: Workflow,
      cx: 110,
      cy: 410,
      align: "left"
    },
    {
      id: "leads",
      label: "Lead Capture & CRM",
      sub: "Verified Guardrails",
      icon: Target,
      cx: 470,
      cy: 410,
      align: "right"
    }
  ];

  return (
    <div className="relative w-full max-w-[540px] aspect-[580/520] mx-auto flex items-center justify-center select-none overflow-visible">
      {/* 1. Ambient Warm Radial Halo behind SVG composition */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#cbdccb]/40 blur-3xl animate-pulse-halo" />
        <div className="w-64 h-64 rounded-full bg-[#e5ede5]/50 blur-2xl" />
      </div>

      {/* 2. Pure Vector Animated Canvas */}
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 580 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sageFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b563d" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#5f8861" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#cbdccb" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="sageFlow2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b563d" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#5f8861" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#cbdccb" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="hubHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e5ede5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fdfbf7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Orbit Guide Rings */}
        <circle cx="290" cy="260" r="185" stroke="#cbdccb" strokeWidth="1" strokeDasharray="5 5" opacity="0.6" />
        <circle cx="290" cy="260" r="125" stroke="#e7e2d8" strokeWidth="1" opacity="0.8" />

        {/* Elegant Curved Flow Paths converging from Capability Nodes to Center Hub (290, 260) */}
        {/* Path 1: Top-Left (160, 120) -> Hub (290, 260) */}
        <path
          d="M 160 120 Q 210 180 290 260"
          stroke="url(#sageFlow1)"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-line-draw"
        />
        {/* Path 2: Top-Right (420, 120) -> Hub (290, 260) */}
        <path
          d="M 420 120 Q 370 180 290 260"
          stroke="url(#sageFlow2)"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-line-draw"
        />
        {/* Path 3: Bottom-Left (160, 400) -> Hub (290, 260) */}
        <path
          d="M 160 400 Q 210 340 290 260"
          stroke="url(#sageFlow2)"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-line-draw"
        />
        {/* Path 4: Bottom-Right (420, 400) -> Hub (290, 260) */}
        <path
          d="M 420 400 Q 370 340 290 260"
          stroke="url(#sageFlow1)"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-line-draw"
        />

        {/* Moving Particles along paths */}
        <circle cx="230" cy="195" r="3.5" fill="#5f8861" className="animate-pulse" />
        <circle cx="350" cy="195" r="3.5" fill="#3b563d" className="animate-pulse" />
        <circle cx="230" cy="325" r="3.5" fill="#3b563d" className="animate-pulse" />
        <circle cx="350" cy="325" r="3.5" fill="#5f8861" className="animate-pulse" />
      </svg>

      {/* 3. Central Focal Hub: FLASH.Ai Studio */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl bg-[#ffffff] border border-[#cbdccb] shadow-[0_16px_40px_rgba(59,86,61,0.14)] group hover:scale-105 transition-all duration-300">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-2 rounded-2xl bg-[#e5ede5]/80 border border-[#cbdccb] mb-2.5 shadow-inner">
          <Image
            src="/logo.svg"
            alt="FLASH.Ai Logo"
            width={52}
            height={50}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <span className="text-sm sm:text-base font-extrabold text-[#1c1917] tracking-tight block">
            FLASH<span className="text-[#3b563d]">.Ai</span> Studio
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#5f8861] uppercase tracking-wider block">
            Engineering Hub
          </span>
        </div>

        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f7f4] border border-[#cbdccb] text-[10px] font-mono text-[#3b563d]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5f8861] animate-ping" />
          <span>Production Verified</span>
        </div>
      </div>

      {/* 4. Elegant Capability Badges anchored predictably */}
      {/* Top-Left: Custom AI Agents */}
      <div className="absolute top-4 sm:top-6 left-2 sm:left-4 z-20 animate-float-gentle">
        <div className="natural-card px-3.5 py-2.5 bg-[#ffffff] border-[#cbdccb] shadow-[0_6px_20px_rgba(28,25,23,0.05)] flex items-center gap-2.5 hover:border-[#5f8861] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1c1917] block leading-tight">Custom AI Agents</span>
            <span className="text-[10px] text-[#78716c] block leading-tight font-medium">Deterministic Tools</span>
          </div>
        </div>
      </div>

      {/* Top-Right: n8n Orchestration */}
      <div className="absolute top-4 sm:top-6 right-2 sm:right-4 z-20 animate-float-lag">
        <div className="natural-card px-3.5 py-2.5 bg-[#ffffff] border-[#cbdccb] shadow-[0_6px_20px_rgba(28,25,23,0.05)] flex items-center gap-2.5 hover:border-[#5f8861] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1c1917] block leading-tight">n8n Orchestration</span>
            <span className="text-[10px] text-[#78716c] block leading-tight font-medium">Self-Hosted Workflows</span>
          </div>
        </div>
      </div>

      {/* Bottom-Left: Workflow Automation */}
      <div className="absolute bottom-4 sm:bottom-6 left-2 sm:left-4 z-20 animate-float-lag">
        <div className="natural-card px-3.5 py-2.5 bg-[#ffffff] border-[#cbdccb] shadow-[0_6px_20px_rgba(28,25,23,0.05)] flex items-center gap-2.5 hover:border-[#5f8861] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1c1917] block leading-tight">Workflow Automation</span>
            <span className="text-[10px] text-[#78716c] block leading-tight font-medium">ERP & Document Sync</span>
          </div>
        </div>
      </div>

      {/* Bottom-Right: Lead Capture & CRM */}
      <div className="absolute bottom-4 sm:bottom-6 right-2 sm:right-4 z-20 animate-float-gentle">
        <div className="natural-card px-3.5 py-2.5 bg-[#ffffff] border-[#cbdccb] shadow-[0_6px_20px_rgba(28,25,23,0.05)] flex items-center gap-2.5 hover:border-[#5f8861] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1c1917] block leading-tight">Lead Capture & CRM</span>
            <span className="text-[10px] text-[#78716c] block leading-tight font-medium">Verified Guardrails</span>
          </div>
        </div>
      </div>
    </div>
  );
}
