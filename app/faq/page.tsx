import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getContent } from "@/lib/site-content/server";
import type { Metadata } from "next";
import {
  faqCta,
  faqIntro,
  faqList,
  faqSeo,
} from "@/lib/site-content/blocks/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent(faqSeo);
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(seo, "/faq", biz.brand);
}

export default async function FaqPage() {
  const [biz, intro, cta, list] = await Promise.all([
    getContent(siteBusiness),
    getContent(faqIntro),
    getContent(faqCta),
    getContent(faqList),
  ]);
  // FAQPage 結構化資料：讓 Google／AI 搜尋讀懂問答內容
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.items
      .filter((item) => item.q.trim() && item.a.trim())
      .map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
  };
  return (
    <>
      <JsonLd data={faqJsonLd} />
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
              as="h1"
              watermark={intro.watermark}
              title={intro.title}
              description={intro.description}
            />
            <FaqAccordion />

            <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-brand-soft/50 bg-white px-8 py-8 text-center shadow-[0_18px_40px_rgba(237,160,157,0.10)]">
              <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
                {cta.eyebrow}
              </p>
              <p className="whitespace-pre-line text-brand-ink">{cta.text}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={lineChatHref(biz)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-all duration-300 hover:scale-105"
                >
                  {cta.lineButton}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
                >
                  {cta.formButton}
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
