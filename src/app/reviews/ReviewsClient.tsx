"use client";

import { useState } from "react";
import { CustomerReview } from "@/lib/types";
import { Star, ShieldCheck, CheckCircle2, AlertCircle, Send } from "lucide-react";

interface ReviewsClientProps {
  initialReviews: CustomerReview[];
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    reviewerName: "",
    company: "",
    role: "",
    rating: 5,
    reviewText: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          success: true,
          message:
            "Thank you! Your review has been submitted for verification. It will appear publicly once authorized by the agency admin."
        });
        setFormData({
          reviewerName: "",
          company: "",
          role: "",
          rating: 5,
          reviewText: ""
        });
      } else {
        setStatus({
          success: false,
          message: data.error || "Submission failed. Please check your inputs."
        });
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || "Network error. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Top Banner / Verification Policy */}
      <div className="natural-card p-8 sm:p-10 mb-12 bg-[#ffffff] border-[#cbdccb]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3b563d] bg-[#e5ede5] px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authenticity Policy
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917]">
              Strictly Verified Client Testimonials
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] max-w-2xl leading-relaxed">
              We never fabricate customer reviews, mock names, or stock avatars. All reviews shown below originate from real clients and are reviewed for authorization before publication.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(!showSubmitModal)}
            className="btn-sage-primary text-xs py-2.5 px-5 shrink-0"
          >
            {showSubmitModal ? "Close Form" : "Submit Client Review"}
          </button>
        </div>
      </div>

      {/* Submission Form Modal / Drawer */}
      {showSubmitModal && (
        <div className="natural-card p-8 sm:p-10 mb-12 bg-[#ffffff] border-[#cbdccb]">
          <h3 className="text-lg font-bold text-[#1c1917] mb-2">
            Submit an Authorized Review
          </h3>
          <p className="text-xs text-[#78716c] mb-6">
            If you are a current or past Flash.ai Agency client, please submit your feedback below. Submissions undergo administrative verification before public display.
          </p>

          {status && (
            <div
              className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-2.5 ${
                status.success
                  ? "bg-[#e5ede5] text-[#293a2b] border border-[#cbdccb]"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {status.success ? (
                <CheckCircle2 className="w-4 h-4 text-[#5f8861] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={formData.reviewerName}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Northstar Logistics"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                  Job Role / Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operations Director"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                  Rating (1 to 5 Stars) *
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Great Experience</option>
                  <option value={3}>3 Stars - Met Expectations</option>
                  <option value={2}>2 Stars - Subpar</option>
                  <option value={1}>1 Star - Unsatisfactory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Review & Project Experience *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your experience working with Flash.ai Agency on your automation or web engineering project..."
                value={formData.reviewText}
                onChange={(e) =>
                  setFormData({ ...formData, reviewText: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-sage-primary text-xs py-2.5 px-6 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review for Verification"}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="natural-card p-12 text-center bg-[#ffffff] max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#e5ede5] text-[#3b563d] flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1c1917] mb-2">
            No Published Reviews Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-6">
            We do not manufacture fake reviews or pay for artificial testimonials. When authorized reviews are verified from completed client deliverables, they will be listed here.
          </p>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-sage-secondary text-xs py-2 px-4"
          >
            Submit First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="natural-card p-6 bg-[#ffffff]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#78716c]">
                  {new Date(rev.date).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-[#1c1917] italic mb-6 leading-relaxed">
                &ldquo;{rev.reviewText}&rdquo;
              </p>

              <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1c1917]">
                    {rev.reviewerName}
                  </h4>
                  <p className="text-[11px] text-[#78716c]">
                    {rev.role ? `${rev.role}, ` : ""}
                    {rev.company}
                  </p>
                </div>
                {rev.verifiedClient && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3b563d] bg-[#e5ede5] px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
