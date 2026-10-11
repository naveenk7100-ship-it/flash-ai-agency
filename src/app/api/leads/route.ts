import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateAdminRequest } from "@/lib/auth";
import { LeadStatus } from "@/lib/types";

/**
 * Lead Management API
 * Protected with server-side authentication
 */

export async function GET(req: Request) {
  try {
    const auth = await authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const status = searchParams.get("status") || "all";
    const service = searchParams.get("service") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

    let leads = await db.getLeads();

    // 1. Text Search
    if (query) {
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query) ||
          l.phone.toLowerCase().includes(query) ||
          (l.company && l.company.toLowerCase().includes(query)) ||
          l.message.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (status !== "all") {
      leads = leads.filter((l) => l.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Service Filter
    if (service !== "all") {
      leads = leads.filter((l) => l.service.toLowerCase().includes(service.toLowerCase()));
    }

    const total = leads.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedLeads = leads.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      leads: paginatedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      dbInfo: db.getDatabaseInfo()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leads." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required." },
        { status: 400 }
      );
    }

    const updates: Partial<{ status: LeadStatus; notes: string }> = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = String(notes);

    const ok = await db.updateLead(id, updates);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead updated successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update lead." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required." },
        { status: 400 }
      );
    }

    const ok = await db.deleteLead(id);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete lead." },
      { status: 500 }
    );
  }
}
