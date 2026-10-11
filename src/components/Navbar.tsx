"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

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
          ? "bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e7e2d8] shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#e5ede5] border border-[#cbdccb] flex items-center justify-center text-[#3b563d] group-hover:bg-[#cbdccb] transition-colors">
            <span className="font-bold text-base tracking-tighter font-mono">F.ai</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#1c1917] flex items-center gap-1.5">
              Flash.ai <span className="text-xs font-normal text-[#57534e] tracking-normal">Agency</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#78716c] font-medium">
              AI Automation & Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-[#57534e] hover:text-[#1c1917] transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs font-medium px-3 py-2 rounded-lg text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee] transition-all flex items-center gap-1.5"
            title="Secure Client & Operations Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5f8861]" />
            Admin
          </Link>
          <Link
            href="/booking"
            className="btn-sage-primary text-xs py-2 px-4 rounded-lg shadow-sm"
          >
            Book a Discovery Call
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[#e7e2d8] bg-[#fdfbf7]/98 px-6 py-6 shadow-md backdrop-blur-lg">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#1c1917] py-2 border-b border-[#f7f4ee]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="btn-sage-primary w-full text-center py-2.5"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-xs text-[#57534e] hover:text-[#1c1917]"
              >
                Admin Management Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
