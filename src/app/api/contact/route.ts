import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmailAlert, sendWhatsAppAlert } from "@/lib/notifications";
import { ContactSubmission } from "@/lib/types";

export async function GET() {
  try {
    const contacts = await db.getContacts();
    return NextResponse.json({
      success: true,
      count: contacts.length,
      storageType: db.isCloudConfigured() ? "upstash_redis" : "serverless_warm_memory",
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
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newContact: ContactSubmission = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject || "General Inquiry").trim(),
      message: String(message).trim(),
      source: "Website Contact Form",
      status: "unread",
      createdAt: new Date().toISOString()
    };

    // 1. Persist contact inquiry
    await db.saveContact(newContact);

    // 2. Dispatch real Email & WhatsApp alerts
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
        type: db.isCloudConfigured() ? "upstash_redis" : "serverless_warm_memory"
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
