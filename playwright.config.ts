import { defineConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return {};

  const env: Record<string, string> = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in env)) {
      env[key] = value;
    }
  }

  return env;
}

const rootDir = process.cwd();
const loadedEnv = {
  ...loadEnvFile(path.join(rootDir, ".env")),
  ...loadEnvFile(path.join(rootDir, ".env.local")),
  ...process.env,
};

for (const [key, value] of Object.entries(loadedEnv)) {
  if (typeof value === "string" && !(key in process.env)) {
    process.env[key] = value;
  }
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "pnpm --filter @hiresense/web dev",
    url: `${baseURL}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: Object.fromEntries(
      Object.entries(loadedEnv).filter(([, value]) => typeof value === "string")
    ),
  },
});
