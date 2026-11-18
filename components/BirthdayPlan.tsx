"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSlotImage } from "@/components/SiteImagesProvider";
import { useContent } from "@/components/SiteContentProvider";
import { partyBirthdayPlan } from "@/lib/site-content/blocks/baby-party";

export const BirthdayPlan = () => {
  const photo = useSlotImage("party.birthday");
  const c = useContent(partyBirthdayPlan);
  return (
    <section
      id="birthday"
      aria-labelledby="birthday-heading"
      className="bg-gradient-to-b from-white to-brand-soft/15 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          // 手機版排在文字後面（從導覽列「生日派對」跳過來先看到標題）；電腦版維持在左邊
          className="relative order-2 aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_18px_48px_rgba(237,160,157,0.18)] md:order-none"
        >
          <Image
            src={photo}
            alt={`${c.title}佈置`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
            {c.eyebrow}
          </p>
          <h2
            id="birthday-heading"
            className="mt-3 text-3xl font-semibold tracking-wide text-brand md:text-4xl"
          >
            {c.title}
          </h2>
          <p className="mt-4 whitespace-pre-line leading-loose text-brand-ink/80">
            {c.intro}
          </p>

          <ul className="mt-8 space-y-3 text-brand-ink">
            {c.features.map((f, i) => (
              <li key={`${i}-${f}`} className="flex items-start gap-3">
                <span className="mt-1 inline-block size-2 shrink-0 rounded-full bg-brand-soft" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-2 border-t border-brand-soft/50 pt-6 text-sm leading-relaxed text-brand-ink/80">
            {c.notes.map((n, i) => (
              <p key={`${i}-${n}`} className="whitespace-pre-line">
                ・{n}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
