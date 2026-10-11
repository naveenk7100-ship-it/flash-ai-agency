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
  ChevronRight,
  Terminal,
  Activity,
  Compass,
  Database,
  ArrowUpRight
} from "lucide-react";
import { HeroScene3D } from "@/components/HeroScene3D";
import { VERIFIED_PROJECTS, AGENCY_SERVICES } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#020106]">
      {/* ========================================================= */}
      {/* 1. FULL-SCREEN CINEMATIC 3D HERO (100vh Edge-to-Edge)      */}
      {/* ========================================================= */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Full-bleed Three.js 3D Canvas Scene */}
        <HeroScene3D />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#863bff]/25 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#38bdf8]/15 blur-[180px] rounded-full pointer-events-none" />

        {/* Hero Foreground Content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-[#863bff]/40 text-[#d8b4fe] text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_25px_rgba(134,59,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-ping" />
            <span>Next-Generation AI Engineering Studio</span>
            <span className="text-zinc-500">•</span>
            <span className="text-emerald-400 font-mono">Systems Live</span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05] mb-6">
            Autonomous <span className="animated-gradient-text">AI Systems</span> Engineered For Scale.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl font-normal leading-relaxed mb-10">
            We architect verified agentic pipelines, Navier-Stokes computer vision inpainting engines, real-time trend radars, and high-conversion web platforms with zero hallucinated fluff.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-[#863bff] via-[#9333ea] to-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(134,59,255,0.5)] hover:shadow-[0_0_45px_rgba(134,59,255,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Book Technical Discovery
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/portfolio"
              className="w-full sm:w-auto px-9 py-4 rounded-xl glass-panel text-zinc-200 hover:text-white hover:border-[#863bff]/50 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              Explore Verified Systems
            </Link>
          </div>

          {/* Live Metrics Strip */}
          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl glass-panel border border-white/10">
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-white">5+</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">Verified Architectures</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-[#c084fc]">100%</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">Inspected Codebases</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">0 Fake</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">Testimonials / Claims</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-[#38bdf8]">&lt; 1s</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">Global Edge Latency</div>
            </div>
          </div>
        </div>

        {/* Ambient bottom gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020106] to-transparent pointer-events-none" />
      </section>

      {/* ========================================================= */}
      {/* 2. TRUSTED ENGINEERING CAPABILITIES STRIP                  */}
      {/* ========================================================= */}
      <section className="py-12 border-b border-white/10 bg-[#04020a]/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-400 text-xs uppercase tracking-widest font-semibold">
            <span className="text-[#a855f7] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#863bff]" />
              Production Stacks Deployed & Verified
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-zinc-300">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#863bff]" /> Next.js 16 App Router
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" /> Navier-Stokes PDE
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Meta Graph & WhatsApp Cloud API
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" /> OpenRouter & Gemini AI
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> PostgreSQL & Upstash
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. VERIFIED SYSTEMS SHOWCASE (Authentic Case Studies)       */}
      {/* ========================================================= */}
      <section className="py-24 md:py-32 relative border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-widest text-[#a855f7] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#863bff]" />
                Audited Workspaces & Deployments
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Verified Production Architectures
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
                Every system showcased here is backed by inspected repositories in your workspace. We never use generic template screenshots or make unsubstantiated claims.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c084fc] hover:text-white transition-colors py-2 px-4 rounded-xl glass-panel border border-[#863bff]/30"
            >
              Open Full Dossiers ({VERIFIED_PROJECTS.length})
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VERIFIED_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl glass-panel p-8 glass-panel-hover flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#863bff]/10 blur-3xl pointer-events-none group-hover:bg-[#863bff]/20 transition-all" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#863bff]/20 text-[#d8b4fe] border border-[#863bff]/30">
                      {project.category}
                    </span>
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {project.liveStatus}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#c084fc] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#a855f7] font-semibold mb-4 leading-relaxed">
                    {project.tagline}
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                    {project.summary}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {project.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-zinc-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/portfolio#${project.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#c084fc] transition-colors"
                  >
                    Inspect System Dossier <ArrowUpRight className="w-4 h-4 text-[#a855f7]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. IMMERSIVE SERVICES & DELIVERABLES                      */}
      {/* ========================================================= */}
      <section className="py-24 md:py-32 relative border-b border-white/10 bg-[#04020a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="text-xs uppercase tracking-widest text-[#a855f7] font-bold">
              Engineering Disciplines
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Production Capabilities Built to Ship
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Every deliverable is engineered with automated error boundaries, cloud-cost optimization, and clean source code ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AGENCY_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="rounded-3xl glass-panel p-8 sm:p-10 glow-border flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#863bff]/20 text-[#c084fc] border border-[#863bff]/30">
                      {srv.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Timeline: <strong className="text-white font-bold">{srv.timeline}</strong>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                    {srv.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Production Deliverables
                  </h4>
                  <div className="space-y-3 mb-8">
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
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                      Scope Estimate
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      {srv.priceEstimate}
                    </span>
                  </div>
                  <Link
                    href={`/booking?service=${srv.id}`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(134,59,255,0.4)] hover:shadow-[0_0_30px_rgba(134,59,255,0.6)] transition-all flex items-center gap-1.5"
                  >
                    Select Service <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. DEVELOPMENT BLUEPRINT (Transparent Process)            */}
      {/* ========================================================= */}
      <section className="py-24 md:py-32 relative border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="text-xs uppercase tracking-widest text-[#a855f7] font-bold">
              Engineering Protocol
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              From Architecture to Production in 4 Steps
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Predictable cycles, continuous automated tests, and honest status updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
              <span className="text-4xl font-black text-[#863bff] font-mono">01</span>
              <h3 className="text-lg font-bold text-white">System Scoping</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We audit API constraints, model token economics, rate limits, and database concurrency demands.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
              <span className="text-4xl font-black text-[#863bff] font-mono">02</span>
              <h3 className="text-lg font-bold text-white">Functional POC</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We assemble working core logic with real test fixtures and verified models before cosmetic styling.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
              <span className="text-4xl font-black text-[#863bff] font-mono">03</span>
              <h3 className="text-lg font-bold text-white">Security Hardening</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Implementing SSRF defenses, serverless secret protections, rate limiters, and webhook idempotency.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
              <span className="text-4xl font-black text-[#863bff] font-mono">04</span>
              <h3 className="text-lg font-bold text-white">Edge Deployment</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Deploying to Vercel and container clusters with telemetry, health logs, and admin operational tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CALL TO ACTION & ENGAGEMENT                             */}
      {/* ========================================================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="p-12 sm:p-16 rounded-3xl glass-panel glow-border-strong relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#863bff]/25 blur-[120px] pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Ready to Deploy Production-Grade AI?
            </h2>
            <p className="text-base text-zinc-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Schedule a 30-minute technical discovery session directly with our lead engineer. Get an architectural breakdown and scope estimate for your project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto px-9 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-[0_0_35px_rgba(255,255,255,0.35)]"
              >
                Book Discovery Session
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-9 py-4 rounded-xl glass-panel text-white hover:border-[#863bff]/60 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Request Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
