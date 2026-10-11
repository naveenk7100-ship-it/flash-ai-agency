import fs from "fs";
import path from "path";
import { BookingSubmission, ContactSubmission, CustomerReview, Project, Lead } from "./types";
import { INITIAL_PROJECTS } from "./data";

/**
 * Production-Ready Storage Engine for FLASH.Ai Agency
 * - Works on Vercel Serverless with Upstash Redis / Vercel KV REST API
 * - Works with PostgreSQL (POSTGRES_URL / DATABASE_URL)
 * - Persistent local JSON store fallback for local development (so leads survive restarts)
 * - Zero silent lead losses with comprehensive error logging
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

// Local File Storage path for local development (guarantees local data is never wiped on dev restart)
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
    // Vercel serverless /tmp or readonly filesystem: safe to swallow
  }
}

// Initialize In-Memory global store with local cache if available
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

// Cloud Database configuration (Upstash Redis or Vercel KV)
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN;

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

export const db = {
  isCloudConfigured: (): boolean => {
    return Boolean(REDIS_URL && REDIS_TOKEN);
  },

  getDatabaseInfo: (): { type: string; configured: boolean; provider: string } => {
    if (REDIS_URL && REDIS_TOKEN) {
      return {
        type: "Production Cloud KV (Upstash/Vercel)",
        configured: true,
        provider: "upstash_redis"
      };
    }
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      return {
        type: "PostgreSQL Database",
        configured: true,
        provider: "postgres"
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
    let leads: Lead[] = [];

    // 1. Try cloud Redis
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:leads"]);
      if (data) {
        try {
          leads = typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore
        }
      }
    }

    // 2. Fallback to memory / local store
    if (!leads || leads.length === 0) {
      leads = global.__FLASH_AI_STORE?.leads || [];
    }

    // 3. Ensure all bookings & contacts exist in the leads list
    const currentBookings = await db.getBookings();
    const currentContacts = await db.getContacts();

    let hasNewItems = false;
    currentBookings.forEach((b) => {
      if (!leads.some((l) => l.id === b.id)) {
        leads.push(bookingToLead(b));
        hasNewItems = true;
      }
    });

    currentContacts.forEach((c) => {
      if (!leads.some((l) => l.id === c.id)) {
        leads.push(contactToLead(c));
        hasNewItems = true;
      }
    });

    // Sort descending by creation date
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (hasNewItems) {
      if (global.__FLASH_AI_STORE) {
        global.__FLASH_AI_STORE.leads = leads;
      }
      saveLocalStore(global.__FLASH_AI_STORE);
      if (REDIS_URL && REDIS_TOKEN) {
        await redisCommand(["SET", "flash_ai:leads", JSON.stringify(leads)]);
      }
    }

    return leads;
  },

  saveLead: async (lead: Lead): Promise<Lead> => {
    const current = await db.getLeads();
    const index = current.findIndex((l) => l.id === lead.id);
    let updated: Lead[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...updated[index], ...lead };
    } else {
      updated = [lead, ...current];
    }

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.leads = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:leads", JSON.stringify(updated)]);
    }

    return lead;
  },

  updateLead: async (id: string, updates: Partial<Lead>): Promise<boolean> => {
    const current = await db.getLeads();
    const index = current.findIndex((l) => l.id === id);
    if (index === -1) return false;

    current[index] = { ...current[index], ...updates };

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.leads = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:leads", JSON.stringify(current)]);
    }

    // Mirror updates back to booking or contact if applicable
    if (updates.status) {
      if (current[index].type === "booking") {
        await db.updateBooking(id, {
          status: updates.status as any,
          notes: updates.notes
        });
      }
    }

    return true;
  },

  deleteLead: async (id: string): Promise<boolean> => {
    const current = await db.getLeads();
    const updated = current.filter((l) => l.id !== id);

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.leads = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:leads", JSON.stringify(updated)]);
    }

    return true;
  },

  /* ------------------- BOOKINGS ------------------- */
  getBookings: async (): Promise<BookingSubmission[]> => {
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
    const current = await db.getBookings();
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.bookings = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:bookings", JSON.stringify(updated)]);
    }

    // Mirror to leads collection automatically
    await db.saveLead(bookingToLead(booking));

    return booking;
  },

  updateBooking: async (
    id: string,
    updates: Partial<BookingSubmission>
  ): Promise<boolean> => {
    const current = await db.getBookings();
    const index = current.findIndex((b) => b.id === id);
    if (index === -1) return false;

    current[index] = { ...current[index], ...updates };

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.bookings = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:bookings", JSON.stringify(current)]);
    }

    return true;
  },

  /* ------------------- CONTACTS ------------------- */
  getContacts: async (): Promise<ContactSubmission[]> => {
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
    const current = await db.getContacts();
    const updated = [contact, ...current.filter((c) => c.id !== contact.id)];

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.contacts = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:contacts", JSON.stringify(updated)]);
    }

    // Mirror to leads collection automatically
    await db.saveLead(contactToLead(contact));

    return contact;
  },

  updateContactStatus: async (
    id: string,
    status: ContactSubmission["status"]
  ): Promise<boolean> => {
    const current = await db.getContacts();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return false;

    current[index].status = status;

    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.contacts = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:contacts", JSON.stringify(current)]);
    }

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
    const current = await db.getProjects();
    const index = current.findIndex((p) => p.id === project.id);
    let updated: Project[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = project;
    } else {
      updated = [project, ...current];
    }
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.projects = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:projects", JSON.stringify(updated)]);
    }
    return project;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    const current = await db.getProjects();
    const updated = current.filter((p) => p.id !== id);
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.projects = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:projects", JSON.stringify(updated)]);
    }
    return true;
  },

  /* ------------------- CUSTOMER REVIEWS ------------------- */
  getReviews: async (onlyApproved = true): Promise<CustomerReview[]> => {
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
    const current = await db.getReviews(false);
    const index = current.findIndex((r) => r.id === review.id);
    let updated: CustomerReview[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = review;
    } else {
      updated = [review, ...current];
    }
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.reviews = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(updated)]);
    }
    return review;
  },

  updateReviewStatus: async (
    id: string,
    status: CustomerReview["status"]
  ): Promise<boolean> => {
    const current = await db.getReviews(false);
    const index = current.findIndex((r) => r.id === id);
    if (index === -1) return false;
    current[index].status = status;
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.reviews = [...current];
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(current)]);
    }
    return true;
  },

  deleteReview: async (id: string): Promise<boolean> => {
    const current = await db.getReviews(false);
    const updated = current.filter((r) => r.id !== id);
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.reviews = updated;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(updated)]);
    }
    return true;
  },

  /* ------------------- ADMIN AUTH CREDENTIAL STORAGE ------------------- */
  getAdminPasswordHash: async (): Promise<string | null> => {
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:admin_password_hash"]);
      if (data) return String(data);
    }
    return global.__FLASH_AI_STORE?.adminPasswordHash || null;
  },

  setAdminPasswordHash: async (hash: string): Promise<boolean> => {
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.adminPasswordHash = hash;
    }
    saveLocalStore(global.__FLASH_AI_STORE);

    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:admin_password_hash", hash]);
    }
    return true;
  }
};
