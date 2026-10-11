/**
 * FLASH.Ai Agency - Secure Vercel Environment Variables Synchronizer
 * Usage: node scripts/push_vercel_env.js
 * Strictly masks all secrets and values during execution.
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const envLocalPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envLocalPath)) {
  console.error("❌ .env.local file not found.");
  process.exit(1);
}

const content = fs.readFileSync(envLocalPath, "utf8");
const envVars = {};

content.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx > 0) {
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (val && !key.startsWith("VERCEL_")) {
      envVars[key] = val;
    }
  }
});

const keysToSync = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "ADMIN_USERNAME",
  "ADMIN_INITIAL_PASSWORD",
  "ADMIN_PASSWORD_HASH",
  "ADMIN_SESSION_SECRET",
  "ADMIN_SECRET_KEY",
  "AGENCY_NOTIFICATION_EMAIL"
];

function addEnvVar(key, value) {
  return new Promise((resolve) => {
    console.log(`Setting Vercel environment variable: ${key} (production, preview, development)...`);
    
    // Command: npx vercel env add <key> production,preview,development --force
    const isWindows = process.platform === "win32";
    const cmd = isWindows ? "cmd.exe" : "npx";
    const args = isWindows
      ? ["/c", "npx", "vercel", "env", "add", key, "production,preview,development", "--force"]
      : ["vercel", "env", "add", key, "production,preview,development", "--force"];

    const proc = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });

    proc.stdin.write(value + "\n");
    proc.stdin.end();

    let output = "";
    proc.stdout.on("data", (d) => { output += d.toString(); });
    proc.stderr.on("data", (d) => { output += d.toString(); });

    proc.on("close", (code) => {
      if (code === 0 || output.includes("Added") || output.includes("Updated")) {
        console.log(`✅ Successfully configured ${key}`);
      } else {
        console.log(`⚠️  Notice for ${key}: ${output.replace(value, "********").trim()}`);
      }
      resolve();
    });
  });
}

async function run() {
  console.log("================================================================");
  console.log(" FLASH.Ai Agency - Vercel Environment Configuration Sync       ");
  console.log("================================================================\n");

  for (const key of keysToSync) {
    if (envVars[key]) {
      await addEnvVar(key, envVars[key]);
    } else {
      console.log(`Skipping ${key}: not present in .env.local`);
    }
  }

  console.log("\n================================================================");
  console.log(" VERCEL ENVIRONMENT CONFIGURATION COMPLETED                     ");
  console.log("================================================================\n");
}

run();
