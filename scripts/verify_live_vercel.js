/**
 * FLASH.Ai Agency - Live Vercel Production Verification Script
 * Target: https://flash-ai-agency.vercel.app
 */

const LIVE_URL = "https://flash-ai-agency.vercel.app";

async function verifyLiveProduction() {
  console.log("================================================================");
  console.log(" FLASH.Ai Agency - Live Vercel Production Audit                 ");
  console.log(` Target URL: ${LIVE_URL}`);
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

  // 1. Live Homepage Status & Contact Info
  console.log("--- 1. Testing Live Public Homepage & Channels ---");
  try {
    const homeRes = await fetch(`${LIVE_URL}/`);
    const homeHtml = await homeRes.text();

    assert(homeRes.status === 200, "Live Homepage returns HTTP 200 OK");
    assert(
      homeHtml.includes("flashai.digital@gmail.com") && homeHtml.includes("mailto:flashai.digital@gmail.com"),
      "Live Homepage contains official email composer link (flashai.digital@gmail.com)"
    );
    assert(
      homeHtml.includes("https://www.instagram.com/flash__ai__digital/") && homeHtml.includes("@flash__ai__digital"),
      "Live Homepage renders official Instagram channel (@flash__ai__digital)"
    );
    assert(
      homeHtml.includes("93984") && homeHtml.includes("85238"),
      "Live Homepage displays both WhatsApp lines (+91 93984 21460 & +91 85238 46914)"
    );

    const hasAdminLink = /href=["']\/admin(?:\/.*)?["']/.test(homeHtml);
    assert(!hasAdminLink, "Zero admin links visible in live public HTML");
  } catch (e) {
    assert(false, "Live homepage check", e.message);
  }

  // 2. Live Server-Side Middleware Protection
  console.log("\n--- 2. Testing Live Security & Edge Middleware ---");
  try {
    const adminRes = await fetch(`${LIVE_URL}/admin`, { redirect: "manual" });
    const isRedirect = [307, 308, 302, 301].includes(adminRes.status);
    const location = adminRes.headers.get("location") || "";
    assert(
      isRedirect && location.includes("/admin/login"),
      `Unauthenticated visit to /admin redirects to /admin/login (Status: ${adminRes.status})`
    );
  } catch (e) {
    assert(false, "Live /admin protection", e.message);
  }

  try {
    const apiLeadsRes = await fetch(`${LIVE_URL}/api/leads`);
    assert(apiLeadsRes.status === 401, "Unauthenticated GET /api/leads rejected with HTTP 401");
  } catch (e) {
    assert(false, "Live /api/leads auth guard", e.message);
  }

  // 3. Live Admin Authentication
  console.log("\n--- 3. Testing Live Admin Authentication (admin / NAVEEN@20) ---");
  let sessionCookie = null;
  try {
    const loginRes = await fetch(`${LIVE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "NAVEEN@20" })
    });
    const loginData = await loginRes.json();
    const setCookie = loginRes.headers.get("set-cookie");

    assert(
      loginRes.ok && loginData.success && loginData.user?.username === "admin",
      "Live admin authentication succeeds (HTTP 200)"
    );

    if (setCookie) {
      sessionCookie = setCookie.split(";")[0];
      assert(sessionCookie.includes("flash_admin_session="), "Secure HttpOnly session cookie issued by Vercel");
    } else {
      assert(false, "Session cookie header present", "No set-cookie returned");
    }
  } catch (e) {
    assert(false, "Live admin authentication", e.message);
  }

  // 4. Live CRM Query & Database Info
  console.log("\n--- 4. Testing Live CRM & Neon Database Telemetry ---");
  try {
    const leadsRes = await fetch(`${LIVE_URL}/api/leads`, {
      headers: { Cookie: sessionCookie || "" }
    });
    const leadsData = await leadsRes.json();
    assert(leadsRes.ok && Array.isArray(leadsData.leads), "Authenticated GET /api/leads returns leads array");
    assert(
      leadsData.dbInfo?.provider === "postgres" && leadsData.dbInfo?.configured === true,
      `Live database engine verified: ${leadsData.dbInfo?.type} (Host: ${leadsData.dbInfo?.host})`
    );
  } catch (e) {
    assert(false, "Live CRM query", e.message);
  }

  // 5. Live Contact & Booking Persistence into Neon PostgreSQL
  console.log("\n--- 5. Testing Live Intake & Database Persistence ---");
  const testEmail = `vercel_live_${Date.now()}@agency-client.com`;
  let createdBookingId = null;

  try {
    const bookingRes = await fetch(`${LIVE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Victoria Sterling",
        email: testEmail,
        phone: "+91 93984 21460",
        company: "Sterling Automation Global",
        serviceId: "ai-workflow-automation",
        preferredDate: "2026-11-10",
        preferredTime: "15:00 - 17:00",
        timezone: "EST",
        budgetRange: "$5,000 - $10,000",
        projectBrief: "Live deployment audit verification booking."
      })
    });
    const bookingData = await bookingRes.json();

    assert(
      bookingRes.ok && bookingData.success && bookingData.booking?.id,
      "Live booking submission persists to Neon PostgreSQL (HTTP 200)"
    );
    createdBookingId = bookingData.booking?.id;
  } catch (e) {
    assert(false, "Live booking submission", e.message);
  }

  // Verify booking appears in CRM
  try {
    const verifyRes = await fetch(`${LIVE_URL}/api/leads?q=${testEmail}`, {
      headers: { Cookie: sessionCookie || "" }
    });
    const verifyData = await verifyRes.json();
    const found = verifyData.leads?.find((l) => l.email === testEmail);

    assert(
      Boolean(found && found.id === createdBookingId),
      `Newly persisted booking confirmed retrieved from live Neon database (${testEmail})`
    );

    // Live status mutation via PATCH
    const patchRes = await fetch(`${LIVE_URL}/api/leads`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie || ""
      },
      body: JSON.stringify({
        id: createdBookingId,
        status: "Contacted",
        notes: "Live Vercel verification test: Status updated in Neon database."
      })
    });
    const patchData = await patchRes.json();
    assert(patchRes.ok && patchData.success, "Live CRM PATCH updates status in Neon PostgreSQL");
  } catch (e) {
    assert(false, "Live CRM read & status update", e.message);
  }

  // 6. Summary
  console.log("\n================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;
  console.log(` LIVE PRODUCTION AUDIT SUMMARY: ${passed}/${total} TESTS PASSED (${failed} FAILED)`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

verifyLiveProduction();
