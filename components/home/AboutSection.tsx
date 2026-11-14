"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSlotImage } from "@/components/SiteImagesProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { useContent } from "@/components/SiteContentProvider";
import { homeAbout } from "@/lib/site-content/blocks/home";

const PlayIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="ml-1 size-7"
    aria-hidden
    fill="currentColor"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const AboutSection = () => {
  const photo = useSlotImage("home.about");
  const c = useContent(homeAbout);
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative bg-brand-beige py-24 md:py-32"
    >
      <Image
        aria-hidden
        src="/decorations/ic004.png"
        alt=""
        width={120}
        height={86}
        className="pointer-events-none absolute left-6 top-12 size-20 -rotate-12 opacity-80 md:size-28"
      />
      <Image
        aria-hidden
        src="/decorations/ic006.png"
        alt=""
        width={120}
        height={110}
        className="pointer-events-none absolute right-6 bottom-16 size-20 opacity-90 md:size-28"
      />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading watermark={c.watermark} title={c.title} />

        <div className="mx-auto mt-4 flex justify-center">
          <Image
            src="/decorations/line-divider.png"
            alt=""
            width={150}
            height={27}
            className="h-6 w-auto opacity-90"
          />
        </div>

        <div className="relative mt-16 grid items-center gap-8 md:grid-cols-12 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative md:col-span-7 md:col-start-1 md:row-start-1"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_24px_56px_rgba(237,160,157,0.20)]">
              <Image
                src={photo}
                alt={c.photoAlt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
                priority
              />
              <button
                type="button"
                aria-label="播放影片（敬請期待）"
                className="group/play absolute inset-0 grid place-items-center bg-black/10 transition-colors duration-300 hover:bg-black/25"
              >
                <span className="grid size-20 place-items-center rounded-full bg-white/90 text-brand shadow-2xl transition-transform duration-300 group-hover/play:scale-110 md:size-24">
                  <PlayIcon />
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative md:col-span-6 md:col-start-7 md:row-start-1 md:-ml-12 md:-mt-8 md:self-center lg:-ml-20"
          >
            <div className="rounded-3xl bg-white p-8 shadow-[0_24px_56px_rgba(237,160,157,0.18)] ring-1 ring-brand-soft/40 md:p-10">
              <p className="font-display text-sm uppercase tracking-[0.4em] text-brand-accent">
                {c.eyebrow}
              </p>
              <h3
                id="about-heading"
                className="mt-3 text-2xl font-semibold leading-snug text-brand md:text-3xl"
              >
                {c.heading}
              </h3>
              <div className="mt-6 space-y-4 leading-loose text-brand-ink">
                {c.paragraphs.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
              <Link
                href="/baby-party"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
              >
                {c.button}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
