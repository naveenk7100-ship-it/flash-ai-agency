const http = require("http");

const BASE_URL = "http://localhost:3001";

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: options.method || "GET",
        headers: options.headers || {}
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch {}
          resolve({ status: res.statusCode, headers: res.headers, text: data, json });
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log("==================================================");
  console.log(" FLASH.Ai Agency - Full Production Readiness Audit");
  console.log("==================================================");
  console.log("Target Base URL:", BASE_URL);
  console.log("Timestamp:", new Date().toISOString(), "\n");

  const results = [];
  function record(category, testName, pass, details = "") {
    results.push({ category, testName, pass, details });
    const mark = pass ? "[PASS]" : "[FAIL]";
    console.log(`${mark} [${category}] ${testName} ${details ? "- " + details : ""}`);
  }

  // 1. Critical Public Routes
  const routes = [
    "/",
    "/services",
    "/services/ai-workflow-automation",
    "/services/custom-ai-agents",
    "/services/n8n-workflow-development",
    "/portfolio",
    "/portfolio/flash-ai-social",
    "/portfolio/trendpost",
    "/portfolio/cleancut-ai",
    "/portfolio/globallead-ai",
    "/booking",
    "/reviews",
    "/contact",
    "/about",
    "/pricing",
    "/faq",
    "/terms",
    "/privacy",
    "/admin"
  ];

  console.log("--- 1. Testing Critical Routes ---");
  for (const r of routes) {
    try {
      const res = await request(r);
      const pass = res.status === 200;
      record("Route Check", `GET ${r}`, pass, `HTTP ${res.status}`);
    } catch (err) {
      record("Route Check", `GET ${r}`, false, `Error: ${err.message}`);
    }
  }

  // 2. Navigation Links on Homepage
  console.log("\n--- 2. Auditing Navigation & Internal Links on Homepage ---");
  try {
    const homeRes = await request("/");
    const hrefRegex = /href="(\/[^"#?]*)"/g;
    const links = new Set();
    let match;
    while ((match = hrefRegex.exec(homeRes.text)) !== null) {
      const link = match[1];
      if (!link.startsWith("/_next") && !link.startsWith("/favicon")) {
        links.add(link);
      }
    }
    console.log(`Discovered ${links.size} unique internal routes linked from homepage:`, Array.from(links));
    for (const link of links) {
      const res = await request(link);
      const pass = res.status === 200;
      record("Navigation Link", link, pass, `HTTP ${res.status}`);
    }
  } catch (err) {
    record("Navigation Link", "Parse Homepage Links", false, err.message);
  }

  // 3. Bookings API Validation & Creation Flow
  console.log("\n--- 3. Testing Bookings API & Validation Flow ---");
  try {
    // GET Bookings
    const getRes = await request("/api/bookings");
    record("Bookings API", "GET /api/bookings", getRes.status === 200 && getRes.json?.success === true, `HTTP ${getRes.status}`);

    // POST missing fields (Validation)
    const missingRes = await request("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { fullName: "Incomplete Lead" }
    });
    record("Bookings API", "POST validation: missing fields", missingRes.status === 400, `HTTP ${missingRes.status} - ${missingRes.json?.error || ""}`);

    // POST invalid email (Validation)
    const invalidEmailRes = await request("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        fullName: "Test User",
        email: "not-an-email",
        company: "Test Co",
        serviceId: "ai-workflow-automation",
        projectBrief: "Detailed workflow brief here.",
        preferredDate: "2026-11-01"
      }
    });
    record("Bookings API", "POST validation: invalid email", invalidEmailRes.status === 400, `HTTP ${invalidEmailRes.status} - ${invalidEmailRes.json?.error || ""}`);

    // POST valid booking submission
    const validBookingPayload = {
      fullName: "Audit Operator",
      email: "audit.test@enterprise-systems.com",
      phone: "+1 (555) 019-2834",
      company: "Enterprise Systems UK",
      website: "https://enterprise-systems.com",
      serviceId: "ai-workflow-automation",
      preferredDate: "2026-11-15",
      preferredTime: "14:00 - 16:00",
      timezone: "GMT (London)",
      budgetRange: "$5,000 - $10,000",
      projectBrief: "Automate cross-department invoice parsing and n8n webhook routing with human-in-the-loop signoff."
    };
    const validRes = await request("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: validBookingPayload
    });
    const bookingCreated = validRes.status === 200 && validRes.json?.success === true;
    record("Bookings API", "POST valid booking submission", bookingCreated, `HTTP ${validRes.status} (ID: ${validRes.json?.booking?.id || "N/A"})`);
  } catch (err) {
    record("Bookings API", "Booking Flow", false, err.message);
  }

  // 4. Contact API Flow
  console.log("\n--- 4. Testing Contact API Flow ---");
  try {
    const contactGet = await request("/api/contact");
    record("Contact API", "GET /api/contact", contactGet.status === 200 && contactGet.json?.success === true, `HTTP ${contactGet.status}`);

    const contactPost = await request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        name: "Director of Ops",
        email: "ops@apexholding.com",
        subject: "Audit of n8n workflow deployment",
        message: "Requesting a preliminary architecture review for our enterprise data pipeline."
      }
    });
    record("Contact API", "POST /api/contact submission", contactPost.status === 200 && contactPost.json?.success === true, `HTTP ${contactPost.status}`);
  } catch (err) {
    record("Contact API", "Contact Flow", false, err.message);
  }

  // 5. Customer Reviews Submission & Admin Approval Flow
  console.log("\n--- 5. Testing Reviews API & Integrity Workflow ---");
  try {
    const revGetBefore = await request("/api/reviews");
    record("Reviews API", "GET /api/reviews (public published)", revGetBefore.status === 200 && revGetBefore.json?.success === true, `Count: ${revGetBefore.json?.count}`);

    const testRev = {
      reviewerName: "Alexander Vance",
      company: "Vance Logistics",
      role: "VP of Engineering",
      rating: 5,
      reviewText: "Flash.ai eliminated 18 hours of manual weekly dispatch workflows with zero data loss."
    };
    const revPost = await request("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: testRev
    });
    const revCreated = revPost.status === 200 && revPost.json?.success === true && revPost.json?.review?.status === "pending";
    record("Reviews API", "POST review (must default to 'pending')", revCreated, `Status: ${revPost.json?.review?.status}`);
    const reviewId = revPost.json?.review?.id;

    // Verify review is NOT visible publicly until approved!
    const revGetPending = await request("/api/reviews");
    const isPublicBeforeApproval = revGetPending.json?.reviews?.some((r) => r.id === reviewId);
    record("Reviews Integrity", "Unapproved review remains hidden from public", !isPublicBeforeApproval, `Hidden: ${!isPublicBeforeApproval}`);
  } catch (err) {
    record("Reviews API", "Reviews Flow", false, err.message);
  }

  // 6. Admin Authentication & Management Operations
  console.log("\n--- 6. Testing Admin Authentication & Governance ---");
  try {
    // Unauthorized check
    const unauthRes = await request("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { action: "getStats", adminKey: "wrong-password" }
    });
    record("Admin Auth", "Reject invalid credentials", unauthRes.status === 401, `HTTP ${unauthRes.status}`);

    // Authorized check
    const adminKey = process.env.ADMIN_SECRET_KEY || "flash-admin-2026";
    const authRes = await request("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { action: "getStats", adminKey }
    });
    const authOk = authRes.status === 200 && authRes.json?.success === true;
    record("Admin Auth", "Accept authorized administrative key", authOk, `HTTP ${authRes.status} (Storage: ${authRes.json?.stats?.storageType || "N/A"})`);

    if (authOk) {
      console.log("   Admin Dashboard Stats Verified:");
      console.log("   - Total Bookings:", authRes.json.stats.totalBookings);
      console.log("   - Total Contacts:", authRes.json.stats.totalContacts);
      console.log("   - Pending Reviews:", authRes.json.stats.pendingReviews);
      console.log("   - Active Storage:", authRes.json.stats.storageType);
    }
  } catch (err) {
    record("Admin Auth", "Admin API Flow", false, err.message);
  }

  // Summary
  console.log("\n==================================================");
  console.log(" AUDIT SUITE EXECUTION SUMMARY");
  console.log("==================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Total Checks: ${total} | Passed: ${passed} | Failed: ${failed}`);
  if (failed === 0) {
    console.log("STATUS: ALL TESTS PASSED (100% PRODUCTION-READY)");
  } else {
    console.log("STATUS: FAILURES DETECTED");
  }
}

runAudit().catch(console.error);
