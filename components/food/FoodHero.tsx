"use client";

import { motion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { foodHero } from "@/lib/site-content/blocks/food";

export const FoodHero = () => {
  const c = useContent(foodHero);
  return (
    <section className="relative overflow-hidden bg-white/65 py-20 md:py-28">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 top-10 hidden size-48 rounded-full bg-brand-soft/30 blur-3xl md:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-10 hidden size-56 rounded-full bg-brand-accent/20 blur-3xl md:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <span className="block font-display italic leading-none text-brand-cream text-[88px] md:text-[140px]">
          {c.watermark}
        </span>
        <h1 className="-mt-8 text-3xl font-semibold tracking-wide text-brand md:-mt-12 md:text-4xl">
          {c.title}
        </h1>
        <p className="mt-8 whitespace-pre-line leading-loose text-brand-ink md:text-lg">
          {c.intro}
        </p>
      </motion.div>
    </section>
  );
};
