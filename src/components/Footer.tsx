import Link from "next/link";
import { Mail, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e7e2d8] bg-[#f7f4ee] text-[#57534e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e5ede5] border border-[#cbdccb] flex items-center justify-center text-[#3b563d] font-bold font-mono text-sm">
                F.ai
              </div>
              <span className="text-lg font-bold tracking-tight text-[#1c1917]">
                Flash.ai Agency
              </span>
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

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[#1c1917] tracking-wider uppercase mb-4">
              Contact & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5f8861]" />
                <a href="mailto:hello@flashai.agency" className="hover:text-[#1c1917] transition-colors">
                  hello@flashai.agency
                </a>
              </li>
              <li className="text-[#78716c]">
                Remote First • Worldwide Operations
              </li>
              <li className="pt-2">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[#e5ede5] text-[#3b563d] hover:bg-[#cbdccb] border border-[#cbdccb] transition-all"
                >
                  Book Discovery Call
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
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
      </div>
    </footer>
  );
}
