import Link from "next/link";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";

// 頁面最底部的收尾引導：看完介紹後給「看方案」與「LINE 問檔期」兩個下一步。
// 標題留空就整塊不顯示。
export const PageCta = async ({
  title,
  text,
  primaryLabel,
  primaryHref,
  lineLabel,
  extraLabel,
  extraHref,
}: {
  extraLabel?: string;
  extraHref?: string;
  title: string;
  text?: string;
  primaryLabel: string;
  primaryHref: string;
  lineLabel: string;
}) => {
  if (!title.trim()) return null;
  const biz = await getContent(siteBusiness);
  return (
    <section className="bg-gradient-to-b from-white to-brand-beige/60 py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-2xl font-semibold text-brand md:text-3xl">{title}</h2>
        {text && (
          <p className="mt-4 whitespace-pre-line leading-relaxed text-brand-ink/80">{text}</p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {primaryLabel && (
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105"
            >
              {primaryLabel}
              <span aria-hidden>→</span>
            </Link>
          )}
          {lineLabel && (
            <a
              href={lineChatHref(biz)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#06c755] px-8 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-transform duration-300 hover:scale-105"
            >
              💬 {lineLabel}
            </a>
          )}
        </div>
        {extraLabel && extraHref && (
          <Link
            href={extraHref}
            className="mt-5 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            {extraLabel} →
          </Link>
        )}
      </div>
    </section>
  );
};
