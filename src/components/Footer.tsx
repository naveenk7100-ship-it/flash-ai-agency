"use client";

import Link from "next/link";
import { Zap, ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040307] text-zinc-400 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#863bff]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#863bff] to-[#c084fc] p-[1.5px] shadow-[0_0_20px_rgba(134,59,255,0.4)]">
                <div className="w-full h-full bg-[#090714] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#a855f7] fill-[#863bff]" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FLASH<span className="text-[#a855f7]">.Ai</span> Agency
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Architecting production AI agents, autonomous content engines, computer vision inpainting pipelines, and cinematic web platforms with zero hallucinated fluff.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Engineering Systems Live & Active
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Agency Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Verified Case Studies
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Engineering Team
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Quotes
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Agency FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Case Studies */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Verified Systems
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/portfolio#flash-ai-social" className="hover:text-white transition-colors">
                  FLASH.Ai Social
                </Link>
              </li>
              <li>
                <Link href="/portfolio#trendpost" className="hover:text-white transition-colors">
                  TrendPost SaaS
                </Link>
              </li>
              <li>
                <Link href="/portfolio#cleancut-ai" className="hover:text-white transition-colors">
                  CleanCut AI (PDE)
                </Link>
              </li>
              <li>
                <Link href="/portfolio#globallead-ai" className="hover:text-white transition-colors">
                  GlobalLead AI
                </Link>
              </li>
              <li>
                <Link href="/portfolio#exampilot" className="hover:text-white transition-colors">
                  ExamPilot Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Inquiries */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#a855f7]" />
                <a href="mailto:hello@flashai.agency" className="hover:text-white transition-colors">
                  hello@flashai.agency
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a855f7]" />
                <span>Global Remote / Cloud Edge</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#863bff]/20 text-[#c084fc] hover:bg-[#863bff]/30 border border-[#863bff]/40 transition-all"
                >
                  Book Discovery Call
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 FLASH.Ai Agency. All rights reserved. Zero fabricated metrics.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">
              Support
            </Link>
            <Link href="/admin" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-zinc-400" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
