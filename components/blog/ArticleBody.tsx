import Image from "next/image";
import Link from "next/link";
import type { ArticleSection } from "@/lib/blog/articles";
import {
  partyCareerItems,
  partyPlans,
  partyRitual,
  partyTraditionalItems,
} from "@/lib/site-content/blocks/baby-party";
import { blogText } from "@/lib/site-content/blocks/blog";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";

// 文章內文：一般段落直接排版；引用網站資料的區塊（場地、物品、流程）讀後台最新內容

const ItemTable = ({
  items,
}: {
  items: { emoji: string; name: string; meaning: string }[];
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-brand-soft/60 text-brand">
          <th className="py-2 pr-4 font-semibold">物品</th>
          <th className="py-2 font-semibold">象徵意義</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it, i) => (
          <tr key={`${i}-${it.name}`} className="border-b border-brand-soft/30">
            <td className="py-2 pr-4 whitespace-nowrap">
              <span aria-hidden className="mr-2">
                {it.emoji}
              </span>
              {it.name}
            </td>
            <td className="py-2 text-brand-ink/80">{it.meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** 目錄用：第 n 個 h2 的錨點 id */
export const sectionAnchor = (n: number) => `s${n + 1}`;

const SectionView = async ({
  section,
  anchor,
  articleTitle,
}: {
  section: ArticleSection;
  anchor?: string;
  articleTitle: string;
}) => {
  switch (section.kind) {
    case "h2":
      return (
        <h2 id={anchor} className="mt-12 text-2xl font-semibold text-brand md:text-3xl">
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 text-xl font-semibold text-brand-ink">{section.text}</h3>
      );
    case "p":
      return <p className="mt-4 leading-loose">{section.text}</p>;
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed marker:text-brand">
          {section.items.map((t, i) => (
            <li key={`${i}-${t}`}>{t}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed marker:font-semibold marker:text-brand">
          {section.items.map((t, i) => (
            <li key={`${i}-${t}`}>{t}</li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-brand-soft/50">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="bg-brand-soft/25 text-brand">
              <tr>
                {section.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i} className="border-t border-brand-soft/40">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={j === 0 ? "px-4 py-3 font-medium text-brand-ink" : "px-4 py-3"}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
      return (
        <p className="mt-6 rounded-2xl bg-brand-beige/70 px-5 py-4 text-sm leading-relaxed">
          💡 {section.text}
        </p>
      );
    case "link":
      return (
        <p className="mt-5">
          <Link
            href={section.href}
            className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft/20"
          >
            {section.text}
            <span aria-hidden>→</span>
          </Link>
        </p>
      );
    case "plans": {
      const [c, text] = await Promise.all([
        getContent(partyPlans),
        getContent(blogText),
      ]);
      return (
        <div className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {c.plans.map((p, i) => {
              const [intro, ...tags] = p.features;
              return (
                <div
                  key={`${i}-${p.title}`}
                  className="overflow-hidden rounded-2xl bg-white ring-1 ring-brand-soft/50"
                >
                  {p.images[0] && (
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={p.images[0]}
                        alt={p.title.replace(/^[^\p{L}\p{N}]+/u, "").trim()}
                        fill
                        sizes="(min-width: 640px) 360px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-brand">
                      {p.title}
                      {p.price && (
                        <span className="ml-2 text-brand-accent">{p.price}</span>
                      )}
                    </p>
                    {tags.length > 0 && (
                      <p className="mt-1 text-sm text-brand-ink/70">{tags.join("・")}</p>
                    )}
                    {intro && <p className="mt-2 text-sm leading-relaxed">{intro}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          {c.includes.length > 0 && (
            <div className="mt-5 rounded-2xl bg-brand-soft/15 px-5 py-4 text-sm">
              <p className="font-medium text-brand">{c.includesTitle}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-brand-accent">
                {c.includes.map((t, i) => (
                  <li key={`${i}-${t}`}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-5">
            <Link
              href="/baby-party#plans"
              className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft/20"
            >
              {text.plansButton}
              <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      );
    }
    case "careerItems":
      return (
        <div className="mt-4">
          <ItemTable items={(await getContent(partyCareerItems)).items} />
        </div>
      );
    case "traditionalItems":
      return (
        <div className="mt-4">
          <ItemTable items={(await getContent(partyTraditionalItems)).items} />
        </div>
      );
    case "ritual": {
      const c = await getContent(partyRitual);
      return (
        <ol className="mt-6 space-y-4">
          {c.steps.map((s, i) => (
            <li key={`${i}-${s.title}`} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-brand-ink">{s.title}</p>
                <p className="mt-1 leading-relaxed text-brand-ink/80">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    }
    case "cta": {
      const [biz, text] = await Promise.all([
        getContent(siteBusiness),
        getContent(blogText),
      ]);
      return (
        <div className="mt-12 rounded-3xl bg-brand-soft/25 px-6 py-8 text-center">
          <p className="leading-relaxed text-brand-ink">{section.text}</p>
          <a
            href={lineChatHref(biz, text.ctaMessage.replaceAll("{文章}", articleTitle))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
          >
            {text.ctaButton}
            <span aria-hidden>→</span>
          </a>
        </div>
      );
    }
  }
};

export const ArticleBody = ({
  sections,
  articleTitle,
}: {
  sections: ArticleSection[];
  articleTitle: string;
}) => {
  let h2Count = 0;
  return (
    <div className="text-base text-brand-ink/90 md:text-[17px]">
      {sections.map((s, i) => (
        <SectionView
          key={i}
          section={s}
          anchor={s.kind === "h2" ? sectionAnchor(h2Count++) : undefined}
          articleTitle={articleTitle}
        />
      ))}
    </div>
  );
};
