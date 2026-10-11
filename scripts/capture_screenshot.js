const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9228;
const USER_DATA_DIR = path.join(__dirname, "..", ".edge_shot_profile");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture(url, outputPath, width = 1440, height = 900) {
  try {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch {}

  const proc = spawn(EDGE_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    `--window-size=${width},${height}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-search-engine-choice-screen",
    "--disable-sync",
    "--guest",
    "--use-gl=angle",
    url
  ]);

  await sleep(2500);

  const list = await new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${PORT}/json/list`, (r) => {
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => res(JSON.parse(d)));
    }).on("error", rej);
  });

  const page = list.find((t) => t.type === "page" && (t.url.includes("3001") || !t.url.includes("chrome://"))) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Page.enable");
  // Wait for 3D animation loop to render multiple frames
  await sleep(1500);

  const shot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(outputPath, Buffer.from(shot.data, "base64"));
  console.log(`Saved screenshot to: ${outputPath}`);

  ws.close();
  proc.kill();
}

async function main() {
  const targetDir = path.join(__dirname, "..", "screenshots");
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const desktopShot = path.join(targetDir, "hero_desktop_redesigned.png");
  await capture("http://localhost:3001/", desktopShot, 1440, 900);

  const mobileShot = path.join(targetDir, "hero_mobile_redesigned.png");
  await capture("http://localhost:3001/", mobileShot, 390, 844);
}

main().catch(console.error);
