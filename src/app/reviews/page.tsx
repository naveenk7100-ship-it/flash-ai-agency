import { db } from "@/lib/db";
import { ReviewsClient } from "./ReviewsClient";
import { ShieldCheck, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { WHATSAPP_CONTACTS } from "@/lib/config";

export const metadata = {
  title: "Client Reviews & Verification Policy — Flash.ai Agency",
  description:
    "Authentic client feedback, authorized verification procedures, and transparency policies for Flash.ai Agency."
};

export default async function ReviewsPage() {
  const reviews = await db.getReviews(true);

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Client Reviews & Transparency
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Authentic Customer Experiences
          </h1>
          <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
            Every testimonial on this page is authorized by a verified client stakeholder. We do not generate mock reviews or purchase third-party testimonials.
          </p>
        </div>

        <ReviewsClient initialReviews={reviews} />

        {/* Bottom Consultation Card */}
        <div className="mt-16 natural-card p-10 text-center bg-[#ffffff] border-[#cbdccb]">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] mb-2">
            Want to see how our engineering works for your business?
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-lg mx-auto mb-6 leading-relaxed">
            Schedule a scoping call or chat directly with our engineering team on WhatsApp to evaluate your automation requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/booking" className="btn-sage-primary text-xs py-2.5 px-6">
              Book Technical Discovery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-6 border-t border-[#cbdccb]/60 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-[#78716c] font-medium text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              Direct WhatsApp Support:
            </span>
            <a
              href={WHATSAPP_CONTACTS.line1.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#cbdccb] text-[#293a2b] hover:border-[#25D366] hover:bg-[#e5ede5] transition-colors font-mono text-[11px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              Line 1: {WHATSAPP_CONTACTS.line1.display}
            </a>
            <a
              href={WHATSAPP_CONTACTS.line2.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#cbdccb] text-[#293a2b] hover:border-[#25D366] hover:bg-[#e5ede5] transition-colors font-mono text-[11px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              Line 2: {WHATSAPP_CONTACTS.line2.display}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
