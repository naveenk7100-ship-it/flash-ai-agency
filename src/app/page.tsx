import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  Cpu,
  Share2,
  Target,
  Headphones,
  Calendar,
  BarChart3,
  Layout,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Users,
  ChevronRight,
  Sparkles,
  Phone,
  Layers,
  Zap,
  Globe2,
  Bot
} from "lucide-react";
import { AGENCY_SERVICES, AGENCY_FAQS } from "@/lib/data";
import { db } from "@/lib/db";
import { HeroScene3D } from "@/components/HeroScene3D";
import { ScrollStoryController } from "@/components/ScrollStoryController";
import { InteractiveProcessTimeline } from "@/components/InteractiveProcessTimeline";
import { FaqAccordion } from "@/components/FaqAccordion";
import { AGENCY_CONFIG } from "@/lib/config";

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

export default async function HomePage() {
  const projects = await db.getProjects();
  const reviews = await db.getReviews(true);
  const featuredProjects = projects.filter((p) => p.featured || p.status === "published").slice(0, 4);

  return (
    <div className="bg-[#fdfbf7] text-[#1c1917] w-full selection:bg-[#cbdccb] selection:text-[#293a2b] relative">
      {/* Scroll-Driven Top Progress Bar & Motion Coordinator */}
      <ScrollStoryController />

      {/* ========================================================= */}
      {/* 1. CINEMATIC 3D HERO SECTION                              */}
      {/* ========================================================= */}
      <section className="relative pt-6 pb-20 lg:pt-14 lg:pb-28 border-b border-[#e7e2d8] overflow-hidden">
        {/* Subtle Ambient Studio Glows */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[640px] h-[360px] bg-gradient-to-b from-[#e5ede5]/45 via-[#cbdccb]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Headline & CTAs (Col span 7 = ~58%) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Subtle Verified Status Pill */}
              <div className="reveal-item inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-[11px] sm:text-xs font-semibold shadow-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#5f8861] animate-ping shrink-0" />
                <span>AI Automation & Systems Studio</span>
                <span className="text-[#a7c3a8]">•</span>
                <span className="text-[#1c1917] font-mono text-[10px] sm:text-[11px]">Production Verified</span>
              </div>

              {/* Redesigned Headline */}
              <h1 className="reveal-item reveal-delay-1 text-[clamp(1.75rem,5.5vw,4.15rem)] font-extrabold text-[#1c1917] tracking-tight leading-[1.1] break-normal">
                We Turn AI Into Your Unfair Advantage.
              </h1>

              {/* Supporting Copy */}
              <p className="reveal-item reveal-delay-2 text-base sm:text-lg text-[#57534e] max-w-xl font-normal leading-relaxed">
                Custom AI agents, intelligent workflows, and high-performance digital experiences engineered to eliminate repetitive work and help ambitious businesses scale.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="reveal-item reveal-delay-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/booking"
                  className="btn-sage-primary text-sm py-3.5 px-8 flex items-center justify-center gap-2"
                >
                  Build Your AI Workflow
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/portfolio"
                  className="btn-sage-secondary text-sm py-3.5 px-8 flex items-center justify-center gap-2"
                >
                  Explore Our Work
                </Link>

                {AGENCY_CONFIG.hasPhone && (
                  <a
                    href={AGENCY_CONFIG.telLink}
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-3 text-[#3b563d] hover:text-[#1c1917] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{AGENCY_CONFIG.phone}</span>
                  </a>
                )}
              </div>

              {/* Trust Metric Strip */}
              <div className="reveal-item reveal-delay-4 pt-6 border-t border-[#e7e2d8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-xs">
                <div>
                  <span className="text-[#78716c] block text-[11px] font-medium">Architecture</span>
                  <span className="font-semibold text-[#1c1917] mt-0.5 block">Deterministic Guardrails</span>
                </div>
                <div>
                  <span className="text-[#78716c] block text-[11px] font-medium">Cost Control</span>
                  <span className="font-semibold text-[#1c1917] mt-0.5 block">Self-Hosted n8n & Open APIs</span>
                </div>
                <div>
                  <span className="text-[#78716c] block text-[11px] font-medium">Oversight</span>
                  <span className="font-semibold text-[#1c1917] mt-0.5 block">Human-in-the-Loop Reviews</span>
                </div>
                <div>
                  <span className="text-[#78716c] block text-[11px] font-medium">Integrity</span>
                  <span className="font-semibold text-[#1c1917] mt-0.5 block">Zero Fabricated Claims</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D FLASH.Ai Lightning Brand Sculpture (Col span 5 = ~42%) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <HeroScene3D />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SERVICES SECTION                                       */}
      {/* ========================================================= */}
      <section id="services" className="py-20 lg:py-28 border-b border-[#e7e2d8]">
        <div className="container-wide">
          <div className="reveal-item flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="sage-badge mb-3">Enterprise Engineering Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight">
                Eight production-grade automation specializations.
              </h2>
            </div>
            <p className="text-sm text-[#57534e] max-w-md">
              Every workflow is engineered around zero-loss data pipelines, deterministic failure recovery, and self-hosted open standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENCY_SERVICES.map((srv, idx) => {
              const Icon = ICON_MAP[srv.iconName] || Workflow;
              const delayClass = `reveal-delay-${(idx % 4) + 1}`;
              return (
                <div
                  key={srv.id}
                  className={`reveal-item ${delayClass} natural-card tilt-card p-6 flex flex-col justify-between group hover:border-[#cbdccb] hover:shadow-[0_12px_28px_rgba(59,86,61,0.08)]`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#e5ede5] text-[#3b563d] flex items-center justify-center mb-5 group-hover:bg-[#3b563d] group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#5f8861] uppercase tracking-wider block mb-1">
                      {srv.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#1c1917] mb-2">{srv.title}</h3>
                    <p className="text-xs text-[#57534e] leading-relaxed mb-6">{srv.shortDescription}</p>
                  </div>
                  <div>
                    <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#3b563d]">{srv.typicalTimeline}</span>
                      <Link
                        href={`/services/${srv.id}`}
                        className="text-[#57534e] hover:text-[#1c1917] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform"
                      >
                        Deep Dive <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CASE STUDIES & PORTFOLIO                               */}
      {/* ========================================================= */}
      <section id="portfolio" className="py-20 lg:py-28 border-b border-[#e7e2d8] bg-[#f7f4ee]">
        <div className="container-wide">
          <div className="reveal-item flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="sage-badge mb-3">Documented Client Deployments</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight">
                Real architectures. Measured operational impact.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="btn-sage-secondary text-xs self-start md:self-auto"
            >
              Browse All Case Studies
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((p, idx) => {
              const delayClass = `reveal-delay-${idx + 1}`;
              return (
                <div key={p.id} className={`reveal-item ${delayClass} natural-card tilt-card p-8 flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(59,86,61,0.1)]`}>
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="sage-badge text-[11px] py-1">
                        {p.category}
                      </span>
                      <span className="text-[11px] font-medium text-[#78716c] px-2.5 py-1 rounded bg-[#ffffff] border border-[#e7e2d8]">
                        {p.projectType}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1c1917] mb-2">{p.name}</h3>
                    <p className="text-xs font-semibold text-[#5f8861] mb-3">{p.tagline}</p>
                    <p className="text-sm text-[#57534e] leading-relaxed mb-6">{p.problem}</p>

                    <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e7e2d8] mb-6 shadow-inner">
                      <div className="text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-1">
                        Key Quantified Outcome
                      </div>
                      <div className="text-base font-extrabold text-[#3b563d]">{p.outcome}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-[#e5ede5] text-[#3b563d] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between">
                    <span className="text-xs text-[#78716c]">Verified Client Architecture</span>
                    <Link
                      href={`/portfolio/${p.id}`}
                      className="text-xs font-bold text-[#3b563d] hover:text-[#1c1917] flex items-center gap-1"
                    >
                      Read Technical Breakdown <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. VERIFIED CLIENT REVIEWS                                */}
      {/* ========================================================= */}
      <section id="reviews" className="py-20 lg:py-28 border-b border-[#e7e2d8]">
        <div className="container-wide">
          <div className="reveal-item flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="sage-badge mb-3">Authentic Client Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight">
                Trusted by operators across global regions.
              </h2>
            </div>
            <Link href="/reviews" className="btn-sage-secondary text-xs">
              View All Reviews & Submit Feedback
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r, idx) => {
              const delayClass = `reveal-delay-${idx + 1}`;
              return (
                <div key={r.id} className={`reveal-item ${delayClass} natural-card tilt-card p-6 flex flex-col justify-between hover:shadow-[0_12px_28px_rgba(59,86,61,0.08)]`}>
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-[#5f8861]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-[#57534e] italic leading-relaxed mb-6">
                      &ldquo;{r.reviewText}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#1c1917]">{r.reviewerName}</div>
                      <div className="text-xs text-[#78716c]">
                        {r.role ? `${r.role}, ` : ""}{r.company}
                      </div>
                    </div>
                    {r.verifiedClient && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3b563d] bg-[#e5ede5] px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. IMPLEMENTATION PROCESS (Interactive Scroll Timeline)    */}
      {/* ========================================================= */}
      <section id="process" className="py-20 lg:py-28 border-b border-[#e7e2d8] bg-[#f7f4ee]">
        <div className="container-wide">
          <div className="reveal-item max-w-2xl mb-12">
            <span className="sage-badge mb-3">Rigorous 4-Stage Methodology</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight mb-4">
              How we take your operations from audit to autonomous execution.
            </h2>
            <p className="text-sm text-[#57534e]">
              No black boxes or brittle scripts. We document every webhook, API contract, and guardrail before deployment.
            </p>
          </div>

          <div className="reveal-item reveal-delay-2">
            <InteractiveProcessTimeline />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FAQS (Interactive Accordion)                           */}
      {/* ========================================================= */}
      <section id="faq" className="py-20 lg:py-28 border-b border-[#e7e2d8]">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div className="reveal-item text-center mb-16">
              <span className="sage-badge mb-3">Clear Answers</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#57534e]">
                Direct answers regarding our engineering standards, timelines, and commitments.
              </p>
            </div>

            <div className="reveal-item reveal-delay-2">
              <FaqAccordion items={AGENCY_FAQS} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FINAL CALL TO ACTION                                   */}
      {/* ========================================================= */}
      <section className="py-20 lg:py-28 bg-[#f4f7f4] border-b border-[#cbdccb]">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <div className="reveal-item">
              <span className="sage-badge mb-4">Ready to Automate?</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1917] tracking-tight mb-6">
                Ready to turn AI into your unfair advantage?
              </h2>
              <p className="text-base text-[#57534e] mb-10 leading-relaxed">
                Schedule a confidential 30-minute discovery call. We will review your current software stack and outline an automation roadmap tailored to your specific budget and timeline.
              </p>
            </div>
            <div className="reveal-item reveal-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="btn-sage-primary text-base py-4 px-9 w-full sm:w-auto"
              >
                Build Your AI Workflow
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/contact"
                className="btn-sage-secondary text-base py-4 px-9 w-full sm:w-auto"
              >
                Send an RFP / Custom Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
