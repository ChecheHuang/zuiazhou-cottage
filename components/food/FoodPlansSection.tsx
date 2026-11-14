"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useContent } from "@/components/SiteContentProvider";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { foodNotice, foodPlans } from "@/lib/site-content/blocks/food";
import { FoodPlanCard } from "./FoodPlanCard";
import { SectionHeading } from "@/components/SectionHeading";

export const FoodPlansSection = () => {
  const biz = useContent(siteBusiness);
  const c = useContent(foodPlans);
  const notice = useContent(foodNotice);
  return (
    <section className="bg-brand-beige/40 py-20 md:py-28">
      <div className="mx-auto max-w-content space-y-20 px-6 md:space-y-24">
        <SectionHeading
          watermark={c.watermark}
          title={c.title}
          description={c.description}
        />

        {c.plans.map((plan, idx) => (
          <FoodPlanCard key={`${idx}-${plan.code}`} plan={plan} index={idx} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl rounded-3xl border border-brand-soft/60 bg-white p-8 shadow-[0_18px_40px_rgba(237,160,157,0.10)] md:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-accent">
            {notice.eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-brand md:text-2xl">
            {notice.title}
          </h3>
          <ul className="mt-6 space-y-3 text-brand-ink">
            {notice.notes.map((n, i) => (
              <li
                key={`${i}-${n}`}
                className="flex items-start gap-3 leading-relaxed"
              >
                <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{n}</span>
              </li>
            ))}
          </ul>

          {notice.banquetNotes.length > 0 && (
            <div className="mt-6 border-t border-brand-soft/40 pt-6">
              <p className="text-sm font-semibold text-brand">
                {notice.banquetTitle}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-ink/80">
                {notice.banquetNotes.map((n, i) => (
                  <li key={`${i}-${n}`} className="flex items-start gap-3">
                    <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-brand-accent" />
                    <span className="whitespace-pre-line">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={biz.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#06c755] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-all duration-300 hover:scale-105"
            >
              {notice.lineButton}
            </a>
            <Link
              href="/baby-party"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-6 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
            >
              {notice.partyButton}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
