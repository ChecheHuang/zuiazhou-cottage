import type { Metadata } from "next";

// 網站正式網址。優先順序：
// 1. NEXT_PUBLIC_SITE_URL（手動指定，例如買了網域但還沒設成正式網域時）
// 2. VERCEL_PROJECT_PRODUCTION_URL（Vercel 自動提供；網域綁定並設為正式網域後會自動變成新網域）
// 3. 本機開發
export const siteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
};

export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl()}${path}`;

interface SeoContent {
  title: string;
  description: string;
  image: string;
}

// 每頁共用：標題、描述、canonical、分享預覽（Open Graph / Twitter）
export const buildPageMetadata = (
  seo: SeoContent,
  path: string,
  siteName: string,
): Metadata => {
  // 內建的 /og/*.jpg 都是 1200×630；後台上傳的圖尺寸不一定，就不標註
  const image = seo.image.startsWith("/og/")
    ? { url: seo.image, width: 1200, height: 630, alt: seo.title }
    : { url: seo.image, alt: seo.title };
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName,
      url: path,
      title: seo.title,
      description: seo.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
};
