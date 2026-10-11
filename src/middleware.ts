import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("flash_admin_session")?.value;

  // 1. Protect all /admin pages (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!sessionCookie || !sessionCookie.includes(".")) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. If already logged in and visiting /admin/login, redirect to /admin
  if (pathname === "/admin/login") {
    if (sessionCookie && sessionCookie.includes(".")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // 3. Protect internal /api/admin/* and /api/leads/* routes
  // (Note: /api/admin/login is allowed for public authentication)
  if (
    (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) ||
    pathname.startsWith("/api/leads")
  ) {
    const authHeader = req.headers.get("authorization");
    const adminKeyHeader = req.headers.get("x-admin-key");

    if (!sessionCookie && !authHeader && !adminKeyHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative session required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/leads/:path*"
  ]
};
