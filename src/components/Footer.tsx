import Link from "next/link";
import { Mail, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="border-t border-[#e7e2d8] bg-[#f7f4ee] text-[#57534e]">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="group flex items-center">
              <BrandLogo size="md" />
            </Link>
            <p className="text-sm text-[#57534e] leading-relaxed max-w-sm">
              We design and engineer bespoke AI workflow automations, custom AI agents, n8n infrastructure, and high-conversion web platforms for growing businesses.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-[#5f8861]" />
                Serving India, USA, UK, Canada & Australia
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-[#1c1917] tracking-wider uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/ai-workflow-automation" className="hover:text-[#1c1917] transition-colors">
                  AI Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="/services/custom-ai-agents" className="hover:text-[#1c1917] transition-colors">
                  Custom AI Agents
                </Link>
              </li>
              <li>
                <Link href="/services/n8n-workflow-development" className="hover:text-[#1c1917] transition-colors">
                  n8n Workflow Development
                </Link>
              </li>
              <li>
                <Link href="/services/lead-capture-and-followup" className="hover:text-[#1c1917] transition-colors">
                  Lead Capture Automation
                </Link>
              </li>
              <li>
                <Link href="/services/customer-support-automation" className="hover:text-[#1c1917] transition-colors">
                  Customer Support AI
                </Link>
              </li>
              <li>
                <Link href="/services/appointment-booking-systems" className="hover:text-[#1c1917] transition-colors">
                  Appointment Booking
                </Link>
              </li>
              <li>
                <Link href="/services/reporting-and-business-operations" className="hover:text-[#1c1917] transition-colors">
                  Reporting & Operations
                </Link>
              </li>
              <li>
                <Link href="/services/website-design-and-conversion" className="hover:text-[#1c1917] transition-colors">
                  Website Design & CRO
                </Link>
              </li>
            </ul>
          </div>

          {/* Case Studies & Reviews */}
          <div>
            <h4 className="text-xs font-semibold text-[#1c1917] tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portfolio" className="hover:text-[#1c1917] transition-colors">
                  Portfolio & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#1c1917] transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-[#1c1917] transition-colors">
                  How Our Process Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#1c1917] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#1c1917] transition-colors">
                  Direct Contact Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & WhatsApp Lines */}
          <div>
            <h4 className="text-xs font-semibold text-[#1c1917] tracking-wider uppercase mb-4">
              Direct Contact & WhatsApp
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5f8861] shrink-0" />
                <a href="mailto:hello@flashai.agency" className="hover:text-[#1c1917] transition-colors">
                  hello@flashai.agency
                </a>
              </li>
              <li className="text-[#78716c]">
                Remote First • Worldwide Operations
              </li>

              {/* Dedicated WhatsApp Line 1 */}
              <li className="p-2.5 rounded-xl bg-white border border-[#cbdccb]">
                <div className="text-[11px] font-bold text-[#1c1917] mb-1.5 flex items-center justify-between">
                  <span>Line 1: +91 93984 21460</span>
                  <span className="text-[9px] font-mono text-[#3b563d] bg-[#e5ede5] px-1 rounded">24/7</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://wa.me/919398421460"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-[#3b563d] text-white text-[11px] font-semibold hover:bg-[#293a2b] transition-colors"
                  >
                    WhatsApp <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="tel:+919398421460"
                    className="inline-flex items-center justify-center py-1.5 px-2.5 rounded-md bg-[#f7f4ee] border border-[#cbdccb] text-[#1c1917] text-[11px] font-semibold hover:bg-[#e5ede5] transition-colors"
                  >
                    Call
                  </a>
                </div>
              </li>

              {/* Dedicated WhatsApp Line 2 */}
              <li className="p-2.5 rounded-xl bg-white border border-[#cbdccb]">
                <div className="text-[11px] font-bold text-[#1c1917] mb-1.5 flex items-center justify-between">
                  <span>Line 2: +91 85238 46914</span>
                  <span className="text-[9px] font-mono text-[#3b563d] bg-[#e5ede5] px-1 rounded">24/7</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://wa.me/918523846914"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-[#3b563d] text-white text-[11px] font-semibold hover:bg-[#293a2b] transition-colors"
                  >
                    WhatsApp <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="tel:+918523846914"
                    className="inline-flex items-center justify-center py-1.5 px-2.5 rounded-md bg-[#f7f4ee] border border-[#cbdccb] text-[#1c1917] text-[11px] font-semibold hover:bg-[#e5ede5] transition-colors"
                  >
                    Call
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#e7e2d8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716c] gap-4">
          <p>© 2026 Flash.ai Agency. All rights reserved. Zero fabricated claims.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#1c1917] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#1c1917] transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="hover:text-[#1c1917] transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5f8861]" />
              Staff Login
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
