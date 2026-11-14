import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import { FloatingActions } from "@/components/FloatingActions";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { SiteImagesProvider } from "@/components/SiteImagesProvider";
import { layoutSeo } from "@/lib/site-content/blocks/layout";
import { getContent, getContentOverrides } from "@/lib/site-content/server";
import { getSiteImageOverrides } from "@/lib/site-images/server";
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
  const seo = await getContent(layoutSeo);
  return { title: seo.title, description: seo.description };
}

const themeBootScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='teal'){document.documentElement.setAttribute('data-theme','teal');}}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [imageOverrides, contentOverrides] = await Promise.all([
    getSiteImageOverrides(),
    getContentOverrides(),
  ]);

  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTC.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-brand-ink">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <SiteContentProvider overrides={contentOverrides}>
          <SiteImagesProvider overrides={imageOverrides}>
            {children}
            <FloatingActions />
          </SiteImagesProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
