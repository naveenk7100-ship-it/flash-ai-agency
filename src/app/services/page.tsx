import Link from "next/link";
import { AGENCY_SERVICES } from "@/lib/data";
import {
  Workflow,
  Cpu,
  Share2,
  Target,
  Headphones,
  Calendar,
  BarChart3,
  Layout,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Workflow,
  Cpu,
  Share2,
  Target,
  Headphones,
  Calendar,
  BarChart3,
  Layout
};

export const metadata = {
  title: "Services — Flash.ai Agency",
  description:
    "Explore individual AI workflow, custom AI agent, n8n development, lead capture, and appointment booking engineering services."
};

export default function ServicesIndexPage() {
  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            Engineering Offerings
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Comprehensive Automation & AI Services
          </h1>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
            Every service is tailored to solve specific operational bottlenecks. We do not invent performance statistics or make unrealistic outcome guarantees.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {AGENCY_SERVICES.map((srv) => {
            const Icon = ICON_MAP[srv.iconName] || Workflow;
            return (
              <div
                key={srv.id}
                className="natural-card p-8 sm:p-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#e5ede5] flex items-center justify-center text-[#3b563d]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="sage-badge text-[11px]">{srv.badge}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-[#1c1917] mb-3">{srv.title}</h2>
                  <p className="text-sm text-[#57534e] leading-relaxed mb-6">
                    {srv.shortDescription}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                        Business Challenge Addressed:
                      </h3>
                      <p className="text-xs text-[#57534e] leading-relaxed line-clamp-2">
                        {srv.problem}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] mb-2">
                        Key Capabilities:
                      </h3>
                      <ul className="space-y-1.5">
                        {srv.keyFeatures.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#1c1917]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5f8861] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e7e2d8] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#78716c] block">Estimated Scope</span>
                    <span className="text-xs font-bold text-[#1c1917]">{srv.startingInvestment}</span>
                  </div>
                  <Link
                    href={`/services/${srv.id}`}
                    className="btn-sage-primary text-xs py-2 px-4"
                  >
                    View Full Service Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="natural-card p-8 text-center max-w-3xl mx-auto bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-2">Need a custom combination of services?</h2>
          <p className="text-xs sm:text-sm text-[#57534e] mb-6">
            Many client projects combine custom AI agents with n8n orchestrations and automated lead capture. We can scope an end-to-end architecture tailored to your stack.
          </p>
          <Link href="/booking" className="btn-sage-primary text-xs py-2.5 px-6">
            Discuss Custom Requirements
          </Link>
        </div>
      </div>
    </div>
  );
}
