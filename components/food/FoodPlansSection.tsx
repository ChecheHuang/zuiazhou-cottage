"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { businessInfo } from "@/data/home";
import {
  banquetExtraNotes,
  foodOrderingNotes,
  foodPlans,
} from "@/data/food";
import { FoodPlanCard } from "./FoodPlanCard";
import { SectionHeading } from "@/components/SectionHeading";

export const FoodPlansSection = () => (
  <section className="bg-brand-beige/40 py-20 md:py-28">
    <div className="mx-auto max-w-content space-y-20 px-6 md:space-y-24">
      <SectionHeading
        watermark="Plans"
        title="四種用餐方案"
        description="從專屬組合套餐到桌菜辦桌、下午茶點心，依參加人數與場合自由選擇。"
      />

      {foodPlans.map((plan, idx) => (
        <FoodPlanCard key={plan.code} plan={plan} index={idx} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-3xl rounded-3xl border border-brand-soft/60 bg-white p-8 shadow-[0_18px_40px_rgba(237,160,157,0.10)] md:p-10"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-accent">
          Notice
        </p>
        <h3 className="mt-2 text-xl font-semibold text-brand md:text-2xl">
          ❗ 餐點注意事項
        </h3>
        <ul className="mt-6 space-y-3 text-brand-ink">
          {foodOrderingNotes.map((n) => (
            <li key={n} className="flex items-start gap-3 leading-relaxed">
              <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
              <span>{n}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-brand-soft/40 pt-6">
          <p className="text-sm font-semibold text-brand">桌菜補充規範</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-ink/80">
            {banquetExtraNotes.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-brand-accent" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={businessInfo.socials.line}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#06c755] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-all duration-300 hover:scale-105"
          >
            LINE 線上諮詢
          </a>
          <Link
            href="/baby-party"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-6 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
          >
            查看派對方案
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);
