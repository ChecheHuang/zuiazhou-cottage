"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/home";
import { SectionHeading } from "@/components/SectionHeading";

export const BlogSection = () => (
  <section
    id="blog"
    aria-labelledby="blog-heading"
    className="bg-gradient-to-b from-white to-brand-beige py-24 md:py-32"
  >
    <div className="mx-auto max-w-content px-6">
      <SectionHeading
        watermark="Blog"
        title="部落格"
        description="一邊籌備派對，一邊累積知識：場地、道具、流程、禁忌全部一次告訴你。"
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
        {blogPosts.map((post) => (
          <motion.li
            key={post.slug}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(237,160,157,0.18)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand backdrop-blur">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-accent">
                  Read · {post.readTime}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-brand-ink md:text-xl">
                  {post.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-ink/80">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand transition-all duration-300 group-hover:gap-3">
                  閱讀更多
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);
