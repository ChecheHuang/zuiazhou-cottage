"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { otherAddons } from "@/data/photo";
import { businessInfo } from "@/data/home";
import { SectionHeading } from "@/components/SectionHeading";

export const AddonGrid = () => (
  <section
    id="other"
    className="bg-white/65 py-20 md:py-28"
  >
    <div className="mx-auto max-w-content px-6">
      <SectionHeading
        watermark="Add-ons"
        title="其他加購方案"
        description="氣球、立牌、客製化道具，依需求自由搭配，讓派對更有質感。"
      />

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {otherAddons.map((addon) => (
          <motion.li
            key={addon.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="group relative overflow-hidden rounded-3xl border border-brand-soft/40 bg-brand-beige/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(237,160,157,0.18)]"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
              {addon.emoji}
            </span>
            <h3 className="mt-5 text-base font-semibold text-brand-ink md:text-lg">
              {addon.name}
            </h3>
            <p className="mt-2 text-2xl font-semibold text-brand md:text-3xl">
              {addon.price}
            </p>
            <span
              aria-hidden
              className="absolute -bottom-12 -right-12 size-32 rounded-full bg-brand-soft/30 transition-all duration-700 group-hover:scale-150"
            />
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={businessInfo.socials.line}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-all duration-300 hover:scale-105"
        >
          LINE 線上諮詢
        </a>
        <Link
          href="/baby-party"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
        >
          回派對方案
        </Link>
      </div>
    </div>
  </section>
);
