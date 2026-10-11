"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AGENCY_SERVICES } from "@/lib/data";
import {
  Calendar,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  ArrowRight
} from "lucide-react";

function BookingFormContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || AGENCY_SERVICES[0].id;
  const projectRef = searchParams.get("projectRef") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    serviceId: preselectedService,
    preferredDate: "",
    preferredTime: "14:00 - 16:00",
    timezone: "UTC",
    budgetRange: "$1,500 - $3,000",
    projectBrief: projectRef
      ? `Inquiring about an architecture similar to the "${projectRef}" case study. `
      : "",
    referenceLinks: ""
  });

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedService }));
    }
  }, [preselectedService]);

  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseStatus(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResponseStatus({
          success: true,
          message:
            "Your discovery call request has been saved to our database. Our engineering team will review your project brief and email you to confirm the calendar invitation.",
          details: data
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          website: "",
          serviceId: AGENCY_SERVICES[0].id,
          preferredDate: "",
          preferredTime: "14:00 - 16:00",
          timezone: "UTC",
          budgetRange: "$1,500 - $3,000",
          projectBrief: "",
          referenceLinks: ""
        });
      } else {
        setResponseStatus({
          success: false,
          message: data.error || "Failed to submit booking request. Please check inputs."
        });
      }
    } catch (err: any) {
      setResponseStatus({
        success: false,
        message: err.message || "Network error. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Notice Card */}
      <div className="p-4 rounded-xl bg-[#e5ede5] border border-[#cbdccb] text-xs text-[#293a2b] mb-8 leading-relaxed">
        <strong className="font-semibold block mb-0.5">Note on Scheduling:</strong>
        This form logs a booking request in our system. Because we do not claim a meeting is finalized until our team reviews your timezone availability, we will confirm the calendar appointment via email within 24 hours.
      </div>

      {/* Alert Messages */}
      {responseStatus && (
        <div
          className={`p-5 rounded-2xl mb-8 text-xs sm:text-sm flex items-start gap-3 ${
            responseStatus.success
              ? "bg-[#e5ede5] text-[#293a2b] border border-[#cbdccb]"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {responseStatus.success ? (
            <CheckCircle2 className="w-5 h-5 text-[#5f8861] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold">{responseStatus.message}</p>
            {responseStatus.details?.booking?.id && (
              <p className="font-mono text-[11px] text-[#57534e]">
                Tracking Request ID: {responseStatus.details.booking.id}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="natural-card p-8 sm:p-10 bg-[#ffffff]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Client Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Business Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="maya@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
            </div>
          </div>

          {/* Row 2: Company & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lin Agency Group"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Business Website (Optional)
              </label>
              <input
                type="url"
                placeholder="https://company.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
            </div>
          </div>

          {/* Row 3: Service Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
              Selected Service Focus *
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
            >
              {AGENCY_SERVICES.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.title} ({srv.startingInvestment})
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Date, Time & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Preferred Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Preferred Time Slot *
              </label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              >
                <option value="10:00 - 12:00">Morning (10:00 - 12:00)</option>
                <option value="14:00 - 16:00">Afternoon (14:00 - 16:00)</option>
                <option value="17:00 - 19:00">Evening (17:00 - 19:00)</option>
                <option value="Flexible">Flexible / Anytime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Time Zone *
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              >
                <option value="IST (India)">IST (UTC+5:30) - India</option>
                <option value="EST (US East)">EST (UTC-5:00) - New York / Toronto</option>
                <option value="PST (US West)">PST (UTC-8:00) - San Francisco</option>
                <option value="GMT/BST (UK)">GMT / BST - London</option>
                <option value="AEST (Australia)">AEST (UTC+10:00) - Sydney / Melbourne</option>
                <option value="UTC">UTC (Universal Time)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Estimated Budget */}
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
              Estimated Budget Range *
            </label>
            <select
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
            >
              <option value="$1,000 - $2,500">$1,000 - $2,500 (Targeted Automation or Single Workflow)</option>
              <option value="$2,500 - $5,000">$2,500 - $5,000 (Multi-step Agent / n8n Platform)</option>
              <option value="$5,000 - $10,000">$5,000 - $10,000 (Complete Agency Systems Overhaul)</option>
              <option value="$10,000+">$10,000+ (Enterprise Deep Tech / Continuous Engineering)</option>
            </select>
          </div>

          {/* Row 6: Project Brief */}
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
              Project Description & Requirements *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your current manual workflow, what systems need to integrate (e.g. HubSpot, Slack, n8n, WhatsApp), and what you want to achieve..."
              value={formData.projectBrief}
              onChange={(e) => setFormData({ ...formData, projectBrief: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
            />
          </div>

          {/* Row 7: Optional Reference Links */}
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
              Optional Reference Links / Documentation (Drive, Loom, GitHub)
            </label>
            <input
              type="text"
              placeholder="e.g. https://docs.google.com/document/d/... or Loom link"
              value={formData.referenceLinks}
              onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-sage-primary w-full py-3 text-xs tracking-wider uppercase font-bold disabled:opacity-50"
          >
            {loading ? "Saving Booking Request..." : "Submit Discovery Call Request"}
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            Client Booking System
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Schedule a Technical Discovery Call
          </h1>
          <p className="text-sm sm:text-base text-[#57534e] max-w-xl mx-auto leading-relaxed">
            Discuss your system requirements directly with our lead engineer. No sales pressure, no generic proposals.
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center text-xs text-[#78716c]">Loading booking intake...</div>}>
          <BookingFormContent />
        </Suspense>
      </div>
    </div>
  );
}
