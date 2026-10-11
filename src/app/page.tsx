import Link from "next/link";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Code2,
  Workflow,
  Globe2,
  ChevronRight
} from "lucide-react";
import { HeroScene3D } from "@/components/HeroScene3D";
import { VERIFIED_PROJECTS, AGENCY_SERVICES } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 border-b border-white/10">
        {/* Ambient violet glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#863bff]/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#38bdf8]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#863bff]/10 border border-[#863bff]/30 text-[#d8b4fe] text-xs font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-[#a855f7] animate-spin" />
                <span>Boutique AI & Deep Web Engineering</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Autonomous <span className="animated-gradient-text">AI Systems</span> Built for Real Impact.
              </h1>

              <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                FLASH.Ai designs production-grade agentic architectures, automated content engines, computer vision pipelines, and cinematic web platforms. Zero fluff, fully verified code.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/booking"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#863bff] via-[#9333ea] to-[#7c3aed] text-white font-semibold text-sm shadow-[0_0_30px_rgba(134,59,255,0.45)] hover:shadow-[0_0_40px_rgba(134,59,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Book Technical Discovery
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/portfolio"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-zinc-200 hover:text-white hover:border-[#863bff]/50 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  Explore Verified Portfolio
                </Link>
              </div>

              {/* Verified Pillars Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">5+</div>
                  <div className="text-xs text-zinc-400 font-medium">Verified Systems</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#c084fc] tracking-tight">100%</div>
                  <div className="text-xs text-zinc-400 font-medium">Authentic Demos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400 tracking-tight">&lt; 1s</div>
                  <div className="text-xs text-zinc-400 font-medium">Edge Performance</div>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Canvas */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full rounded-2xl glass-panel p-2 glow-border relative overflow-hidden">
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] text-zinc-300 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-ping" />
                  3D Interactive Canvas
                </div>
                <HeroScene3D />
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-zinc-400 bg-black/60 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5">
                  <span>Three.js WebGL Core</span>
                  <span className="text-[#c084fc]">Interactive Mouse Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED WORK & CASE STUDIES SHOWCASE */}
      <section className="py-24 bg-[#07050d] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#a855f7] font-bold mb-2">
                Proven Engineering
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Verified Production Case Studies
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
                Real codebases inspected and deployed by our team. Never fabricated clients or mock portfolios.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c084fc] hover:text-white transition-colors"
            >
              View Detailed Architecture Teardowns
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VERIFIED_PROJECTS.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="rounded-2xl glass-panel p-6 glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#863bff]/20 text-[#d8b4fe] border border-[#863bff]/30">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {project.liveStatus}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  <p className="text-xs text-[#a855f7] font-medium mb-3">{project.tagline}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">{project.summary}</p>

                  <div className="space-y-2 mb-6">
                    {project.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a855f7] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/portfolio#${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#c084fc] transition-colors"
                  >
                    View System Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section className="py-24 relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#a855f7] font-bold">
              Engineering Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What We Build For Modern High-Growth Teams
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              From automated AI content pipelines to mathematical computer vision algorithms, we architect complete solutions from inception to production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AGENCY_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="rounded-2xl glass-panel p-8 glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#863bff]/20 text-[#c084fc] border border-[#863bff]/30">
                      {srv.badge}
                    </span>
                    <span className="text-xs font-bold text-zinc-300 font-mono">
                      {srv.timeline}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{srv.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6">{srv.description}</p>

                  <div className="space-y-2.5 mb-6">
                    {srv.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-medium block">
                      Scope Estimate
                    </span>
                    <span className="text-base font-bold text-white">{srv.priceEstimate}</span>
                  </div>
                  <Link
                    href={`/booking?service=${srv.id}`}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#863bff] text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    Select Service <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY FLASH.AI DIFFERENTIATOR */}
      <section className="py-24 bg-[#080612] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-widest text-[#a855f7] font-bold">
                The FLASH.Ai Standard
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                No Hallucinated Testimonials. Just High-Velocity Code.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Many agencies market shiny mockups without code beneath the surface. At FLASH.Ai, every system we showcase is backed by authentic commits, tested unit suites, and containerized microservices.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#863bff]/20 text-[#a855f7] shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full-Stack Intelligence</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      We connect browser canvases, Python microservices, and serverless edge databases into unified, responsive engines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#863bff]/20 text-[#a855f7] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero Fake Metrics or Promises</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Honest engineering: when APIs are unconfigured or third parties are rate-limited, our code detects and reports it gracefully.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#863bff]/20 text-[#a855f7] shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Free-Tier Scalable Architecture</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Architected for Vercel, Neon, and Upstash with low to zero monthly cloud overhead.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="glass-panel p-8 rounded-2xl glow-border space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono text-zinc-400">FLASH_AI_PIPELINE.config</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Ready for Production
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-300 space-y-2">
                <p className="text-zinc-500">// Real Multi-Platform Integrations</p>
                <p>
                  <span className="text-[#a855f7]">const</span> target ={" "}
                  <span className="text-emerald-400">&apos;Meta Graph API & WhatsApp Cloud&apos;</span>;
                </p>
                <p>
                  <span className="text-[#a855f7]">const</span> inpaintingAlgorithm ={" "}
                  <span className="text-emerald-400">&apos;Navier-Stokes PDE + Optical Flow&apos;</span>;
                </p>
                <p>
                  <span className="text-[#a855f7]">const</span> trendDelivery ={" "}
                  <span className="text-emerald-400">&apos;Telegram Webhook at 07:30 AM IST&apos;</span>;
                </p>
                <p>
                  <span className="text-[#a855f7]">const</span> leadValidation ={" "}
                  <span className="text-emerald-400">&apos;SSRF-Protected 12-Point Audit&apos;</span>;
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/booking"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white font-semibold text-xs tracking-wider uppercase text-center block"
                >
                  Schedule Your Project Kickoff
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="p-12 rounded-3xl glass-panel glow-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#863bff]/25 blur-[100px] pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to Accelerate Your AI Roadmap?
            </h2>
            <p className="text-base text-zinc-300 max-w-xl mx-auto mb-8">
              Discuss your custom workflow, automated social engine, or high-conversion platform with our engineering lead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Book 30-Min Discovery
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl glass-panel text-white hover:border-[#863bff]/60 font-semibold text-sm transition-colors"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
