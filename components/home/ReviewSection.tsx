"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { reviews } from "@/data/home";
import { REVIEW_PHOTOS } from "@/data/photos";
import { SectionHeading } from "@/components/SectionHeading";

const Star = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-4"
  >
    <path d="M12 2l2.95 6.32 6.93.62-5.24 4.7 1.6 6.83L12 17.27l-6.24 3.2 1.6-6.83-5.24-4.7 6.93-.62L12 2z" />
  </svg>
);

export const ReviewSection = () => (
  <section
    id="reviews"
    aria-labelledby="reviews-heading"
    className="bg-gradient-to-b from-white to-brand-beige py-24 md:py-32"
  >
    <div className="mx-auto max-w-content px-6">
      <SectionHeading
        watermark="Testimonial"
        title="好評分享"
        description="爸爸媽媽們的真實回饋，是我們繼續用心做下去的最大動力。"
      />

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
        className="mt-10 grid items-stretch gap-8 md:mt-12 md:grid-cols-3"
      >
        {reviews.map((r) => (
          <motion.li
            key={r.name}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40"
          >
            <div className="flex items-center gap-4">
              <Image
                src={r.avatar}
                alt={r.name}
                width={56}
                height={56}
                unoptimized
                className="size-14 rounded-full object-cover ring-2 ring-brand-soft/40"
              />
              <div>
                <p className="font-semibold text-brand">{r.name}</p>
                <p className="text-xs text-brand-ink/70">{r.relation}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-0.5 text-brand">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <p className="mt-4 flex-1 leading-relaxed text-brand-ink">
              「{r.body}」
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
        className="mt-8 grid grid-cols-4 gap-3 md:mt-10 md:grid-cols-8 md:gap-4"
      >
        {REVIEW_PHOTOS.map((src) => (
          <motion.div
            key={src}
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 12vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/20" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);
