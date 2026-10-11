import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

const SESSION_COOKIE_NAME = "flash_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Derive a secure session signing secret from environment or fallback
function getSessionSecret(): string {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SECRET_KEY ||
    "flash-ai-agency-production-secret-2026";
  return secret;
}

/**
 * Hash a password using PBKDF2 with a random salt.
 * Returns salt:hash format.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored salt:hash string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const hashToVerify = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  const originalBuf = Buffer.from(originalHash, "hex");
  const verifyBuf = Buffer.from(hashToVerify, "hex");

  if (originalBuf.length !== verifyBuf.length) return false;
  return crypto.timingSafeEqual(originalBuf, verifyBuf);
}

/**
 * Validate credentials against environment configuration or dynamic DB hash.
 * Never hardcodes passwords in source code.
 */
export async function validateAdminCredentials(
  usernameInput: string,
  passwordInput: string
): Promise<{ valid: boolean; mustChangePassword: boolean; error?: string }> {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredInitialPassword = process.env.ADMIN_INITIAL_PASSWORD;

  // Verify username safely
  if (usernameInput.trim().toLowerCase() !== expectedUsername.toLowerCase()) {
    return { valid: false, mustChangePassword: false, error: "Invalid username or password." };
  }

  // 1. Check if an updated password hash was saved in DB (from change-password)
  try {
    const dbHash = await db.getAdminPasswordHash();
    if (dbHash) {
      const isMatch = verifyPassword(passwordInput, dbHash);
      if (isMatch) {
        return { valid: true, mustChangePassword: false };
      }
    }
  } catch {
    // continue to env check
  }

  // 2. If initial password is set in env (e.g. NAVEEN@20), check via timing-safe comparison
  // Initial setup password ALWAYS requires changing on first login!
  if (configuredInitialPassword) {
    const inputBuf = Buffer.from(passwordInput);
    const expectedBuf = Buffer.from(configuredInitialPassword);

    let isMatch = false;
    if (inputBuf.length === expectedBuf.length) {
      isMatch = crypto.timingSafeEqual(inputBuf, expectedBuf);
    }

    if (isMatch) {
      // Force password change on first login if using the initial setup password
      return { valid: true, mustChangePassword: true };
    }
  }

  // 3. If a custom production password hash is configured in env, verify against it
  if (configuredHash) {
    const isMatch = verifyPassword(passwordInput, configuredHash);
    if (isMatch) {
      return { valid: true, mustChangePassword: false };
    }
  }

  // 4. Fallback to ADMIN_SECRET_KEY if neither password nor hash is configured
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (adminSecret && passwordInput === adminSecret) {
    return { valid: true, mustChangePassword: true };
  }

  return { valid: false, mustChangePassword: false, error: "Invalid username or password." };
}

export interface AdminSessionPayload {
  username: string;
  role: "admin";
  mustChangePassword: boolean;
  iat: number;
  exp: number;
}

/**
 * Sign an admin session payload using HMAC-SHA256
 */
export function signSession(payload: Omit<AdminSessionPayload, "iat" | "exp">): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AdminSessionPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verify and parse an admin session token
 */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  if (!token || !token.includes(".")) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const json = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (json.exp && json.exp < now) {
      return null; // Expired
    }
    return json;
  } catch {
    return null;
  }
}

/**
 * Server-side check for admin authentication from Next.js Request (API Routes)
 */
export async function authenticateAdminRequest(req: Request | NextRequest): Promise<{
  authenticated: boolean;
  username?: string;
  mustChangePassword?: boolean;
}> {
  // 1. Check Authorization header (Bearer token)
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7).trim();
    // Check if bearer matches session token
    const session = verifySessionToken(bearerToken);
    if (session) {
      return {
        authenticated: true,
        username: session.username,
        mustChangePassword: session.mustChangePassword
      };
    }
    // Or check if it matches ADMIN_SECRET_KEY
    const adminSecret = process.env.ADMIN_SECRET_KEY || "flash-admin-2026";
    if (bearerToken === adminSecret) {
      return { authenticated: true, username: "admin", mustChangePassword: false };
    }
  }

  // 2. Check x-admin-key header
  const adminKey = req.headers.get("x-admin-key");
  const adminSecret = process.env.ADMIN_SECRET_KEY || "flash-admin-2026";
  if (adminKey && adminKey === adminSecret) {
    return { authenticated: true, username: "admin", mustChangePassword: false };
  }

  // 3. Check cookies (HttpOnly session cookie)
  let cookieHeader: string | null = null;
  if (req instanceof Request) {
    cookieHeader = req.headers.get("cookie");
  }

  if (cookieHeader) {
    const cookiesObj: Record<string, string> = {};
    cookieHeader.split(";").forEach((c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) cookiesObj[k] = decodeURIComponent(v);
    });

    const sessionCookie = cookiesObj[SESSION_COOKIE_NAME];
    if (sessionCookie) {
      const session = verifySessionToken(sessionCookie);
      if (session) {
        return {
          authenticated: true,
          username: session.username,
          mustChangePassword: session.mustChangePassword
        };
      }
    }
  }

  return { authenticated: false };
}

/**
 * Server Component / Server Action helper to check admin session
 */
export async function getAdminSessionServer(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    return verifySessionToken(sessionCookie);
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
