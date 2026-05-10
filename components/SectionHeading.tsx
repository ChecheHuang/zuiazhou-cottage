"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  watermark: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}

export const SectionHeading = ({
  watermark,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className={cn(
      "relative",
      align === "center" ? "text-center" : "text-left",
    )}
  >
    <span
      aria-hidden
      className={cn(
        "block font-display italic tracking-tight",
        "text-[64px] leading-[0.9] sm:text-[80px] md:text-[110px]",
        light ? "text-white/15" : "text-brand-cream",
      )}
    >
      {watermark}
    </span>
    <h2
      className={cn(
        "relative -mt-6 text-2xl font-semibold tracking-wide md:-mt-10 md:text-3xl",
        light ? "text-white" : "text-brand",
      )}
    >
      {title}
    </h2>
    {description && (
      <p
        className={cn(
          "mx-auto mt-4 max-w-2xl leading-loose",
          light ? "text-white/80" : "text-brand-ink/80",
          align === "left" && "ml-0",
        )}
      >
        {description}
      </p>
    )}
  </motion.div>
);
