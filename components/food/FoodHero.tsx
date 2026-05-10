"use client";

import { motion } from "framer-motion";
import { foodIntro } from "@/data/food";

export const FoodHero = () => (
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
        Food
      </span>
      <h1 className="-mt-8 text-3xl font-semibold tracking-wide text-brand md:-mt-12 md:text-4xl">
        餐食加購
      </h1>
      <p className="mt-8 whitespace-pre-line leading-loose text-brand-ink md:text-lg">
        {foodIntro}
      </p>
    </motion.div>
  </section>
);
