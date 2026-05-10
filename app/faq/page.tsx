import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { businessInfo } from "@/data/home";

export const metadata = {
  title: "常見問題 - Happy 抓週小屋",
  description:
    "抓周流程、人數限制、攝影、寵物入場、雙寶加價等常見問題與貼心提醒。",
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-beige/55 py-20 md:py-28">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 top-10 hidden size-48 rounded-full bg-brand-soft/30 blur-3xl md:block"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-10 hidden size-56 rounded-full bg-brand-accent/20 blur-3xl md:block"
          />

          <div className="relative mx-auto max-w-content px-6">
            <SectionHeading
              watermark="FAQ"
              title="常見問題"
              description="新手爸媽最常問的問題與貼心提醒，這裡整理好了 12 個常見疑問。"
            />
            <FaqAccordion />

            <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-brand-soft/50 bg-white px-8 py-8 text-center shadow-[0_18px_40px_rgba(237,160,157,0.10)]">
              <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
                Still have questions?
              </p>
              <p className="text-brand-ink">
                找不到您要的答案？歡迎直接 LINE 線上諮詢，我們會逐項回覆。
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={businessInfo.socials.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-all duration-300 hover:scale-105"
                >
                  LINE 線上諮詢
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
                >
                  填寫聯絡表單
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
