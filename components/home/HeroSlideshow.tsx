"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSlotImages } from "@/components/SiteImagesProvider";
import { useContent } from "@/components/SiteContentProvider";
import { homeHero } from "@/lib/site-content/blocks/home";

const SLIDE_DURATION = 4500;

export const HeroSlideshow = () => {
  const [active, setActive] = useState(0);
  const slides = useSlotImages("home.hero");
  const c = useContent(homeHero);
  const count = slides.length;

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % count),
      SLIDE_DURATION,
    );
    return () => clearInterval(t);
  }, [count]);

  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
      {/* initial={false}：第一張不做淡入，讓首屏大圖立刻出現（LCP） */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[active % count]}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: SLIDE_DURATION / 1000 + 1, ease: "linear" },
          }}
          className="absolute inset-0"
          aria-hidden
        >
          <Image
            src={slides[active % count]}
            alt=""
            fill
            sizes="100vw"
            priority={active === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/55"
      />

      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="max-w-3xl"
        >
          <p className="font-display text-2xl italic tracking-wide text-white/90 md:text-3xl">
            {c.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-wide drop-shadow-lg md:text-6xl">
            {c.titleLine1}
            <br className="md:hidden" />
            {c.titleLine2}
          </h1>
          <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-base leading-loose text-white/90 md:text-lg">
            {c.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/baby-party"
              className="rounded-full bg-brand px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/40 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
            >
              {c.primaryButton}
            </Link>
            <a
              href="#about"
              className="rounded-full border border-white/70 bg-white/10 px-8 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              {c.secondaryButton}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`第 ${i + 1} 張`}
            onClick={() => setActive(i)}
            className="h-1 rounded-full bg-white/40 transition-all duration-500 hover:bg-white/70"
            style={{ width: i === active % count ? 32 : 12 }}
          />
        ))}
      </div>
    </section>
  );
};
