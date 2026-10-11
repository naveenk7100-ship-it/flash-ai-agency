import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, status, adminKey } = body;

    // Secure authentication check
    const secret = process.env.ADMIN_SECRET_KEY || "flash-admin-2026";
    if (adminKey !== secret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid administrative credentials." },
        { status: 401 }
      );
    }

    if (action === "updateBooking") {
      const ok = await db.updateBookingStatus(id, status);
      return NextResponse.json({ success: ok });
    }

    if (action === "updateContact") {
      const ok = await db.updateContactStatus(id, status);
      return NextResponse.json({ success: ok });
    }

    if (action === "getStats") {
      const bookings = await db.getBookings();
      const contacts = await db.getContacts();
      return NextResponse.json({
        success: true,
        stats: {
          totalBookings: bookings.length,
          newBookings: bookings.filter((b) => b.status === "new").length,
          totalContacts: contacts.length,
          unreadContacts: contacts.filter((c) => c.status === "unread").length,
          storageType: db.isCloudConfigured() ? "Upstash Redis Cloud" : "Serverless In-Memory Storage",
          whatsappConfigured: Boolean(
            process.env.WHATSAPP_PHONE_ID &&
              process.env.WHATSAPP_ACCESS_TOKEN &&
              process.env.WHATSAPP_RECIPIENT_PHONE
          ),
          emailConfigured: Boolean(process.env.RESEND_API_KEY)
        },
        bookings,
        contacts
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Admin operation failed" },
      { status: 500 }
    );
  }
}
