"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { ArrowRight, Tag, ShieldCheck, ExternalLink, Video } from "lucide-react";

interface PortfolioClientProps {
  initialProjects: Project[];
}

export function PortfolioClient({ initialProjects }: PortfolioClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "AI Workflow",
    "AI Agents",
    "n8n Automation",
    "Lead & CRM",
    "Vision & PDE"
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? initialProjects
      : initialProjects.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              selectedCategory === cat
                ? "bg-[#3b563d] text-white shadow-sm"
                : "bg-[#ffffff] text-[#57534e] border border-[#e7e2d8] hover:border-[#cbdccb] hover:text-[#1c1917]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="space-y-10">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            id={p.id}
            className="natural-card p-8 sm:p-10 bg-[#ffffff] scroll-mt-28"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Core Overview */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="sage-badge text-xs">{p.category}</span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                      p.projectType === "Client System"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : p.projectType === "Concept Architecture"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {p.projectType}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1917]">
                    {p.name}
                  </h2>
                  <p className="text-sm font-semibold text-[#5f8861] mt-1">
                    {p.tagline}
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#57534e] leading-relaxed">
                  <div>
                    <strong className="text-[#1c1917] block font-semibold mb-0.5">
                      Business Challenge:
                    </strong>
                    <p>{p.problem}</p>
                  </div>
                  <div>
                    <strong className="text-[#1c1917] block font-semibold mb-0.5">
                      Engineered Solution:
                    </strong>
                    <p>{p.solution}</p>
                  </div>
                </div>

                <div>
                  <strong className="text-xs uppercase font-bold tracking-wider text-[#78716c] block mb-2">
                    Production Stack
                  </strong>
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#f7f4ee] border border-[#e7e2d8] text-[#57534e]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <Link
                    href={`/portfolio/${p.id}`}
                    className="btn-sage-primary text-xs py-2 px-4"
                  >
                    View Project Breakdown
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {p.projectUrl && (
                    <a
                      href={p.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#3b563d] hover:text-[#1c1917] flex items-center gap-1"
                    >
                      Project URL <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {p.demoVideoUrl && (
                    <a
                      href={p.demoVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#57534e] hover:text-[#1c1917] flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-[#5f8861]" /> Demo Recording
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Outcomes & Metrics */}
              <div className="lg:col-span-5 bg-[#f7f4ee] border border-[#e7e2d8] rounded-2xl p-6 sm:p-7 space-y-6">
                <div>
                  <h3 className="text-xs uppercase font-bold tracking-wider text-[#78716c] mb-1">
                    System Specification Dossier
                  </h3>
                  <p className="text-xs text-[#57534e]">Architectural and verification details</p>
                </div>

                <div className="space-y-3">
                  {p.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#ffffff] border border-[#e7e2d8]"
                    >
                      <span className="text-xs text-[#57534e]">{m.label}</span>
                      <span className="text-xs font-bold text-[#1c1917] font-mono">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#cbdccb] text-xs text-[#3b563d] leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#5f8861]" />
                    Transparency Notice:
                  </div>
                  {p.projectType === "Client System"
                    ? "Verified production architecture engineered and verified directly within our client repository."
                    : p.projectType === "Concept Architecture"
                    ? "Concept architecture designed to demonstrate technical feasibility and mathematical algorithms."
                    : "Prototype simulator built for diagnostic evaluation. Strictly non-fictional."}
                </div>

                <Link
                  href={`/booking?service=ai-workflow-automation&projectRef=${p.id}`}
                  className="w-full btn-sage-secondary text-xs py-2.5 justify-center"
                >
                  Inquire About Similar Architecture
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
