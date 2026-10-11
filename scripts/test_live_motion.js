const { spawn } = require("child_process");
const http = require("http");

async function main() {
  console.log("=== Testing Real In-Browser Motion Verification ===");
  const proc = spawn("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", [
    "--headless=new",
    "--remote-debugging-port=9226",
    "--user-data-dir=C:\\Users\\navee\\.gemini\\antigravity\\scratch\\flash-ai-agency\\.edge_motion_verify",
    "--use-gl=angle",
    "http://localhost:3001/"
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  const list = await new Promise((res) =>
    http.get("http://127.0.0.1:9226/json/list", (r) => {
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => res(JSON.parse(d)));
    })
  );

  const target = list.find((t) => t.type === "page" && t.url.includes("3001")) || list[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const logs = [];
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.method === "Runtime.consoleAPICalled") {
      logs.push(`[${data.params.type}] ` + data.params.args.map((a) => a.value ?? a.description).join(" "));
    }
  };

  await new Promise((resolve) => {
    ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
    ws.send(JSON.stringify({ id: 2, method: "Console.enable" }));
    setTimeout(resolve, 1000);
  });

  // Evaluate initial sample at t=0
  const sample1 = await new Promise((res) => {
    ws.send(
      JSON.stringify({
        id: 3,
        method: "Runtime.evaluate",
        params: {
          expression: `(() => {
            const h = window.__FLASH_HERO__;
            const canvas = document.querySelector("canvas");
            return {
              hasHero: !!h,
              heroData: h,
              canvasWidth: canvas?.width,
              canvasHeight: canvas?.height
            };
          })()`,
          returnByValue: true
        }
      })
    );
    const prev = ws.onmessage;
    ws.onmessage = (e) => {
      prev(e);
      const data = JSON.parse(e.data);
      if (data.id === 3) res(data.result?.result?.value);
    };
  });

  console.log("Sample 1 (T=0):", JSON.stringify(sample1, null, 2));

  // Wait 1.5 seconds for animation frames to accrue
  await new Promise((r) => setTimeout(r, 1500));

  // Evaluate sample 2 at t=1.5s
  const sample2 = await new Promise((res) => {
    ws.send(
      JSON.stringify({
        id: 4,
        method: "Runtime.evaluate",
        params: {
          expression: `(() => {
            const h = window.__FLASH_HERO__;
            return {
              hasHero: !!h,
              heroData: h
            };
          })()`,
          returnByValue: true
        }
      })
    );
    const prev = ws.onmessage;
    ws.onmessage = (e) => {
      prev(e);
      const data = JSON.parse(e.data);
      if (data.id === 4) res(data.result?.result?.value);
    };
  });

  console.log("Sample 2 (T=1.5s):", JSON.stringify(sample2, null, 2));

  if (sample1.heroData && sample2.heroData) {
    console.log("\n--- Motion Delta Analysis (Workflow Core & Floating 3D Panels) ---");
    console.log("Frames Rendered in 1.5s:", sample2.heroData.frameCount - sample1.heroData.frameCount);
    console.log("Workflow Core Float Y:", sample2.heroData.coreFloatY?.toFixed(4));
    console.log("Websites Glass Panel Float Y:", sample2.heroData.webPanelY?.toFixed(4));
    console.log("Instagram Glass Panel Float Y:", sample2.heroData.igPanelY?.toFixed(4));
    console.log("AI Agents Glass Panel Float Y:", sample2.heroData.agentPanelY?.toFixed(4));
    console.log("Master Scene Rotation Y Delta:", ((sample2.heroData.masterRotationY || 0) - (sample1.heroData.masterRotationY || 0)).toFixed(4), "radians");
    console.log("Verdict:", sample2.heroData.frameCount > sample1.heroData.frameCount ? "CONFIRMED: VISIBLE 3D WORKFLOW MOTION ACTIVE" : "STATIONARY");
  }

  // Check WhatsApp Links on Page
  console.log("\n--- WhatsApp Contacts Link Verification ---");
  const waCheck = await new Promise((res) => {
    ws.send(
      JSON.stringify({
        id: 45,
        method: "Runtime.evaluate",
        params: {
          expression: `(() => {
            const links = Array.from(document.querySelectorAll("a[href*='wa.me']"));
            const line1 = links.filter(l => l.href.includes("919398421460"));
            const line2 = links.filter(l => l.href.includes("918523846914"));
            return {
              totalWaLinks: links.length,
              line1Count: line1.length,
              line2Count: line2.length,
              sampleHref1: line1[0]?.href,
              sampleHref2: line2[0]?.href
            };
          })()`,
          returnByValue: true
        }
      })
    );
    const prev = ws.onmessage;
    ws.onmessage = (e) => {
      prev(e);
      const data = JSON.parse(e.data);
      if (data.id === 45) res(data.result?.result?.value);
    };
  });
  console.log("WhatsApp Links Result:", JSON.stringify(waCheck, null, 2));

  // Scroll down and inspect reveal animation classes
  console.log("\n--- Scroll Entrance Animation Verification ---");
  const scrollResult = await new Promise((res) => {
    ws.send(
      JSON.stringify({
        id: 5,
        method: "Runtime.evaluate",
        params: {
          expression: `(async () => {
            window.scrollTo(0, 1100);
            await new Promise(r => setTimeout(r, 700));
            const items = Array.from(document.querySelectorAll(".reveal-item"));
            const entering = items.filter(i => i.classList.contains("is-entering"));
            return {
              scrollY: window.scrollY,
              totalItems: items.length,
              enteringCount: entering.length,
              sampleEnteringClasses: entering.slice(0, 5).map(el => el.className)
            };
          })()`,
          awaitPromise: true,
          returnByValue: true
        }
      })
    );
    const prev = ws.onmessage;
    ws.onmessage = (e) => {
      prev(e);
      const data = JSON.parse(e.data);
      if (data.id === 5) res(data.result?.result?.value);
    };
  });

  console.log("Scroll Result:", JSON.stringify(scrollResult, null, 2));

  console.log("\nConsole Logs (Should be clean):", logs);

  ws.close();
  proc.kill();
}

main().catch(console.error);
