import {
  ABOUT_PHOTO,
  BACKGROUND_SLIDESHOW,
  BIRTHDAY_PHOTO,
  GALLERY_PHOTOS,
  HERO_SLIDESHOW,
  HOST_PHOTO,
  REVIEW_PHOTOS,
  SERVICE_PHOTOS,
} from "@/data/photos";

export { isAllowedImageUrl, isBlobUrl } from "./urls";

// 後台「圖片」分頁可以更換的固定圖片位置。
// - multiple: true 代表一組照片（輪播、相簿），可以新增、刪除、排序
// - multiple: false 代表單張照片，上傳新圖會直接取代
// - defaults 是資料庫沒有設定時使用的預設圖片
//
// 屬於清單項目的圖片（服務卡片、四個場地、抓周流程、團隊、餐點方案…）
// 放在各自的文字區塊裡（lib/site-content/blocks），跟著項目一起新增、刪除。
export interface SlotDef {
  key: string;
  page: string;
  label: string;
  hint?: string;
  multiple: boolean;
  defaults: string[];
}

const single = (
  key: string,
  page: string,
  label: string,
  src: string,
  hint?: string,
): SlotDef => ({ key, page, label, hint, multiple: false, defaults: [src] });

const multi = (
  key: string,
  page: string,
  label: string,
  srcs: string[],
  hint?: string,
): SlotDef => ({ key, page, label, hint, multiple: true, defaults: srcs });

export const SLOTS: SlotDef[] = [
  // 首頁
  multi("home.hero", "首頁", "最上方大圖輪播", HERO_SLIDESHOW, "建議橫式照片"),
  single("home.about", "首頁", "關於我們", ABOUT_PHOTO),
  multi("home.reviews", "首頁", "好評區照片牆", REVIEW_PHOTOS),
  multi(
    "gallery",
    "首頁／寶寶派對",
    "作品集",
    GALLERY_PHOTOS,
    "首頁只顯示前 8 張，寶寶派對頁顯示全部",
  ),

  // 寶寶派對
  single("party.host", "寶寶派對", "主持人介紹", HOST_PHOTO),
  multi("party.background", "寶寶派對", "滿版背景輪播", BACKGROUND_SLIDESHOW),
  single("party.birthday", "寶寶派對", "兒童生日方案", BIRTHDAY_PHOTO),

  // 關於我們
  single("about.hero", "關於我們", "頁首照片", ABOUT_PHOTO),
  multi("about.photos", "關於我們", "攝影作品", GALLERY_PHOTOS.slice(0, 12)),
  multi(
    "about.environment",
    "關於我們",
    "環境照片",
    GALLERY_PHOTOS.slice(12, 20),
  ),

  // 派對加購
  single("photo.hero", "派對加購", "攝影師方案主圖", SERVICE_PHOTOS.babyParty),
  multi(
    "photo.portfolio",
    "派對加購",
    "攝影作品集",
    GALLERY_PHOTOS.slice(0, 12),
  ),
];

export const SLOT_MAP: ReadonlyMap<string, SlotDef> = new Map(
  SLOTS.map((s) => [s.key, s]),
);

export type SiteImageOverrides = Record<string, string[]>;
