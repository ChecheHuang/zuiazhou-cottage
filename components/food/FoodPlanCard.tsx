"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { businessInfo } from "@/data/home";
import type { FoodPlan } from "@/data/food";
import { cn } from "@/lib/cn";

interface FoodPlanCardProps {
  plan: FoodPlan;
  index: number;
}

const PriceTag = ({ price, seats }: { price: string; seats?: string }) => (
  <div className="inline-flex items-baseline gap-3 rounded-full bg-brand px-6 py-2.5 text-white shadow-md shadow-brand/30">
    <span className="text-2xl font-semibold md:text-3xl">{price}</span>
    {seats && <span className="text-sm text-white/85">／{seats}</span>}
  </div>
);

const DishGrid = ({ items }: { items: string[] }) => (
  <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-brand-ink md:grid-cols-3">
    {items.map((dish) => (
      <li
        key={dish}
        className="flex items-center gap-2 border-b border-brand-soft/30 py-1.5 text-sm md:text-[15px]"
      >
        <span className="size-1 shrink-0 rounded-full bg-brand-accent" />
        {dish}
      </li>
    ))}
  </ul>
);

export const FoodPlanCard = ({ plan, index }: FoodPlanCardProps) => {
  const reverse = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-[0_22px_44px_rgba(237,160,157,0.18)]",
          reverse && "lg:order-2",
        )}
      >
        <Image
          src={plan.photo}
          alt={plan.title}
          fill
          sizes="(min-width: 1024px) 480px, 90vw"
          className="object-cover"
        />
        <span className="absolute left-6 top-6 grid size-14 place-items-center rounded-full bg-white/95 text-2xl font-semibold text-brand shadow-lg backdrop-blur">
          {plan.code}
        </span>
      </div>

      <div className={cn(reverse && "lg:order-1")}>
        {plan.subtitle && (
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-accent">
            {plan.subtitle}
          </p>
        )}
        <h2 className="mt-3 text-2xl font-semibold text-brand md:text-3xl">
          {plan.title}
        </h2>
        <p className="mt-4 leading-loose text-brand-ink/85">{plan.desc}</p>

        {plan.kind === "combo" && (
          <>
            <DishGrid items={plan.dishes} />
            <div className="mt-8">
              <PriceTag price={plan.price} seats={plan.seats} />
            </div>
          </>
        )}

        {plan.kind === "simple" && (
          <div className="mt-8">
            <a
              href={businessInfo.socials.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-white px-6 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
            >
              {plan.ctaLabel ?? "查看菜單"}
              <span aria-hidden>→</span>
            </a>
          </div>
        )}

        {plan.kind === "banquet" && (
          <>
            <div className="mt-8">
              <PriceTag price={plan.priceRange} seats={plan.seats} />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {plan.menus.map((menu) => (
                <details
                  key={menu.price}
                  className="group rounded-2xl border border-brand-soft/40 bg-brand-beige/40 p-5 transition-shadow duration-300 hover:shadow-md open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-brand">
                    <span>{menu.price} 套餐菜色</span>
                    <span
                      aria-hidden
                      className="grid size-6 place-items-center rounded-full bg-white text-brand transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <ul className="mt-4 space-y-1.5 text-sm text-brand-ink/85">
                    {menu.dishes.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </>
        )}

        {plan.kind === "dessert" && (
          <>
            <ul className="mt-6 space-y-2.5 text-brand-ink">
              {plan.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <PriceTag price={plan.price} />
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold text-brand">
                可選餐點種類
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
                {plan.desserts.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 rounded-full border border-brand-soft/40 bg-white px-3 py-1.5 text-xs text-brand-ink"
                  >
                    <span className="size-1 shrink-0 rounded-full bg-brand-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
};
