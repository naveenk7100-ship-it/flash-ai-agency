"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Phone, MapPin, Globe } from "lucide-react";

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
          message: "Thank you! Your inquiry has been received. Our team will review and reply via email within 24 hours.",
          details: data
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

  // Location display rule: shown only if configured in environment
  const businessLocation = process.env.NEXT_PUBLIC_BUSINESS_LOCATION;

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            Direct Communication
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Contact Flash.ai Agency
          </h1>
          <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
            Have a question about an automation architecture, API integration, or bespoke engagement? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="natural-card p-6 sm:p-8 bg-[#ffffff]">
              <h2 className="text-lg font-bold text-[#1c1917] mb-6">
                Official Agency Channels
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#1c1917] block font-semibold">Official Email</strong>
                    <a
                      href="mailto:hello@flashai.agency"
                      className="text-[#3b563d] hover:underline"
                    >
                      hello@flashai.agency
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#1c1917] block font-semibold">Operating Footprint</strong>
                    <p className="text-[#57534e]">
                      Serving India, USA, UK, Canada & Australia
                    </p>
                  </div>
                </div>

                {/* Business Location: SHOWN ONLY IF CONFIGURED */}
                {businessLocation && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-[#1c1917] block font-semibold">Office Location</strong>
                      <p className="text-[#57534e]">{businessLocation}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-[#e7e2d8]">
                <h3 className="text-xs uppercase font-bold tracking-wider text-[#78716c] mb-3">
                  Social & Developer Links
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#f7f4ee] border border-[#e7e2d8] text-[#57534e] hover:text-[#1c1917]"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#f7f4ee] border border-[#e7e2d8] text-[#57534e] hover:text-[#1c1917]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#f7f4ee] border border-[#e7e2d8] text-[#57534e] hover:text-[#1c1917]"
                  >
                    X (Twitter)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            {status && (
              <div
                className={`p-5 rounded-2xl mb-6 text-xs sm:text-sm flex items-start gap-3 ${
                  status.success
                    ? "bg-[#e5ede5] text-[#293a2b] border border-[#cbdccb]"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {status.success ? (
                  <CheckCircle2 className="w-5 h-5 text-[#5f8861] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <p className="font-semibold">{status.message}</p>
              </div>
            )}

            <div className="natural-card p-8 sm:p-10 bg-[#ffffff]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Walker"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="liam@startup.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiring about n8n migration or custom AI agent"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can Flash.ai Agency assist your business operations?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-sage-primary w-full py-3 text-xs tracking-wider uppercase font-bold disabled:opacity-50"
                >
                  {loading ? "Sending Message..." : "Dispatch Message"}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
