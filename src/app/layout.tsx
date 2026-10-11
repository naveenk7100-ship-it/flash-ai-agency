import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FLASH.Ai Agency — Production AI Systems, Agentic Workflows & Cinematic Web",
  description:
    "Boutique AI engineering agency building verified production systems: autonomous multi-model agents, Navier-Stokes PDE inpainting, real-time trend intelligence radars, and high-conversion web platforms.",
  keywords: [
    "FLASH.Ai",
    "AI Agency",
    "Agentic Workflows",
    "Next.js AI Platforms",
    "TrendPost",
    "CleanCut AI",
    "GlobalLead AI",
    "ExamPilot"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[#020106] text-zinc-100 antialiased selection:bg-[#863bff] selection:text-white`}
      >
        <Navbar />
        {/* Main page content container */}
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
