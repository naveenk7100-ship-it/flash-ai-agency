"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`natural-card transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-[#ffffff] border-[#cbdccb] shadow-[0_8px_24px_rgba(59,86,61,0.08)]"
                : "bg-[#ffffff] border-[#e7e2d8] hover:border-[#cbdccb]"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f8861] rounded-2xl"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
            >
              <div className="flex items-start gap-3.5 pr-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isOpen
                      ? "bg-[#3b563d] text-white"
                      : "bg-[#e5ede5] text-[#3b563d]"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1c1917] pt-0.5">
                  {faq.question}
                </h3>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  isOpen
                    ? "bg-[#e5ede5] border-[#cbdccb] text-[#3b563d] rotate-180"
                    : "bg-[#f7f4ee] border-[#e7e2d8] text-[#78716c]"
                }`}
              >
                <ChevronDown className="w-4 h-4 transition-transform" />
              </div>
            </button>

            {isOpen && (
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#57534e] leading-relaxed border-t border-[#e7e2d8]/60 mt-1 pl-[3.75rem]"
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
