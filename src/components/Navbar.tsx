"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, Phone, ChevronDown, ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { WHATSAPP_CONTACTS } from "@/lib/config";

// Elegant WhatsApp SVG Icon
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [waDropdownOpen, setWaDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Reviews", href: "/reviews" },
    { label: "How It Works", href: "/#process" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#fdfbf7]/92 backdrop-blur-md border-b border-[#e7e2d8] shadow-sm py-3"
          : "bg-transparent border-b border-transparent py-4 sm:py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Real Brand Logo */}
        <Link href="/" className="group flex items-center">
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-[#57534e] hover:text-[#1c1917] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[2px] after:bg-[#3b563d] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions & WhatsApp Channels */}
        <div className="hidden lg:flex items-center gap-3">
          {/* WhatsApp Dropdown Pill with Both Numbers */}
          <div className="relative">
            <button
              onClick={() => setWaDropdownOpen(!waDropdownOpen)}
              onMouseEnter={() => setWaDropdownOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#293a2b] bg-[#e5ede5] hover:bg-[#cbdccb] border border-[#cbdccb] transition-all cursor-pointer shadow-xs"
              title="Direct WhatsApp Engineering Lines"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#3b563d]" />
              <span>WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-[#5f8861] animate-pulse" />
              <ChevronDown className="w-3 h-3 text-[#57534e]" />
            </button>

            {/* Dropdown Menu */}
            {waDropdownOpen && (
              <div
                onMouseLeave={() => setWaDropdownOpen(false)}
                className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-xl shadow-xl border border-[#cbdccb] z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="text-[10px] font-mono uppercase font-bold text-[#78716c] px-2 py-1 mb-1 border-b border-[#e7e2d8]">
                  Direct WhatsApp Engineering Lines
                </div>
                <div className="space-y-2 pt-1">
                  {WHATSAPP_CONTACTS.map((c, i) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg bg-[#fdfbf7] hover:bg-[#e5ede5] border border-[#e7e2d8] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[#1c1917]">
                          Line {i + 1}: {c.displayNumber}
                        </span>
                        <span className="text-[9px] font-mono text-[#3b563d] bg-white px-1.5 py-0.5 rounded border border-[#cbdccb]">
                          ONLINE
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={c.waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-[#3b563d] text-white text-[11px] font-semibold hover:bg-[#293a2b] transition-colors"
                        >
                          <WhatsAppIcon className="w-3 h-3" /> Chat
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                        <a
                          href={c.telUrl}
                          className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md bg-white border border-[#cbdccb] text-[#57534e] hover:text-[#1c1917] text-[11px] font-semibold transition-colors"
                          title={`Call ${c.displayNumber}`}
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/admin"
            className="text-xs font-medium px-2.5 py-2 rounded-lg text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee] transition-all flex items-center gap-1.5"
            title="Secure Staff Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5f8861]" />
            Staff
          </Link>

          <Link
            href="/booking"
            className="btn-sage-primary text-xs py-2.5 px-5 rounded-lg shadow-sm"
          >
            Book Discovery Call
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee] border border-[#e7e2d8] transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-[#e7e2d8] bg-[#fdfbf7]/98 px-6 py-6 shadow-xl backdrop-blur-md max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-[#1c1917] py-2 border-b border-[#e7e2d8]/60"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Dedicated WhatsApp Section */}
            <div className="pt-3 pb-2 border-b border-[#e7e2d8]/60">
              <span className="text-[11px] font-mono font-bold uppercase text-[#5f8861] block mb-2.5">
                Direct WhatsApp Lines
              </span>
              <div className="space-y-2">
                {WHATSAPP_CONTACTS.map((c, i) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-white border border-[#cbdccb]">
                    <div className="text-xs font-bold text-[#1c1917] mb-2 flex items-center justify-between">
                      <span>Line {i + 1}: {c.displayNumber}</span>
                      <span className="text-[10px] font-mono text-[#3b563d] bg-[#e5ede5] px-1.5 py-0.5 rounded">ONLINE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={c.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#3b563d] text-white text-xs font-semibold"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <a
                        href={c.telUrl}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#f7f4ee] border border-[#cbdccb] text-[#1c1917] text-xs font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="btn-sage-primary w-full text-center py-3"
              >
                Book Discovery Call
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-xs text-[#57534e] hover:text-[#1c1917]"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
