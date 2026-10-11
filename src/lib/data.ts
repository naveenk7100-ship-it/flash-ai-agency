import { Service, Project } from "./types";

export const AGENCY_SERVICES: Service[] = [
  {
    id: "ai-workflow-automation",
    title: "AI Workflow Automation",
    badge: "Core Service",
    shortDescription:
      "Automate repetitive multi-step operational tasks, document routing, data parsing, and business notifications with deterministic AI guardrails.",
    problem:
      "Operational teams spend 15–25 hours per week manually extracting invoice details, formatting cross-system records, and handing off tasks between departments, leading to latency and human data entry mistakes.",
    solution:
      "We design hardened, error-handled automation pipelines connecting your ERP, Google Workspace, Slack, and cloud storage, augmenting manual reviews with secure LLM document extraction and automated verification.",
    keyFeatures: [
      "Custom document parsing (PDF invoices, purchase orders, client briefs)",
      "Strict data schema enforcement with deterministic JSON validation",
      "Human-in-the-loop exception handling queues with instant slack/email alerts",
      "Automated cross-system reconciliation and audit trail logging"
    ],
    suitableClients: [
      "Small-to-medium businesses processing 50+ documents weekly",
      "Marketing and logistics agencies needing automated client asset handoffs",
      "Accounting & operations teams seeking zero manual data re-entry"
    ],
    expectedWorkflow: [
      { step: "01", title: "Process Discovery", description: "Map inputs, decision trees, exception thresholds, and target systems." },
      { step: "02", title: "Architecture & Schema", description: "Define secure data contracts, fallback procedures, and validation rules." },
      { step: "03", title: "Staged Deployment", description: "Deploy test pipeline running in parallel with existing manual flows." },
      { step: "04", title: "Monitoring & Handover", description: "Full staff training, alert thresholds, and operational runbooks." }
    ],
    startingInvestment: "Starting at $1,400",
    typicalTimeline: "2 – 3 weeks",
    iconName: "Workflow"
  },
  {
    id: "custom-ai-agents",
    title: "Custom AI Agents",
    badge: "Autonomous Intelligence",
    shortDescription:
      "Purpose-built autonomous agents with structured memory, tool-calling capabilities, and safe API execution designed for specific business roles.",
    problem:
      "Standard chatbots lack context, hallucinate answers, cannot take verified actions in real software systems, and lack auditable boundaries.",
    solution:
      "We build scoped, tool-equipped AI agents that query internal knowledge bases, call authorized CRM or billing APIs, verify permissions before taking action, and gracefully escalate when uncertainty is detected.",
    keyFeatures: [
      "Role-specific agent prompts with explicit operating boundaries",
      "Vector search over company SOPs, catalogs, and documentation",
      "Tool-calling integration into internal databases and third-party APIs",
      "Detailed action transcripts and safety guardrails"
    ],
    suitableClients: [
      "SaaS founders requiring intelligent automated onboarding assistants",
      "Real-estate brokerages requiring property matching agents",
      "E-commerce brands handling high-volume repetitive client queries"
    ],
    expectedWorkflow: [
      { step: "01", title: "Agent Role Definition", description: "Define exact agent responsibilities, permissions, and tool permissions." },
      { step: "02", title: "Knowledge Ingestion", description: "Chunk, index, and verify internal company knowledge and guidelines." },
      { step: "03", title: "Tool & API Wiring", description: "Securely connect agent actions to verified endpoints with strict bounds." },
      { step: "04", title: "Simulation & Safety Audit", description: "Stress test edge cases and red-team prompt injection vulnerabilities." }
    ],
    startingInvestment: "Starting at $1,800",
    typicalTimeline: "2 – 4 weeks",
    iconName: "Cpu"
  },
  {
    id: "n8n-workflow-development",
    title: "n8n Workflow Development",
    badge: "Self-Hosted & Scalable",
    shortDescription:
      "Self-hosted or cloud n8n orchestrations that eliminate costly per-task SaaS bills while keeping your data privately hosted within your perimeter.",
    problem:
      "Proprietary automation platforms like Zapier become prohibitively expensive as operations scale, and enterprise data privacy rules frequently forbid third-party data transit.",
    solution:
      "We architect resilient, self-hosted n8n instances with custom JavaScript nodes, webhook listeners, retry mechanisms, and PostgreSQL backend stores for full sovereignty and cost predictability.",
    keyFeatures: [
      "Self-hosted Dockerized n8n deployment with automated backups",
      "Advanced error-handling, webhook retries, and dead-letter queues",
      "Custom community nodes and API integrations for legacy software",
      "Zero per-execution fees, ensuring fixed operational costs"
    ],
    suitableClients: [
      "Agencies looking to replace high five-figure Zapier/Make subscription bills",
      "Enterprises bound by GDPR / HIPAA data residency requirements",
      "Developers needing complex branching logic with custom Node.js scripts"
    ],
    expectedWorkflow: [
      { step: "01", title: "Infrastructure Setup", description: "Deploy self-hosted secure n8n instance or audit existing workspace." },
      { step: "02", title: "Logic Architecture", description: "Build branching logic, token refreshes, and failure fallback handlers." },
      { step: "03", title: "Load & Stress Testing", description: "Simulate peak concurrency and verify error retry policies." },
      { step: "04", title: "Documentation & Access", description: "Deliver node blueprints, environment guides, and maintenance playbooks." }
    ],
    startingInvestment: "Starting at $1,200",
    typicalTimeline: "1 – 3 weeks",
    iconName: "Share2"
  },
  {
    id: "lead-capture-and-followup",
    title: "Lead Capture & Follow-up Automation",
    badge: "Revenue Operations",
    shortDescription:
      "Instant multi-channel lead enrichment, qualification scoring, CRM synchronization, and personalized omni-channel follow-ups.",
    problem:
      "Leads go cold when response times exceed 10 minutes. Sales teams waste time following up with unqualified inquiries without knowing budget or authority.",
    solution:
      "We connect your landing pages, ads, and inquiry forms to real-time qualification triggers, enrich company data automatically, score prospects, and dispatch immediate personalized responses via email or WhatsApp.",
    keyFeatures: [
      "Sub-2-minute automated lead enrichment and qualification scoring",
      "Instant CRM synchronization (HubSpot, GoHighLevel, Pipedrive, custom)",
      "Multi-channel follow-up sequences via official email & WhatsApp Cloud API",
      "Sales rep routing based on deal size, territory, or availability"
    ],
    suitableClients: [
      "Real-estate agencies requiring instant property inquiry qualification",
      "Performance marketing agencies seeking higher campaign conversion",
      "B2B service providers with high average contract values"
    ],
    expectedWorkflow: [
      { step: "01", title: "Inbound Audit", description: "Review existing lead forms, ad channels, and qualification criteria." },
      { step: "02", title: "CRM & Pipeline Setup", description: "Configure custom fields, pipeline stages, and webhook endpoints." },
      { step: "03", title: "Cadence Design", description: "Draft contextual follow-up messages tailored to prospect intent." },
      { step: "04", title: "Live Integration", description: "End-to-end testing from form submission to calendar booking." }
    ],
    startingInvestment: "Starting at $1,500",
    typicalTimeline: "2 – 3 weeks",
    iconName: "Target"
  },
  {
    id: "customer-support-automation",
    title: "Customer Support Automation",
    badge: "24/7 Operations",
    shortDescription:
      "Intelligent tier-1 support deflection with verified knowledge retrieval, ticket categorization, and seamless escalation to human agents.",
    problem:
      "Support queues get inundated with routine questions (order status, refund policies, FAQs), burning out support staff while increasing wait times for high-priority accounts.",
    solution:
      "We deploy verified retrieval systems that resolve routine inquiries 24/7, categorize and tag tickets automatically, draft proposed replies for agent review, and route complex issues directly to the right specialist.",
    keyFeatures: [
      "Tier-1 instant resolution grounded strictly in approved knowledge docs",
      "Automated ticket classification, sentiment scoring, and urgency tagging",
      "Seamless Zendesk, Intercom, Gorgias, or Crisp bidirectional integration",
      "Human escalation triggers when confidence scores dip below defined thresholds"
    ],
    suitableClients: [
      "E-commerce stores handling repetitive shipping and return questions",
      "SaaS companies seeking lower first-response and resolution times",
      "Service businesses fielding after-hours customer inquiries"
    ],
    expectedWorkflow: [
      { step: "01", title: "Ticket Analysis", description: "Analyze historic support conversations to identify top 20 repetitive queries." },
      { step: "02", title: "Knowledge Calibration", description: "Curate verified answers and establish strict answer boundaries." },
      { step: "03", title: "Helpdesk Integration", description: "Wire webhooks, draft mode testing, and agent handover workflows." },
      { step: "04", title: "Accuracy Monitoring", description: "Review deflected tickets weekly to refine response fidelity." }
    ],
    startingInvestment: "Starting at $1,600",
    typicalTimeline: "2 – 4 weeks",
    iconName: "Headphones"
  },
  {
    id: "appointment-booking-systems",
    title: "Appointment Booking Systems",
    badge: "Conversion Engine",
    shortDescription:
      "Custom calendar scheduling engines with timezone intelligence, pre-qualification intake questions, automated reminders, and CRM sync.",
    problem:
      "Generic calendar tools feel impersonal, fail to disqualify unsuitable leads prior to calls, and suffer from high no-show rates without proactive SMS/WhatsApp reminders.",
    solution:
      "We engineer custom branded booking flows that qualify prospects upfront, calculate real-time slot availability, prevent double-bookings, and dispatch multi-stage confirmations and reminders.",
    keyFeatures: [
      "Custom qualification intake flow embedded directly in your domain",
      "Timezone-aware scheduling with Google Calendar or Microsoft 365 sync",
      "Multi-stage reminder sequence via email & WhatsApp Cloud API",
      "Direct integration into agency sales pipeline as 'Discovery Scheduled'"
    ],
    suitableClients: [
      "Consultants and coaches needing pre-call qualification",
      "Real-estate agents booking property showings and buyer consults",
      "Clinics, wellness studios, and local services managing appointment slots"
    ],
    expectedWorkflow: [
      { step: "01", title: "Availability Rules", description: "Configure buffer times, max bookings per day, and timezone policies." },
      { step: "02", title: "Intake Customization", description: "Build question flow to collect budget, company size, and specific needs." },
      { step: "03", title: "Calendar & Alert Sync", description: "Connect Google/Outlook calendars and set up SMS/Email notification hooks." },
      { step: "04", title: "Launch & Testing", description: "Simulate bookings across international timezones to verify precision." }
    ],
    startingInvestment: "Starting at $1,100",
    typicalTimeline: "1 – 2 weeks",
    iconName: "Calendar"
  },
  {
    id: "reporting-and-business-operations",
    title: "Reporting & Business Operations",
    badge: "Executive Clarity",
    shortDescription:
      "Automated multi-source data consolidation, weekly executive KPI summaries, and automated client performance reports.",
    problem:
      "Agency teams spend entire Mondays manually pulling numbers from Google Ads, Meta Ads, Stripe, and Google Analytics into spreadsheets to format client reports.",
    solution:
      "We build automated reporting pipelines that ingest metrics daily, calculate blended CAC/ROAS, generate formatted PDF or Notion client reports, and dispatch summaries via email or Slack.",
    keyFeatures: [
      "Multi-platform data connectors (Meta, Google, Stripe, Shopify, CRM)",
      "Automated report generation in branded PDF, Google Slides, or Notion",
      "Scheduled weekly and monthly executive digest delivery",
      "Anomaly detection alerts when conversion rates or spend spikes occur"
    ],
    suitableClients: [
      "Marketing agencies generating monthly performance decks for 10+ clients",
      "E-commerce brands monitoring daily margins, ad spend, and inventory",
      "SaaS leadership tracking churn, MRR, expansion, and trial conversions"
    ],
    expectedWorkflow: [
      { step: "01", title: "Metric Specification", description: "Define single source of truth formulas for CAC, LTV, ROAS, and MRR." },
      { step: "02", title: "API Extractors", description: "Build automated ingestion jobs pulling data safely into PostgreSQL." },
      { step: "03", title: "Report Templating", description: "Design clear, executive-ready layouts reflecting your brand." },
      { step: "04", title: "Scheduled Dispatch", description: "Automate delivery cadences with verification checks." }
    ],
    startingInvestment: "Starting at $1,300",
    typicalTimeline: "2 – 3 weeks",
    iconName: "BarChart3"
  },
  {
    id: "website-design-and-conversion",
    title: "Website Design & Conversion Optimization",
    badge: "High Performance",
    shortDescription:
      "Bespoke, high-speed Next.js web applications designed with natural elegance, accessible typography, clear CTA architecture, and sub-second page loads.",
    problem:
      "Heavy WordPress templates with slow load times, generic AI copy, and cluttered designs confuse visitors, leading to high bounce rates and low inquiry conversions.",
    solution:
      "We design and code clean, minimalist Next.js web platforms using Tailwind CSS, structured for rapid load speeds, search engine accessibility, and frictionless client conversion pathways.",
    keyFeatures: [
      "Next.js App Router & TypeScript with sub-second page delivery",
      "Warm, minimal UI/UX aligned with modern design standards",
      "Server-side form validation and anti-spam protection",
      "Complete mobile-first responsiveness, SEO metadata, and OpenGraph cards"
    ],
    suitableClients: [
      "Modern B2B service firms seeking a credible, premium web presence",
      "Agencies rebranding away from dated templates",
      "High-growth startups launching new product suites"
    ],
    expectedWorkflow: [
      { step: "01", title: "Information Architecture", description: "Structure pages, primary conversion hooks, and key user journeys." },
      { step: "02", title: "High-Fidelity UI Design", description: "Craft calm, balanced typography, generous whitespace, and restrained accents." },
      { step: "03", title: "Component Development", description: "Develop reusable accessible Next.js components with clean CSS." },
      { step: "04", title: "Launch & Core Web Vitals Audit", description: "Optimize Lighthouse scores (95+), DNS, and edge hosting." }
    ],
    startingInvestment: "Starting at $1,800",
    typicalTimeline: "3 – 4 weeks",
    iconName: "Layout"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "flash-ai-social",
    name: "FLASH.Ai Social",
    tagline: "Autonomous Multi-Platform Social Media Content & Approval Engine",
    category: "AI Workflow",
    projectType: "Client System",
    status: "published",
    featured: true,
    problem:
      "Social media management teams spent 18 hours weekly researching industry topics, drafting copy for Instagram and X, and coordinating email approvals across stakeholders.",
    solution:
      "Engineered an autonomous content pipeline that monitors topic pillars, generates structured drafts across multiple formats (Reels, Carousels, Hooks), presents them in a clean approval queue, and publishes directly via the Meta Instagram Graph API.",
    workflow: [
      "Inbound trend listener indexes topical keywords from target sources",
      "Multi-model generation drafts contextual copy with explicit tone rules",
      "Human reviewer receives Slack notification and approves/edits in one click",
      "Meta Instagram Graph API publishes on scheduled calendar slots"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Meta Graph API", "PostgreSQL"],
    outcome:
      "Reduced content drafting and approval cycle time from 18 hours to under 3 hours weekly, with 100% human-in-the-loop oversight.",
    metrics: [
      { label: "Drafting Cycle", value: "-80% Time Spent" },
      { label: "Approval Latency", value: "< 2 Minutes" },
      { label: "Publishing Reliability", value: "99.8% Success" }
    ],
    projectUrl: "https://flashai.agency"
  },
  {
    id: "trendpost",
    name: "TrendPost SaaS",
    tagline: "Live Multi-Source Trend Radar & Atomic Content Orchestrator",
    category: "AI Workflow",
    projectType: "Client System",
    status: "published",
    featured: true,
    problem:
      "Digital creators and marketing agencies struggled to spot emerging topics fast enough to publish timely content before viral windows closed.",
    solution:
      "Architected a real-time extraction pipeline monitoring Google Trends India, Reddit, and X spikes, scoring them with a 5-factor virality formula, and delivering packaged briefing packets directly to private Telegram channels.",
    workflow: [
      "Scheduled worker runs daily extraction across 3 public sources",
      "Token clustering removes duplicates and computes velocity score",
      "LLM pipeline crafts 3-second hook scripts and carousel slides",
      "Telegram bot dispatches instant interactive claim cards to team members"
    ],
    techStack: ["Next.js 15", "PostgreSQL", "OpenRouter AI", "Telegram Bot API"],
    outcome:
      "Eliminated 4 hours of daily manual research and delivered first-mover topic notifications to the marketing team each morning by 07:00 AM.",
    metrics: [
      { label: "Daily Extraction", value: "07:00 AM Automated" },
      { label: "Topic Discovery", value: "3 Sources Unified" },
      { label: "Alert Dispatch", value: "Real-time Telegram" }
    ],
    projectUrl: "https://trendpost.app"
  },
  {
    id: "cleancut-ai",
    name: "CleanCut AI",
    tagline: "Video Watermark Inpainting Engine with Navier-Stokes PDE Reconstruction",
    category: "Vision & PDE",
    projectType: "Concept Architecture",
    status: "published",
    featured: true,
    problem:
      "Video editing teams required high-precision removal of timestamps and channel logos from archival footage without introducing distracting blur artifacts.",
    solution:
      "Developed a dual-canvas web application using OpenCV Navier-Stokes partial differential equation inpainting coupled with optical flow temporal motion compensation across neighbor frames.",
    workflow: [
      "User outlines watermark bounding box on interactive timeline canvas",
      "Keyframes interpolated across duration with optical flow tracking",
      "Python microservice applies Navier-Stokes PDE spatial inpainting",
      "FFmpeg remuxes lossless audio track with processed video stream"
    ],
    techStack: ["Next.js", "Python FastAPI", "OpenCV", "FFmpeg", "Docker"],
    outcome:
      "Demonstrated clean, artifact-minimized video restoration on archival footage with lossless audio preservation.",
    metrics: [
      { label: "Mathematical Engine", value: "Navier-Stokes PDE" },
      { label: "Motion Tracking", value: "Optical Flow" },
      { label: "Audio Stream", value: "Lossless Remux" }
    ],
    demoVideoUrl: "https://youtube.com/watch?v=sample"
  },
  {
    id: "globallead-ai",
    name: "GlobalLead AI",
    tagline: "Worldwide Local Commercial Prospecting & 12-Point Technical Audit",
    category: "Lead & CRM",
    projectType: "Client System",
    status: "published",
    featured: true,
    problem:
      "B2B agency sales reps spent hours searching Google Maps and checking websites manually to find local businesses needing website and marketing upgrades.",
    solution:
      "Created an automated prospecting platform that indexes commercial entities across global regions, runs non-invasive 12-point technical audits (HTTPS, mobile viewport, CTA count), and scores sales readiness from 0–100.",
    workflow: [
      "Geographic bounding box query runs via OpenStreetMap Nominatim",
      "Non-invasive technical audit assesses response headers and mobile tags",
      "SSRF-protected scanner ensures safe external URL resolution",
      "Exportable CSV dossiers formatted for immediate CRM import"
    ],
    techStack: ["React", "TypeScript", "Node.js", "Nominatim", "Tailwind CSS"],
    outcome:
      "Enabled sales teams to generate qualified lists of 200+ local prospects with verified contact details and pre-calculated audit summaries in minutes.",
    metrics: [
      { label: "Audit Precision", value: "12 Technical Checks" },
      { label: "Prospect Scoring", value: "0–100 Readiness" },
      { label: "Security", value: "SSRF Protected" }
    ]
  },
  {
    id: "exampilot",
    name: "ExamPilot Readiness Engine",
    tagline: "Curriculum Analytics & Multi-Axis Competency Assessment",
    category: "AI Workflow",
    projectType: "Demo Prototype",
    status: "published",
    featured: false,
    problem:
      "Students taking standardized board examinations lacked actionable feedback on whether their test mistakes were caused by conceptual gaps, calculation slips, or time pressure.",
    solution:
      "Built an adaptive diagnostic examination simulator that maps student answers to official blueprints, categorizes error types automatically, and generates a 6-axis readiness radar.",
    workflow: [
      "Student completes timed examination matching official paper blueprint",
      "Diagnostic engine analyzes answers and mistake taxonomy",
      "Multi-axis scoring calculates Concept, Calculation, Phrasing, and Time metrics",
      "Personalized revision roadmap generated with targeted practice questions"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    outcome:
      "Proven architecture demonstrating transparent diagnostic categorization without hallucinated score inflation.",
    metrics: [
      { label: "Taxonomy", value: "6 Error Dimensions" },
      { label: "Blueprint Match", value: "100% Curriculum Aligned" },
      { label: "Feedback Latency", value: "Instant Analysis" }
    ]
  }
];

export const INITIAL_REVIEWS = [
  // Deliberately starting with an empty array or authentic empty state.
  // The system rules state: "Never generate fake customer testimonials."
  // Authorized reviews submitted by authentic clients are stored here when verified.
];

export const AGENCY_FAQS = [
  {
    question: "What makes Flash.ai Agency different from standard digital agencies?",
    answer:
      "We are engineering-first. We do not use loud generic templates or claim unrealistic guarantees. Every workflow, n8n instance, and AI agent we build is production-hardened with typed schemas, deterministic fallbacks, and human-in-the-loop review queues. You work directly with senior engineers, not account managers."
  },
  {
    question: "Do you guarantee specific revenue or business outcomes?",
    answer:
      "No. We never invent performance statistics or make unfounded business guarantees. What we do guarantee is architectural excellence: reliable uptime, validated data schemas, zero data leakage, and rigorous testing on all automations."
  },
  {
    question: "How do your booking and discovery processes work?",
    answer:
      "When you submit a booking request through our site, it is saved directly to our database and our team is alerted. We review your project scope and confirm a calendar slot for a 30-minute technical discovery call. We treat initial submissions strictly as booking requests until confirmed."
  },
  {
    question: "What tech stack do you build with?",
    answer:
      "Our web applications are built with Next.js, React, TypeScript, and Tailwind CSS. For backend automation and workflows, we utilize n8n (self-hosted or cloud), Node.js, Python, PostgreSQL, and official APIs (such as Meta WhatsApp Cloud API and major LLM providers)."
  },
  {
    question: "Can I manage our agency projects and reviews through the admin dashboard?",
    answer:
      "Yes. The platform includes a protected /admin area where authorized team members can review incoming booking requests, manage leads, update project case studies, and approve authentic customer reviews before they appear publicly."
  },
  {
    question: "How do you protect client data and credentials?",
    answer:
      "We enforce least-privilege API access, never hardcode secrets, store configuration exclusively in environment variables, and implement SSRF and anti-spam defenses on all public endpoints."
  }
];
