#!/usr/bin/env node

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [envFile, command, ...args] = process.argv.slice(2);

if (!envFile || !command) {
  console.error("Usage: node scripts/with-env.js <env-file> <command> [...args]");
  process.exit(1);
}

const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  console.error(`Environment file not found: ${envFile}`);
  process.exit(1);
}

const env = { ...process.env };
const envFileContent = fs.readFileSync(envPath, "utf8");

for (const rawLine of envFileContent.split(/\r?\n/)) {
  const line = rawLine.trim();

  if (!line || line.startsWith("#")) {
    continue;
  }

  const separatorIndex = line.indexOf("=");

  if (separatorIndex < 1) {
    continue;
  }

  const key = line.slice(0, separatorIndex).trim();
  let value = line.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  env[key] = value;
}

const result = spawnSync(command, args, {
  env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
