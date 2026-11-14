import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// 後台採單一管理密碼：密碼放在環境變數 ADMIN_PASSWORD，
// 登入成功後發一個用 ADMIN_SESSION_SECRET 簽章的 cookie。
export const ADMIN_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

const getSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET 未設定或長度不足 32 字元");
  }
  return secret;
};

const sign = (payload: string) =>
  createHmac("sha256", getSecret()).update(payload).digest("base64url");

const safeEqual = (a: string, b: string) => {
  // 先雜湊成相同長度，避免長度差異造成時間差
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

export const checkPassword = (input: string) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD 未設定");
  return safeEqual(input, expected);
};

export const createSessionToken = () => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
};

export const verifySessionToken = (token: string | undefined) => {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const [, exp, sig] = parts;
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) {
    return false;
  }
  return safeEqual(sig, sign(`admin.${exp}`));
};

export const isAdmin = async () =>
  verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value);

// 每個 Server Action / Route Handler 都要再驗一次，不能只靠 proxy
export const requireAdmin = async () => {
  if (!(await isAdmin())) throw new Error("未登入或登入已過期");
};
