import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Cpu,
  Share2,
  Target,
  Headphones,
  Calendar,
  BarChart3,
  Layout,
  ExternalLink,
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { AGENCY_SERVICES, AGENCY_FAQS } from "@/lib/data";
import { db } from "@/lib/db";

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
    <div className="bg-[#fdfbf7]">
      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#e7e2d8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-[#5f8861]" />
            AI Automation & Systems Engineering Agency
          </div>

          {/* Agency Message */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1c1917] tracking-tight leading-[1.15] mb-6">
            Bespoke AI automations and workflows that save hours and eliminate busywork.
          </h1>

          <p className="text-lg sm:text-xl text-[#57534e] max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Flash.ai Agency designs custom AI workflows, autonomous agents, self-hosted n8n pipelines, and high-conversion web platforms for growing businesses and modern agencies.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/booking"
              className="btn-sage-primary w-full sm:w-auto px-8 py-3.5 text-sm"
            >
              Book a Discovery Call
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio"
              className="btn-sage-secondary w-full sm:w-auto px-8 py-3.5 text-sm"
            >
              Explore Our Work
            </Link>
          </div>

          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#e7e2d8] text-left">
            <div className="p-3">
              <span className="text-xs font-semibold text-[#3b563d] block">Architecture</span>
              <p className="text-sm font-medium text-[#1c1917] mt-0.5">Deterministic Guardrails</p>
            </div>
            <div className="p-3">
              <span className="text-xs font-semibold text-[#3b563d] block">Cost Control</span>
              <p className="text-sm font-medium text-[#1c1917] mt-0.5">Self-Hosted n8n & Open APIs</p>
            </div>
            <div className="p-3">
              <span className="text-xs font-semibold text-[#3b563d] block">Quality Assurance</span>
              <p className="text-sm font-medium text-[#1c1917] mt-0.5">Human-in-the-Loop Reviews</p>
            </div>
            <div className="p-3">
              <span className="text-xs font-semibold text-[#3b563d] block">Integrity</span>
              <p className="text-sm font-medium text-[#1c1917] mt-0.5">Zero Fabricated Claims</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. AGENCY INTRODUCTION                                    */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#ffffff] border-b border-[#e7e2d8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-[#5f8861]">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight">
              Calm, resilient engineering built for long-term reliability.
            </h2>
          </div>

          <div className="space-y-6 text-[#57534e] text-base leading-relaxed">
            <p>
              Flash.ai Agency is a boutique AI engineering studio partnering with small-to-medium businesses, marketing agencies, and real-estate firms across India, the USA, the UK, Canada, and Australia.
            </p>
            <p>
              We believe practical AI is not about gimmicky chatbots or complex generative promises. Real business value comes from eliminating repetitive manual handoffs: parsing inbound invoices, syncing leads from ad platforms into CRMs, routing client support tickets with strict knowledge boundaries, and automating calendar bookings.
            </p>
            <p>
              We write clean, production-ready code with typed schemas, comprehensive error catching, and respectful human fallback controls. You get clear timelines, transparent documentation, and systems you truly own.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SERVICES OVERVIEW                                      */}
      {/* ========================================================= */}
      <section className="py-20 md:py-28 bg-[#fdfbf7] border-b border-[#e7e2d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#5f8861]">
              What We Build
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight">
              Core Automation & Engineering Services
            </h2>
            <p className="text-sm sm:text-base text-[#57534e]">
              Every solution is custom-architected for your business logic and existing tech stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {AGENCY_SERVICES.map((srv) => {
              const IconComponent = ICON_MAP[srv.iconName] || Workflow;
              return (
                <div
                  key={srv.id}
                  className="natural-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#e5ede5] flex items-center justify-center text-[#3b563d] mb-4">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#5f8861] uppercase tracking-wider block mb-1">
                      {srv.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#1c1917] mb-2">{srv.title}</h3>
                    <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed line-clamp-3 mb-4">
                      {srv.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#78716c]">
                      {srv.typicalTimeline}
                    </span>
                    <Link
                      href={`/services/${srv.id}`}
                      className="text-xs font-semibold text-[#3b563d] hover:text-[#1c1917] flex items-center gap-1 group"
                    >
                      Details
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="btn-sage-secondary text-xs px-6 py-2.5"
            >
              Browse Detailed Service Guides
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FEATURED PORTFOLIO PROJECTS                            */}
      {/* ========================================================= */}
      <section className="py-20 md:py-28 bg-[#ffffff] border-b border-[#e7e2d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#5f8861] block mb-2">
                Proven Architectures
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight">
                Featured Case Studies
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="btn-sage-secondary text-xs px-5 py-2.5 self-start md:self-auto"
            >
              View Full Portfolio
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                className="natural-card p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="sage-badge text-[11px] py-1">
                      {p.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#78716c] px-2.5 py-1 rounded bg-[#f7f4ee] border border-[#e7e2d8]">
                      {p.projectType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1c1917] mb-2">{p.name}</h3>
                  <p className="text-xs font-semibold text-[#5f8861] mb-3">{p.tagline}</p>
                  <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-6">
                    {p.problem}
                  </p>

                  <div className="bg-[#f7f4ee] rounded-xl p-4 mb-6 border border-[#e7e2d8]">
                    <span className="text-[11px] font-semibold text-[#1c1917] uppercase tracking-wider block mb-1">
                      Demonstrated Outcome:
                    </span>
                    <p className="text-xs text-[#57534e]">{p.outcome}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#ffffff] border border-[#e7e2d8] text-[#57534e]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between">
                  <Link
                    href={`/portfolio/${p.id}`}
                    className="text-xs font-semibold text-[#3b563d] hover:text-[#1c1917] flex items-center gap-1 group"
                  >
                    View Project Breakdown
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href={`/booking?service=ai-workflow-automation&projectRef=${p.id}`}
                    className="text-xs text-[#78716c] hover:text-[#1c1917]"
                  >
                    Inquire Similar Architecture
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. GENUINE CUSTOMER REVIEWS (WHEN AVAILABLE)              */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#fdfbf7] border-b border-[#e7e2d8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-[#5f8861]">
              Client Feedback
            </span>
            <h2 className="text-3xl font-bold text-[#1c1917] tracking-tight">
              Verified Client Reviews
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c]">
              We strictly publish authorized, authenticated feedback from completed client engagements.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="natural-card p-10 text-center max-w-xl mx-auto bg-[#ffffff]">
              <div className="w-12 h-12 rounded-full bg-[#e5ede5] text-[#3b563d] flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1c1917] mb-2">
                Commitment to Authentic Client Feedback
              </h3>
              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-6">
                Unlike agencies that generate fictitious testimonials and stock client logos, we only present authorized testimonials approved directly by verified client stakeholders.
              </p>
              <Link
                href="/reviews"
                className="btn-sage-secondary text-xs px-4 py-2"
              >
                Submit Client Review / View Verification Policy
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="natural-card p-6 bg-[#ffffff]">
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#1c1917] italic mb-4 leading-relaxed">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1917]">{rev.reviewerName}</h4>
                    <p className="text-[11px] text-[#78716c]">
                      {rev.role ? `${rev.role}, ` : ""}{rev.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. HOW OUR PROCESS WORKS                                  */}
      {/* ========================================================= */}
      <section id="process" className="py-20 md:py-28 bg-[#ffffff] border-b border-[#e7e2d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#5f8861]">
              Predictable Collaboration
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight">
              How Our Process Works
            </h2>
            <p className="text-sm sm:text-base text-[#57534e]">
              A disciplined four-stage engineering methodology designed to prevent scope creep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-3">
              <span className="text-2xl font-black text-[#5f8861] font-mono">01</span>
              <h3 className="text-base font-bold text-[#1c1917]">Discovery & Scope Audit</h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                We review your current toolchain, identify operational bottlenecks, calculate realistic API token quotas, and agree on clear delivery milestones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-3">
              <span className="text-2xl font-black text-[#5f8861] font-mono">02</span>
              <h3 className="text-base font-bold text-[#1c1917]">Architecture & POC</h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                We build working prototypes with schema validations and guardrails, testing them against real sample business data in a staging environment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-3">
              <span className="text-2xl font-black text-[#5f8861] font-mono">03</span>
              <h3 className="text-base font-bold text-[#1c1917]">Integration & Hardening</h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                We establish webhook retry logic, dead-letter queues, automated exception alerts, and role-based staff permissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-3">
              <span className="text-2xl font-black text-[#5f8861] font-mono">04</span>
              <h3 className="text-base font-bold text-[#1c1917]">Handover & Runbooks</h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                We provide complete operational documentation, team walkthrough recordings, and post-launch monitoring to ensure reliable daily operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS                             */}
      {/* ========================================================= */}
      <section id="faq" className="py-20 bg-[#fdfbf7] border-b border-[#e7e2d8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#5f8861]">
              Transparency First
            </span>
            <h2 className="text-3xl font-bold text-[#1c1917] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#57534e]">
              Direct answers regarding our engineering standards, timelines, and commitments.
            </p>
          </div>

          <div className="space-y-4">
            {AGENCY_FAQS.map((faq, idx) => (
              <div key={idx} className="natural-card p-6 bg-[#ffffff]">
                <h3 className="text-base font-bold text-[#1c1917] mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-[#5f8861] shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FINAL BOOKING CTA                                      */}
      {/* ========================================================= */}
      <section className="py-20 md:py-28 bg-[#ffffff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="natural-card p-10 sm:p-14 bg-[#f7f4ee] border-[#cbdccb]">
            <span className="sage-badge text-xs mb-4">Ready to automate?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight mb-4">
              Let&apos;s map out your automation architecture.
            </h2>
            <p className="text-sm sm:text-base text-[#57534e] max-w-xl mx-auto leading-relaxed mb-8">
              Schedule a 30-minute discovery call to discuss your bottlenecks, tool integrations, and budget requirements with an engineer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="btn-sage-primary w-full sm:w-auto px-8 py-3.5 text-sm"
              >
                Book a Discovery Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="btn-sage-secondary w-full sm:w-auto px-8 py-3.5 text-sm"
              >
                Send Us a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
