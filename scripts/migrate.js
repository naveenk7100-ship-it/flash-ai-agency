/**
 * FLASH.Ai Agency - Standalone Database Migration Script
 * Usage: node scripts/migrate.js
 */

const fs = require("fs");
const path = require("path");

// Load .env.local if present
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!dbUrl) {
  console.error("❌ ERROR: DATABASE_URL (or POSTGRES_URL) is not set in environment or .env.local.");
  console.error("Please configure DATABASE_URL=postgresql://user:password@host/dbname in your environment or .env.local file.");
  process.exit(1);
}

// Mask secret for safe logging
let maskedHost = "remote-database";
try {
  const parsed = new URL(dbUrl);
  maskedHost = `${parsed.hostname}/${parsed.pathname.replace(/^\//, "")}`;
} catch (e) {
  maskedHost = "configured-database";
}

console.log("================================================================");
console.log(" FLASH.Ai Agency - Database Migration Runner                   ");
console.log(` Target Host: ${maskedHost}`);
console.log("================================================================\n");

async function migrate() {
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);

  try {
    console.log("1. Verifying PostgreSQL connectivity...");
    const timeRes = await sql`SELECT NOW() as current_time, version() as pg_version;`;
    console.log(`   Connected successfully! Server time: ${timeRes[0].current_time}`);

    console.log("\n2. Applying database migrations...");

    // 1. Schema migrations table
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        description TEXT
      );
    `;

    // 2. Leads table (CRM Pipeline)
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

    // 4. Contact submissions
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

    // 5. Admin Settings (Key/Value)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(128) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 6. Customer Reviews
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

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions (created_at DESC);`;

    const VERSION = "2026_10_11_01_init_schema";
    await sql`
      INSERT INTO schema_migrations (version, description)
      VALUES (${VERSION}, 'Initial production tables: leads, bookings, contact_submissions, admin_settings, customer_reviews')
      ON CONFLICT (version) DO NOTHING;
    `;

    console.log("   ✅ All tables and indexes verified successfully.");
    console.log("\n================================================================");
    console.log(" MIGRATION COMPLETED SUCCESSFULLY                               ");
    console.log("================================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Migration failed with error:", err.message);
    process.exit(1);
  }
}

migrate();
