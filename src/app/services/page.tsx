import Link from "next/link";
import { AGENCY_SERVICES } from "@/lib/data";
import { CheckCircle2, ArrowRight, Zap, Sparkles } from "lucide-react";

export const metadata = {
  title: "Services — FLASH.Ai Agency",
  description: "End-to-end AI engineering, autonomous agents, computer vision, and Next.js platforms."
};

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#863bff]/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#863bff]/15 border border-[#863bff]/30 text-[#c084fc] text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#a855f7]" />
            Full-Spectrum AI Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Engineering Services Built for Production
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            We deliver robust AI systems that integrate directly into your existing infrastructure.
            Every architecture is audited for security, latency, and cost-efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {AGENCY_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="rounded-3xl glass-panel p-8 md:p-10 glow-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#863bff]/20 text-[#c084fc] border border-[#863bff]/30">
                    {srv.badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Est. Timeline: <strong className="text-white">{srv.timeline}</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{srv.title}</h2>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">{srv.description}</p>

                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Scope Deliverables
                </h3>
                <ul className="space-y-3 mb-8">
                  {srv.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200">
                      <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Key Technologies
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {srv.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold block">
                    Starting Investment
                  </span>
                  <span className="text-xl font-extrabold text-white">{srv.priceEstimate}</span>
                </div>
                <Link
                  href={`/booking?service=${srv.id}`}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(134,59,255,0.4)] hover:shadow-[0_0_30px_rgba(134,59,255,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  Schedule Kickoff <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Process Roadmap */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Our 4-Stage Delivery Blueprint</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Transparent milestones, strict continuous testing, and zero communication gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-2xl font-black text-[#863bff]">01</span>
              <h4 className="text-base font-bold text-white">Technical Scoping</h4>
              <p className="text-xs text-zinc-400">
                Auditing requirements, API rate limits, model token budgets, and security parameters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-2xl font-black text-[#863bff]">02</span>
              <h4 className="text-base font-bold text-white">Interactive Prototyping</h4>
              <p className="text-xs text-zinc-400">
                Building functional POCs with real models and verified database schemas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-2xl font-black text-[#863bff]">03</span>
              <h4 className="text-base font-bold text-white">Integration & Hardening</h4>
              <p className="text-xs text-zinc-400">
                Setting up edge caching, SSRF defenses, authentication locks, and webhook retries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-2xl font-black text-[#863bff]">04</span>
              <h4 className="text-base font-bold text-white">Production Deployment</h4>
              <p className="text-xs text-zinc-400">
                Deploying to Vercel and container clusters with automated health logs and alerting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
