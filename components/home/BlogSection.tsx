"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useContent } from "@/components/SiteContentProvider";
import { homeBlog } from "@/lib/site-content/blocks/home";

export const BlogSection = () => {
  const c = useContent(homeBlog);
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
          {c.posts.map((post, i) => (
            <motion.li
              key={`${i}-${post.title}`}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* 文章頁尚未上線：卡片暫不可點，之後有 /blog/[slug] 再改回 Link */}
              <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand backdrop-blur">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-accent">
                    {c.readLabel} · {post.readTime}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-brand-ink md:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-brand-ink/80">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex w-fit items-center rounded-full bg-brand-soft/30 px-3 py-1 text-xs font-medium text-brand">
                    {c.comingSoon}
                  </span>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};
