import { db } from "@/lib/db";
import { ReviewsClient } from "./ReviewsClient";
import { ShieldCheck } from "lucide-react";

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
      </div>
    </div>
  );
}
