const BASE_URL = "http://localhost:3001";

async function testPasswordChange() {
  console.log("--- Testing Password Change Flow ---");

  // 1. Login with initial password
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "NAVEEN@20" })
  });
  const loginData = await loginRes.json();
  const sessionCookie = loginRes.headers.get("set-cookie")?.split(";")[0];
  console.log("Initial login:", loginData.user);

  // 2. Change password
  const changeRes = await fetch(`${BASE_URL}/api/admin/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionCookie
    },
    body: JSON.stringify({
      currentPassword: "NAVEEN@20",
      newPassword: "UpdatedSecurePassword#2026"
    })
  });
  const changeData = await changeRes.json();
  const updatedCookie = changeRes.headers.get("set-cookie")?.split(";")[0] || sessionCookie;
  console.log("Change response:", changeData);

  // 3. Verify me endpoint returns mustChangePassword: false
  const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: { Cookie: updatedCookie }
  });
  const meData = await meRes.json();
  console.log("Me response after change:", meData.user);

  if (!meData.user?.mustChangePassword) {
    console.log("✅ PASS: mustChangePassword is now false!");
  } else {
    console.error("❌ FAIL: mustChangePassword is still true!");
    process.exit(1);
  }

  // 4. Test login with new password
  const newLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "UpdatedSecurePassword#2026" })
  });
  const newLoginData = await newLoginRes.json();
  console.log("Login with new password:", newLoginData);

  if (newLoginData.success && !newLoginData.user?.mustChangePassword) {
    console.log("✅ PASS: Login with new password succeeded!");
  } else {
    console.error("❌ FAIL: Login with new password failed!");
    process.exit(1);
  }

  // 5. Restore password back to NAVEEN@20 so user's manual testing with NAVEEN@20 works as expected
  const restoreRes = await fetch(`${BASE_URL}/api/admin/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: newLoginRes.headers.get("set-cookie")?.split(";")[0]
    },
    body: JSON.stringify({
      currentPassword: "UpdatedSecurePassword#2026",
      newPassword: "NAVEEN@20"
    })
  });
  console.log("Restored setup state:", await restoreRes.json());
  console.log("✅ Password change flow fully validated and reset to initial setup state.");
}

testPasswordChange().catch(console.error);
