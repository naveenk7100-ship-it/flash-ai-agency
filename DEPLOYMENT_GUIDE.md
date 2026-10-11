# ⚡ FLASH.Ai Agency — Production Deployment & Handover Guide

> **Production AI Systems, Agentic Workflows & Cinematic Web Engineering**  
> Workspace directory: `C:\Users\navee\.gemini\antigravity\scratch\flash-ai-agency`

---

## 1. Executive Summary

The production **FLASH.Ai Agency** website has been built, tested, and verified using Next.js 16 (App Router), TypeScript, Tailwind CSS, Three.js 3D WebGL visuals, and a resilient dual-layer storage & notification engine.

All showcased case studies are derived directly from verified codebase inspections in your scratch workspace:
1. **FLASH.Ai Social**: Multi-model AI generation, human-in-the-loop approval queues, and direct Meta Instagram Graph API publishing.
2. **TrendPost**: Multi-source trend clustering (Google Trends, YouTube, Reddit, X), 5-factor virality scoring, and 07:30 AM IST Telegram dispatches.
3. **CleanCut AI**: Video watermark inpainting platform utilizing Navier-Stokes PDE spatial algorithms and optical flow temporal motion tracking.
4. **GlobalLead AI**: Worldwide local business discovery and non-invasive 12-point SSRF-protected website auditing engine.
5. **ExamPilot**: Official CBSE 2026–27 curriculum compliance engine featuring 6-dimension mastery readiness analytics and mistake taxonomy.

---

## 2. Verified Page & Route Blueprint

| Route | Purpose | Key Capabilities |
|---|---|---|
| `/` | **Home** | Interactive Three.js 3D hero torus knot, verified project highlights, differentiators, and CTA banners. |
| `/services` | **Services** | 4 core engineering services with deliverables, technical stacks, pricing ranges, and delivery roadmaps. |
| `/portfolio` | **Portfolio / Case Studies** | Detailed dossiers with authentic metrics, architectural breakdowns, and zero fabricated testimonials. |
| `/about` | **About Us** | The FLASH.Ai engineering manifesto, anti-buzzword philosophy, and technical principles. |
| `/pricing` | **Pricing & Quotes** | Predictable engineering starter tiers, full-stack packages, and custom scope request actions. |
| `/booking` | **Client Booking** | Working booking form with budget, dates, and live alert dispatching. |
| `/contact` | **Contact** | Working general inquiry form with instant SLA disclosure and privacy protections. |
| `/faq` | **FAQ** | Transparent answers to hosting, WhatsApp integrations, and storage architectures. |
| `/admin` | **Admin Portal** | Protected operator dashboard with status toggles, lead counts, and API health checks. |
| `/api/bookings` | **API (POST/GET)** | Booking persistence and real alert dispatcher (WhatsApp & Resend). |
| `/api/contact` | **API (POST/GET)** | Contact submission persistence and notifications. |
| `/api/admin` | **API (POST)** | Administrative key authentication and CRM updates. |

---

## 3. Storage & Notification Architecture

### Zero-Data-Loss Serverless Storage:
- **Primary Cloud Storage**: Compatible with **Upstash Redis** (free serverless tier).
  - Simply provide `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- **Warm Serverless In-Memory Storage**: Built-in fallback that retains submissions across active execution contexts without risking crashes or writing to ephemeral serverless disks.

### Honest WhatsApp & Email Notifications:
- **WhatsApp Cloud API**: Integrates with official Meta Graph API (`/v21.0/{phone-id}/messages`).
  - If keys are missing, the system **honestly returns `unconfigured`** status and exact missing env keys without pretending it succeeded.
- **Resend Email**: Integrated with Resend API for lead email triggers.

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env.local` or configure these directly in your Vercel Project Settings:

```env
# Administrative Secret Key (Used for /admin login)
ADMIN_SECRET_KEY=flash-admin-2026

# Upstash Redis Cloud Storage (Free tier: https://console.upstash.com)
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Meta WhatsApp Cloud API (https://developers.facebook.com)
WHATSAPP_PHONE_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_RECIPIENT_PHONE=

# Resend Email Notification (https://resend.com)
RESEND_API_KEY=
AGENCY_NOTIFICATION_EMAIL=hello@flashai.agency
```

---

## 5. Deployment to Vercel (1-Click or CLI)

### Option A: Via Vercel CLI (Recommended)
1. In your terminal inside the project directory:
   ```bash
   cd C:\Users\navee\.gemini\antigravity\scratch\flash-ai-agency
   npx vercel
   ```
2. Follow the interactive prompts to link your Vercel account.
3. Deploy to production:
   ```bash
   npx vercel --prod
   ```

### Option B: Via GitHub & Vercel Dashboard
1. Create a repository on GitHub (e.g., `flash-ai-agency`).
2. Push the local Git repository:
   ```bash
   git remote add origin https://github.com/<your-username>/flash-ai-agency.git
   git push -u origin master
   ```
3. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New Project** $\rightarrow$ **Import Git Repository**.
4. Add the environment variables specified in Section 4.
5. Click **Deploy**. Vercel will build and assign your live production URL (e.g., `https://flash-ai-agency.vercel.app`).
