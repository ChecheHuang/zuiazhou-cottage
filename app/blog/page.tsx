import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ARTICLES } from "@/lib/blog/articles";
import { blogSeo, blogText } from "@/lib/site-content/blocks/blog";
import { homeBlog } from "@/lib/site-content/blocks/home";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, biz] = await Promise.all([
    getContent(blogSeo),
    getContent(siteBusiness),
  ]);
  return buildPageMetadata(seo, "/blog", biz.brand);
}

export default async function BlogIndexPage() {
  const [text, card] = await Promise.all([
    getContent(blogText),
    getContent(homeBlog),
  ]);
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6">
          <SectionHeading
            as="h1"
            watermark={text.watermark}
            title={text.title}
            description={text.description}
          />
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <ArticleCard
                  article={a}
                  readLabel={card.readLabel}
                  readMore={card.readMore}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
