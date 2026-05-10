"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BACKGROUND_SLIDESHOW } from "@/data/photos";

interface BackgroundSlideshowProps {
  intervalMs?: number;
}

export const BackgroundSlideshow = ({
  intervalMs = 4500,
}: BackgroundSlideshowProps) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % BACKGROUND_SLIDESHOW.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [intervalMs]);

  return (
    <section className="relative overflow-hidden py-32 text-white md:py-40">
      {BACKGROUND_SLIDESHOW.map((src, i) => (
        <div
          key={src}
          aria-hidden
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === active ? 1 : 0,
            transform: i === active ? "scale(1.04)" : "scale(1)",
            transitionProperty: "opacity, transform",
          }}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand/40 via-black/40 to-black/55"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-white/80">
          Forever Memories
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-wide text-white md:text-5xl">
          紀錄每個美好瞬間
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-loose text-white/85 md:text-lg">
          從寶寶第一次穿上虎衣，到全家圍著生日蛋糕的笑容，我們替您留住所有值得珍藏的細節。
        </p>
      </motion.div>
    </section>
  );
};
