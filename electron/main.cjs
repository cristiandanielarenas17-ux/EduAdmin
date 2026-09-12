const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let serverProcess = null;

function readEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const raw of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function startNextServer() {
  const serverDir = path.join(process.resourcesPath, "next");
  const serverPath = path.join(serverDir, "server.js");
  const fileEnv = readEnvFile(path.join(serverDir, ".env.local"));

  serverProcess = spawn(process.execPath, [serverPath], {
    cwd: serverDir,
    env: {
      ...process.env,
      ...fileEnv,
      ELECTRON_RUN_AS_NODE: "1",
      PORT: "3100",
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
    },
    windowsHide: true,
    stdio: "inherit",
  });

  serverProcess.on("error", (error) => {
    console.error("Error iniciando Next.js:", error);
  });
}

async function createWindow() {
  startNextServer();
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#09090b",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  await win.loadURL("http://127.0.0.1:3100/dashboard");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (serverProcess) serverProcess.kill();
});
