"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";

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
    { label: "About", href: "/about" },
    { label: "Pricing & Quote", href: "/pricing" },
    { label: "Book Discovery", href: "/booking" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#020106]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-white/5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#863bff] via-[#a855f7] to-[#38bdf8] p-[1.5px] shadow-[0_0_25px_rgba(134,59,255,0.45)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070510] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#c084fc] fill-[#863bff] animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              FLASH<span className="text-[#a855f7]">.Ai</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-semibold">
              Engineering Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-wider font-semibold text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#863bff] after:to-[#38bdf8] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-[#863bff]/40 transition-all flex items-center gap-1.5 glass-panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#a855f7]" />
            Admin
          </Link>
          <Link
            href="/booking"
            className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs uppercase tracking-wider"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#863bff] via-[#d8b4fe] to-[#38bdf8] rounded-xl transition-all group-hover:opacity-100" />
            <span className="relative block px-5 py-2.5 rounded-xl bg-[#070510] text-white transition-colors group-hover:bg-opacity-80 flex items-center gap-1.5">
              Request Project
              <ArrowUpRight className="w-4 h-4 text-[#c084fc] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#04020a]/98 px-6 py-6 backdrop-blur-2xl transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-200 hover:text-[#a855f7] py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(134,59,255,0.4)]"
              >
                Request a Project
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
