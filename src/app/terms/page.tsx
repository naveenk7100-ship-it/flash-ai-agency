import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Flash.ai Agency",
  description: "Terms and conditions governing services provided by Flash.ai Agency."
};

export default function TermsPage() {
  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#1c1917]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        <div className="natural-card p-8 sm:p-12 bg-[#ffffff] space-y-6">
          <div className="border-b border-[#e7e2d8] pb-6">
            <span className="sage-badge text-xs mb-3">Terms & Conditions</span>
            <h1 className="text-3xl font-extrabold text-[#1c1917] tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-[#78716c] mt-2">
              Last Updated: October 2026 • Flash.ai Agency
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#57534e] leading-relaxed">
            <h2 className="text-base font-bold text-[#1c1917]">1. Engagement Scoping</h2>
            <p>
              Flash.ai Agency provides bespoke software engineering, AI workflow automations, and consulting services. All projects proceed under formal Statements of Work (SOW) outlining defined milestones, deliverables, timelines, and acceptance criteria.
            </p>

            <h2 className="text-base font-bold text-[#1c1917]">2. Realistic Performance Commitments</h2>
            <p>
              While we guarantee high-quality code, verified schema validation, and rigorous testing on all deliverables, we do not guarantee specific business revenue outcomes, viral reach, or arbitrary conversion rates. AI models operate probabilistically, and our systems incorporate guardrails to maximize deterministic reliability.
            </p>

            <h2 className="text-base font-bold text-[#1c1917]">3. Intellectual Property Rights</h2>
            <p>
              Upon receipt of final payment for custom project deliverables, clients retain full ownership of the bespoke source code, database structures, and workflow scripts developed specifically for their engagement, excluding pre-existing agency open-source utilities or libraries.
            </p>

            <h2 className="text-base font-bold text-[#1c1917]">4. Third-Party API & Tool Subscriptions</h2>
            <p>
              Clients are responsible for their own third-party API accounts (e.g., OpenAI, Anthropic, Meta WhatsApp Cloud API, cloud server hosting). Flash.ai Agency assists in setup and hardening, but monthly consumption fees charged by third parties remain the responsibility of the client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
