"use client";

import { useState } from "react";
import { AGENCY_SERVICES } from "@/lib/data";
import { CheckCircle2, Calendar, Clock, Send, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceId: AGENCY_SERVICES[0].id,
    preferredDate: "",
    preferredTime: "14:00 - 16:00 UTC",
    budgetRange: "$1,500 - $3,000",
    projectBrief: ""
  });

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
          message: "Discovery call request logged successfully!",
          details: data
        });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          serviceId: AGENCY_SERVICES[0].id,
          preferredDate: "",
          preferredTime: "14:00 - 16:00 UTC",
          budgetRange: "$1,500 - $3,000",
          projectBrief: ""
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
    <div className="py-16 md:py-24 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#863bff]/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#863bff]/15 border border-[#863bff]/30 text-[#c084fc] text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#a855f7]" />
            Direct Engineering Discovery
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Schedule a Technical Discovery Call
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Discuss your system requirements directly with our lead architect. No sales intermediaries, no vague proposals.
          </p>
        </div>

        {/* Feedback Alert */}
        {responseStatus && (
          <div
            className={`mb-8 p-6 rounded-2xl border ${
              responseStatus.success
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/40 border-red-500/40 text-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {responseStatus.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="font-bold">{responseStatus.message}</p>
                {responseStatus.details?.notifications && (
                  <div className="mt-2 space-y-1 font-mono text-xs opacity-90 border-t border-white/10 pt-2">
                    <p>
                      <strong>WhatsApp Status:</strong>{" "}
                      {responseStatus.details.notifications.whatsapp.sent
                        ? "✅ Delivered to Admin"
                        : `ℹ️ ${responseStatus.details.notifications.whatsapp.reason}`}
                    </p>
                    <p>
                      <strong>Email Status:</strong>{" "}
                      {responseStatus.details.notifications.email.sent
                        ? "✅ Sent via Resend"
                        : `ℹ️ ${responseStatus.details.notifications.email.reason}`}
                    </p>
                    <p>
                      <strong>Storage:</strong>{" "}
                      {responseStatus.details.storage?.type} (Stored)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="rounded-3xl glass-panel p-8 sm:p-12 glow-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="elena@company.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Health Systems"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Target Service Architecture *
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                >
                  {AGENCY_SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0e0c18] text-white">
                      {s.title} ({s.priceEstimate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Estimated Budget Range
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                >
                  <option value="$1,200 - $2,500" className="bg-[#0e0c18] text-white">
                    $1,200 - $2,500 (Agent Pipeline)
                  </option>
                  <option value="$2,500 - $5,000" className="bg-[#0e0c18] text-white">
                    $2,500 - $5,000 (Full Web App)
                  </option>
                  <option value="$5,000 - $10,000+" className="bg-[#0e0c18] text-white">
                    $5,000 - $10,000+ (Deep Tech / CV Engine)
                  </option>
                  <option value="Flexible / To be scoped" className="bg-[#0e0c18] text-white">
                    Flexible / To be scoped
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Preferred Time Window
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14:00 - 16:00 UTC or Morning IST"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Project Brief & Technical Requirements *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain the problem you want to automate, models you want to use, or platforms to integrate (e.g. Telegram, Meta, PostgreSQL, Docker)..."
                value={formData.projectBrief}
                onChange={(e) => setFormData({ ...formData, projectBrief: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#863bff] via-[#9333ea] to-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(134,59,255,0.45)] hover:shadow-[0_0_35px_rgba(134,59,255,0.65)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Recording System Booking..." : "Submit Discovery Request"}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
