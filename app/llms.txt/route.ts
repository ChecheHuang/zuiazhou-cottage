import { ARTICLES } from "@/lib/blog/articles";
import { partyNotices, partyPlans } from "@/lib/site-content/blocks/baby-party";
import { faqList } from "@/lib/site-content/blocks/faq";
import { homeAbout, homeSeo } from "@/lib/site-content/blocks/home";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { absoluteUrl } from "@/lib/seo";

// /llms.txt：給 ChatGPT、Gemini 等 AI 搜尋讀的網站摘要（https://llmstxt.org 格式）。
// 內容全部取自後台可改的文字區塊，後台改價格或問答後這裡會自動跟著變。

// 主要頁面；新增公開頁面時可順手加上
const PAGES: { path: string; name: string; desc: string }[] = [
  { path: "/baby-party", name: "寶寶派對方案", desc: "四大主題場地、價格、方案內容與注意事項" },
  { path: "/photo", name: "派對加購方案", desc: "攝影師與其他加購項目" },
  { path: "/food", name: "餐食加購", desc: "派對餐點方案" },
  { path: "/products", name: "商品專區", desc: "抓周道具與紀念商品" },
  { path: "/play", name: "線上模擬抓周", desc: "線上抓周小遊戲" },
  { path: "/invite", name: "派對邀請文案產生器", desc: "抓周、收涎、生日、性別揭曉邀請文案" },
  { path: "/faq", name: "常見問題", desc: "流程、人數、攝影、寵物、雙寶加價等問答" },
  { path: "/about", name: "關於我們", desc: "主理人與團隊介紹" },
  { path: "/contact", name: "聯絡我們", desc: "LINE、電話、地址與預約諮詢" },
];

// 單行化：去掉換行與多餘空白，避免破壞 Markdown 清單
const oneLine = (s: string) => s.replace(/\s*\n\s*/g, " ").trim();

export async function GET() {
  const [biz, seo, about, plans, notices, faq] = await Promise.all([
    getContent(siteBusiness),
    getContent(homeSeo),
    getContent(homeAbout),
    getContent(partyPlans),
    getContent(partyNotices),
    getContent(faqList),
  ]);

  const lines: string[] = [
    `# ${biz.brand}`,
    "",
    `> ${oneLine(seo.description)}`,
    "",
    ...about.paragraphs.flatMap((p) => [oneLine(p), ""]),
    "## 店家資訊",
    "",
    `- 地址：${biz.address}${biz.landmark ? `（${biz.landmark}）` : ""}`,
    `- 營業時間：${biz.hours}`,
    `- 電話：${biz.phone}`,
    `- 官方 LINE：${biz.lineId}（${biz.lineUrl}）`,
    biz.instagramUrl && `- Instagram：${biz.instagramUrl}`,
    biz.facebookUrl && `- Facebook：${biz.facebookUrl}`,
    `- 官方網站：${absoluteUrl("/")}`,
    "",
    `## ${plans.heading}`,
    "",
    ...plans.plans.map(
      (p) =>
        `- ${p.title.replace(/^[^\p{L}\p{N}]+/u, "").trim()}${p.price ? `：${p.price}` : ""}｜${p.features.map(oneLine).join("；")}`,
    ),
    "",
    oneLine(plans.includesTitle),
    "",
    ...plans.includes.map((i) => `- ${oneLine(i)}`),
    "",
    `## ${notices.heading}`,
    "",
    ...notices.bullets.map((b) => `- ${oneLine(b)}`),
    notices.cancelTitle && `- ${oneLine(notices.cancelTitle)}：${oneLine(notices.cancelBody)}`,
    "",
    "## 常見問題",
    "",
    ...faq.items.flatMap((f) => [`### ${oneLine(f.q)}`, "", oneLine(f.a), ""]),
    "## 頁面",
    "",
    ...PAGES.map((p) => `- [${p.name}](${absoluteUrl(p.path)})：${p.desc}`),
    "",
    "## 文章",
    "",
    ...ARTICLES.map((a) => `- [${a.title}](${absoluteUrl(`/blog/${a.slug}`)})：${a.excerpt}`),
    "",
  ].filter((l): l is string => typeof l === "string");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
