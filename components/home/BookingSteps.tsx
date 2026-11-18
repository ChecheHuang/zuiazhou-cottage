"use client";

import { motion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import { homeBooking } from "@/lib/site-content/blocks/home";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/cn";

export const BookingSteps = () => {
  const biz = useContent(siteBusiness);
  const c = useContent(homeBooking);
  return (
    <section
      id="booking"
      aria-labelledby="booking-heading"
      className="relative overflow-hidden bg-brand-beige/55 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 mx-auto hidden h-32 max-w-3xl bg-[url('/photos/logo.png')] bg-contain bg-center bg-no-repeat opacity-[0.04] md:block"
      />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          watermark={c.watermark}
          title={c.title}
          description={c.description}
        />

        <ol className="mt-16 grid gap-6 md:grid-cols-4 md:gap-5">
          {c.steps.map((step, i) => (
            <motion.li
              key={`${i}-${step.title}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: "easeOut",
              }}
              className={cn(
                "relative flex flex-col rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/40",
                "before:absolute before:left-1/2 before:top-1/2 before:hidden before:size-3 before:-translate-x-1/2 before:rounded-full before:bg-brand-soft",
              )}
            >
              <span
                aria-hidden
                className="absolute -top-5 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-brand-strong text-white shadow-lg shadow-brand/30"
              >
                <span className="text-xl">{step.emoji}</span>
              </span>
              <p className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">
                {c.stepPrefix} {i + 1}
              </p>
              <h3 className="mt-2 text-center text-xl font-semibold text-brand">
                {step.title}
              </h3>
              <p className="mt-4 flex-1 whitespace-pre-line text-center text-sm leading-relaxed text-brand-ink/85">
                {step.desc}
              </p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={lineChatHref(biz)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand-strong/90"
          >
            {c.lineButton}
            <span aria-hidden>→</span>
          </a>
          <span className="text-sm text-brand-ink/70">
            {c.phonePrefix} {biz.phone}
          </span>
        </div>
      </div>
    </section>
  );
};
