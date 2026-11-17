import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { playGrabStats } from "@/lib/db/schema";
import { findPlayItem } from "@/lib/play/items";
import { getPlayItems } from "@/lib/play/server";
import type { GrabStats } from "@/lib/play/stats";

// 線上模擬抓周的統計：
//   POST { item } → 這個物品 +1，回傳最新統計（自己玩出結果時）
//   GET ?item=    → 只讀統計（點開別人分享的結果時）
// 只接受目前遊戲裡真的有的物品；沒有資料庫或讀寫失敗時回傳 null，前台就不顯示。

const readStats = async (item: string): Promise<GrabStats | null> => {
  if (!db) return null;
  const [row] = await db
    .select({
      total: sql<string>`coalesce(sum(${playGrabStats.count}), 0)`,
      count: sql<string>`coalesce(sum(${playGrabStats.count}) filter (where ${playGrabStats.item} = ${item}), 0)`,
    })
    .from(playGrabStats);
  return { total: Number(row?.total ?? 0), count: Number(row?.count ?? 0) };
};

const validItem = async (raw: unknown) =>
  findPlayItem(await getPlayItems(), raw)?.name;

export async function GET(request: Request) {
  const item = await validItem(new URL(request.url).searchParams.get("item"));
  if (!item) return Response.json(null, { status: 400 });
  try {
    return Response.json(await readStats(item));
  } catch (error) {
    console.error("[play/stats] 讀取失敗", error);
    return Response.json(null);
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const item = await validItem(
    typeof body === "object" && body !== null && "item" in body
      ? body.item
      : null,
  );
  if (!item) return Response.json(null, { status: 400 });
  if (!db) return Response.json(null);
  try {
    await db
      .insert(playGrabStats)
      .values({ item, count: 1 })
      .onConflictDoUpdate({
        target: playGrabStats.item,
        set: { count: sql`${playGrabStats.count} + 1`, updatedAt: new Date() },
      });
    return Response.json(await readStats(item));
  } catch (error) {
    console.error("[play/stats] 寫入失敗", error);
    return Response.json(null);
  }
}
