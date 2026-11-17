// 模擬抓周寶寶的衣服（前後台共用：分享網址會帶衣服，伺服器端也要能驗證）

export const OUTFIT_IDS = ["tiger", "onesie", "overalls", "tutu"] as const;
export type OutfitId = (typeof OUTFIT_IDS)[number];

/** 預設穿虎衣：抓周儀式本來就要穿虎衣，店裡方案也有附 */
export const DEFAULT_OUTFIT: OutfitId = "tiger";

export const parseOutfit = (raw: unknown): OutfitId =>
  OUTFIT_IDS.find((id) => id === raw) ?? DEFAULT_OUTFIT;
