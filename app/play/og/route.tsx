import { ImageResponse } from "next/og";
import { findPlayItem } from "@/lib/play/items";
import { getPlayItems } from "@/lib/play/server";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";

// 分享抓周結果時的預覽圖（1200×630）。
// 只依「物品」產生，不含寶寶小名：小名不會被送到字型服務，同一物品的圖也能共用快取。

const HEADLINE = "寶寶抓到了";
const CTA = "線上模擬抓周，換你家寶寶試試！";

const BRAND = "#eda09d";
const INK = "#555555";
const CREAM = "#ffeee1";

// Google Fonts 依 text 只回傳用到的字，中文字型才不會太大（ImageResponse 限 500KB）
const loadFont = async (text: string) => {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("找不到字型檔網址");
  return fetch(url).then((res) => res.arrayBuffer());
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const [items, biz] = await Promise.all([
    getPlayItems(),
    getContent(siteBusiness),
  ]);
  const item = findPlayItem(items, searchParams.get("item"));
  if (!item) return new Response("Not found", { status: 404 });

  const text = [HEADLINE, CTA, item.name, item.meaning, biz.brand].join("");
  const fonts = await loadFont(text)
    .then((data) => [
      { name: "Noto Sans TC", data, weight: 700 as const, style: "normal" as const },
    ])
    .catch((error) => {
      console.error("[play/og] 載入字型失敗", error);
      return undefined;
    });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 90px",
          gap: 70,
          fontFamily: "Noto Sans TC",
          color: INK,
          background: `linear-gradient(135deg, ${CREAM} 0%, #f5eae2 45%, #ffffff 100%)`,
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            background: "#ffffff",
            border: `16px solid ${BRAND}55`,
            fontSize: 200,
          }}
        >
          {item.emoji}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 44, color: BRAND }}>{HEADLINE}</div>
          <div
            style={{
              fontSize: 110,
              lineHeight: 1.1,
              marginTop: 8,
              color: BRAND,
            }}
          >
            {item.name}
          </div>
          {item.meaning && (
            <div style={{ fontSize: 44, marginTop: 20 }}>{item.meaning}</div>
          )}
          <div
            style={{
              display: "flex",
              marginTop: 48,
              fontSize: 30,
              color: "#8a8a8a",
            }}
          >
            {CTA}
          </div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 30, color: BRAND }}>
            {biz.brand}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
