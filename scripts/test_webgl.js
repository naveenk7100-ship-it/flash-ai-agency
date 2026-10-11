const { spawn } = require("child_process");
const http = require("http");

async function main() {
  const proc = spawn("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", [
    "--headless=new",
    "--remote-debugging-port=9224",
    "--user-data-dir=C:\\Users\\navee\\.gemini\\antigravity\\scratch\\flash-ai-agency\\.edge_test_hero",
    "--use-gl=angle",
    "http://localhost:3001/"
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  const list = await new Promise((res) =>
    http.get("http://127.0.0.1:9224/json/list", (r) => {
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => res(JSON.parse(d)));
    })
  );

  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  // Collect console logs
  const logs = [];
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.method === "Runtime.consoleAPICalled") {
      logs.push(data.params.args.map((a) => a.value ?? a.description).join(" "));
    }
  };

  await new Promise((resolve) => {
    ws.send(JSON.stringify({ id: 1, method: "Console.enable" }));
    ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
    setTimeout(resolve, 500);
  });

  // Evaluate hero section HTML and container
  const result = await new Promise((res) => {
    ws.send(
      JSON.stringify({
        id: 3,
        method: "Runtime.evaluate",
        params: {
          expression: `(() => {
            const heroSection = document.querySelector("section");
            const canvasList = document.querySelectorAll("canvas");
            return {
              canvasCount: canvasList.length,
              heroHTMLSnippet: heroSection ? heroSection.innerHTML.slice(0, 1500) : "No section",
              webglSupport: (() => {
                const c = document.createElement("canvas");
                return {
                  webgl: !!c.getContext("webgl"),
                  webgl2: !!c.getContext("webgl2"),
                  experimental: !!c.getContext("experimental-webgl")
                };
              })()
            };
          })()`,
          returnByValue: true
        }
      })
    );
    const prevOnMsg = ws.onmessage;
    ws.onmessage = (e) => {
      prevOnMsg(e);
      const data = JSON.parse(e.data);
      if (data.id === 3) res(data.result?.result?.value);
    };
  });

  console.log("Console Logs from Page Load:", logs);
  console.log("DOM Inspection:", JSON.stringify(result, null, 2));

  ws.close();
  proc.kill();
}

main().catch(console.error);
