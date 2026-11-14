import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

export const db = url ? drizzle({ client: neon(url), schema }) : null;

export const requireDb = () => {
  if (!db) throw new Error("DATABASE_URL 未設定，無法連線資料庫");
  return db;
};
