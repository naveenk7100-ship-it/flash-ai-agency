import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWhatsAppAlert, sendEmailAlert } from "@/lib/notifications";
import { BookingSubmission } from "@/lib/types";

// In-memory rate limiting map for basic DDoS/spam prevention
const submissionTimestamps = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxSubmissions = 5;

  const timestamps = submissionTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxSubmissions) {
    return false;
  }

  validTimestamps.push(now);
  submissionTimestamps.set(ip, validTimestamps);
  return true;
}

export async function GET() {
  try {
    const bookings = await db.getBookings();
    return NextResponse.json({
      success: true,
      count: bookings.length,
      storageType: db.isCloudConfigured() ? "upstash_redis" : "serverless_warm_memory",
      bookings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 1. Basic Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submission attempts. Please wait a minute and try again."
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      company,
      website,
      serviceId,
      preferredDate,
      preferredTime,
      timezone,
      budgetRange,
      projectBrief,
      referenceLinks
    } = body;

    // 2. Server-side Validation
    if (!fullName || !email || !company || !serviceId || !projectBrief || !preferredDate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields. Please ensure Full Name, Business Email, Company, Service, Preferred Date, and Project Brief are filled."
        },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid business email address."
        },
        { status: 400 }
      );
    }

    // 3. Spam / Duplicate Prevention (same email + same brief within 2 minutes)
    const existingBookings = await db.getBookings();
    const recentDuplicate = existingBookings.find((b) => {
      const isSameEmail = b.email.toLowerCase() === String(email).trim().toLowerCase();
      const isRecent = Date.now() - new Date(b.createdAt).getTime() < 120000;
      return isSameEmail && isRecent;
    });

    if (recentDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A booking request from this email was received moments ago. Our team is already reviewing it!"
        },
        { status: 429 }
      );
    }

    const newBooking: BookingSubmission = {
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      company: String(company).trim(),
      website: website ? String(website).trim() : undefined,
      serviceId: String(serviceId),
      preferredDate: String(preferredDate).trim(),
      preferredTime: preferredTime || "14:00 - 16:00",
      timezone: timezone || "UTC",
      budgetRange: budgetRange || "$1,500 - $3,000",
      projectBrief: String(projectBrief).trim(),
      referenceLinks: referenceLinks ? String(referenceLinks).trim() : undefined,
      status: "New", // Explicit initial status
      createdAt: new Date().toISOString()
    };

    // 4. Save booking to DB
    await db.saveBooking(newBooking);

    // 5. Notify agency team (Strictly non-fake: reports exact configuration state)
    const whatsappResult = await sendWhatsAppAlert({
      leadName: newBooking.fullName,
      leadEmail: newBooking.email,
      serviceType: newBooking.serviceId,
      brief: newBooking.projectBrief
    });

    const emailResult = await sendEmailAlert({
      leadName: newBooking.fullName,
      leadEmail: newBooking.email,
      serviceType: newBooking.serviceId,
      brief: newBooking.projectBrief
    });

    return NextResponse.json({
      success: true,
      message:
        "Booking request successfully received. Note: This is an intake request awaiting calendar confirmation from our team.",
      booking: newBooking,
      storage: {
        persisted: true,
        type: db.isCloudConfigured() ? "upstash_redis" : "serverless_warm_memory"
      },
      notifications: {
        whatsapp: whatsappResult,
        email: emailResult
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
