import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Video,
  CheckCircle2,
  ShieldCheck,
  Tag,
  MessageSquare,
  Phone,
  Sparkles,
  Share2,
  Globe
} from "lucide-react";
import { WHATSAPP_CONTACTS } from "@/lib/config";
import { Container } from "@/components/Container";

interface ProjectDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = await db.getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProjectDetailProps) {
  const { id } = await params;
  const projects = await db.getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} Case Study — Flash.ai Agency`,
    description: project.tagline
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = await params;
  const projects = await db.getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <Container>
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Case Studies
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-[#ffffff] border border-[#e7e2d8] rounded-2xl p-8 sm:p-12 mb-10 shadow-sm hud-bracket">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e7e2d8]/70">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#5f8861] bg-[#e5ede5] px-2.5 py-1 rounded">
                DOSSIER // {project.id.toUpperCase()}
              </span>
              <span className="sage-badge text-xs">{project.category}</span>
            </div>
            <span
              className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border ${
                project.projectType === "Client System"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : project.projectType === "Concept Architecture"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              ● {project.projectType}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight mb-2">
            {project.name}
          </h1>
          <p className="text-base font-semibold text-[#5f8861] mb-6">
            {project.tagline}
          </p>

          {/* Quantified Outcome Highlight */}
          <div className="p-4 rounded-xl bg-[#f7f4ee] border border-[#cbdccb] mb-6">
            <span className="text-[10px] font-mono uppercase text-[#78716c] font-bold block mb-1">
              Verified Production Outcome:
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#3b563d]">
              {project.outcome}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e7e2d8]">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-md bg-[#e5ede5] text-[#3b563d] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Problem Section */}
        <div className="natural-card p-8 sm:p-10 mb-8 bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            The Business Problem
          </h2>
          <p className="text-sm text-[#57534e] leading-relaxed">
            {project.problem}
          </p>
        </div>

        {/* 2. Solution Section */}
        <div className="natural-card p-8 sm:p-10 mb-8 bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5f8861]" />
            The Engineered Solution
          </h2>
          <p className="text-sm text-[#57534e] leading-relaxed">
            {project.solution}
          </p>
        </div>

        {/* 3. Workflow Section */}
        <div className="natural-card p-8 sm:p-10 mb-8 bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-4">
            System Workflow & Architecture
          </h2>
          <div className="space-y-4">
            {project.workflow.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8]"
              >
                <div className="w-7 h-7 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-[#1c1917] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Interactive Visual Pipeline for FLASH.Ai Social */}
        {project.id === "flash-ai-social" && (
          <div className="natural-card p-8 sm:p-10 mb-8 bg-[#ffffff] border-2 border-[#cbdccb] shadow-[0_4px_24px_rgba(59,86,61,0.08)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e7e2d8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <h2 className="text-xl font-bold text-[#1c1917]">
                  Meta Instagram Autonomous Publishing Pipeline
                </h2>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#3b563d] bg-[#e5ede5] px-2.5 py-1 rounded">
                API V21.0 GRAPH
              </span>
            </div>

            {/* Pipeline Step Sequence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#3b563d] text-white flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <span className="text-[10px] font-mono text-[#5f8861] uppercase font-bold">Inbound</span>
                </div>
                <h4 className="text-xs font-bold text-[#1c1917]">Trend & Topic Trigger</h4>
                <p className="text-[11px] text-[#57534e] leading-relaxed">
                  Scheduled cron monitors content calendar pillars and indexes high-velocity topics.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#3b563d] text-white flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span className="text-[10px] font-mono text-[#5f8861] uppercase font-bold">Generative</span>
                </div>
                <h4 className="text-xs font-bold text-[#1c1917]">Multi-Model AI Drafting</h4>
                <p className="text-[11px] text-[#57534e] leading-relaxed">
                  LLM drafts contextual Reels script, carousel text slides, and verified hashtags with strict brand tone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#e5ede5] border border-[#cbdccb] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#5f8861] text-white flex items-center justify-center font-mono text-xs font-bold">3</span>
                  <span className="text-[10px] font-mono text-[#293a2b] uppercase font-bold">Gatekeeper</span>
                </div>
                <h4 className="text-xs font-bold text-[#1c1917]">1-Click Human Review</h4>
                <p className="text-[11px] text-[#293a2b] leading-relaxed">
                  Slack/Telegram notification delivers one-click Approve / Edit / Reject buttons. Zero hallucinated postings.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#3b563d] text-white flex items-center justify-center font-mono text-xs font-bold">4</span>
                  <span className="text-[10px] font-mono text-[#25D366] uppercase font-bold">Publish</span>
                </div>
                <h4 className="text-xs font-bold text-[#1c1917]">Meta Graph API</h4>
                <p className="text-[11px] text-[#57534e] leading-relaxed">
                  Media container generated and published to Instagram Business Profile at optimal target audience hour.
                </p>
              </div>
            </div>

            {/* Simulated Live Post Telemetry Card */}
            <div className="p-4 rounded-xl bg-[#121b14] text-[#fdfbf7] border border-[#293a2b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  IG
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href="https://www.instagram.com/flash__ai__digital/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold font-mono hover:underline text-white"
                    >
                      @flash__ai__digital
                    </a>
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  </div>
                  <span className="text-[10px] text-[#86c289] font-mono">STATUS: PUBLISHED // CONTAINER #839219</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#78716c] block">CYCLE TIME</span>
                  <span className="font-bold text-[#86c289]">&lt; 3 mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#78716c] block">HUMAN REVIEW</span>
                  <span className="font-bold text-[#86c289]">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Outcome & Metrics */}
        <div className="natural-card p-8 sm:p-10 mb-8 bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-3">
            Outcome & Demonstrated Results
          </h2>
          <p className="text-sm text-[#57534e] leading-relaxed mb-6">
            {project.outcome}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] text-center"
              >
                <span className="text-xs text-[#78716c] block font-medium mb-1">
                  {m.label}
                </span>
                <span className="text-sm font-bold text-[#1c1917] font-mono">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Screenshots / Demo Links (if configured) */}
        {(project.projectUrl || project.demoVideoUrl) && (
          <div className="natural-card p-6 mb-12 bg-[#ffffff] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[#57534e]">
              External References:
            </span>
            <div className="flex gap-4">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sage-secondary text-xs py-2 px-4"
                >
                  Visit Project Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.demoVideoUrl && (
                <a
                  href={project.demoVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sage-secondary text-xs py-2 px-4"
                >
                  <Video className="w-3.5 h-3.5" /> Watch Demo
                </a>
              )}
            </div>
          </div>
        )}

        {/* Inquiry CTA */}
        <div className="natural-card p-10 text-center bg-[#f7f4ee] border-[#cbdccb]">
          <h2 className="text-2xl font-bold text-[#1c1917] mb-3">
            Interested in building a similar architecture?
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-lg mx-auto mb-6">
            We can adapt this architectural blueprint to your organization&apos;s data sources, APIs, and security parameters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link
              href={`/booking?service=ai-workflow-automation&projectRef=${project.id}`}
              className="btn-sage-primary text-xs py-3 px-8"
            >
              Schedule a Technical Discovery Call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick WhatsApp Inquiry Buttons */}
          <div className="pt-6 border-t border-[#cbdccb]/60 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-[#78716c] font-medium text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              Quick WhatsApp Consultation:
            </span>
            <a
              href={WHATSAPP_CONTACTS.line1.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#cbdccb] text-[#293a2b] hover:border-[#25D366] hover:bg-[#e5ede5] transition-colors font-mono text-[11px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              Line 1: {WHATSAPP_CONTACTS.line1.display}
            </a>
            <a
              href={WHATSAPP_CONTACTS.line2.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#cbdccb] text-[#293a2b] hover:border-[#25D366] hover:bg-[#e5ede5] transition-colors font-mono text-[11px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              Line 2: {WHATSAPP_CONTACTS.line2.display}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
