"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Phone, MapPin, Zap } from "lucide-react";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          success: true,
          message: "Thank you! Your message has been logged in our system.",
          details: data
        });
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 }
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({
          success: false,
          message: data.error || "Failed to submit message."
        });
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || "Network exception. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-10 right-1/3 w-[500px] h-[400px] bg-[#863bff]/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#863bff]/15 border border-[#863bff]/30 text-[#c084fc] text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-[#a855f7]" />
            Direct Communication Channel
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact FLASH.Ai Engineering
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Questions regarding architectures, API integrations, licensing, or custom contracts? Drop a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel rounded-3xl p-8 glow-border space-y-6">
              <h2 className="text-xl font-bold text-white">Direct Contacts</h2>
              <div className="space-y-4 text-sm text-zinc-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#863bff] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-zinc-400">Engineering Inquiries</span>
                    <a href="mailto:hello@flashai.agency" className="text-white hover:text-[#c084fc] font-mono">
                      hello@flashai.agency
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#863bff] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-zinc-400">Response SLA</span>
                    <span className="text-white">Under 4 hours (Weekdays)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#863bff] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-zinc-400">Headquarters</span>
                    <span className="text-white">Distributed Cloud Architecture / Global Remote</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 text-xs text-zinc-400">
              <h3 className="font-bold text-white text-sm">Security & Privacy First</h3>
              <p>
                We do not sell client data, share project briefs, or run telemetry on unconsenting users. All inquiries are securely stored with restricted access.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            {status && (
              <div
                className={`mb-6 p-6 rounded-2xl border ${
                  status.success
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                    : "bg-red-950/40 border-red-500/40 text-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {status.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-bold">{status.message}</p>
                    {status.details?.notifications && (
                      <div className="mt-2 space-y-1 font-mono text-xs opacity-90 border-t border-white/10 pt-2">
                        <p>
                          <strong>WhatsApp:</strong>{" "}
                          {status.details.notifications.whatsapp?.sent
                            ? "✅ Alert Sent"
                            : `ℹ️ ${status.details.notifications.whatsapp?.reason}`}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {status.details.notifications.email?.sent
                            ? "✅ Sent via Resend"
                            : `ℹ️ ${status.details.notifications.email?.reason}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="glass-panel rounded-3xl p-8 sm:p-10 glow-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Walker"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="liam@startup.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiring about TrendPost or CleanCut architecture"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can FLASH.Ai help your organization?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#863bff] via-[#9333ea] to-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(134,59,255,0.45)] hover:shadow-[0_0_35px_rgba(134,59,255,0.65)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Transmitting Message..." : "Dispatch Message"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
