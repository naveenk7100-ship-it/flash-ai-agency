import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Flash.ai Agency — AI Workflow Automation, Agents & High-Conversion Systems",
  description:
    "Flash.ai Agency engineers bespoke AI workflow automation, custom AI agents, n8n orchestrations, lead capture systems, and conversion-focused websites for SMBs and agencies worldwide.",
  keywords: [
    "Flash.ai Agency",
    "AI workflow automation",
    "custom AI agents",
    "n8n automation",
    "lead management automation",
    "appointment booking systems",
    "conversion websites"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[#fdfbf7] text-[#1c1917] antialiased selection:bg-[#cbdccb] selection:text-[#293a2b]`}
      >
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
