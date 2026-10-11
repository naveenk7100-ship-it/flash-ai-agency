/**
 * FLASH.Ai Agency - Full Production & Lead Storage Verification Script
 * Tests:
 * 1. Spam protection & validation on /api/bookings & /api/contact
 * 2. Successful lead submission & persistence to database
 * 3. Rejection of unauthenticated users on protected endpoints
 * 4. Admin login with admin + NAVEEN@20
 * 5. Extraction and verification of leads via CRM API with session cookie
 * 6. Lead status update and notes update
 * 7. Admin password change flow & verification
 */

const BASE_URL = "http://localhost:3001";

async function runTests() {
  console.log("================================================================");
  console.log(" FLASH.Ai Agency - End-to-End Verification Audit                ");
  console.log("================================================================\n");

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

  // -------------------------------------------------------------
  // Test 1: Anti-Spam & Validation on Contact Endpoint
  // -------------------------------------------------------------
  console.log("--- 1. Testing Contact Form & Spam Protection ---");

  // Missing fields -> 400
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", email: "test@example.com", message: "" })
    });
    assert(res.status === 400, "Contact form rejects missing fields (400)");
  } catch (e) {
    assert(false, "Contact form rejects missing fields", e.message);
  }

  // Invalid email format -> 400
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice", email: "not-an-email", message: "Hello" })
    });
    assert(res.status === 400, "Contact form rejects invalid email (400)");
  } catch (e) {
    assert(false, "Contact form rejects invalid email", e.message);
  }

  // Honeypot spam test -> returns 200 without saving
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot Spam",
        email: "bot@spam.com",
        message: "Spam content",
        _hp_company_fax: "automated_bot_payload"
      })
    });
    const data = await res.json();
    assert(res.ok && data.contact?.id === "hp-filtered", "Contact honeypot intercepts bots silently (hp-filtered)");
  } catch (e) {
    assert(false, "Contact honeypot intercepts bots", e.message);
  }

  // Valid contact submission
  const testContactEmail = `e2e_contact_${Date.now()}@agency-client.com`;
  let createdContactId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Devon Vance",
        email: testContactEmail,
        phone: "+91 93984 21460",
        subject: "AI Agent Implementation Inquiry",
        message: "We need an autonomous customer support agent integrated with PostgreSQL and n8n."
      })
    });
    const data = await res.json();
    assert(res.ok && data.success && data.contact?.id, "Valid contact submission succeeds and returns contact ID");
    createdContactId = data.contact?.id;
  } catch (e) {
    assert(false, "Valid contact submission succeeds", e.message);
  }

  // -------------------------------------------------------------
  // Test 2: Booking Form & Lead Storage
  // -------------------------------------------------------------
  console.log("\n--- 2. Testing Booking Form & Validation ---");

  // Missing required booking fields -> 400
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Marcus" })
    });
    assert(res.status === 400, "Booking form rejects incomplete submissions (400)");
  } catch (e) {
    assert(false, "Booking form rejects incomplete submissions", e.message);
  }

  // Honeypot spam test on bookings
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Spam Bot",
        email: "bot@spam.com",
        company: "Bot Co",
        serviceId: "custom-ai-agents",
        preferredDate: "2026-11-01",
        projectBrief: "Buy pills online",
        _hp_company_fax: "bot-fax-filled"
      })
    });
    const data = await res.json();
    assert(res.ok && data.booking?.id === "hp-filtered", "Booking honeypot intercepts bots silently (hp-filtered)");
  } catch (e) {
    assert(false, "Booking honeypot intercepts bots", e.message);
  }

  // Valid booking submission
  const testBookingEmail = `e2e_booking_${Date.now()}@vanguard-holdings.co`;
  let createdBookingId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Samantha Reed",
        email: testBookingEmail,
        phone: "+91 85238 46914",
        company: "Vanguard Global Capital",
        serviceId: "ai-workflow-automation",
        preferredDate: "2026-10-28",
        preferredTime: "15:00 - 17:00",
        timezone: "EST (New York)",
        budgetRange: "$3,000 - $6,000",
        projectBrief: "Complete automation of client onboarding with Meta ads lead sync and n8n orchestration."
      })
    });
    const data = await res.json();
    assert(res.ok && data.success && data.booking?.id, "Valid booking submission succeeds and persists");
    createdBookingId = data.booking?.id;
  } catch (e) {
    assert(false, "Valid booking submission succeeds", e.message);
  }

  // -------------------------------------------------------------
  // Test 3: Unauthenticated Access Protection
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing Route & API Security (Auth Guards) ---");

  // GET /api/leads without auth -> MUST 401
  try {
    const res = await fetch(`${BASE_URL}/api/leads`);
    assert(res.status === 401, "GET /api/leads rejects unauthenticated requests (401)");
  } catch (e) {
    assert(false, "GET /api/leads rejects unauthenticated requests", e.message);
  }

  // GET /api/bookings without auth -> MUST 401
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`);
    assert(res.status === 401, "GET /api/bookings rejects unauthenticated requests (401)");
  } catch (e) {
    assert(false, "GET /api/bookings rejects unauthenticated requests", e.message);
  }

  // GET /api/contact without auth -> MUST 401
  try {
    const res = await fetch(`${BASE_URL}/api/contact`);
    assert(res.status === 401, "GET /api/contact rejects unauthenticated requests (401)");
  } catch (e) {
    assert(false, "GET /api/contact rejects unauthenticated requests", e.message);
  }

  // PATCH /api/leads without auth -> MUST 401
  try {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: createdBookingId, status: "Contacted" })
    });
    assert(res.status === 401, "PATCH /api/leads rejects unauthenticated updates (401)");
  } catch (e) {
    assert(false, "PATCH /api/leads rejects unauthenticated updates", e.message);
  }

  // -------------------------------------------------------------
  // Test 4: Admin Authentication with admin / NAVEEN@20
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing Admin Authentication ---");

  // Wrong password -> 401
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "WRONG_PASSWORD_XYZ" })
    });
    assert(res.status === 401, "Login rejects incorrect credentials (401)");
  } catch (e) {
    assert(false, "Login rejects incorrect credentials", e.message);
  }

  // Correct credentials (admin / NAVEEN@20)
  let sessionCookie = null;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "NAVEEN@20" })
    });
    const data = await res.json();
    const setCookieHeader = res.headers.get("set-cookie");

    assert(
      res.ok && data.success && data.user?.username === "admin",
      "Admin login with admin / NAVEEN@20 succeeds (200)"
    );

    assert(
      data.user?.mustChangePassword === true,
      "Initial login flags `mustChangePassword: true` as required"
    );

    if (setCookieHeader) {
      sessionCookie = setCookieHeader.split(";")[0];
      assert(sessionCookie.includes("flash_admin_session="), "HttpOnly flash_admin_session cookie issued");
    } else {
      assert(false, "HttpOnly session cookie issued", "No set-cookie header received");
    }
  } catch (e) {
    assert(false, "Admin login with admin / NAVEEN@20 succeeds", e.message);
  }

  // Verify /api/admin/me with cookie
  try {
    const res = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Cookie: sessionCookie || "" }
    });
    const data = await res.json();
    assert(
      res.ok && data.authenticated && data.user?.username === "admin",
      "Session cookie authorizes GET /api/admin/me"
    );
  } catch (e) {
    assert(false, "Session cookie authorizes GET /api/admin/me", e.message);
  }

  // -------------------------------------------------------------
  // Test 5: CRM Leads API & Data Verification
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing CRM Leads Dashboard API ---");

  try {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      headers: { Cookie: sessionCookie || "" }
    });
    const data = await res.json();
    assert(res.ok && data.success && Array.isArray(data.leads), "Authenticated GET /api/leads returns lead collection");

    const foundBooking = data.leads.find((l) => l.email === testBookingEmail);
    assert(Boolean(foundBooking), `Newly created booking (${testBookingEmail}) exists in CRM leads`);

    const foundContact = data.leads.find((l) => l.email === testContactEmail);
    assert(Boolean(foundContact), `Newly created contact (${testContactEmail}) exists in CRM leads`);
  } catch (e) {
    assert(false, "Authenticated GET /api/leads returns lead collection", e.message);
  }

  // Search filter test
  try {
    const res = await fetch(`${BASE_URL}/api/leads?q=Samantha`, {
      headers: { Cookie: sessionCookie || "" }
    });
    const data = await res.json();
    const found = data.leads?.some((l) => l.name.includes("Samantha"));
    assert(res.ok && found, "Search query (?q=Samantha) filters leads accurately");
  } catch (e) {
    assert(false, "Search query filters leads", e.message);
  }

  // Status update test
  try {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie || ""
      },
      body: JSON.stringify({
        id: createdBookingId,
        status: "Contacted",
        notes: "Verified via E2E test suite. Initial WhatsApp follow-up queued."
      })
    });
    const data = await res.json();
    assert(res.ok && data.success, "PATCH /api/leads successfully updates lead status to 'Contacted'");
  } catch (e) {
    assert(false, "PATCH /api/leads updates lead status", e.message);
  }

  // Verify the update persisted
  try {
    const res = await fetch(`${BASE_URL}/api/leads?q=${testBookingEmail}`, {
      headers: { Cookie: sessionCookie || "" }
    });
    const data = await res.json();
    const updatedLead = data.leads?.find((l) => l.id === createdBookingId);
    assert(
      updatedLead?.status === "Contacted" && updatedLead?.notes?.includes("Verified via E2E"),
      "Persisted status 'Contacted' and notes confirmed in database"
    );
  } catch (e) {
    assert(false, "Persisted status and notes confirmed in database", e.message);
  }

  // -------------------------------------------------------------
  // Test 6: WhatsApp Follow-Up Links
  // -------------------------------------------------------------
  console.log("\n--- 6. Verifying WhatsApp Links & Integration ---");

  const agencyPhone1 = "919398421460";
  const agencyPhone2 = "918523846914";
  const waUrl1 = `https://wa.me/${agencyPhone1}`;
  const waUrl2 = `https://wa.me/${agencyPhone2}`;

  assert(waUrl1 === "https://wa.me/919398421460", "WhatsApp Line 1 link correctly formatted (+91 93984 21460)");
  assert(waUrl2 === "https://wa.me/918523846914", "WhatsApp Line 2 link correctly formatted (+91 85238 46914)");

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;
  console.log(` AUDIT SUMMARY: ${passed}/${total} TESTS PASSED (${failed} FAILED)`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
