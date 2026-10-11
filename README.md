# Flash.ai Agency — Production Website & Client Management Platform

A production-grade, minimal, natural website and client management platform for **Flash.ai Agency**, built with Next.js (App Router), TypeScript, Tailwind CSS, and a durable storage architecture.

Designed specifically for small and medium businesses, marketing agencies, and real-estate firms across **India, USA, UK, Canada, and Australia**.

---

## 🌿 Design System & Aesthetic Direction

In strict accordance with the project requirements, the user interface features:
- **Warm off-white background** (`#fdfbf7`, `#f7f4ee`)
- **Deep charcoal typography** (`#1c1917`, `#57534e`)
- **Soft sage-green accents** (`#3b563d`, `#5f8861`, `#e5ede5`, `#cbdccb`)
- **Generous whitespace & restrained micro-interactions**
- **Subtle natural cards** with gentle borders (`#e7e2d8`)
- **Accessible contrast** meeting WCAG AA standards
- **Zero loud neon gradients, zero generic templates, and zero unverified marketing fluff**

---

## 🚀 Public Pages & Architecture

1. **Home (`/`)**:
   - Clear hero section with calm, confident agency message.
   - Primary CTA: *Book a Discovery Call* & Secondary CTA: *Explore Our Work*.
   - Agency introduction & engineering ethos.
   - Core services overview.
   - Featured case studies.
   - Genuine customer review section (displays authentic verified reviews only).
   - 4-stage delivery process (*Discovery, Architecture & POC, Integration & Hardening, Handover & Runbooks*).
   - Detailed FAQ.
   - Final booking CTA.

2. **Services (`/services` and individual `/services/[slug]`)**:
   Individual, dedicated pages for each core capability:
   - **AI Workflow Automation** (`/services/ai-workflow-automation`)
   - **Custom AI Agents** (`/services/custom-ai-agents`)
   - **n8n Workflow Development** (`/services/n8n-workflow-development`)
   - **Lead Capture & Follow-up Automation** (`/services/lead-capture-and-followup`)
   - **Customer Support Automation** (`/services/customer-support-automation`)
   - **Appointment Booking Systems** (`/services/appointment-booking-systems`)
   - **Reporting & Business Operations** (`/services/reporting-and-business-operations`)
   - **Website Design & Conversion Optimization** (`/services/website-design-and-conversion`)

   *Each individual service page contains: Business Problem, Proposed Solution, Key Features, Suitable Clients, Expected Workflow, and Project Inquiry CTA.*

3. **Portfolio (`/portfolio` and `/portfolio/[id]`)**:
   - Filterable project cards by category (*AI Workflow, AI Agents, n8n Automation, Lead & CRM, Vision & PDE*).
   - Distinct classification pills clearly labeling *Client System*, *Concept Architecture*, and *Demo Prototype*.
   - Detailed project case studies with: Problem, Solution, Workflow, Technology Stack, and Outcome sections.
   - Support for live links and demo recordings.

4. **Customer Reviews (`/reviews`)**:
   - Dedicated client reviews showcase.
   - Client submission modal with client name, company, role, rating, and review text.
   - Authentic verification policy: newly submitted reviews enter a `pending` state and are **only** published publicly after authorized admin approval.

5. **Client Booking System (`/booking`)**:
   - Dedicated intake system collecting client name, business email, company name, selected service, business website, project description, budget range, preferred date/time slot, timezone, and reference links.
   - Client-side and server-side validation.
   - Anti-spam rate limiting and duplicate submission prevention.
   - Saves requests to database with initial status `New`.
   - Explicit confirmation notice explaining that the submission is an intake booking request awaiting calendar review.

6. **Secure Admin Dashboard (`/admin`)**:
   - Server-side credential check via `ADMIN_SECRET_KEY`.
   - Summary statistics & booking pipeline distribution.
   - Booking Management: search, status filter, internal staff notes, and **CSV Export**.
   - Lead & Inquiries Management: review contact submissions, mark read/replied.
   - Portfolio Management: create, edit, publish, archive, and delete case studies.
   - Customer Review Approval: approve/publish, reject, or delete submitted reviews.
   - Services Directory: live inspection of active agency scope minimums and timelines.
   - System & API Health: audit storage layer, Resend email status, and WhatsApp Cloud API status.

7. **Contact (`/contact`)**:
   - Direct inquiry form with server-side processing.
   - Official email configuration (`hello@flashai.agency`).
   - Social and developer links.
   - Business location rendered **only if** configured via `NEXT_PUBLIC_BUSINESS_LOCATION`.

8. **Legal & Compliance**:
   - **Privacy Policy** (`/privacy`)
   - **Terms of Service** (`/terms`)

---

## 🛠️ Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom natural design tokens
- **Icons**: Lucide React
- **Storage Layer**:
  - **Local/Development**: Persistent serverless in-memory store across warm invocations.
  - **Production/Cloud**: Upstash Redis (REST-based serverless key-value / document store) or PostgreSQL.
- **Alerts & Integrations**:
  - Resend Email API
  - Meta WhatsApp Cloud API
  - Anti-spam & IP rate limiting

---

## ⚙️ Environment Configuration

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

### Environment Variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ADMIN_SECRET_KEY` | Master secret key to authenticate into `/admin` | `flash-admin-2026` |
| `NEXT_PUBLIC_BUSINESS_LOCATION` | Physical office location (Leave blank if 100% remote) | *Optional* |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL for durable cloud storage | *Optional* |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token | *Optional* |
| `WHATSAPP_PHONE_ID` | Meta WhatsApp Cloud API Phone Number ID | *Optional* |
| `WHATSAPP_ACCESS_TOKEN` | Meta System User Access Token | *Optional* |
| `WHATSAPP_RECIPIENT_PHONE` | Recipient WhatsApp number for lead alerts | *Optional* |
| `RESEND_API_KEY` | Resend API key for automated transactional emails | *Optional* |
| `AGENCY_NOTIFICATION_EMAIL`| Agency inbox for new booking alerts | `hello@flashai.agency` |

> **Transparency Guarantee**: If external credentials (WhatsApp or Resend) are omitted, the application operates normally, persists all leads to the database, and explicitly reports `unconfigured` status without faking live dispatches.

---

## 💻 Local Development & Testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or port 3001 if 3000 is occupied).

3. **Build and verify production output**:
   ```bash
   npm run build
   ```

4. **Run production server**:
   ```bash
   npm run start
   ```

---

## 🔒 Security Best Practices

1. **Server-Side Authorization**: Protected data in `/api/admin` is verified on the server using `ADMIN_SECRET_KEY`. No raw customer data is leaked to unauthorized clients.
2. **Anti-Spam & Rate Limiting**: The booking endpoint tracks client IP submissions and blocks rapid duplicate submissions.
3. **No Sensitive Keys Exposed**: All server-side secrets are restricted from client-side bundle exposure.
4. **Data Minimization**: Private client contact information is kept confidential and only accessible within the protected admin area.

---

## 📋 Status: Implemented vs. Awaiting Configuration

### Implemented & Fully Functional:
- [x] Complete Warm Off-White / Sage-Green Minimalist Design System
- [x] Home Page with Hero, Process, FAQ, and Conversion CTAs
- [x] All 8 Detailed Service Pages with Business Problem, Solution, Features, and Workflows
- [x] Portfolio Page with Category Filtering and Status Badges
- [x] Dynamic Case Study Detail Pages (`/portfolio/[id]`)
- [x] Customer Reviews Engine with Pending Queue and Authenticity Policy
- [x] Complete Client Booking Engine with Timezones, Budgets, and Validation
- [x] Anti-Spam Rate Limiting and Duplicate Prevention
- [x] Server-Protected `/admin` Portal with Pipeline Status, Notes, and CSV Export
- [x] Portfolio Add/Edit/Delete Management via Admin
- [x] Review Approval / Rejection Workflow via Admin
- [x] Contact Form & Conditional Business Location Display
- [x] Privacy Policy and Terms of Service Pages

### Awaiting External Configuration:
- [ ] **Live WhatsApp Alerts**: Enter Meta Cloud API credentials in `.env.local` to enable instant alerts to phone.
- [ ] **Live Resend Dispatch**: Enter `RESEND_API_KEY` in `.env.local` to dispatch transactional confirmation emails to clients.
- [ ] **Durable Cloud Database**: Provide `UPSTASH_REDIS_REST_URL` & `TOKEN` (or Neon PostgreSQL) for multi-region cloud replication.
