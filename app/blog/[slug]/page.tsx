import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ARTICLES, getArticle, readMinutes } from "@/lib/blog/articles";
import { blogText } from "@/lib/site-content/blocks/blog";
import { homeBlog } from "@/lib/site-content/blocks/home";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(
    {
      title: `${article.title} - ${biz.brand}`,
      description: article.excerpt,
      image: article.cover,
    },
    `/blog/${article.slug}`,
    biz.brand,
  );
}

const formatDate = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return `${y} 年 ${m} 月 ${d} 日`;
};

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const [text, card, biz] = await Promise.all([
    getContent(blogText),
    getContent(homeBlog),
    getContent(siteBusiness),
  ]);
  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);
  const url = absoluteUrl(`/blog/${article.slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          image: [absoluteUrl(article.cover)],
          datePublished: article.publishedAt,
          dateModified: article.updatedAt ?? article.publishedAt,
          mainEntityOfPage: url,
          url,
          author: { "@type": "Organization", name: biz.brand, url: absoluteUrl("/") },
          publisher: { "@type": "Organization", name: biz.brand, url: absoluteUrl("/") },
        }}
      />
      <SiteHeader />
      <main className="flex-1 py-16 md:py-24">
        <article className="mx-auto max-w-3xl px-6">
          <Link href="/blog" className="text-sm text-brand hover:underline">
            {text.backLabel}
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-brand-accent">
            {article.category} · {card.readLabel} {readMinutes(article)} 分鐘
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-snug text-brand md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-brand-ink/60">
            {text.publishedLabel}{" "}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-8">
            <ArticleBody sections={article.sections} />
          </div>
        </article>

        {others.length > 0 && (
          <aside className="mx-auto mt-20 max-w-content px-6" aria-labelledby="more-heading">
            <h2 id="more-heading" className="text-center text-2xl font-semibold text-brand">
              {text.moreTitle}
            </h2>
            <ul className="mx-auto mt-8 grid max-w-4xl gap-8 md:grid-cols-2">
              {others.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} readLabel={card.readLabel} readMore={card.readMore} />
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
