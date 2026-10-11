"use client";

import { useEffect, useState } from "react";

export function ScrollStoryController() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Scroll-driven Progress Indicator & Intersection Observer for .reveal-item
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        setScrollProgress(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. Add js-reveal class for progressive enhancement
    document.documentElement.classList.add("js-reveal");

    // 3. Intersection Observer to smoothly trigger scroll entrance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-entering");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const elements = document.querySelectorAll(".reveal-item");
    elements.forEach((el) => {
      observer.observe(el);

      // Elements already above or within the viewport immediately trigger smooth entrance
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        // Small micro-delay so CSS transition triggers visibly from initial state
        requestAnimationFrame(() => {
          el.classList.add("is-entering");
        });
      }
    });

    // 4. Safety fallback: Ensure any lingering elements are always revealed after 2.5s
    const fallbackTimeout = setTimeout(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.5) {
          el.classList.add("is-entering");
        }
      });
    }, 2500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallbackTimeout);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Top Subtle Scroll Progress Bar in Pure Sage */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#5f8861] via-[#496d4b] to-[#3b563d] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </>
  );
}
