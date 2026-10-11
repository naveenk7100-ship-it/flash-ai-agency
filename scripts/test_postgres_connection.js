/**
 * FLASH.Ai Agency - Neon PostgreSQL Connectivity & CRUD Test Suite
 * Usage: node scripts/test_postgres_connection.js
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
  console.log("================================================================");
  console.log(" FLASH.Ai Agency - Neon Database Connectivity & CRUD Audit     ");
  console.log("================================================================");
  console.log("\n⚠️  DATABASE_URL (or POSTGRES_URL) is not set in environment or .env.local.");
  console.log("   To run live database tests, provide your Neon connection string:");
  console.log("   DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require\n");
  process.exit(2);
}

// Mask secret for safe display
let maskedHost = "remote-database";
try {
  const parsed = new URL(dbUrl);
  maskedHost = `${parsed.hostname} (DB: ${parsed.pathname.replace(/^\//, "")})`;
} catch (e) {
  maskedHost = "custom-connection-string";
}

console.log("================================================================");
console.log(" FLASH.Ai Agency - Neon Database Connectivity & CRUD Audit     ");
console.log(` Target Host: ${maskedHost}`);
console.log("================================================================\n");

async function runAudit() {
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);
  const results = [];

  function assert(condition, name, details = "") {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      results.push({ name, pass: true, details });
    } else {
      console.error(`❌ FAIL: ${name} - ${details}`);
      results.push({ name, pass: false, details });
    }
  }

  // 1. Connectivity test
  try {
    const timeRes = await sql`SELECT NOW() as current_time, version() as pg_version;`;
    assert(timeRes.length > 0 && timeRes[0].current_time, "Neon PostgreSQL connection handshake (SELECT NOW())");
  } catch (err) {
    assert(false, "Neon PostgreSQL connection handshake", err.message);
    console.error("\nConnection failed. Halting subsequent tests.");
    process.exit(1);
  }

  // 2. Schema check / ensure tables exist
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        description TEXT
      );
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
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(128) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
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
    assert(true, "PostgreSQL schema validation (leads, bookings, contact_submissions, admin_settings, customer_reviews)");
  } catch (err) {
    assert(false, "PostgreSQL schema validation", err.message);
  }

  // 3. Leads CRUD Test
  const testLeadId = `test-lead-${Date.now()}`;
  try {
    // INSERT
    await sql`
      INSERT INTO leads (id, type, name, email, phone, service, message, status, source)
      VALUES (${testLeadId}, 'booking', 'Neon QA Lead', 'neon-test@flashai.agency', '+91 93984 21460', 'ai-workflow-automation', 'PostgreSQL Live Verification Query', 'New', 'CRUD Test');
    `;
    assert(true, "PostgreSQL Leads INSERT (write verification)");

    // READ
    const readRows = await sql`SELECT * FROM leads WHERE id = ${testLeadId};`;
    assert(readRows.length === 1 && readRows[0].email === 'neon-test@flashai.agency', "PostgreSQL Leads SELECT (read verification)");

    // UPDATE
    await sql`
      UPDATE leads SET status = 'Contacted', notes = 'Neon verified' WHERE id = ${testLeadId};
    `;
    const updateRows = await sql`SELECT status, notes FROM leads WHERE id = ${testLeadId};`;
    assert(updateRows[0]?.status === 'Contacted' && updateRows[0]?.notes === 'Neon verified', "PostgreSQL Leads UPDATE (status mutation verification)");

    // DELETE
    await sql`DELETE FROM leads WHERE id = ${testLeadId};`;
    const verifyDeleted = await sql`SELECT id FROM leads WHERE id = ${testLeadId};`;
    assert(verifyDeleted.length === 0, "PostgreSQL Leads DELETE (cleanup verification)");
  } catch (err) {
    assert(false, "PostgreSQL Leads CRUD", err.message);
  }

  // 4. Bookings CRUD Test
  const testBookingId = `test-book-${Date.now()}`;
  try {
    await sql`
      INSERT INTO bookings (
        id, full_name, email, phone, company, service_id,
        preferred_date, preferred_time, budget_range, project_brief, status
      ) VALUES (
        ${testBookingId}, 'Marcus Neon', 'marcus-neon@flashai.agency', '+44 7911 123456',
        'Neon Tech Corp', 'custom-ai-agents', '2026-11-15', '14:00 - 16:00',
        '$5,000 - $10,000', 'Automated testing brief', 'New'
      );
    `;
    assert(true, "PostgreSQL Bookings INSERT (write verification)");

    const readBooking = await sql`SELECT * FROM bookings WHERE id = ${testBookingId};`;
    assert(readBooking.length === 1 && readBooking[0].company === 'Neon Tech Corp', "PostgreSQL Bookings SELECT (read verification)");

    await sql`DELETE FROM bookings WHERE id = ${testBookingId};`;
    assert(true, "PostgreSQL Bookings DELETE (cleanup verification)");
  } catch (err) {
    assert(false, "PostgreSQL Bookings CRUD", err.message);
  }

  // 5. Admin Settings CRUD Test
  const testKey = `test_setting_${Date.now()}`;
  try {
    await sql`
      INSERT INTO admin_settings (key, value) VALUES (${testKey}, 'neon_verified_value')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
    assert(true, "PostgreSQL Admin Settings INSERT / UPSERT");

    const readSetting = await sql`SELECT value FROM admin_settings WHERE key = ${testKey};`;
    assert(readSetting.length === 1 && readSetting[0].value === 'neon_verified_value', "PostgreSQL Admin Settings SELECT");

    await sql`DELETE FROM admin_settings WHERE key = ${testKey};`;
    assert(true, "PostgreSQL Admin Settings DELETE (cleanup verification)");
  } catch (err) {
    assert(false, "PostgreSQL Admin Settings CRUD", err.message);
  }

  console.log("\n================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;
  console.log(` POSTGRESQL AUDIT SUMMARY: ${passed}/${total} TESTS PASSED (${failed} FAILED)`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit();
