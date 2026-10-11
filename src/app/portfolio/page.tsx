import { db } from "@/lib/db";
import { PortfolioClient } from "./PortfolioClient";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Portfolio & Case Studies — Flash.ai Agency",
  description:
    "Explore genuine client case studies, verified AI systems, concept architectures, and prototypes."
};

export default async function PortfolioIndexPage() {
  const allProjects = await db.getProjects();
  const publishedProjects = allProjects.filter((p) => p.status === "published");

  return (
    <div className="bg-[#fdfbf7] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5ede5] border border-[#cbdccb] text-[#3b563d] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Case Studies & Implementations
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c1917] tracking-tight">
            Proven Engineering & Systems
          </h1>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
            Every case study below represents real codebases. Concept architectures and prototypes are clearly labeled to uphold strict client integrity.
          </p>
        </div>

        {/* Client Interactive Filter & List */}
        <PortfolioClient initialProjects={publishedProjects} />
      </div>
    </div>
  );
}
