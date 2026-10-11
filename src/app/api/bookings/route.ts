import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWhatsAppAlert, sendEmailAlert } from "@/lib/notifications";
import { BookingSubmission } from "@/lib/types";

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
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      company,
      serviceId,
      preferredDate,
      preferredTime,
      budgetRange,
      projectBrief
    } = body;

    if (!fullName || !email || !serviceId || !projectBrief) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: fullName, email, serviceId, and projectBrief are required."
        },
        { status: 400 }
      );
    }

    const newBooking: BookingSubmission = {
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      company: company ? String(company).trim() : undefined,
      serviceId: String(serviceId),
      preferredDate: preferredDate || new Date().toISOString().split("T")[0],
      preferredTime: preferredTime || "Flexible",
      budgetRange: budgetRange || "$1,200 - $3,000",
      projectBrief: String(projectBrief).trim(),
      status: "new",
      createdAt: new Date().toISOString()
    };

    // 1. Persist booking
    await db.saveBooking(newBooking);

    // 2. Dispatch real WhatsApp alert (strictly non-fake)
    const whatsappResult = await sendWhatsAppAlert({
      leadName: newBooking.fullName,
      leadEmail: newBooking.email,
      serviceType: newBooking.serviceId,
      brief: newBooking.projectBrief
    });

    // 3. Dispatch real Email alert (strictly non-fake)
    const emailResult = await sendEmailAlert({
      leadName: newBooking.fullName,
      leadEmail: newBooking.email,
      serviceType: newBooking.serviceId,
      brief: newBooking.projectBrief
    });

    return NextResponse.json({
      success: true,
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
