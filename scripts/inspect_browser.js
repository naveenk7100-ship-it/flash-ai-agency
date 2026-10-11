const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9222;
const USER_DATA_DIR = path.join(__dirname, "..", ".edge_debug_profile");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${endpoint}`, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  console.log("=== Launching Microsoft Edge for Real In-Browser Inspection ===");

  // Cleanup old profile if exists
  try {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch {}

  const edgeProc = spawn(EDGE_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    "--disable-background-networking",
    "--enable-features=NetworkService,NetworkServiceInProcess",
    "--use-gl=angle",
    "--window-size=1440,900",
    "http://localhost:3001/"
  ]);

  edgeProc.stderr.on("data", (d) => {
    const msg = d.toString();
    if (msg.includes("ERROR") || msg.includes("exception")) {
      // console.log("[Edge Stderr]", msg.trim());
    }
  });

  // Wait for remote debugging to be ready
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      targets = await getJson("/json/list");
      if (targets && targets.length > 0) break;
    } catch {}
  }

  if (!targets || targets.length === 0) {
    console.error("Failed to connect to Edge remote debugging port!");
    edgeProc.kill();
    process.exit(1);
  }

  const pageTarget = targets.find((t) => t.type === "page" && t.url.includes("localhost:3001")) || targets[0];
  console.log("Connected to browser target:", pageTarget.title, pageTarget.url);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      if (data.error) cb.reject(data.error);
      else cb.resolve(data.result);
    } else if (data.method === "Runtime.consoleAPICalled") {
      console.log(`[Browser Console ${data.params.type.toUpperCase()}]`, data.params.args.map(a => a.value ?? a.description).join(" "));
    } else if (data.method === "Runtime.exceptionThrown") {
      console.error("[Browser Exception]", data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
    }
  };

  await new Promise((resolve) => (ws.onopen = resolve));

  // Enable debugging domains
  await send("Console.enable");
  await send("Runtime.enable");
  await send("Page.enable");

  // Wait 2.5 seconds for React hydration, WebGL mount, and animations to spin up
  await sleep(2500);

  console.log("\n--- Checking WebGL Canvas & HeroScene3D Execution ---");
  const evalCanvas = await send("Runtime.evaluate", {
    expression: `(() => {
      const canvas = document.querySelector("canvas");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!canvas) {
        return { hasCanvas: false, prefersReducedMotion };
      }
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      const rect = canvas.getBoundingClientRect();
      return {
        hasCanvas: true,
        width: canvas.width,
        height: canvas.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        hasGL: !!gl,
        isWebGL2: canvas.getContext("webgl2") !== null,
        prefersReducedMotion,
        clientVisible: rect.width > 0 && rect.height > 0
      };
    })()`,
    returnByValue: true
  });
  console.log("Canvas Evaluation:", evalCanvas.result.value);

  console.log("\n--- Checking Animation Frame & Rotation Over Time (1.5 seconds) ---");
  const sampleMotion = await send("Runtime.evaluate", {
    expression: `(async () => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return { error: "No canvas found" };

      // Sample pixels or read canvas dataUrl at t=0 and t=1.2s to detect actual visible movement
      const data1 = canvas.toDataURL("image/png").slice(0, 500);
      await new Promise(r => setTimeout(r, 1200));
      const data2 = canvas.toDataURL("image/png").slice(0, 500);

      // Check if window is scrolling or requestAnimationFrame is executing
      let rafCount = 0;
      const start = performance.now();
      await new Promise(resolve => {
        function loop() {
          rafCount++;
          if (performance.now() - start < 500) {
            requestAnimationFrame(loop);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(loop);
      });

      return {
        hasPixelChangeBetweenFrames: data1 !== data2,
        rafCountOver500ms: rafCount,
        fpsEstimate: (rafCount / 0.5)
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log("Hero Motion Sample:", sampleMotion.result.value);

  console.log("\n--- Checking Scroll Story & IntersectionObserver Elements ---");
  const evalScroll = await send("Runtime.evaluate", {
    expression: `(() => {
      const revealItems = Array.from(document.querySelectorAll(".reveal-item"));
      const stats = revealItems.map((el, i) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          index: i,
          tagName: el.tagName,
          classes: el.className,
          opacity: computed.opacity,
          transform: computed.transform,
          animation: computed.animation,
          transition: computed.transition,
          top: rect.top,
          isEntering: el.classList.contains("is-entering")
        };
      });
      return {
        totalRevealItems: revealItems.length,
        itemsEnteringCount: revealItems.filter(el => el.classList.contains("is-entering")).length,
        hasJsRevealClass: document.documentElement.classList.contains("js-reveal"),
        samples: stats.slice(0, 6)
      };
    })()`,
    returnByValue: true
  });
  console.log("Scroll Elements State:", JSON.stringify(evalScroll.result.value, null, 2));

  console.log("\n--- Simulating Scroll to Process & Portfolio Sections ---");
  const scrollTest = await send("Runtime.evaluate", {
    expression: `(async () => {
      window.scrollTo(0, 1500);
      await new Promise(r => setTimeout(r, 600));
      const inViewItems = Array.from(document.querySelectorAll(".reveal-item")).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
      });
      return {
        scrollY: window.scrollY,
        inViewItemsCount: inViewItems.length,
        inViewEnteringCount: inViewItems.filter(el => el.classList.contains("is-entering")).length,
        sampleComputed: inViewItems.slice(0, 3).map(el => {
          const comp = window.getComputedStyle(el);
          return {
            classes: el.className,
            opacity: comp.opacity,
            transform: comp.transform,
            animation: comp.animation
          };
        })
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log("Post-Scroll State:", JSON.stringify(scrollTest.result.value, null, 2));

  ws.close();
  edgeProc.kill();
  console.log("\n=== Inspection Complete ===");
}

run().catch((err) => {
  console.error("Inspection error:", err);
  process.exit(1);
});
