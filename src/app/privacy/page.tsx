import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Privacy Policy — Flash.ai Agency",
  description: "Privacy policy and client data handling commitments at Flash.ai Agency."
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
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
            <span className="sage-badge text-xs mb-3">Legal & Compliance</span>
            <h1 className="text-3xl font-extrabold text-[#1c1917] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#78716c] mt-2">
              Effective Date: October 2026 • Flash.ai Agency
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#57534e] leading-relaxed">
            <h2 className="text-base font-bold text-[#1c1917]">1. Information We Collect</h2>
            <p>
              When you submit a discovery call or contact form on our website, we collect your name, business email, company name, optional website URL, time preferences, and project brief. This information is gathered solely to evaluate your project requirements and schedule consultations.
            </p>

            <h2 className="text-base font-bold text-[#1c1917]">2. How We Use Your Information</h2>
            <p>
              We do not sell, rent, or trade your personal or business data. We use your submitted details exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Review your technical requirements and prepare scoping documents.</li>
              <li>Coordinate calendar slots for technical discovery sessions.</li>
              <li>Respond to direct support inquiries.</li>
            </ul>

            <h2 className="text-base font-bold text-[#1c1917]">3. Data Security & Storage</h2>
            <p>
              All submissions are transmitted securely over HTTPS and stored with server-side access controls. We apply strict least-privilege policies to internal databases and never log sensitive API credentials or customer passwords in plain text.
            </p>

            <h2 className="text-base font-bold text-[#1c1917]">4. Client Data Sovereignty</h2>
            <p>
              When we build custom automations, n8n instances, or AI pipelines for clients, we prioritize self-hosted infrastructure and direct API keys owned by your organization. We do not retain copies of your proprietary business data or documents once deployments are complete.
            </p>

            <h2 className="text-base font-bold text-[#1c1917]">5. Inquiries & Data Removal</h2>
            <p>
              To request a copy of your stored records or request complete deletion of your booking inquiry, please contact our data team at{" "}
              <a href="mailto:flashai.digital@gmail.com" className="text-[#3b563d] underline">
                flashai.digital@gmail.com
              </a>.
            </p>
          </div>
        </div>
        </div>
      </Container>
    </div>
  );
}
