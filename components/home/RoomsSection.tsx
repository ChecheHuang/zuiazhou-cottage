"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useContent } from "@/components/SiteContentProvider";
import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { homeRooms } from "@/lib/site-content/blocks/home";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";

// 首頁的主題場地對照：資料直接沿用寶寶派對頁的場地方案，避免兩邊各寫一份
export const RoomsSection = () => {
  const c = useContent(homeRooms);
  const biz = useContent(siteBusiness);
  const { plans } = useContent(partyPlans);
  if (plans.length === 0) return null;

  return (
    <section
      id="rooms"
      aria-labelledby="rooms-heading"
      className="bg-brand-beige/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          watermark={c.watermark}
          title={c.title}
          description={c.description}
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan, i) => {
            // 第一條特色是場地介紹，其餘（人數等）做成小標籤
            const [intro, ...tags] = plan.features;
            const cover = plan.images[0];
            return (
              <motion.li
                key={`${i}-${plan.title}`}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Link
                  href="/baby-party#plans"
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(237,160,157,0.20)]"
                >
                  {cover && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={cover}
                        alt={plan.title.replace(/^[^\p{L}\p{N}]+/u, "").trim()}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold text-brand md:text-xl">
                      {plan.title}
                    </h3>
                    {plan.price && (
                      <p className="mt-1 text-2xl font-semibold text-brand-accent">
                        {plan.price}
                        {c.priceSuffix && (
                          <span className="ml-1 text-sm font-normal text-brand-ink/60">
                            {c.priceSuffix}
                          </span>
                        )}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {tags.map((t, j) => (
                          <li
                            key={`${j}-${t}`}
                            className="rounded-full bg-brand-soft/30 px-3 py-1 text-xs font-medium text-brand"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                    {intro && (
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-ink/80">
                        {intro}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/baby-party#plans"
            className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand-strong/90"
          >
            {c.button}
            <span aria-hidden>→</span>
          </Link>
          {c.lineButton && (
            <a
              href={lineChatHref(biz)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#06c755] px-8 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-transform duration-300 hover:scale-105"
            >
              💬 {c.lineButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
