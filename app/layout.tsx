import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_TC } from "next/font/google";
import { FloatingActions } from "@/components/FloatingActions";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { SiteFlagsProvider } from "@/components/SiteFlagsProvider";
import { SiteImagesProvider } from "@/components/SiteImagesProvider";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { layoutSeo } from "@/lib/site-content/blocks/layout";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent, getContentOverrides } from "@/lib/site-content/server";
import { getSiteImageOverrides } from "@/lib/site-images/server";
import { getPublishedProducts } from "@/lib/products/server";
import { buildPageMetadata, siteUrl } from "@/lib/seo";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [seo, biz] = await Promise.all([
    getContent(layoutSeo),
    getContent(siteBusiness),
  ]);
  // 根 layout 不設 canonical，避免沒有自己 canonical 的頁面（例如 404）被指到首頁
  const { title, description, openGraph, twitter } = buildPageMetadata(
    seo,
    "/",
    biz.brand,
  );
  return {
    title,
    description,
    openGraph,
    twitter,
    metadataBase: new URL(siteUrl()),
    applicationName: biz.brand,
  };
}

// 在 <head> 用一般的內嵌 script，讓瀏覽器解析 HTML 時就同步套用主題，第一次繪製就是正確顏色。
// 不能用 next/script 的 beforeInteractive：App Router 會把它排進 Next.js 的佇列，
// 等框架載入後才執行，畫面會先閃一下預設的粉色再換成青綠。
const themeBootScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='teal'){document.documentElement.setAttribute('data-theme','teal');}}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [imageOverrides, contentOverrides, products] = await Promise.all([
    getSiteImageOverrides(),
    getContentOverrides(),
    getPublishedProducts(),
  ]);

  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTC.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-brand-ink">
        <SiteContentProvider overrides={contentOverrides}>
          <SiteFlagsProvider flags={{ hasProducts: products.length > 0 }}>
          <SiteImagesProvider overrides={imageOverrides}>
            <MotionProvider>
              {children}
              <FloatingActions />
            </MotionProvider>
          </SiteImagesProvider>
          </SiteFlagsProvider>
        </SiteContentProvider>
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
