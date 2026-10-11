import { NextResponse } from "next/server";
import { validateAdminCredentials, signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const result = await validateAdminCredentials(String(username), String(password));

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid username or password." },
        { status: 401 }
      );
    }

    const sessionToken = signSession({
      username: String(username).trim(),
      role: "admin",
      mustChangePassword: result.mustChangePassword
    });

    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      success: true,
      user: {
        username: String(username).trim(),
        role: "admin",
        mustChangePassword: result.mustChangePassword
      },
      message: result.mustChangePassword
        ? "Logged in using initial setup credentials. Please update your password."
        : "Admin session authenticated successfully."
    });

    // Set HttpOnly, Secure (in production), SameSite cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/"
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error." },
      { status: 500 }
    );
  }
}
