import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { layoutNotFound } from "@/lib/site-content/blocks/layout";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";

// 網址打錯、連結失效時顯示（取代 Next.js 內建的英文 404）
export async function generateMetadata(): Promise<Metadata> {
  const [c, biz] = await Promise.all([
    getContent(layoutNotFound),
    getContent(siteBusiness),
  ]);
  return { title: `${c.title} - ${biz.brand}`, robots: { index: false } };
}

export default async function NotFound() {
  const [c, biz] = await Promise.all([
    getContent(layoutNotFound),
    getContent(siteBusiness),
  ]);
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center bg-brand-beige/40 py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <p className="font-display text-7xl italic text-brand-soft">404</p>
          <h1 className="mt-4 text-3xl font-semibold text-brand">{c.title}</h1>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-brand-ink/80">
            {c.text}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-brand-strong px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30"
            >
              {c.homeButton}
            </Link>
            <Link
              href="/#rooms"
              className="rounded-full border border-brand/40 bg-white px-8 py-3 text-sm font-medium text-brand"
            >
              {c.plansButton}
            </Link>
            <a
              href={lineChatHref(biz)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#06c755] px-8 py-3 text-sm font-medium text-white"
            >
              💬 {c.lineButton}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
