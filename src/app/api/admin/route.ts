import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AGENCY_SERVICES } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, adminKey } = body;

    // 1. Server-side Secret Verification
    const secret = process.env.ADMIN_SECRET_KEY || "flash-admin-2026";
    if (adminKey !== secret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid administrative credentials." },
        { status: 401 }
      );
    }

    // 2. Fetch full dashboard stats
    if (action === "getStats") {
      const bookings = await db.getBookings();
      const contacts = await db.getContacts();
      const projects = await db.getProjects();
      const reviews = await db.getReviews(false); // get ALL reviews including pending

      return NextResponse.json({
        success: true,
        stats: {
          totalBookings: bookings.length,
          newBookings: bookings.filter((b) => b.status === "New").length,
          totalContacts: contacts.length,
          unreadContacts: contacts.filter((c) => c.status === "unread").length,
          totalProjects: projects.length,
          pendingReviews: reviews.filter((r) => r.status === "pending").length,
          storageType: db.isCloudConfigured() ? "Upstash Redis Cloud" : "Persistent Serverless Store",
          whatsappConfigured: Boolean(
            process.env.WHATSAPP_PHONE_ID &&
              process.env.WHATSAPP_ACCESS_TOKEN &&
              process.env.WHATSAPP_RECIPIENT_PHONE
          ),
          emailConfigured: Boolean(process.env.RESEND_API_KEY)
        },
        bookings,
        contacts,
        projects,
        reviews,
        services: AGENCY_SERVICES
      });
    }

    // 3. Update Booking Status / Internal Notes
    if (action === "updateBooking") {
      const { id, status, notes } = body;
      const updates: any = {};
      if (status) updates.status = status;
      if (notes !== undefined) updates.notes = notes;
      const ok = await db.updateBooking(id, updates);
      return NextResponse.json({ success: ok });
    }

    // 4. Update Contact Status
    if (action === "updateContact") {
      const { id, status } = body;
      const ok = await db.updateContactStatus(id, status);
      return NextResponse.json({ success: ok });
    }

    // 5. Review Approval / Rejection / Deletion
    if (action === "updateReviewStatus") {
      const { id, status } = body;
      const ok = await db.updateReviewStatus(id, status);
      return NextResponse.json({ success: ok });
    }

    if (action === "deleteReview") {
      const { id } = body;
      const ok = await db.deleteReview(id);
      return NextResponse.json({ success: ok });
    }

    // 6. Project Management (Create / Update / Delete)
    if (action === "saveProject") {
      const { project } = body;
      if (!project || !project.id || !project.name) {
        return NextResponse.json(
          { success: false, error: "Project must include an ID and Name." },
          { status: 400 }
        );
      }
      const saved = await db.saveProject(project);
      return NextResponse.json({ success: true, project: saved });
    }

    if (action === "deleteProject") {
      const { id } = body;
      const ok = await db.deleteProject(id);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: "Unknown action requested." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Admin operation failed." },
      { status: 500 }
    );
  }
}
