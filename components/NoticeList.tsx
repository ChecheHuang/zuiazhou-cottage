"use client";

import { motion } from "framer-motion";
import { noticeBullets, customNote, cancellationNote } from "@/data/notices";

export const NoticeList = () => (
  <section
    id="notice"
    aria-labelledby="notice-heading"
    className="bg-gradient-to-b from-brand-soft/15 to-white py-20 md:py-28"
  >
    <div className="mx-auto max-w-content px-6">
      <motion.h2
        id="notice-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center text-3xl font-semibold tracking-wide text-brand md:text-4xl"
      >
        注意事項
      </motion.h2>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
        className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2 md:gap-x-10"
      >
        {noticeBullets.map((bullet) => (
          <motion.li
            key={bullet}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            className="flex items-start gap-3 leading-relaxed text-brand-ink"
          >
            <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
            <span>{bullet}</span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-12 max-w-3xl rounded-3xl border border-brand-soft/60 bg-white p-8 shadow-[0_8px_28px_rgba(237,160,157,0.12)] md:p-10"
      >
        <p className="leading-loose text-brand-ink">{customNote}</p>
        <div className="mt-6 border-t border-brand-soft/40 pt-6">
          <p className="font-semibold text-brand">{cancellationNote.title}</p>
          <p className="mt-2 text-brand-ink">{cancellationNote.body}</p>
        </div>
      </motion.div>
    </div>
  </section>
);
