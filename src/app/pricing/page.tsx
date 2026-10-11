import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Pricing & Custom Quotes — FLASH.Ai Agency",
  description: "Transparent engineering tiers and custom quote requests with zero hidden fees."
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Agent & Pipeline Starter",
      price: "$1,200",
      period: "one-time build",
      tagline: "Ideal for automating internal tasks or launching a targeted AI agent.",
      features: [
        "Single autonomous agent pipeline (OpenRouter, Gemini, OpenAI)",
        "Telegram or Discord interactive delivery integration",
        "Scheduled background crons & webhook triggers",
        "SSRF protection & input validation",
        "Deployment to Vercel or container platform with full docs"
      ],
      serviceId: "autonomous-ai-agents",
      popular: false
    },
    {
      name: "Cinematic Full-Stack Platform",
      price: "$2,800",
      period: "one-time build",
      tagline: "Production Next.js application with 3D WebGL hero, database, and CRM.",
      features: [
        "Complete Next.js App Router & React 19 architecture",
        "Custom Three.js 3D interactive hero scene",
        "Persistent serverless database (Postgres / Redis)",
        "Admin portal for lead and booking management",
        "Official WhatsApp & Email notification integration",
        "100/100 Lighthouse performance and SEO optimization"
      ],
      serviceId: "cinematic-web-platforms",
      popular: true
    },
    {
      name: "Deep Tech & Computer Vision",
      price: "Custom Scope",
      period: "milestone-based",
      tagline: "For teams requiring OpenCV, FFmpeg, PDE mathematical modeling, or custom ML microservices.",
      features: [
        "Specialized computer vision & inpainting pipelines",
        "FastAPI Python Docker container architecture",
        "Lossless video multiplexing & streaming",
        "High-concurrency cloud deployments (Render / AWS)",
        "Dedicated weekly engineering syncs & architecture audits"
      ],
      serviceId: "computer-vision-media",
      popular: false
    }
  ];

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#863bff]/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#863bff]/15 border border-[#863bff]/30 text-[#c084fc] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            Transparent Engagements
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Predictable Pricing. Zero Secret Fees.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Every engagement includes complete source code ownership, production deployment setup, and comprehensive documentation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl glass-panel p-8 flex flex-col justify-between transition-all ${
                tier.popular
                  ? "border-[#863bff] shadow-[0_0_35px_rgba(134,59,255,0.3)] relative -translate-y-2"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                  Most Requested Architecture
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-zinc-400 mb-6">{tier.tagline}</p>

                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-zinc-400 font-mono ml-2">/ {tier.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-[#863bff] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href={`/booking?service=${tier.serviceId}`}
                  className={`w-full py-3.5 rounded-xl text-center block text-xs font-bold uppercase tracking-wider transition-all ${
                    tier.popular
                      ? "bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white shadow-[0_0_20px_rgba(134,59,255,0.4)] hover:shadow-[0_0_30px_rgba(134,59,255,0.6)]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Choose Tier & Book
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Quote Request Banner */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 text-center max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Have a Specific Multi-Repository or ML Requirement?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
            Need a custom quote with NDA, dedicated microservices, or specific on-premises compliance? Fill out our brief form and receive an architectural estimate within 24 hours.
          </p>
          <div className="pt-2">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              Submit Custom Project Scope <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
