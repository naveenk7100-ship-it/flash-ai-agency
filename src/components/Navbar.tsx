"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { AGENCY_CONFIG } from "@/lib/config";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          ? "bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e7e2d8] shadow-sm py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Real Brand Logo */}
        <Link href="/" className="group flex items-center">
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
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

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3.5">
          {AGENCY_CONFIG.hasPhone && (
            <a
              href={AGENCY_CONFIG.telLink}
              className="text-xs font-semibold px-3 py-2 rounded-lg text-[#3b563d] bg-[#e5ede5] hover:bg-[#cbdccb] border border-[#cbdccb] transition-all flex items-center gap-1.5"
              title="Call Flash.ai Agency"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{AGENCY_CONFIG.phone}</span>
            </a>
          )}

          <Link
            href="/admin"
            className="text-xs font-medium px-3 py-2 rounded-lg text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee] border border-transparent hover:border-[#e7e2d8] transition-all flex items-center gap-1.5"
            title="Secure Client & Operations Portal"
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
        <div className="lg:hidden border-b border-[#e7e2d8] bg-[#fdfbf7]/98 px-6 py-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-[#1c1917] py-2.5 border-b border-[#e7e2d8]/60"
              >
                {link.label}
              </Link>
            ))}

            {AGENCY_CONFIG.hasPhone && (
              <a
                href={AGENCY_CONFIG.telLink}
                className="flex items-center gap-2 text-xs font-semibold py-2 text-[#3b563d]"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us: {AGENCY_CONFIG.phone}</span>
              </a>
            )}

            <div className="pt-3 flex flex-col gap-2.5">
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="btn-sage-primary w-full text-center py-3"
              >
                Book a Discovery Call
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
