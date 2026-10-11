import { AGENCY_FAQS } from "@/lib/data";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions — FLASH.Ai Agency",
  description: "Answers to common questions regarding technical scope, WhatsApp integration, hosting, and guarantees."
};

export default function FAQPage() {
  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#863bff]/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#863bff]/15 border border-[#863bff]/30 text-[#c084fc] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#a855f7]" />
            Clarity & Transparency
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Everything you need to know about our engineering standards, deployment practices, and notification pipelines.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {AGENCY_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 glow-border space-y-3"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-start gap-3">
                <span className="text-[#863bff] font-mono text-sm">0{idx + 1}.</span>
                {faq.question}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed pl-7">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Additional Questions Banner */}
        <div className="p-8 rounded-3xl glass-panel text-center border border-white/10 space-y-3">
          <h3 className="text-xl font-bold text-white">Have a question not listed here?</h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Reach out directly to our engineering team. We usually respond in under 4 hours.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Open Direct Contact Form <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
