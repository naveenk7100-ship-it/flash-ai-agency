"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Search, Cpu, ShieldCheck, Activity, ArrowRight } from "lucide-react";

interface TimelineStep {
  step: string;
  title: string;
  desc: string;
  duration: string;
  icon: typeof Search;
  deliverables: string[];
}

const STEPS: TimelineStep[] = [
  {
    step: "01",
    title: "Process Discovery & Scope Audit",
    desc: "We audit your manual workflows, CRM schemas, and API endpoints to identify the highest-ROI bottlenecks with zero assumptions.",
    duration: "Week 1",
    icon: Search,
    deliverables: ["Process Bottleneck Map", "Data Input Schemas", "ROI & Token Forecast"]
  },
  {
    step: "02",
    title: "Architecture & PoC Validation",
    desc: "We build sandbox n8n flows, validate LLM structured JSON schemas, and test failover recovery on sanitized business records.",
    duration: "Week 1 – 2",
    icon: Cpu,
    deliverables: ["Live Staging Pipeline", "Strict JSON Guardrails", "Fallback Decision Trees"]
  },
  {
    step: "03",
    title: "Hardened Staged Deployment",
    desc: "Production deployment with rate-limiting, error alerts, audit logging, and human-in-the-loop sign-off controls.",
    duration: "Week 2 – 3",
    icon: ShieldCheck,
    deliverables: ["Webhook Dead-Letter Queues", "Slack/Email Exception Queues", "Zero-Data-Loss Handlers"]
  },
  {
    step: "04",
    title: "Handover, Runbooks & 30-Day SLA",
    desc: "30 days of active warranty, exhaustive documentation handover, and ongoing token cost & throughput optimization.",
    duration: "Week 3+",
    icon: Activity,
    deliverables: ["Operations Runbook", "Staff Video Walkthroughs", "30-Day Hypercare Warranty"]
  }
];

export function InteractiveProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("process");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress through this specific process section
      if (rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.2) {
        const progress = Math.min(
          Math.max((windowHeight * 0.75 - rect.top) / (rect.height * 0.85), 0),
          1
        );
        const index = Math.min(Math.floor(progress * STEPS.length), STEPS.length - 1);
        setActiveStep(index);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-10">
      {/* Dynamic Process Progress Bar with Animated Track */}
      <div className="relative w-full h-2 bg-[#e7e2d8] rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#5f8861] via-[#496d4b] to-[#3b563d] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(59,86,61,0.4)]"
          style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Process Cards Grid with Interactive Highlight and Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((st, idx) => {
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;
          const StepIcon = st.icon;

          return (
            <div
              key={st.step}
              onClick={() => setActiveStep(idx)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between ${
                isActive
                  ? "bg-[#ffffff] border-[#5f8861] shadow-[0_14px_36px_rgba(59,86,61,0.14)] scale-[1.02] ring-2 ring-[#5f8861]/30"
                  : isPassed
                  ? "bg-[#fdfbf7] border-[#cbdccb] shadow-sm hover:border-[#5f8861]"
                  : "bg-[#ffffff] border-[#e7e2d8] shadow-sm hover:border-[#cbdccb]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#3b563d] text-white"
                        : isPassed
                        ? "bg-[#e5ede5] text-[#3b563d]"
                        : "bg-[#f7f4ee] text-[#78716c]"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-[#e5ede5] text-[#3b563d]">
                    {st.duration}
                  </span>
                </div>

                <span
                  className={`text-xs font-mono font-bold tracking-wider uppercase block mb-1 ${
                    isActive ? "text-[#5f8861]" : "text-[#78716c]"
                  }`}
                >
                  Stage {st.step}
                </span>
                <h3 className="text-base font-bold text-[#1c1917] mb-2">{st.title}</h3>
                <p className="text-xs text-[#57534e] leading-relaxed mb-4">{st.desc}</p>

                {/* Deliverables List */}
                <div className="pt-3 border-t border-[#e7e2d8]/70 space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716c] block">
                    Verified Outputs:
                  </span>
                  {st.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5 text-[11px] text-[#57534e]">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-[#5f8861]" : "bg-[#cbdccb]"}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7e2d8] flex items-center justify-between text-[11px]">
                <span
                  className={`font-semibold ${
                    isActive ? "text-[#3b563d]" : isPassed ? "text-[#5f8861]" : "text-[#78716c]"
                  }`}
                >
                  {isActive ? "Active Stage" : isPassed ? "Completed" : "Next Up"}
                </span>
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#5f8861]" />
                ) : (
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? "text-[#3b563d] translate-x-1" : "text-[#78716c]"}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
