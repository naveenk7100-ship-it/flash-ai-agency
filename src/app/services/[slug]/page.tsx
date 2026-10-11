import { notFound } from "next/navigation";
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
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  ArrowLeft,
  MessageSquare
} from "lucide-react";
import { WHATSAPP_CONTACTS } from "@/lib/config";
import { Container } from "@/components/Container";

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

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return AGENCY_SERVICES.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const srv = AGENCY_SERVICES.find((s) => s.id === slug);
  if (!srv) return { title: "Service Not Found" };
  return {
    title: `${srv.title} — Flash.ai Agency`,
    description: srv.shortDescription
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const srv = AGENCY_SERVICES.find((s) => s.id === slug);

  if (!srv) {
    notFound();
  }

  const Icon = ICON_MAP[srv.iconName] || Workflow;

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <Container>
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Services
          </Link>
        </div>

        {/* Hero header */}
        <div className="bg-[#ffffff] border border-[#e7e2d8] rounded-2xl p-8 sm:p-12 mb-12 shadow-sm hud-bracket">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e7e2d8]/70">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#5f8861] bg-[#e5ede5] px-2.5 py-1 rounded">
                SPEC // {srv.id.toUpperCase()}
              </span>
              <span className="sage-badge text-xs">{srv.badge}</span>
            </div>
            <span className="text-xs font-mono font-medium text-[#78716c] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5f8861]" />
              Timeline: {srv.typicalTimeline}
            </span>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#e5ede5] flex items-center justify-center text-[#3b563d] shrink-0 shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight">
                {srv.title}
              </h1>
              <p className="text-base text-[#57534e] mt-2 leading-relaxed">
                {srv.shortDescription}
              </p>
            </div>
          </div>

          {/* Technical SLA & Guardrail Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] text-xs">
            <div>
              <span className="text-[10px] font-mono text-[#78716c] uppercase block">Fault Tolerance</span>
              <span className="font-bold text-[#1c1917] mt-0.5 block">Sub-Second Failover</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#78716c] uppercase block">Data Loss</span>
              <span className="font-bold text-[#3b563d] mt-0.5 block">Zero-Loss Guaranteed</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#78716c] uppercase block">Governance</span>
              <span className="font-bold text-[#1c1917] mt-0.5 block">Human-in-the-Loop</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#78716c] uppercase block">Deployment</span>
              <span className="font-bold text-[#3b563d] mt-0.5 block">Self-Hosted / Open APIs</span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e7e2d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#78716c] block font-medium">Estimated Starting Scope</span>
              <span className="text-xl font-bold text-[#1c1917]">{srv.startingInvestment}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={WHATSAPP_CONTACTS.line1.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#ffffff] hover:bg-[#e5ede5] border border-[#cbdccb] text-[#293a2b] text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                WhatsApp: {WHATSAPP_CONTACTS.line1.display}
              </a>
              <Link
                href={`/booking?service=${srv.id}`}
                className="btn-sage-primary text-xs py-3 px-6 shadow-sm"
              >
                Inquire About {srv.title}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Problem & Solution Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Problem */}
          <div className="natural-card p-8 bg-[#ffffff]">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md inline-block mb-3 border border-rose-200">
              The Business Problem
            </span>
            <h2 className="text-lg font-bold text-[#1c1917] mb-3">What breaks without this automation</h2>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
              {srv.problem}
            </p>
          </div>

          {/* Solution */}
          <div className="natural-card p-8 bg-[#ffffff]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b563d] bg-[#e5ede5] px-2.5 py-1 rounded-md inline-block mb-3 border border-[#cbdccb]">
              Our Proposed Solution
            </span>
            <h2 className="text-lg font-bold text-[#1c1917] mb-3">How we engineer the fix</h2>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
              {srv.solution}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="natural-card p-8 sm:p-10 mb-12 bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-6">Key Capabilities & Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {srv.keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8]">
                <CheckCircle2 className="w-4 h-4 text-[#5f8861] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1c1917] leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suitable Clients */}
        <div className="natural-card p-8 sm:p-10 mb-12 bg-[#ffffff]">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[#5f8861]" />
            <h2 className="text-xl font-bold text-[#1c1917]">Who This Is Best Suited For</h2>
          </div>
          <p className="text-xs text-[#78716c] mb-6">
            We specifically tailor this service for businesses matching these operational profiles:
          </p>
          <ul className="space-y-3">
            {srv.suitableClients.map((client, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#57534e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5f8861] mt-2 shrink-0" />
                <span>{client}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Workflow Stages */}
        <div className="natural-card p-8 sm:p-10 mb-16 bg-[#ffffff]">
          <h2 className="text-xl font-bold text-[#1c1917] mb-2">Expected Engineering Workflow</h2>
          <p className="text-xs text-[#78716c] mb-8">
            How your project progresses from initial scoping to live production.
          </p>

          <div className="space-y-6">
            {srv.expectedWorkflow.map((stage) => (
              <div
                key={stage.step}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#e5ede5] text-[#3b563d] flex items-center justify-center font-bold font-mono text-sm shrink-0">
                  {stage.step}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1c1917]">{stage.title}</h3>
                  <p className="text-xs text-[#57534e] mt-1 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Inquiry CTA */}
        <div className="natural-card p-10 text-center bg-[#f7f4ee] border-[#cbdccb]">
          <h2 className="text-2xl font-bold text-[#1c1917] mb-3">
            Ready to explore {srv.title}?
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-lg mx-auto mb-6 leading-relaxed">
            Submit a booking request with your specific system requirements. We&apos;ll review your stack and respond within 24 business hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link
              href={`/booking?service=${srv.id}`}
              className="btn-sage-primary text-xs py-3 px-8 shadow-sm"
            >
              Schedule a Technical Discovery Call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick WhatsApp Inquiry Buttons */}
          <div className="pt-6 border-t border-[#cbdccb]/60 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-[#78716c] font-medium text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              Direct WhatsApp Support:
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
