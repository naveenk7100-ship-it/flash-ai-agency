import Link from "next/link";
import { VERIFIED_PROJECTS } from "@/lib/data";
import { CheckCircle2, ArrowRight, ExternalLink, ShieldAlert, Cpu, Terminal, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Portfolio & Verified Systems — FLASH.Ai Agency",
  description: "Explore verified case studies: FLASH.Ai Social, TrendPost, CleanCut AI, GlobalLead AI, and ExamPilot."
};

export default function PortfolioPage() {
  return (
    <div className="py-16 md:py-24 relative overflow-hidden bg-[#020106]">
      {/* Background glow */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-[#863bff]/15 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            100% Inspected & Verified Systems
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Case Studies & Proven Architectures
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Every project listed here represents actual production software designed and developed by our team.
            We explicitly avoid fabricating mock logos, fake client logos, or vanity metrics.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-16">
          {VERIFIED_PROJECTS.map((proj, idx) => (
            <div
              key={proj.id}
              id={proj.id}
              className="rounded-3xl glass-panel p-8 sm:p-12 glow-border scroll-mt-28 relative overflow-hidden"
            >
              {/* Subtle index watermark */}
              <div className="absolute -top-6 -right-2 text-8xl font-black text-white/[0.03] select-none pointer-events-none font-mono">
                0{idx + 1}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#863bff]/20 text-[#d8b4fe] border border-[#863bff]/30">
                      {proj.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {proj.liveStatus}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                      {proj.name}
                    </h2>
                    <p className="text-sm sm:text-base text-[#a855f7] font-semibold">
                      {proj.tagline}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                    {proj.summary}
                  </p>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                      Verified Capabilities & Technical Innovations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {proj.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Production Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-zinc-300 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Specs & Metric Panel */}
                <div className="lg:col-span-5 rounded-2xl bg-black/60 border border-white/10 p-6 sm:p-8 space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      System Specification Dossier
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">Verified Architectural Metrics</p>
                  </div>

                  <div className="space-y-4">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">{m.label}</span>
                        <span className="text-xs font-bold text-white font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#863bff]/10 border border-[#863bff]/20 text-xs text-[#d8b4fe] leading-relaxed">
                    <strong>Integrity Guarantee:</strong> This application was tested and verified directly from the repository source. All algorithmic models and interfaces are genuine.
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/booking?service=autonomous-ai-agents&ref=${proj.id}`}
                      className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-[#863bff] text-white text-xs font-bold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-2 group"
                    >
                      Build Similar Architecture
                      <ArrowUpRight className="w-4 h-4 text-[#c084fc] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
