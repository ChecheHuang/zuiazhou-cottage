"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutHeroPhoto, aboutStory } from "@/data/about";

export const AboutHero = () => (
  <section className="relative overflow-hidden bg-brand-beige/55 py-20 md:py-28">
    <span
      aria-hidden
      className="pointer-events-none absolute -left-6 top-12 hidden h-[160px] w-[160px] rounded-full bg-brand-soft/30 blur-3xl md:block"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute -right-10 bottom-10 hidden h-[220px] w-[220px] rounded-full bg-brand-accent/20 blur-3xl md:block"
    />

    <div className="mx-auto grid max-w-content items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <span
          aria-hidden
          className="block font-display italic leading-none text-brand-cream text-[88px] md:text-[140px]"
        >
          About
        </span>
        <h1 className="-mt-8 text-3xl font-semibold tracking-wide text-brand md:-mt-12 md:text-4xl">
          關於我們
        </h1>

        <div className="mt-8 space-y-5 text-base leading-loose text-brand-ink md:text-[17px]">
          {aboutStory.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-brand-soft/60 bg-white px-5 py-2 text-sm text-brand-accent">
          <span className="size-1.5 rounded-full bg-brand" />
          主理人團隊
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[40px] shadow-[0_24px_48px_rgba(237,160,157,0.25)]"
      >
        <Image
          src={aboutHeroPhoto}
          alt="Happy 抓週小屋現場照"
          fill
          priority
          sizes="(min-width: 768px) 480px, 90vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-white/80">
            Happy One House
          </p>
          <p className="mt-1 text-base font-medium">桃園楊梅 · 抓週派對小屋</p>
        </div>
      </motion.div>
    </div>
  </section>
);
