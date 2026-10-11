import Link from "next/link";
import { ShieldCheck, Cpu, Code2, ArrowRight, CheckCircle2, Award, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Us — Flash.ai Agency",
  description: "Learn about the engineering philosophy, background, and production standards of Flash.ai Agency."
};

export default function AboutPage() {
  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            Engineering Integrity
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Code Over Buzzwords. Reliability Over Hype.
          </h1>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
            Flash.ai Agency was built on the conviction that small and medium businesses deserve resilient, hardened automation architectures without unrealistic guarantees.
          </p>
        </div>

        {/* Narrative Card */}
        <div className="natural-card p-8 sm:p-12 mb-12 bg-[#ffffff] space-y-6">
          <h2 className="text-2xl font-bold text-[#1c1917]">
            Our Engineering Principles
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-[#57534e] leading-relaxed">
            <p>
              Many digital agencies sell AI as a magical solution, deploying fragile wrappers with zero validation that break the moment real business traffic arrives.
            </p>
            <p>
              At Flash.ai Agency, we treat AI automations like critical software infrastructure. When an invoice PDF is parsed, its fields are checked against strict TypeScript schemas. When an autonomous agent queries an internal database, its tools operate under least-privilege security. And when an exception occurs, a human reviewer is alerted via Slack or WhatsApp with full context.
            </p>
            <p>
              We partner with businesses across India, the United States, the United Kingdom, Canada, and Australia to streamline operations, reduce repetitive manual tasks, and build websites that deliver clear commercial value.
            </p>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="natural-card p-6 bg-[#ffffff]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b563d] block mb-2">
              01 • Deterministic Guardrails
            </span>
            <h3 className="text-base font-bold text-[#1c1917] mb-2">No Hallucinations</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              We constrain model outputs with JSON schema enforcement, regex validators, and automated retry policies.
            </p>
          </div>

          <div className="natural-card p-6 bg-[#ffffff]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b563d] block mb-2">
              02 • Data Sovereignty
            </span>
            <h3 className="text-base font-bold text-[#1c1917] mb-2">Self-Hosted Options</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              We leverage self-hosted n8n and dedicated PostgreSQL instances so your proprietary client data never leaks to third parties.
            </p>
          </div>

          <div className="natural-card p-6 bg-[#ffffff]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b563d] block mb-2">
              03 • Truthful Transparency
            </span>
            <h3 className="text-base font-bold text-[#1c1917] mb-2">Authentic Commitments</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              We never fabricate testimonials, invent vanity performance statistics, or pretend external integrations are configured when they are not.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="natural-card p-10 text-center bg-[#f7f4ee] border-[#cbdccb]">
          <h2 className="text-2xl font-bold text-[#1c1917] mb-3">
            Want to see how we work with your team?
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-lg mx-auto mb-6">
            Book a 30-minute discovery call to discuss your current manual operations and get an honest feasibility assessment.
          </p>
          <Link href="/booking" className="btn-sage-primary text-xs py-3 px-8">
            Schedule a Discovery Call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
