import { Project, Service } from "./types";

/**
 * Verified Projects Built by FLASH.Ai Agency
 * Note: Only verified systems directly inspected in the repository & workspace are showcased.
 */
export const VERIFIED_PROJECTS: Project[] = [
  {
    id: "flash-ai-social",
    name: "FLASH.Ai Social",
    tagline: "Autonomous Multi-Platform Social Media Content & Approval Engine",
    category: "AI SaaS & Content",
    summary:
      "Enterprise social media automation suite featuring dynamic pillar planning, multi-model AI content generation (Reels, Carousels, Hooks), automated review queues, and direct Meta Instagram Graph API publishing.",
    features: [
      "Custom Content Pillars (AI Automation, Growth, Web, WhatsApp)",
      "Multi-angle AI generation with tone and audience calibration",
      "Interactive Approval Queue with schedule & direct publish modals",
      "Direct Meta / Instagram Graph API token management & health audit",
      "Structured publishing activity audit logs with timestamped job history"
    ],
    techStack: ["Next.js / React 19", "Vite", "Tailwind CSS", "Meta Graph API", "TypeScript"],
    metrics: [
      { label: "Architecture", value: "Multi-Model AI" },
      { label: "Target Platform", value: "Instagram & X" },
      { label: "Automation Level", value: "Human-in-the-Loop" }
    ],
    liveStatus: "Live Production",
    accentColor: "violet"
  },
  {
    id: "trendpost",
    name: "TrendPost",
    tagline: "Live Multi-Source Trend Radar & Atomic Two-User SaaS Content Engine",
    category: "AI SaaS & Content",
    summary:
      "Production-grade trend intelligence system extracting live spikes across Google Trends India, YouTube, Reddit, and X every morning at 07:00 AM IST, calculating multi-factor virality scores, and delivering packages via Telegram.",
    features: [
      "Cross-platform token clustering and fuzzy deduplication",
      "Transparent 5-factor virality score (Freshness, Velocity, Volume, Fit, Platform)",
      "OpenRouter AI pipeline generating 3-sec hooks, Reel scripts, 15 hashtags & carousels",
      "PostgreSQL atomic claiming with transactional locking for 2-user teams",
      "Telegram Bot interactive delivery with inline approval actions and 2hr spike alerts"
    ],
    techStack: ["Next.js 15", "PostgreSQL", "OpenRouter AI", "Telegram Bot API", "Vitest"],
    metrics: [
      { label: "Daily Extraction", value: "07:00 AM IST" },
      { label: "Virality Formula", value: "5-Factor Real-time" },
      { label: "Delivery", value: "Telegram Webhook" }
    ],
    liveStatus: "Enterprise Engine",
    accentColor: "purple"
  },
  {
    id: "cleancut-ai",
    name: "CleanCut AI",
    tagline: "Video Watermark Inpainting Platform with Navier-Stokes PDE Engine",
    category: "Computer Vision & PDE",
    summary:
      "High-precision web application for removing static and moving watermarks from video content using temporal neighbor-frame reconstruction and mathematical partial differential equation inpainting.",
    features: [
      "Interactive dual-canvas bounding-box & keyframe timeline scrubber",
      "Navier-Stokes PDE spatial inpainting algorithm",
      "Optical flow temporal motion compensation across adjacent frames",
      "Lossless FFmpeg audio stream preservation and fast remuxing",
      "Side-by-side split screen comparative playback viewer"
    ],
    techStack: ["Next.js", "FastAPI Python", "OpenCV", "FFmpeg", "Docker"],
    metrics: [
      { label: "Algorithm", value: "Navier-Stokes PDE" },
      { label: "Motion Tracking", value: "Optical Flow" },
      { label: "Format Support", value: "Lossless MP4" }
    ],
    liveStatus: "Deployed System",
    accentColor: "blue"
  },
  {
    id: "globallead-ai",
    name: "GlobalLead AI",
    tagline: "Worldwide Local Business Lead Discovery & Web Presence Audit Engine",
    category: "Lead Intelligence",
    summary:
      "AI-driven B2B prospecting tool discovering high-value commercial prospects across worldwide cities, running non-invasive technical website audits, and scoring sales opportunities.",
    features: [
      "Worldwide search hierarchy supporting OpenStreetMap & Google Places",
      "Automated non-invasive website audit (HTTPS, mobile responsiveness, CTAs, load speed)",
      "Transparent 0–100 lead scoring engine prioritizing active businesses without websites",
      "Strict SSRF security protection against internal/loopback network scanning",
      "Exportable CRM-ready prospect dossiers with verified review velocity"
    ],
    techStack: ["React", "TypeScript", "Node.js", "OpenStreetMap / Nominatim", "Tailwind CSS"],
    metrics: [
      { label: "Coverage", value: "Worldwide ISO" },
      { label: "Audit Precision", value: "12-Point Non-invasive" },
      { label: "Security", value: "SSRF Protected" }
    ],
    liveStatus: "Live Production",
    accentColor: "emerald"
  },
  {
    id: "exampilot",
    name: "ExamPilot",
    tagline: "CBSE Class 10 Exam Clarity & 6-Dimension Readiness Analytics Engine",
    category: "EdTech & Analytics",
    summary:
      "Adaptive exam preparation engine built strictly according to official CBSE 2026–27 curriculum blueprints, featuring multi-dimension mastery tracking and automatic mistake taxonomy.",
    features: [
      "6-Dimensional readiness scoring (Concept, Application, Solving, Writing, Time, Revision)",
      "Official 80-mark, 3-hour CBSE pattern exam simulator with Sections A–E",
      "Mistake Intelligence Taxonomy isolating conceptual vs calculation vs phrasing errors",
      "Configurable subject combinations across Mathematics, Science, and Languages",
      "Competency-focused question bank matching modern CBSE board blueprints"
    ],
    techStack: ["React", "TypeScript", "Lucide Icons", "Tailwind CSS", "Vite"],
    metrics: [
      { label: "Curriculum", value: "CBSE 2026–27" },
      { label: "Dimensions", value: "6-Axis Tracking" },
      { label: "Exam Format", value: "80-Mark Official" }
    ],
    liveStatus: "Live Production",
    accentColor: "cyan"
  }
];

export const AGENCY_SERVICES: Service[] = [
  {
    id: "autonomous-ai-agents",
    title: "Autonomous AI Agents & Workflows",
    badge: "Core Flagship",
    description:
      "Custom intelligent agents that replace manual business tasks: lead triage, automated social content generation, document intelligence, and cross-platform notification pipelines.",
    deliverables: [
      "Tailored AI agent pipelines (OpenRouter, Gemini, Claude, OpenAI)",
      "Telegram & Discord webhook alerts with interactive approval buttons",
      "Scheduled cron automation & background workers",
      "Safe fallback algorithms with zero hallucinated production data"
    ],
    tech: ["Next.js", "Python FastAPI", "OpenRouter", "PostgreSQL", "Webhooks"],
    priceEstimate: "Starting from $1,200",
    timeline: "2 to 3 Weeks",
    popular: true
  },
  {
    id: "cinematic-web-platforms",
    title: "High-Performance Next.js Web Platforms",
    badge: "Engineering Excellence",
    description:
      "Ultra-fast, accessible, cinematic web applications with 3D canvas visuals, dark/light aesthetics, interactive dashboards, and sub-second page loads that convert visitors into revenue.",
    deliverables: [
      "Full Next.js App Router & React 19 architecture",
      "Custom 3D Three.js / Canvas interactive visual hero components",
      "Serverless database integration (Neon PostgreSQL / Upstash Redis)",
      "100/100 Lighthouse performance, strict SEO, and OpenGraph tags"
    ],
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Three.js", "Vercel"],
    priceEstimate: "Starting from $1,800",
    timeline: "2 to 4 Weeks",
    popular: true
  },
  {
    id: "computer-vision-media",
    title: "Computer Vision & Media Processing Systems",
    badge: "Deep Tech",
    description:
      "Industrial-strength media pipelines incorporating mathematical PDE inpainting, optical flow frame compensation, video watermarking removal, and automated audio/video manipulation.",
    deliverables: [
      "Custom computer vision endpoints (OpenCV, PDE, Optical Flow)",
      "Lossless video multiplexing & high-throughput streaming (FFmpeg)",
      "Containerized microservices deployable on Render, Fly.io, or Railway",
      "Interactive timeline scrubber and split comparison frontend interfaces"
    ],
    tech: ["FastAPI", "Docker", "OpenCV", "FFmpeg", "Next.js"],
    priceEstimate: "Custom Scope",
    timeline: "3 to 5 Weeks"
  },
  {
    id: "whatsapp-crm-automation",
    title: "WhatsApp Cloud API & Lead Engines",
    badge: "High ROI",
    description:
      "Direct response WhatsApp business systems, automatic lead qualification, catalog ordering bots, instant appointment scheduling, and CRM synchronization.",
    deliverables: [
      "Official Meta WhatsApp Cloud API webhook receiver & dispatcher",
      "Automated lead capture & instant SMS/WhatsApp notification triggers",
      "Admin CRM dashboard with lead statuses, contact dossiers, and notes",
      "Compliant message template submission and opt-in handling"
    ],
    tech: ["Meta Cloud API", "Node.js / Next.js", "Webhooks", "PostgreSQL"],
    priceEstimate: "Starting from $950",
    timeline: "1 to 2 Weeks"
  }
];

export const AGENCY_FAQS = [
  {
    question: "What makes FLASH.Ai different from generic digital agencies?",
    answer:
      "We don't build cookie-cutter templates or superficial marketing wrappers. We are engineering-first: we build actual computer vision platforms (CleanCut AI), real-time trend intelligence radars (TrendPost), enterprise lead scoring tools (GlobalLead AI), and end-to-end social automation engines (FLASH.Ai Social). Every feature we propose has production-verified code behind it."
  },
  {
    question: "How do your booking and client quote processes work?",
    answer:
      "You can submit a project brief via our interactive Booking or Request a Quote forms. Your inquiry is immediately logged in our persistent dashboard, and an automated alert is triggered via our notification pipeline. We follow up within 24 hours with an architectural teardown and transparent scope."
  },
  {
    question: "Do you integrate real WhatsApp notifications?",
    answer:
      "Yes. We support direct integration with the official Meta WhatsApp Cloud API. If credentials (`WHATSAPP_PHONE_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_RECIPIENT_PHONE`) are supplied, live instant alerts are dispatched. If credentials are not yet configured, the system explicitly reports 'unconfigured' mode without faking success."
  },
  {
    question: "What hosting stack do you recommend for our project?",
    answer:
      "We build our web applications using Next.js App Router optimized for Vercel's global edge network, paired with serverless PostgreSQL (such as Neon or Supabase) or Redis (Upstash) for zero-maintenance, free-to-low-cost, instant scaling. Containerized ML services run on Render or Railway."
  },
  {
    question: "Can I manage the agency content and view leads through an admin dashboard?",
    answer:
      "Absolutely. FLASH.Ai includes a protected `/admin` dashboard where administrators can review client bookings, inspect submitted contact inquiries, update lead status pipeline, and view system health."
  }
];
