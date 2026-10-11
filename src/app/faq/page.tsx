import Link from "next/link";
import { AGENCY_FAQS } from "@/lib/data";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions — Flash.ai Agency",
  description: "Transparent answers about our AI automation deliverables, security, pricing, and project workflows."
};

export default function FAQPage() {
  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#57534e]">
            Honest answers regarding how we engineer, deploy, and maintain custom automation systems.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {AGENCY_FAQS.map((faq, idx) => (
            <div key={idx} className="natural-card p-6 sm:p-8 bg-[#ffffff]">
              <h2 className="text-base font-bold text-[#1c1917] mb-2 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                  Q
                </span>
                <span>{faq.question}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed pl-9">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="natural-card p-10 text-center bg-[#f7f4ee] border-[#cbdccb]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-2">Have a question not listed here?</h2>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-md mx-auto mb-6">
            Our lead engineer answers all inbound inquiries directly without sales intermediaries.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="btn-sage-primary text-xs py-2.5 px-6">
              Send Us a Question
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
