// pnpm db:reset-dev
// 把 Neon 的 development 分支重置成 main（正式資料庫）目前的內容。
// 開發資料庫原本的資料會被整個覆蓋。正式資料庫不會被修改。
//
// 第一次使用前要登入 Neon CLI：npx neonctl auth

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const PROJECT_ID = "red-bonus-61061548";
const DEV_BRANCH = "development";
const isWindows = process.platform === "win32";

// Windows 上 npx/vercel 是 .cmd，要透過 shell 執行；整串指令一起傳，避免 Node 的 DEP0190 警告
const quote = (a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);
const spawn = (cmd, args, opts) =>
  isWindows
    ? spawnSync([cmd, ...args].map(quote).join(" "), { ...opts, shell: true })
    : spawnSync(cmd, args, opts);

const run = (args) =>
  spawn("npx", ["-y", "neonctl@latest", ...args, "--project-id", PROJECT_ID], {
    stdio: "inherit",
  });

const rl = createInterface({ input: process.stdin, output: process.stdout });
console.log(
  `\n即將把 Neon 分支「${DEV_BRANCH}」重置成正式資料庫（main）目前的內容。` +
    `\n⚠ 開發資料庫裡的資料會全部被覆蓋，正式資料庫不受影響。\n`,
);
const answer = (await rl.question("確定要繼續請輸入 yes：")).trim();
rl.close();
if (answer !== "yes") {
  console.log("已取消，沒有做任何變更。");
  process.exit(0);
}

const result = run(["branches", "reset", DEV_BRANCH, "--parent"]);
if (result.status !== 0) {
  console.error("\n重置失敗。如果訊息顯示尚未登入，請先執行：npx neonctl auth");
  process.exit(result.status ?? 1);
}
console.log("\n✓ 開發資料庫已重置成正式資料的最新內容。");
