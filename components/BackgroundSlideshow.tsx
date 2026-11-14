"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSlotImages } from "@/components/SiteImagesProvider";
import { useContent } from "@/components/SiteContentProvider";
import { partyMemories } from "@/lib/site-content/blocks/baby-party";

interface BackgroundSlideshowProps {
  intervalMs?: number;
}

export const BackgroundSlideshow = ({
  intervalMs = 4500,
}: BackgroundSlideshowProps) => {
  const [active, setActive] = useState(0);
  const slides = useSlotImages("party.background");
  const c = useContent(partyMemories);
  const count = slides.length;

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, count]);

  return (
    <section className="relative overflow-hidden py-32 text-white md:py-40">
      {slides.map((src, i) => (
        <div
          key={src}
          aria-hidden
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === active % count ? 1 : 0,
            transform: i === active % count ? "scale(1.04)" : "scale(1)",
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
          {c.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-wide text-white md:text-5xl">
          {c.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-base leading-loose text-white/85 md:text-lg">
          {c.body}
        </p>
      </motion.div>
    </section>
  );
};
