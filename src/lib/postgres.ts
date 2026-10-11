import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { BookingSubmission, ContactSubmission, CustomerReview, Lead, LeadStatus } from "./types";

/**
 * FLASH.Ai Agency - Production-Grade PostgreSQL Adapter (Neon Serverless)
 * 
 * Security & Reliability Policies:
 * 1. Reads connection URL strictly from environment variables (DATABASE_URL / POSTGRES_URL).
 * 2. Never hardcodes, exposes, or logs database credentials.
 * 3. Parameterized queries for 100% SQL-injection resistance.
 * 4. Production writes fail safely with clear errors; no silent fallback to RAM.
 */

function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return null;
  }
  return url.trim();
}

export function isPostgresConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

/**
 * Returns sanitized host information for diagnostics without exposing credentials.
 */
export function getSanitizedDbInfo(): { configured: boolean; host?: string; database?: string } {
  const urlStr = getDatabaseUrl();
  if (!urlStr) {
    return { configured: false };
  }

  try {
    const parsed = new URL(urlStr);
    return {
      configured: true,
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, "")
    };
  } catch {
    return {
      configured: true,
      host: "custom_connection_string"
    };
  }
}

// Memoized SQL client instance
let cachedSql: NeonQueryFunction<false, false> | null = null;
let migrationPromise: Promise<boolean> | null = null;

export function getSqlClient(): NeonQueryFunction<false, false> {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "PostgreSQL connection string is missing. Please set DATABASE_URL or POSTGRES_URL in environment variables."
    );
  }

  if (!cachedSql) {
    cachedSql = neon(url);
  }
  return cachedSql;
}

/**
 * Migration definition and execution
 */
export const SCHEMA_VERSION = "2026_10_11_01_init_schema";

export async function runMigrations(): Promise<{ success: boolean; message: string }> {
  const sql = getSqlClient();

  try {
    // 1. Schema migrations tracker
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        description TEXT
      );
    `;

    // 2. Leads table (Unified CRM Pipeline)
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(64) PRIMARY KEY,
        type VARCHAR(32) NOT NULL DEFAULT 'booking',
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) DEFAULT '',
        service VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        company VARCHAR(255),
        budget VARCHAR(128),
        preferred_date VARCHAR(64),
        status VARCHAR(64) NOT NULL DEFAULT 'New',
        notes TEXT,
        source VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 3. Bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        company VARCHAR(255),
        website VARCHAR(255),
        service_id VARCHAR(128) NOT NULL,
        preferred_date VARCHAR(64) NOT NULL,
        preferred_time VARCHAR(64) NOT NULL,
        timezone VARCHAR(64),
        budget_range VARCHAR(128) NOT NULL,
        project_brief TEXT NOT NULL,
        reference_links TEXT,
        status VARCHAR(64) NOT NULL DEFAULT 'New',
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 4. Contact Submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        source VARCHAR(128) DEFAULT 'Contact Page',
        status VARCHAR(64) NOT NULL DEFAULT 'unread',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 5. Admin Settings table (Key/Value store for password hashes and system config)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(128) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 6. Customer Reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS customer_reviews (
        id VARCHAR(64) PRIMARY KEY,
        reviewer_name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(128),
        rating INTEGER NOT NULL DEFAULT 5,
        review_text TEXT NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'approved',
        date VARCHAR(64) NOT NULL,
        verified_client BOOLEAN NOT NULL DEFAULT true,
        service_id VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 7. Performance Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions (created_at DESC);`;

    // Record migration version
    await sql`
      INSERT INTO schema_migrations (version, description)
      VALUES (${SCHEMA_VERSION}, 'Initial production tables: leads, bookings, contact_submissions, admin_settings, customer_reviews')
      ON CONFLICT (version) DO NOTHING;
    `;

    return { success: true, message: "Migrations applied successfully." };
  } catch (err: any) {
    console.error("[PostgreSQL Migration Error]", err.message);
    throw new Error(`Database migration failed: ${err.message}`);
  }
}

/**
 * Ensures schema exists before executing queries
 */
export async function ensureSchemaReady(): Promise<void> {
  if (!isPostgresConfigured()) return;
  if (!migrationPromise) {
    migrationPromise = runMigrations().then(() => true).catch((err) => {
      migrationPromise = null;
      throw err;
    });
  }
  await migrationPromise;
}

/* ------------------- LEADS (CRM) CRUD ------------------- */

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    type: r.type,
    name: r.name,
    email: r.email,
    phone: r.phone || "",
    service: r.service,
    message: r.message,
    company: r.company || undefined,
    budget: r.budget || undefined,
    preferredDate: r.preferred_date || undefined,
    status: r.status as LeadStatus,
    notes: r.notes || undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    source: r.source || undefined
  };
}

export async function pgGetLeads(): Promise<Lead[]> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const rows = await sql`
    SELECT * FROM leads ORDER BY created_at DESC;
  `;
  return rows.map(rowToLead);
}

export async function pgSaveLead(lead: Lead): Promise<Lead> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const createdAt = lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString();

  await sql`
    INSERT INTO leads (
      id, type, name, email, phone, service, message,
      company, budget, preferred_date, status, notes, source, created_at, updated_at
    ) VALUES (
      ${lead.id}, ${lead.type}, ${lead.name}, ${lead.email}, ${lead.phone || ""},
      ${lead.service}, ${lead.message}, ${lead.company || null}, ${lead.budget || null},
      ${lead.preferredDate || null}, ${lead.status}, ${lead.notes || null},
      ${lead.source || null}, ${createdAt}, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      type = EXCLUDED.type,
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      service = EXCLUDED.service,
      message = EXCLUDED.message,
      company = EXCLUDED.company,
      budget = EXCLUDED.budget,
      preferred_date = EXCLUDED.preferred_date,
      status = EXCLUDED.status,
      notes = EXCLUDED.notes,
      source = EXCLUDED.source,
      updated_at = NOW();
  `;

  return lead;
}

export async function pgUpdateLead(id: string, updates: Partial<Lead>): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();

  // Fetch current
  const existing = await sql`SELECT * FROM leads WHERE id = ${id} LIMIT 1;`;
  if (existing.length === 0) return false;

  const current = existing[0];
  const newStatus = updates.status !== undefined ? updates.status : current.status;
  const newNotes = updates.notes !== undefined ? updates.notes : current.notes;
  const newName = updates.name !== undefined ? updates.name : current.name;
  const newEmail = updates.email !== undefined ? updates.email : current.email;
  const newPhone = updates.phone !== undefined ? updates.phone : current.phone;
  const newService = updates.service !== undefined ? updates.service : current.service;
  const newMessage = updates.message !== undefined ? updates.message : current.message;
  const newCompany = updates.company !== undefined ? updates.company : current.company;
  const newBudget = updates.budget !== undefined ? updates.budget : current.budget;

  await sql`
    UPDATE leads SET
      status = ${newStatus},
      notes = ${newNotes},
      name = ${newName},
      email = ${newEmail},
      phone = ${newPhone},
      service = ${newService},
      message = ${newMessage},
      company = ${newCompany},
      budget = ${newBudget},
      updated_at = NOW()
    WHERE id = ${id};
  `;

  // Mirror back to bookings table if booking
  if (current.type === "booking" && (updates.status || updates.notes)) {
    await sql`
      UPDATE bookings SET
        status = ${newStatus},
        notes = ${newNotes},
        updated_at = NOW()
      WHERE id = ${id};
    `;
  }

  return true;
}

export async function pgDeleteLead(id: string): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const res = await sql`DELETE FROM leads WHERE id = ${id} RETURNING id;`;
  return res.length > 0;
}

/* ------------------- BOOKINGS CRUD ------------------- */

function rowToBooking(r: any): BookingSubmission {
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone || undefined,
    company: r.company || undefined,
    website: r.website || undefined,
    serviceId: r.service_id,
    preferredDate: r.preferred_date,
    preferredTime: r.preferred_time,
    timezone: r.timezone || undefined,
    budgetRange: r.budget_range,
    projectBrief: r.project_brief,
    referenceLinks: r.reference_links || undefined,
    status: r.status,
    notes: r.notes || undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at)
  };
}

export async function pgGetBookings(): Promise<BookingSubmission[]> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const rows = await sql`
    SELECT * FROM bookings ORDER BY created_at DESC;
  `;
  return rows.map(rowToBooking);
}

export async function pgSaveBooking(b: BookingSubmission): Promise<BookingSubmission> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const createdAt = b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString();

  // Save in bookings table
  await sql`
    INSERT INTO bookings (
      id, full_name, email, phone, company, website,
      service_id, preferred_date, preferred_time, timezone,
      budget_range, project_brief, reference_links, status, notes,
      created_at, updated_at
    ) VALUES (
      ${b.id}, ${b.fullName}, ${b.email}, ${b.phone || null}, ${b.company || null}, ${b.website || null},
      ${b.serviceId}, ${b.preferredDate}, ${b.preferredTime}, ${b.timezone || null},
      ${b.budgetRange}, ${b.projectBrief}, ${b.referenceLinks || null}, ${b.status}, ${b.notes || null},
      ${createdAt}, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      company = EXCLUDED.company,
      website = EXCLUDED.website,
      service_id = EXCLUDED.service_id,
      preferred_date = EXCLUDED.preferred_date,
      preferred_time = EXCLUDED.preferred_time,
      timezone = EXCLUDED.timezone,
      budget_range = EXCLUDED.budget_range,
      project_brief = EXCLUDED.project_brief,
      reference_links = EXCLUDED.reference_links,
      status = EXCLUDED.status,
      notes = EXCLUDED.notes,
      updated_at = NOW();
  `;

  // Synchronize to unified leads CRM table
  const lead: Lead = {
    id: b.id,
    type: "booking",
    name: b.fullName,
    email: b.email,
    phone: b.phone || "",
    service: b.serviceId,
    message: b.projectBrief,
    company: b.company,
    budget: b.budgetRange,
    preferredDate: b.preferredDate,
    status: b.status === "Won" ? "Converted" : b.status === "Lost" ? "Archived" : (b.status as any),
    notes: b.notes,
    createdAt: createdAt,
    source: "Booking System"
  };

  await pgSaveLead(lead);

  return b;
}

export async function pgUpdateBooking(id: string, updates: Partial<BookingSubmission>): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();

  const existing = await sql`SELECT * FROM bookings WHERE id = ${id} LIMIT 1;`;
  if (existing.length === 0) return false;

  const current = existing[0];
  const newStatus = updates.status !== undefined ? updates.status : current.status;
  const newNotes = updates.notes !== undefined ? updates.notes : current.notes;

  await sql`
    UPDATE bookings SET
      status = ${newStatus},
      notes = ${newNotes},
      updated_at = NOW()
    WHERE id = ${id};
  `;

  // Mirror to leads table
  await sql`
    UPDATE leads SET
      status = ${newStatus},
      notes = ${newNotes},
      updated_at = NOW()
    WHERE id = ${id};
  `;

  return true;
}

/* ------------------- CONTACTS CRUD ------------------- */

function rowToContact(r: any): ContactSubmission {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || undefined,
    subject: r.subject,
    message: r.message,
    source: r.source || undefined,
    status: r.status as ContactSubmission["status"],
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at)
  };
}

export async function pgGetContacts(): Promise<ContactSubmission[]> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const rows = await sql`
    SELECT * FROM contact_submissions ORDER BY created_at DESC;
  `;
  return rows.map(rowToContact);
}

export async function pgSaveContact(c: ContactSubmission): Promise<ContactSubmission> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const createdAt = c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString();

  await sql`
    INSERT INTO contact_submissions (
      id, name, email, phone, subject, message, source, status, created_at, updated_at
    ) VALUES (
      ${c.id}, ${c.name}, ${c.email}, ${c.phone || null}, ${c.subject},
      ${c.message}, ${c.source || "Contact Page"}, ${c.status || "unread"},
      ${createdAt}, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      subject = EXCLUDED.subject,
      message = EXCLUDED.message,
      source = EXCLUDED.source,
      status = EXCLUDED.status,
      updated_at = NOW();
  `;

  // Mirror to leads CRM table
  const lead: Lead = {
    id: c.id,
    type: "contact",
    name: c.name,
    email: c.email,
    phone: c.phone || "",
    service: c.subject,
    message: c.message,
    status: c.status === "replied" ? "Contacted" : "New",
    createdAt: createdAt,
    source: c.source || "Contact Form"
  };

  await pgSaveLead(lead);

  return c;
}

export async function pgUpdateContactStatus(
  id: string,
  status: ContactSubmission["status"]
): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const res = await sql`
    UPDATE contact_submissions SET
      status = ${status},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id;
  `;
  return res.length > 0;
}

/* ------------------- ADMIN SETTINGS & CREDENTIALS ------------------- */

export async function pgGetAdminSetting(key: string): Promise<string | null> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const rows = await sql`
    SELECT value FROM admin_settings WHERE key = ${key} LIMIT 1;
  `;
  return rows.length > 0 ? rows[0].value : null;
}

export async function pgSetAdminSetting(key: string, value: string): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  await sql`
    INSERT INTO admin_settings (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = NOW();
  `;
  return true;
}

export async function pgDeleteAdminSetting(key: string): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const res = await sql`
    DELETE FROM admin_settings WHERE key = ${key} RETURNING key;
  `;
  return res.length > 0;
}

export async function pgGetAdminPasswordHash(): Promise<string | null> {
  return pgGetAdminSetting("admin_password_hash");
}

export async function pgSetAdminPasswordHash(hash: string): Promise<boolean> {
  return pgSetAdminSetting("admin_password_hash", hash);
}

/* ------------------- CUSTOMER REVIEWS CRUD ------------------- */

function rowToReview(r: any): CustomerReview {
  return {
    id: r.id,
    reviewerName: r.reviewer_name,
    company: r.company,
    role: r.role || undefined,
    rating: Number(r.rating),
    reviewText: r.review_text,
    status: r.status as CustomerReview["status"],
    date: r.date,
    verifiedClient: Boolean(r.verified_client),
    serviceId: r.service_id || undefined
  };
}

export async function pgGetReviews(onlyApproved = true): Promise<CustomerReview[]> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const rows = onlyApproved
    ? await sql`SELECT * FROM customer_reviews WHERE status = 'approved' ORDER BY created_at DESC;`
    : await sql`SELECT * FROM customer_reviews ORDER BY created_at DESC;`;
  return rows.map(rowToReview);
}

export async function pgSaveReview(review: CustomerReview): Promise<CustomerReview> {
  await ensureSchemaReady();
  const sql = getSqlClient();

  await sql`
    INSERT INTO customer_reviews (
      id, reviewer_name, company, role, rating, review_text, status, date, verified_client, service_id, created_at
    ) VALUES (
      ${review.id}, ${review.reviewerName}, ${review.company}, ${review.role || null},
      ${review.rating}, ${review.reviewText}, ${review.status}, ${review.date},
      ${review.verifiedClient}, ${review.serviceId || null}, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      reviewer_name = EXCLUDED.reviewer_name,
      company = EXCLUDED.company,
      role = EXCLUDED.role,
      rating = EXCLUDED.rating,
      review_text = EXCLUDED.review_text,
      status = EXCLUDED.status,
      date = EXCLUDED.date,
      verified_client = EXCLUDED.verified_client,
      service_id = EXCLUDED.service_id;
  `;

  return review;
}

export async function pgUpdateReviewStatus(
  id: string,
  status: CustomerReview["status"]
): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const res = await sql`
    UPDATE customer_reviews SET status = ${status} WHERE id = ${id} RETURNING id;
  `;
  return res.length > 0;
}

export async function pgDeleteReview(id: string): Promise<boolean> {
  await ensureSchemaReady();
  const sql = getSqlClient();
  const res = await sql`
    DELETE FROM customer_reviews WHERE id = ${id} RETURNING id;
  `;
  return res.length > 0;
}
