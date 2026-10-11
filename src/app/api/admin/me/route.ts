import { NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const auth = await authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { authenticated: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: auth.username || "admin",
        role: "admin",
        mustChangePassword: Boolean(auth.mustChangePassword)
      },
      dbInfo: db.getDatabaseInfo()
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message || "Session verification failed." },
      { status: 500 }
    );
  }
}
