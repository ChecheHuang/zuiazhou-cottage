"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSlotImages } from "@/components/SiteImagesProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { InstagramButton } from "@/components/InstagramButton";
import { useContent } from "@/components/SiteContentProvider";
import { homeReviews } from "@/lib/site-content/blocks/home";

const Star = () => (
  <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M12 2l2.95 6.32 6.93.62-5.24 4.7 1.6 6.83L12 17.27l-6.24 3.2 1.6-6.83-5.24-4.7 6.93-.62L12 2z" />
  </svg>
);

// 後台填的是文字，轉成 0–5 顆星
const starCount = (rating: string) =>
  Math.min(5, Math.max(0, Number.parseInt(rating, 10) || 0));

export const ReviewSection = () => {
  const photos = useSlotImages("home.reviews");
  const c = useContent(homeReviews);
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
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
          className="mt-10 grid items-stretch gap-8 md:mt-12 md:grid-cols-3"
        >
          {c.items.map((r, idx) => (
            <motion.li
              key={`${idx}-${r.name}`}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-soft/40 text-xl font-semibold text-brand ring-2 ring-brand-soft/40"
                >
                  {r.avatarText}
                </span>
                <div>
                  <p className="font-semibold text-brand">{r.name}</p>
                  <p className="text-xs text-brand-ink/70">{r.relation}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-0.5 text-brand">
                {Array.from({ length: starCount(r.rating) }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="mt-4 flex-1 whitespace-pre-line leading-relaxed text-brand-ink">
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
          {photos.map((src, i) => (
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
                alt={`${c.title} 照片 ${i + 1}`}
                fill
                sizes="(min-width: 768px) 12vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/20" />
            </motion.div>
          ))}
        </motion.div>
        {c.igButton && (
          <div className="mt-10 text-center">
            <InstagramButton label={c.igButton} />
          </div>
        )}
      </div>
    </section>
  );
};
