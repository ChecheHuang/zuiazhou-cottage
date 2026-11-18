"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useContent } from "@/components/SiteContentProvider";
import { ARTICLES } from "@/lib/blog/articles";
import { homeBlog } from "@/lib/site-content/blocks/home";

export const BlogSection = () => {
  const c = useContent(homeBlog);
  const posts = ARTICLES.slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="bg-gradient-to-b from-white to-brand-beige py-24 md:py-32"
    >
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          watermark={c.watermark}
          title={c.title}
          description={c.description}
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="mt-14 grid gap-8 md:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.li
              key={post.slug}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ArticleCard
                article={post}
                readLabel={c.readLabel}
                readMore={c.readMore}
              />
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand-strong/90"
          >
            {c.button}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
