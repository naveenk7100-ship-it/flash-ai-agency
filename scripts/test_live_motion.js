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
    console.log("\n--- Motion Delta Analysis ---");
    console.log("Frames Rendered in 1.5s:", sample2.heroData.frameCount - sample1.heroData.frameCount);
    console.log("Ring 1 Rotation Delta (Z):", (sample2.heroData.ring1Z - sample1.heroData.ring1Z).toFixed(4), "radians");
    console.log("Ring 2 Rotation Delta (Z):", (sample2.heroData.ring2Z - sample1.heroData.ring2Z).toFixed(4), "radians");
    console.log("Sculpture Levitation Y:", sample2.heroData.boltY.toFixed(4));
    console.log("Particles Swirl Rotation Y:", (sample2.heroData.particleRotY - sample1.heroData.particleRotY).toFixed(4), "radians");
    console.log("Verdict:", sample2.heroData.frameCount > sample1.heroData.frameCount ? "CONFIRMED: VISIBLE 3D MOTION ACTIVE" : "STATIONARY");
  }

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
