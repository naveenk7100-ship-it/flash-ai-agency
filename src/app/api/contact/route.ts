import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmailAlert, sendWhatsAppAlert } from "@/lib/notifications";
import { ContactSubmission } from "@/lib/types";
import { authenticateAdminRequest } from "@/lib/auth";

// Basic IP rate limiting
const contactTimestamps = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxSubmissions = 5;

  const timestamps = contactTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxSubmissions) {
    return false;
  }

  validTimestamps.push(now);
  contactTimestamps.set(ip, validTimestamps);
  return true;
}

export async function GET(req: Request) {
  try {
    const auth = await authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const contacts = await db.getContacts();
    return NextResponse.json({
      success: true,
      count: contacts.length,
      storageType: db.getDatabaseInfo().provider,
      contacts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch contact inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many contact attempts. Please wait a minute and try again."
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, subject, message, _hp_company_fax, _submission_time } = body;

    // 2. Anti-spam honeypot detection
    if (_hp_company_fax && String(_hp_company_fax).trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Your message has been received. Our team will get back to you shortly.",
        contact: { id: "hp-filtered", name: String(name || "Guest").trim() }
      });
    }

    // 3. Minimum interaction time check
    if (_submission_time && Date.now() - Number(_submission_time) < 1200) {
      return NextResponse.json(
        {
          success: false,
          error: "Form was submitted abnormally fast. Please review your message and try again."
        },
        { status: 429 }
      );
    }

    // 4. Input validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (phone) {
      const cleanPhone = String(phone).replace(/[^\d+]/g, "");
      if (cleanPhone.length < 7 || cleanPhone.length > 18) {
        return NextResponse.json(
          {
            success: false,
            error: "Please provide a valid phone number (at least 7 digits)."
          },
          { status: 400 }
        );
      }
    }

    const newContact: ContactSubmission = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      subject: String(subject || "General Inquiry").trim(),
      message: String(message).trim(),
      source: "Website Contact Form",
      status: "unread",
      createdAt: new Date().toISOString()
    };

    // 5. Persist contact inquiry (mirrors to CRM leads)
    await db.saveContact(newContact);

    // 6. Dispatch Email & WhatsApp alerts
    const emailResult = await sendEmailAlert({
      leadName: newContact.name,
      leadEmail: newContact.email,
      serviceType: newContact.subject,
      brief: newContact.message
    });

    const whatsappResult = await sendWhatsAppAlert({
      leadName: newContact.name,
      leadEmail: newContact.email,
      serviceType: newContact.subject,
      brief: newContact.message
    });

    return NextResponse.json({
      success: true,
      contact: newContact,
      storage: {
        persisted: true,
        type: db.getDatabaseInfo().provider
      },
      notifications: {
        email: emailResult,
        whatsapp: whatsappResult
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
