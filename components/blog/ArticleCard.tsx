import Image from "next/image";
import Link from "next/link";
import { readMinutes, type Article } from "@/lib/blog/articles";

// 文章卡片：首頁部落格區與 /blog 列表共用
export const ArticleCard = ({
  article,
  readLabel,
  readMore,
}: {
  article: Article;
  readLabel: string;
  readMore: string;
}) => (
  <Link
    href={`/blog/${article.slug}`}
    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(237,160,157,0.20)]"
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <Image
        src={article.cover}
        alt={article.title}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand backdrop-blur">
        {article.category}
      </span>
    </div>
    <div className="flex flex-1 flex-col p-6 md:p-7">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-accent">
        {readLabel} · {readMinutes(article)} 分鐘
      </p>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-brand-ink md:text-xl">
        {article.title}
      </h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-ink/80">
        {article.excerpt}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand transition-all duration-300 group-hover:gap-3">
        {readMore}
        <span aria-hidden>→</span>
      </span>
    </div>
  </Link>
);
