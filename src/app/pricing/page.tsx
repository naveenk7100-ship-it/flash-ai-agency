import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Investment & Scoping — Flash.ai Agency",
  description: "Transparent pricing guidelines and scope ranges for AI automation, custom agents, and web applications."
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Focused Automation",
      investment: "Starting at $1,200",
      description: "Ideal for businesses wanting to automate a single high-friction workflow.",
      deliverables: [
        "Single n8n or Python automation pipeline",
        "Document parsing or webhook data synchronization",
        "Deterministic JSON schema validation",
        "Slack, WhatsApp, or Email alert dispatches",
        "2 weeks of post-launch monitoring"
      ],
      suitable: "SMBs looking to replace 10+ hours/week of repetitive manual tasks.",
      serviceId: "ai-workflow-automation"
    },
    {
      name: "Autonomous Agent Suite",
      investment: "Starting at $2,200",
      description: "Purpose-built multi-step agent with structured memory and CRM tool execution.",
      deliverables: [
        "Custom autonomous agent with strict operating boundaries",
        "Knowledge base retrieval over internal SOPs or documentation",
        "Tool-calling integration into internal databases and APIs",
        "Human-in-the-loop fallback escalation queues",
        "Full staff training session and operational runbooks"
      ],
      popular: true,
      suitable: "Agencies, SaaS founders, or real-estate brokerages needing contextual triage.",
      serviceId: "custom-ai-agents"
    },
    {
      name: "Complete Systems Architecture",
      investment: "Starting at $4,500",
      description: "End-to-end operational overhaul: custom web platform, lead capture, and full automation.",
      deliverables: [
        "Full-stack Next.js web application with sub-second page loads",
        "Automated multi-channel lead enrichment and CRM sync",
        "Self-hosted Dockerized n8n instance deployment",
        "Custom client booking intake with timezone intelligence",
        "Priority architectural support & monthly maintenance retainer"
      ],
      suitable: "High-growth agencies scaling operations across international markets.",
      serviceId: "website-design-and-conversion"
    }
  ];

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            Transparent Investment Guidelines
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Predictable Scoping. Zero Hidden Fees.
          </h1>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
            We operate on fixed-fee milestones agreed upon upfront. We do not charge ambiguous hourly retainers without defined deliverables.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`natural-card p-8 flex flex-col justify-between ${
                tier.popular
                  ? "bg-[#ffffff] border-[#5f8861] ring-1 ring-[#5f8861]/20 shadow-md"
                  : "bg-[#ffffff]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1c1917]">{tier.name}</h2>
                  {tier.popular && (
                    <span className="sage-badge text-[10px] py-0.5">Most Requested</span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1917]">
                    {tier.investment}
                  </span>
                  <span className="text-xs text-[#78716c] block mt-1">One-time milestone scope</span>
                </div>

                <p className="text-xs text-[#57534e] leading-relaxed mb-6">
                  {tier.description}
                </p>

                <div className="space-y-3 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716c] block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#1c1917]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5f8861] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-[#f7f4ee] border border-[#e7e2d8] text-xs text-[#57534e] mb-6">
                  <strong className="block text-[#1c1917] font-semibold mb-0.5">Best Suited For:</strong>
                  {tier.suitable}
                </div>
              </div>

              <div className="pt-4 border-t border-[#e7e2d8]">
                <Link
                  href={`/booking?service=${tier.serviceId}`}
                  className={`w-full py-2.5 text-xs text-center ${
                    tier.popular ? "btn-sage-primary" : "btn-sage-secondary"
                  }`}
                >
                  Schedule Scoping Call
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Retainer & Custom Inquiries */}
        <div className="natural-card p-8 sm:p-10 bg-[#ffffff] max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#1c1917]">
              Need Continuous Engineering or Maintenance Retainers?
            </h3>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
              We offer dedicated monthly engineering retainers starting at $950/month for active monitoring, workflow iterations, and prompt optimization.
            </p>
          </div>
          <Link href="/contact" className="btn-sage-secondary text-xs py-2.5 px-6 shrink-0">
            Inquire About Retainers
          </Link>
        </div>
      </div>
    </div>
  );
}
