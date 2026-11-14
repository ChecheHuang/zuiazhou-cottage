// 模擬抓周用的物品工具（前後台共用，不可 import server-only 模組）

export interface PlayItem {
  emoji: string;
  name: string;
  meaning: string;
}

export const MAT_SIZE = 8;
/** 自選物品時最少要放幾樣 */
export const MIN_MAT_SIZE = 2;
export const MAX_NAME_LENGTH = 10;

// 職業物品＋傳統物品合併；名稱是分享連結裡的識別，重複名稱只留第一個
export const mergePlayItems = (...groups: PlayItem[][]): PlayItem[] => {
  const seen = new Set<string>();
  return groups.flat().filter((item) => {
    const name = item.name.trim();
    if (!name || !item.emoji.trim() || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
};

export const findPlayItem = (items: PlayItem[], name: unknown) =>
  typeof name === "string"
    ? items.find((item) => item.name === name.trim())
    : undefined;

// 隨機取 n 個不重複的物品擺上墊子（Fisher–Yates，不修改原陣列）
export const pickMatItems = (items: PlayItem[], n = MAT_SIZE): PlayItem[] => {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
};

// 去掉控制字元與多餘空白，限制長度；空字串代表沒填
export const cleanBabyName = (raw: unknown): string =>
  typeof raw === "string"
    ? [...raw.replace(/[\p{Cc}\p{Cf}]/gu, "").trim()]
        .slice(0, MAX_NAME_LENGTH)
        .join("")
    : "";

export const fillTemplate = (
  template: string,
  values: { name: string; item: string },
) => template.replaceAll("{name}", values.name).replaceAll("{item}", values.item);

export const resultPath = (item: string, babyName: string) => {
  const params = new URLSearchParams({ item });
  if (babyName) params.set("name", babyName);
  return `/play?${params.toString()}`;
};
