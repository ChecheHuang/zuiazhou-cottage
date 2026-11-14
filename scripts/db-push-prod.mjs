// pnpm db:push:prod
// 把 lib/db/schema.ts 的資料表結構套用到「正式」資料庫。
// 只改結構（新增資料表、欄位），不搬資料。drizzle-kit 會先列出每一條 SQL 並逐條詢問。
//
// 正式連線字串用 `vercel env pull --environment production` 暫時取得，用完立即刪除。

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";

const isWindows = process.platform === "win32";
const run = (cmd, args, env) =>
  spawnSync(cmd, args, {
    stdio: "inherit",
    shell: isWindows,
    env: { ...process.env, ...env },
  });

const parseEnv = (text) =>
  Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Z0-9_]+)="?(.*?)"?$/))
      .filter(Boolean)
      .map((m) => [m[1], m[2]]),
  );

const dir = mkdtempSync(join(tmpdir(), "zhuazhou-prod-env-"));
const envFile = join(dir, ".env.production");

try {
  const pulled = run("vercel", [
    "env",
    "pull",
    envFile,
    "--environment",
    "production",
    "--yes",
  ]);
  if (pulled.status !== 0) {
    throw new Error(
      "無法取得正式環境變數，請確認已登入 Vercel CLI（vercel login）",
    );
  }

  const env = parseEnv(readFileSync(envFile, "utf8"));
  const url = env.DATABASE_URL_UNPOOLED ?? env.DATABASE_URL;
  if (!url) throw new Error("正式環境沒有 DATABASE_URL");
  const host = new URL(url).hostname;

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  console.log(
    `\n即將把資料表結構套用到【正式資料庫】${host}` +
      `\n接下來 drizzle-kit 會列出要執行的 SQL，並逐條詢問。\n`,
  );
  const answer = (await rl.question("確定要繼續請輸入 yes：")).trim();
  rl.close();
  if (answer !== "yes") {
    console.log("已取消，沒有做任何變更。");
  } else {
    const pushed = run(
      "npx",
      ["drizzle-kit", "push", "--strict", "--verbose"],
      {
        DRIZZLE_DATABASE_URL: url,
      },
    );
    if (pushed.status !== 0) process.exitCode = pushed.status ?? 1;
  }
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  // 正式連線字串不留在電腦上
  rmSync(dir, { recursive: true, force: true });
}
