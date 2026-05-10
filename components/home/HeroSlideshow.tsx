"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HERO_SLIDESHOW } from "@/data/photos";

const SLIDE_DURATION = 4500;

export const HeroSlideshow = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % HERO_SLIDESHOW.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={HERO_SLIDESHOW[active]}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: SLIDE_DURATION / 1000 + 1, ease: "linear" },
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_SLIDESHOW[active]})` }}
          aria-hidden
        />
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
            Happy moments, lasting memories
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-wide drop-shadow-lg md:text-6xl">
            為寶貝留下
            <br className="md:hidden" />
            最珍貴的派對時光
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-loose text-white/90 md:text-lg">
            桃園楊梅 ｜ 抓週派對 × 兒童生日派對 × 性別揭曉派對
            <br />
            場佈、流程、主持、攝影一站式包辦
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/baby-party"
              className="rounded-full bg-brand px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/40 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
            >
              查看派對方案
            </Link>
            <a
              href="#about"
              className="rounded-full border border-white/70 bg-white/10 px-8 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              認識 Happy 抓週小屋
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_SLIDESHOW.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`第 ${i + 1} 張`}
            onClick={() => setActive(i)}
            className="h-1 rounded-full bg-white/40 transition-all duration-500 hover:bg-white/70"
            style={{ width: i === active ? 32 : 12 }}
          />
        ))}
      </div>
    </section>
  );
};
