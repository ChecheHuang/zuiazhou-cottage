"use client";

import { useSlotImage } from "@/components/SiteImagesProvider";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { photoPlan } from "@/lib/site-content/blocks/photo";

export const PhotographerPlan = () => {
  const hero = useSlotImage("photo.hero");
  const biz = useContent(siteBusiness);
  const photographerPlan = useContent(photoPlan);
  return (
    <section
      id="photographer"
      className="relative overflow-hidden bg-brand-beige/55 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] shadow-[0_24px_48px_rgba(237,160,157,0.22)]"
        >
          <Image
            src={hero}
            alt="攝影師加購方案"
            fill
            priority
            sizes="(min-width: 768px) 480px, 90vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <span className="block font-display italic leading-none text-brand-cream text-[72px] md:text-[110px]">
            {photographerPlan.eyebrow}
          </span>
          <h1 className="-mt-6 text-3xl font-semibold tracking-wide text-brand md:-mt-9 md:text-4xl">
            {photographerPlan.title}
          </h1>

          <div className="mt-6 inline-flex items-baseline gap-3 rounded-full border border-brand-soft/60 bg-white px-6 py-2.5 shadow-sm">
            <span className="text-sm text-brand-accent">
              {photographerPlan.priceLabel}
            </span>
            <span className="text-2xl font-semibold text-brand md:text-3xl">
              {photographerPlan.price}
            </span>
          </div>

          <ul className="mt-8 space-y-4 text-brand-ink">
            {photographerPlan.bullets.map((b, i) => (
              <li
                key={`${i}-${b}`}
                className="flex items-start gap-3 leading-relaxed"
              >
                <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {photographerPlan.note && (
            <p className="mt-6 whitespace-pre-line rounded-2xl border border-brand-soft/40 bg-white/80 p-4 text-sm leading-relaxed text-brand-ink/80">
              ※ {photographerPlan.note}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={biz.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-all duration-300 hover:scale-105"
            >
              {photographerPlan.lineButton}
            </a>
            <Link
              href="#other"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
            >
              {photographerPlan.otherButton}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
