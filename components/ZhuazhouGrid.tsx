"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { ZhuazhouItem } from "@/data/zhuazhou-items";

interface ZhuazhouGridProps {
  eyebrow: string;
  title: string;
  description?: string;
  items: ZhuazhouItem[];
  density?: "wide" | "compact";
}

export const ZhuazhouGrid = ({
  eyebrow,
  title,
  description,
  items,
  density = "wide",
}: ZhuazhouGridProps) => (
  <section className="py-16 md:py-20">
    <div className="mx-auto max-w-content px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-wide text-brand md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl leading-loose text-brand-ink/80">
            {description}
          </p>
        )}
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04 } },
        }}
        className={cn(
          "grid gap-4 md:gap-6",
          density === "wide"
            ? "grid-cols-3 md:grid-cols-5 lg:grid-cols-7"
            : "grid-cols-3 md:grid-cols-5",
        )}
      >
        {items.map((item) => (
          <motion.li
            key={item.name}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            className="group text-center"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-soft/30 ring-1 ring-brand-soft/40">
              <Image
                src={item.img}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 14vw, (min-width: 768px) 20vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized={item.img.startsWith("http")}
              />
              <div className="absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/15" />
            </div>
            <h3 className="mt-3 text-base font-medium text-brand">
              {item.name}
            </h3>
            {item.meaning && (
              <p className="mt-1 text-xs leading-relaxed text-brand-ink/70">
                {item.meaning}
              </p>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);
