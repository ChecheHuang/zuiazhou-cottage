// 輸出 schema.org 結構化資料。內容可能來自後台輸入，
// 所以把 "<" 轉成 <，避免被當成 HTML（Next.js 官方建議做法）。
export const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);
