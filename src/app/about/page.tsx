import Link from "next/link";
import { ShieldCheck, Cpu, Code2, Award, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us — FLASH.Ai Agency",
  description: "Learn about the engineering philosophy, background, and production standards of FLASH.Ai Agency."
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/3 w-[600px] h-[450px] bg-[#863bff]/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#863bff]/15 border border-[#863bff]/30 text-[#c084fc] text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#a855f7]" />
            Engineering-First AI Studio
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Code Over Buzzwords. Production Over Prototypes.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            FLASH.Ai is an independent AI engineering agency founded on the principle that modern software should be fast, intelligent, and mathematically sound.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why We Rejected the Typical Agency Playbook
            </h2>
            <p>
              The market is saturated with agencies that slap an OpenAI API key onto a generic landing page, call it an &quot;enterprise revolution,&quot; and bill five figures. When real traffic arrives, those applications fail due to unhandled rate limits, non-existent error boundaries, and unoptimized cloud costs.
            </p>
            <p>
              We took a fundamentally different path. We started by building actual working products:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                <span>
                  <strong>CleanCut AI:</strong> Writing computer vision algorithms with Navier-Stokes partial differential equations and temporal optical flow for video watermark inpainting.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                <span>
                  <strong>TrendPost:</strong> Architecting real-time multi-source trend normalization engines that cluster live feeds from Google Trends, YouTube, and Reddit every morning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                <span>
                  <strong>FLASH.Ai Social:</strong> Implementing direct Meta Graph API token verification, human-in-the-loop approval queues, and multi-model social generation.
                </span>
              </li>
            </ul>
            <p>
              When clients hire FLASH.Ai, they don&apos;t get slide decks. They get verified, robust production systems.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 glow-border space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Terminal className="w-5 h-5 text-[#863bff]" />
              <span className="text-xs font-mono text-white">flash_ai_manifesto.md</span>
            </div>

            <div className="space-y-4 text-xs font-mono text-zinc-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-1">01. Truth in Metrics:</strong>
                Never fake testimonials, client counts, or system health. Real software earns credibility through source code.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-1">02. Free-Tier Optimization:</strong>
                Design architectures that minimize operational overhead. Serverless functions, edge caching, and zero wasted compute.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-1">03. SSRF & Security Defense:</strong>
                Treat every user input, scraped URL, and external API payload as hostile until sanitized.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-1">04. Transparent Fallbacks:</strong>
                If third-party credentials or tokens are unconfigured, notify the operator explicitly rather than faking success.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#863bff]/20 via-[#090714] to-[#863bff]/20 p-12 rounded-3xl border border-[#863bff]/30">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Want to Collaborate with Engineers Who Care?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mb-6">
            Schedule a technical consultation to talk architecture, database design, and timeline estimates.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#863bff] hover:bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(134,59,255,0.4)]"
          >
            Start Technical Discovery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
