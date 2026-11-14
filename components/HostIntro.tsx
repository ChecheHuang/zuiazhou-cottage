"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSlotImage } from "@/components/SiteImagesProvider";
import { useContent } from "@/components/SiteContentProvider";
import { partyHostIntro } from "@/lib/site-content/blocks/baby-party";

export const HostIntro = () => {
  const photo = useSlotImage("party.host");
  const c = useContent(partyHostIntro);
  return (
    <section
      id="host"
      className="relative overflow-hidden bg-white/65 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 md:grid-cols-[auto_1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto size-56 shrink-0 overflow-hidden rounded-full ring-8 ring-brand-soft/40 md:size-72"
        >
          <Image
            src={photo}
            alt={c.title}
            fill
            sizes="(min-width: 768px) 288px, 224px"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="text-center md:text-left"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
            {c.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-brand md:text-4xl">
            {c.title}
          </h3>
          <p className="mt-6 whitespace-pre-line text-base leading-loose text-brand-ink md:text-lg">
            {c.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
