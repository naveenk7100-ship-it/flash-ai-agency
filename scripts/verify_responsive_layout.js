const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9229;
const USER_DATA_DIR = path.join(__dirname, "..", ".edge_verify_profile");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function testViewport(url, width, height, label, port = 9230) {
  const userDataDir = path.join(__dirname, "..", `.edge_verify_profile_${port}`);
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}

  const proc = spawn(EDGE_PATH, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-search-engine-choice-screen",
    "--disable-sync",
    "--guest",
    "--use-gl=angle",
    url
  ]);

  // Poll for browser ready
  let list = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/json/list`, (r) => {
          let d = "";
          r.on("data", (c) => (d += c));
          r.on("end", () => {
            try {
              resolve(JSON.parse(d));
            } catch (err) {
              reject(err);
            }
          });
        });
        req.on("error", reject);
        req.setTimeout(1500, () => req.destroy());
      });
      if (Array.isArray(list) && list.length > 0) break;
    } catch {}
    await sleep(600);
  }

  if (!list || list.length === 0) {
    proc.kill();
    throw new Error(`Edge did not open debugging port ${port}`);
  }

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
  await sleep(1500);

  // Evaluate layout metrics in page context
  const evalResult = await send("Runtime.evaluate", {
    expression: `(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hasHorizontalScroll = docW > winW;
      
      // Find all containers
      const headerContainer = document.querySelector("header > div, header > div[class*='max-w']");
      const heroContainer = document.querySelector("section:first-of-type > div[class*='max-w']");
      const heroGrid = document.querySelector("section:first-of-type .grid");
      const heroCols = heroGrid ? Array.from(heroGrid.children).map(c => ({
        width: Math.round(c.getBoundingClientRect().width),
        left: Math.round(c.getBoundingClientRect().left),
        right: Math.round(c.getBoundingClientRect().right)
      })) : [];
      
      const containers = Array.from(document.querySelectorAll("[class*='max-w-[1600px]']")).map(el => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          width: Math.round(r.width),
          left: Math.round(r.left),
          right: Math.round(r.right),
          parentSection: el.closest("section") ? el.closest("section").id || "hero/section" : "header/footer"
        };
      });

      return {
        viewportWidth: winW,
        viewportHeight: window.innerHeight,
        scrollWidth: docW,
        hasHorizontalScroll,
        heroCols,
        containersSample: containers.slice(0, 6)
      };
    })()`,
    returnByValue: true
  });

  const targetDir = path.join(__dirname, "..", "screenshots");
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const shotPath = path.join(targetDir, `viewport_${label}.png`);

  const shot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(shotPath, Buffer.from(shot.data, "base64"));

  ws.close();
  proc.kill();

  return {
    label,
    metrics: evalResult.result.value,
    shotPath
  };
}

async function run() {
  console.log("=== Testing Layout & Alignment Across All Viewport Widths ===");
  const viewports = [
    { width: 1920, height: 1080, label: "1920px" },
    { width: 1440, height: 900, label: "1440px" },
    { width: 1024, height: 768, label: "1024px" },
    { width: 390, height: 844, label: "mobile" }
  ];

  for (let i = 0; i < viewports.length; i++) {
    const vp = viewports[i];
    const port = 9231 + i;
    const res = await testViewport("http://localhost:3001/", vp.width, vp.height, vp.label, port);
    console.log(`\n--- Viewport: ${res.label} (${vp.width}x${vp.height}) ---`);
    console.log(`Horizontal Scrollbar: ${res.metrics.hasHorizontalScroll ? "FAIL (DETECTED)" : "PASS (NONE)"}`);
    console.log(`Document Width: ${res.metrics.scrollWidth}px vs Window Width: ${res.metrics.viewportWidth}px`);
    if (res.metrics.heroCols.length >= 2) {
      console.log(`Hero Col 1 (Text): ${res.metrics.heroCols[0].width}px, Hero Col 2 (3D): ${res.metrics.heroCols[1].width}px (Difference: ${Math.abs(res.metrics.heroCols[0].width - res.metrics.heroCols[1].width)}px)`);
    }
    console.log(`Containers sample left edges aligned:`, res.metrics.containersSample.map(c => `${c.parentSection}: left=${c.left}px, w=${c.width}px`).join(" | "));
    console.log(`Screenshot saved: ${res.shotPath}`);
  }
}

run().catch(console.error);
