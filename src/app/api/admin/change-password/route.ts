import { NextResponse } from "next/server";
import {
  authenticateAdminRequest,
  validateAdminCredentials,
  hashPassword,
  signSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const auth = await authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Verify current password
    const username = auth.username || process.env.ADMIN_USERNAME || "admin";
    const verification = await validateAdminCredentials(username, String(currentPassword));
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: "Current password does not match our records." },
        { status: 400 }
      );
    }

    // Hash new password and save in database
    const newHash = hashPassword(String(newPassword));
    await db.setAdminPasswordHash(newHash);

    // Issue updated session with mustChangePassword = false
    const newSessionToken = signSession({
      username,
      role: "admin",
      mustChangePassword: false
    });

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully. All subsequent logins must use your new password."
    });

    response.cookies.set(SESSION_COOKIE_NAME, newSessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/"
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to change password." },
      { status: 500 }
    );
  }
}
