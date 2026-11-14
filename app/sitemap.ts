import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/products/server";
import { absoluteUrl } from "@/lib/seo";

// 新增公開頁面時記得加在這裡
const PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/baby-party", priority: 0.9, changeFrequency: "weekly" },
  { path: "/photo", priority: 0.7, changeFrequency: "monthly" },
  { path: "/food", priority: 0.7, changeFrequency: "monthly" },
  { path: "/products", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const products = await getPublishedProducts();
  return [
    ...PAGES.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    })),
    // 已上架的商品頁
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.id}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
