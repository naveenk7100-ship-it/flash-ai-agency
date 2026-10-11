import { BookingSubmission, ContactSubmission } from "./types";

/**
 * Storage Abstraction for FLASH.Ai Agency
 * - Supports Upstash Redis / KV if UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are set.
 * - Falls back to a persistent in-memory global state across serverless warm invocations during development.
 * - Complies with requirements: Never relies purely on transient local filesystem in serverless production without logging configuration status.
 */

declare global {
  // eslint-disable-next-line no-var
  var __FLASH_AI_STORE:
    | {
        bookings: BookingSubmission[];
        contacts: ContactSubmission[];
      }
    | undefined;
}

if (!global.__FLASH_AI_STORE) {
  global.__FLASH_AI_STORE = {
    bookings: [
      {
        id: "book-sample-01",
        fullName: "Alex Rivera",
        email: "alex@nexustech.io",
        phone: "+1 415 890 2341",
        company: "Nexus Automation",
        serviceId: "autonomous-ai-agents",
        preferredDate: "2026-10-18",
        preferredTime: "15:00 UTC",
        budgetRange: "$2,500 - $5,000",
        projectBrief: "Looking to deploy a multi-model social media engine similar to FLASH.Ai Social for our B2B tech clients.",
        status: "scheduled",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    contacts: [
      {
        id: "contact-sample-01",
        name: "Devon Vance",
        email: "devon@vancemedia.co",
        subject: "Video Inpainting Pipeline Integration",
        message: "Hi FLASH.Ai team, we saw the CleanCut AI demo and would like to consult on integrating Navier-Stokes PDE inpainting into our studio workflow.",
        source: "Contact Form",
        status: "read",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ]
  };
}

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(command: string[]): Promise<any> {
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

  getBookings: async (): Promise<BookingSubmission[]> => {
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:bookings"]);
      if (data) {
        try {
          return typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore error
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

  updateBookingStatus: async (
    id: string,
    status: BookingSubmission["status"]
  ): Promise<boolean> => {
    const current = await db.getBookings();
    const index = current.findIndex((b) => b.id === id);
    if (index === -1) return false;
    current[index].status = status;
    if (global.__FLASH_AI_STORE) {
      global.__FLASH_AI_STORE.bookings = [...current];
    }
    if (REDIS_URL && REDIS_TOKEN) {
      await redisCommand(["SET", "flash_ai:bookings", JSON.stringify(current)]);
    }
    return true;
  },

  getContacts: async (): Promise<ContactSubmission[]> => {
    if (REDIS_URL && REDIS_TOKEN) {
      const data = await redisCommand(["GET", "flash_ai:contacts"]);
      if (data) {
        try {
          return typeof data === "string" ? JSON.parse(data) : data;
        } catch {
          // ignore error
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
  }
};
