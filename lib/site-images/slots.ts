import {
  aboutEnvironmentGallery,
  aboutPhotoGallery,
  aboutTeams,
} from "@/data/about";
import { foodPlans } from "@/data/food";
import { services } from "@/data/home";
import { partyPlans } from "@/data/party-plans";
import { photographerPlan, photoPortfolio } from "@/data/photo";
import {
  ABOUT_PHOTO,
  BACKGROUND_SLIDESHOW,
  BIRTHDAY_PHOTO,
  GALLERY_PHOTOS,
  HERO_SLIDESHOW,
  HOST_PHOTO,
  PARALLAX_BG,
  REVIEW_PHOTOS,
} from "@/data/photos";
import { ritualSteps } from "@/data/ritual-steps";

// 後台可以更換的每一個「圖片位置」。
// - multiple: true 代表一組照片（輪播、相簿），可以新增、刪除、排序
// - multiple: false 代表單張照片，上傳新圖會直接取代
// - defaults 是資料庫沒有設定時使用的預設圖片
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

const stripEmoji = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, "").trim();

export const SLOTS: SlotDef[] = [
  // 首頁
  multi("home.hero", "首頁", "最上方大圖輪播", HERO_SLIDESHOW, "建議橫式照片"),
  single("home.about", "首頁", "關於我們", ABOUT_PHOTO),
  ...services.map((s, i) =>
    single(`home.service.${i}`, "首頁", `服務項目：${s.title}`, s.img),
  ),
  single("home.parallax", "首頁", "中段滿版背景", PARALLAX_BG, "建議橫式照片"),
  multi("home.reviews", "首頁", "好評區照片牆", REVIEW_PHOTOS),
  multi(
    "gallery",
    "首頁／寶寶派對",
    "作品集",
    GALLERY_PHOTOS,
    "首頁只顯示前 8 張，寶寶派對頁顯示全部",
  ),

  // 寶寶派對
  ...partyPlans.map((p) =>
    multi(
      `room.${p.key}`,
      "寶寶派對",
      `場地：${stripEmoji(p.title)}`,
      p.images.map((img) => img.src),
    ),
  ),
  single("party.host", "寶寶派對", "主持人介紹", HOST_PHOTO),
  ...ritualSteps.map((s) =>
    single(
      `ritual.${s.step}`,
      "寶寶派對",
      `抓周流程 ${s.step}：${s.title}`,
      s.img,
    ),
  ),
  multi("party.background", "寶寶派對", "滿版背景輪播", BACKGROUND_SLIDESHOW),
  single("party.birthday", "寶寶派對", "兒童生日方案", BIRTHDAY_PHOTO),

  // 關於我們
  single("about.hero", "關於我們", "頁首照片", ABOUT_PHOTO),
  ...aboutTeams.map((t, i) =>
    single(`about.team.${i}`, "關於我們", `團隊：${t.title}`, t.photo),
  ),
  multi("about.photos", "關於我們", "攝影作品", aboutPhotoGallery),
  multi("about.environment", "關於我們", "環境照片", aboutEnvironmentGallery),

  // 派對加購
  single("photo.hero", "派對加購", "攝影師方案主圖", photographerPlan.hero),
  multi("photo.portfolio", "派對加購", "攝影作品集", photoPortfolio),

  // 餐食加購
  ...foodPlans.map((p, i) =>
    single(`food.plan.${i}`, "餐食加購", `餐點：${p.title}`, p.photo),
  ),
];

export const SLOT_MAP: ReadonlyMap<string, SlotDef> = new Map(
  SLOTS.map((s) => [s.key, s]),
);

export type SiteImageOverrides = Record<string, string[]>;

// 預設圖片放在 public/photos，上傳的圖片放在 Vercel Blob
export const isAllowedImageUrl = (url: string) => {
  if (url.startsWith("/photos/") && !url.includes("..")) return true;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
};

export const isBlobUrl = (url: string) =>
  url.startsWith("https://") && isAllowedImageUrl(url);
