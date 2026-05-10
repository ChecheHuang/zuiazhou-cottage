import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import { FloatingActions } from "@/components/FloatingActions";
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

export const metadata: Metadata = {
  title: "Happy 抓週小屋｜桃園楊梅抓週派對推薦",
  description:
    "桃園楊梅包場抓週派對、兒童生日派對、性別揭曉派對，從場佈、流程到攝影一站式包辦，給寶貝最美的人生第一場派對。",
};

const themeBootScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='teal'){document.documentElement.setAttribute('data-theme','teal');}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
