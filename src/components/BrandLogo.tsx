"use client";

import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ size = "md", showText = true, className = "" }: BrandLogoProps) {
  const dimensions = {
    sm: { w: 26, h: 25, box: "w-8 h-8 rounded-lg", text: "text-base", sub: "text-[9px]" },
    md: { w: 32, h: 31, box: "w-10 h-10 rounded-xl", text: "text-lg", sub: "text-[10px]" },
    lg: { w: 42, h: 40, box: "w-12 h-12 rounded-xl", text: "text-2xl", sub: "text-xs" }
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${dimensions.box} bg-[#e5ede5] border border-[#cbdccb] p-1.5 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}
      >
        <Image
          src="/logo.svg"
          alt="FLASH.Ai Logo"
          width={dimensions.w}
          height={dimensions.h}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${dimensions.text} font-bold tracking-tight text-[#1c1917] leading-tight flex items-center gap-1.5`}>
            FLASH<span className="text-[#3b563d]">.Ai</span>
            <span className="text-xs font-normal text-[#57534e] tracking-normal">Agency</span>
          </span>
          <span className={`${dimensions.sub} uppercase tracking-wider text-[#78716c] font-medium hidden sm:block`}>
            AI Automation & Systems Studio
          </span>
        </div>
      )}
    </div>
  );
}
