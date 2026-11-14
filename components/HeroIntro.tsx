"use client";

import { motion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { partyHero } from "@/lib/site-content/blocks/baby-party";

export const HeroIntro = () => {
  const c = useContent(partyHero);
  return (
    <section className="bg-white/65 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-content px-6 text-center"
      >
        <h1 className="text-brand text-4xl md:text-5xl font-semibold tracking-wide mb-6">
          {c.title}
        </h1>
        <p className="text-brand-ink text-base md:text-lg leading-loose whitespace-pre-line">
          {c.body}
        </p>
      </motion.div>
    </section>
  );
};
