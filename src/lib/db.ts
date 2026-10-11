import fs from "fs";
import path from "path";
import { BookingSubmission, ContactSubmission, CustomerReview, Project, Lead } from "./types";
import { INITIAL_PROJECTS } from "./data";
import {
  isPostgresConfigured,
  getSanitizedDbInfo,
  pgGetLeads,
  pgSaveLead,
  pgUpdateLead,
  pgDeleteLead,
  pgGetBookings,
  pgSaveBooking,
  pgUpdateBooking,
  pgGetContacts,
  pgSaveContact,
  pgUpdateContactStatus,
  pgGetAdminPasswordHash,
  pgSetAdminPasswordHash,
  pgGetReviews,
  pgSaveReview,
  pgUpdateReviewStatus,
  pgDeleteReview
} from "./postgres";

/**
 * Production-Grade Storage Engine for FLASH.Ai Agency
 * - Prioritizes Neon Serverless PostgreSQL (DATABASE_URL / POSTGRES_URL)
 * - Supports Upstash Redis / Vercel KV REST API
 * - Strict production policy: writes are NEVER stored in RAM/local JSON in production
 * - Persistent local JSON store fallback ONLY for local development without DB
 */

declare global {
  // eslint-disable-next-line no-var
  var __FLASH_AI_STORE:
    | {
        bookings: BookingSubmission[];
        contacts: ContactSubmission[];
        leads: Lead[];
        projects: Project[];
        reviews: CustomerReview[];
        adminPasswordHash?: string;
      }
    | undefined;
}

const INITIAL_BOOKINGS: BookingSubmission[] = [
  {
    id: "book-sample-01",
    fullName: "Marcus Sterling",
    email: "marcus@sterlingrealty.co.uk",
    phone: "+44 7911 123456",
    company: "Sterling Property Group",
    serviceId: "appointment-booking-systems",
    website: "https://sterlingrealty.co.uk",
    preferredDate: "2026-10-20",
    preferredTime: "14:00 - 16:00",
    timezone: "GMT (London)",
    budgetRange: "$2,000 - $4,000",
    projectBrief:
      "Seeking an automated appointment booking flow for high-net-worth real estate buyers in London. We want pre-qualification questions, automatic calendar sync, and WhatsApp reminder sequences.",
    status: "Discovery Scheduled",
    notes: "Discovery call scheduled for Oct 20. Follow up with initial calendar invitation.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "book-sample-02",
    fullName: "Priya Nair",
    email: "priya@zenithscale.in",
    phone: "+91 98200 54321",
    company: "Zenith Performance Marketing",
    serviceId: "n8n-workflow-development",
    website: "https://zenithscale.in",
    preferredDate: "2026-10-22",
    preferredTime: "10:00 - 12:00",
    timezone: "IST (New Delhi)",
    budgetRange: "$1,500 - $3,000",
    projectBrief:
      "Currently spending over $700/mo on Zapier. Need custom self-hosted n8n deployment with webhook failover and PostgreSQL logging for lead sync between Meta Ads and our internal CRM.",
    status: "New",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const INITIAL_CONTACTS: ContactSubmission[] = [
  {
    id: "contact-sample-01",
    name: "Arthur Pendelton",
    email: "arthur@apexpartners.com.au",
    phone: "+61 412 345 678",
    subject: "AI Workflow Assessment for Sydney Office",
    message:
      "Hello Flash.ai team, we are interested in auditing our client onboarding workflow to evaluate where custom AI agents could eliminate repetitive data entry.",
    source: "Contact Page",
    status: "read",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

function bookingToLead(b: BookingSubmission): Lead {
  return {
    id: b.id,
    type: "booking",
    name: b.fullName,
    email: b.email,
    phone: b.phone || "",
    service: b.serviceId,
    message: b.projectBrief,
    company: b.company,
    budget: b.budgetRange,
    preferredDate: b.preferredDate,
    status: b.status === "Won" ? "Converted" : b.status === "Lost" ? "Archived" : (b.status as any),
    notes: b.notes,
    createdAt: b.createdAt,
    source: "Booking System"
  };
}

function contactToLead(c: ContactSubmission): Lead {
  return {
    id: c.id,
    type: "contact",
    name: c.name,
    email: c.email,
    phone: c.phone || "",
    service: c.subject,
    message: c.message,
    status: c.status === "replied" ? "Contacted" : "New",
    createdAt: c.createdAt,
    source: c.source || "Contact Form"
  };
}

// Local File Storage path for local development fallback
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_STORE_FILE = path.join(LOCAL_DATA_DIR, "production_store.json");

function loadLocalStore(): any {
  if (typeof window !== "undefined") return null;
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORE_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch {
    // ignore
  }
  return null;
}

function saveLocalStore(data: any): void {
  if (typeof window !== "undefined") return;
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // ignore
  }
}

// In-Memory store initialized for local development fallback
const localSaved = loadLocalStore();
if (!global.__FLASH_AI_STORE) {
  global.__FLASH_AI_STORE = {
    bookings: localSaved?.bookings || [...INITIAL_BOOKINGS],
    contacts: localSaved?.contacts || [...INITIAL_CONTACTS],
    leads: localSaved?.leads || [
      ...INITIAL_BOOKINGS.map(bookingToLead),
      ...INITIAL_CONTACTS.map(contactToLead)
    ],
    projects: localSaved?.projects || [...INITIAL_PROJECTS],
    reviews: localSaved?.reviews || [],
    adminPasswordHash: localSaved?.adminPasswordHash
  };
}

// Optional Redis fallback configuration
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function redisCommand(command: (string | number)[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });
    if (!res.ok) {
      console.error("[Database] Redis command failed:", await res.text());
      return null;
    }
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("[Database] Redis connection error:", err);
    return null;
  }
}

/**
 * Production write safety guard:
 * Prevents silent data drops into RAM or JSON when running in production without a real database.
 */
function assertProductionStorage(operation: string) {
  if (isPostgresConfigured() || (REDIS_URL && REDIS_TOKEN)) {
    return;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[Production Storage Error] Cannot perform '${operation}': No production database is configured. Please configure DATABASE_URL in environment variables to prevent data loss.`
    );
  }
}

export const db = {
  isCloudConfigured: (): boolean => {
    return isPostgresConfigured() || Boolean(REDIS_URL && REDIS_TOKEN);
  },

  getDatabaseInfo: (): { type: string; configured: boolean; provider: string; host?: string } => {
    if (isPostgresConfigured()) {
      const info = getSanitizedDbInfo();
      return {
        type: "PostgreSQL Database (Neon Serverless)",
        configured: true,
        provider: "postgres",
        host: info.host
      };
    }
    if (REDIS_URL && REDIS_TOKEN) {
      return {
        type: "Production Cloud KV (Upstash/Vercel)",
        configured: true,
        provider: "upstash_redis"
      };
    }
    return {
      type: "Persistent Local Engine",
      configured: false,
      provider: "local_persistent"
    };
  },

  /* ------------------- LEADS (Unified CRM Entity) ------------------- */
  getLeads: async (): Promise<Lead[]> => {
    // 1. PostgreSQL priority
    if (isPostgresConfigured()) {
      return await pgGetLeads();
    }

    // 2. Redis KV
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:leads"]);
      if (data) {
        try {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // ignore
        }
      }
    }

    // 3. Local fallback (development only)
    const leads = global.__FLASH_AI_STORE?.leads || [];
    return [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  saveLead: async (lead: Lead): Promise<Lead> => {
    assertProductionStorage("saveLead");

    // 1. PostgreSQL priority
    if (isPostgresConfigured()) {
      return await pgSaveLead(lead);
    }

    // 2. Redis KV
    const current = await db.getLeads();
    const index = current.findIndex((l) => l.id === lead.id);
    let updated: Lead[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...lead };
    } else {
      updated = [lead, ...current];
    }

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:leads", JSON.stringify(updated)]);
    }

    // 3. Local fallback
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.leads = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return lead;
  },

  updateLead: async (id: string, updates: Partial<Lead>): Promise<boolean> => {
    assertProductionStorage("updateLead");

    // 1. PostgreSQL priority
    if (isPostgresConfigured()) {
      return await pgUpdateLead(id, updates);
    }

    // 2. Local/Redis
    const current = await db.getLeads();
    const index = current.findIndex((l) => l.id === id);
    if (index === -1) return false;

    current[index] = { ...current[index], ...updates };

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:leads", JSON.stringify(current)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.leads = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    // Mirror to booking if applicable
    if (updates.status && current[index].type === "booking") {
      await db.updateBooking(id, {
        status: updates.status as any,
        notes: updates.notes
      });
    }

    return true;
  },

  deleteLead: async (id: string): Promise<boolean> => {
    assertProductionStorage("deleteLead");

    if (isPostgresConfigured()) {
      return await pgDeleteLead(id);
    }

    const current = await db.getLeads();
    const updated = current.filter((l) => l.id !== id);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:leads", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.leads = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  },

  /* ------------------- BOOKINGS ------------------- */
  getBookings: async (): Promise<BookingSubmission[]> => {
    if (isPostgresConfigured()) {
      return await pgGetBookings();
    }

    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:bookings"]);
      if (data) {
        try {
          return typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore
        }
      }
    }

    return global.__FLASH_AI_STORE?.bookings || [];
  },

  saveBooking: async (booking: BookingSubmission): Promise<BookingSubmission> => {
    assertProductionStorage("saveBooking");

    if (isPostgresConfigured()) {
      return await pgSaveBooking(booking);
    }

    const current = await db.getBookings();
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:bookings", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.bookings = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    await db.saveLead(bookingToLead(booking));
    return booking;
  },

  updateBooking: async (
    id: string,
    updates: Partial<BookingSubmission>
  ): Promise<boolean> => {
    assertProductionStorage("updateBooking");

    if (isPostgresConfigured()) {
      return await pgUpdateBooking(id, updates);
    }

    const current = await db.getBookings();
    const index = current.findIndex((b) => b.id === id);
    if (index === -1) return false;

    current[index] = { ...current[index], ...updates };

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:bookings", JSON.stringify(current)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.bookings = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  },

  /* ------------------- CONTACTS ------------------- */
  getContacts: async (): Promise<ContactSubmission[]> => {
    if (isPostgresConfigured()) {
      return await pgGetContacts();
    }

    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:contacts"]);
      if (data) {
        try {
          return typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore
        }
      }
    }

    return global.__FLASH_AI_STORE?.contacts || [];
  },

  saveContact: async (contact: ContactSubmission): Promise<ContactSubmission> => {
    assertProductionStorage("saveContact");

    if (isPostgresConfigured()) {
      return await pgSaveContact(contact);
    }

    const current = await db.getContacts();
    const updated = [contact, ...current.filter((c) => c.id !== contact.id)];

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:contacts", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.contacts = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    await db.saveLead(contactToLead(contact));
    return contact;
  },

  updateContactStatus: async (
    id: string,
    status: ContactSubmission["status"]
  ): Promise<boolean> => {
    assertProductionStorage("updateContactStatus");

    if (isPostgresConfigured()) {
      return await pgUpdateContactStatus(id, status);
    }

    const current = await db.getContacts();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return false;

    current[index].status = status;

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:contacts", JSON.stringify(current)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.contacts = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  },

  /* ------------------- PORTFOLIO PROJECTS ------------------- */
  getProjects: async (): Promise<Project[]> => {
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:projects"]);
      if (data) {
        try {
          return typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore
        }
      }
    }
    return global.__FLASH_AI_STORE?.projects || [...INITIAL_PROJECTS];
  },

  saveProject: async (project: Project): Promise<Project> => {
    assertProductionStorage("saveProject");

    const current = await db.getProjects();
    const index = current.findIndex((p) => p.id === project.id);
    let updated: Project[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = project;
    } else {
      updated = [project, ...current];
    }

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:projects", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.projects = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return project;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    assertProductionStorage("deleteProject");

    const current = await db.getProjects();
    const updated = current.filter((p) => p.id !== id);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:projects", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.projects = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  },

  /* ------------------- CUSTOMER REVIEWS ------------------- */
  getReviews: async (onlyApproved = true): Promise<CustomerReview[]> => {
    if (isPostgresConfigured()) {
      return await pgGetReviews(onlyApproved);
    }

    let reviews: CustomerReview[] = [];
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:reviews"]);
      if (data) {
        try {
          reviews = typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore
        }
      }
    } else {
      reviews = global.__FLASH_AI_STORE?.reviews || [];
    }

    if (onlyApproved) {
      return reviews.filter((r) => r.status === "approved");
    }
    return reviews;
  },

  saveReview: async (review: CustomerReview): Promise<CustomerReview> => {
    assertProductionStorage("saveReview");

    if (isPostgresConfigured()) {
      return await pgSaveReview(review);
    }

    const current = await db.getReviews(false);
    const index = current.findIndex((r) => r.id === review.id);
    let updated: CustomerReview[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = review;
    } else {
      updated = [review, ...current];
    }

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.reviews = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return review;
  },

  updateReviewStatus: async (
    id: string,
    status: CustomerReview["status"]
  ): Promise<boolean> => {
    assertProductionStorage("updateReviewStatus");

    if (isPostgresConfigured()) {
      return await pgUpdateReviewStatus(id, status);
    }

    const current = await db.getReviews(false);
    const index = current.findIndex((r) => r.id === id);
    if (index === -1) return false;
    current[index].status = status;

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(current)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.reviews = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  },

  deleteReview: async (id: string): Promise<boolean> => {
    assertProductionStorage("deleteReview");

    if (isPostgresConfigured()) {
      return await pgDeleteReview(id);
    }

    const current = await db.getReviews(false);
    const updated = current.filter((r) => r.id !== id);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(updated)]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.reviews = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  },

  /* ------------------- ADMIN AUTH CREDENTIAL STORAGE ------------------- */
  getAdminPasswordHash: async (): Promise<string | null> => {
    if (isPostgresConfigured()) {
      return await pgGetAdminPasswordHash();
    }

    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:admin_password_hash"]);
      if (data) return String(data);
    }

    return global.__FLASH_AI_STORE?.adminPasswordHash || null;
  },

  setAdminPasswordHash: async (hash: string): Promise<boolean> => {
    assertProductionStorage("setAdminPasswordHash");

    if (isPostgresConfigured()) {
      return await pgSetAdminPasswordHash(hash);
    }

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:admin_password_hash", hash]);
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.adminPasswordHash = hash;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    return true;
  }
};
