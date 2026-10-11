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
  Tag
} from "lucide-react";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="natural-card p-8 sm:p-12 mb-10 bg-[#ffffff]">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="sage-badge text-xs">{project.category}</span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                project.projectType === "Client System"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : project.projectType === "Concept Architecture"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              {project.projectType}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight mb-2">
            {project.name}
          </h1>
          <p className="text-base font-semibold text-[#5f8861] mb-6">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e7e2d8]">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-md bg-[#f7f4ee] border border-[#e7e2d8] text-[#57534e]"
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
          <Link
            href={`/booking?service=ai-workflow-automation&projectRef=${project.id}`}
            className="btn-sage-primary text-xs py-3 px-8"
          >
            Schedule a Technical Discovery Call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
