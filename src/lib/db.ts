import { BookingSubmission, ContactSubmission, CustomerReview, Project } from "./types";
import { INITIAL_PROJECTS } from "./data";

/**
 * Storage Abstraction for Flash.ai Agency
 * - Durable cloud storage via Upstash Redis (when UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are set)
 * - Persistent global in-memory store across warm serverless invocations for local dev
 * - Manages Bookings, Contacts, Projects (dynamic portfolio), and Customer Reviews
 */

declare global {
  // eslint-disable-next-line no-var
  var __FLASH_AI_STORE:
    | {
        bookings: BookingSubmission[];
        contacts: ContactSubmission[];
        projects: Project[];
        reviews: CustomerReview[];
      }
    | undefined;
}

if (!global.__FLASH_AI_STORE) {
  global.__FLASH_AI_STORE = {
    bookings: [
      {
        id: "book-sample-01",
        fullName: "Marcus Sterling",
        email: "marcus@sterlingrealty.co.uk",
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
    ],
    contacts: [
      {
        id: "contact-sample-01",
        name: "Arthur Pendelton",
        email: "arthur@apexpartners.com.au",
        subject: "AI Workflow Assessment for Sydney Office",
        message:
          "Hello Flash.ai team, we are interested in auditing our client onboarding workflow to evaluate where custom AI agents could eliminate repetitive data entry.",
        source: "Contact Page",
        status: "read",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ],
    projects: [...INITIAL_PROJECTS],
    reviews: [] // Authentic: Initially empty as per policy "Only publish authentic, authorized reviews. Never generate fake testimonials."
  };
}

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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
      console.error("Redis command failed:", await res.text());
      return null;
    }
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("Redis error:", err);
    return null;
  }
}

export const db = {
  isCloudConfigured: (): boolean => {
    return Boolean(REDIS_URL && REDIS_TOKEN);
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
    const updated = [booking, ...current];
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.bookings = updated;
    }
    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:bookings", JSON.stringify(updated)]);
    }
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
    const updated = [contact, ...current];
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.contacts = updated;
    }
    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:contacts", JSON.stringify(updated)]);
    }
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
    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:reviews", JSON.stringify(updated)]);
    }
    return true;
  }
};
