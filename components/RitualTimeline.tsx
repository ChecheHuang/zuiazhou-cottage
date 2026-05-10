"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ritualSteps } from "@/data/ritual-steps";

export const RitualTimeline = () => (
  <section
    id="timeline"
    aria-labelledby="timeline-heading"
    className="relative bg-gradient-to-b from-white via-brand-soft/10 to-white py-20 md:py-28"
  >
    <div className="mx-auto max-w-content px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
          Ritual Flow
        </p>
        <h2
          id="timeline-heading"
          className="mt-3 text-3xl font-semibold tracking-wide text-brand md:text-4xl"
        >
          抓周派對流程
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-loose text-brand-ink/80">
          九個步驟、一段珍貴回憶，從穿虎衣到合影留念，由主持人陪伴全家完整走完。
        </p>
      </motion.div>

      <ol className="relative pl-6 md:pl-0">
        <span
          aria-hidden
          className="absolute left-2 top-2 bottom-2 w-0.5 bg-brand-soft md:left-1/2 md:-translate-x-1/2"
        />
        {ritualSteps.map((step, i) => {
          const onLeft = i % 2 === 0;
          return (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.04, ease: "easeOut" }}
              className={cn(
                "relative mb-12 md:mb-16 md:w-1/2",
                onLeft ? "md:pr-12" : "md:ml-auto md:pl-12",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[1.6rem] top-2 grid size-9 place-items-center rounded-full bg-brand text-xs font-semibold text-white shadow-lg shadow-brand/30 md:-left-auto md:top-4",
                  onLeft
                    ? "md:-right-[1.125rem]"
                    : "md:-left-[1.125rem]",
                )}
              >
                {step.step}
              </span>
              <div
                className={cn(
                  "rounded-3xl border border-brand-soft/50 bg-white p-5 shadow-[0_8px_24px_rgba(237,160,157,0.10)] md:p-6",
                  onLeft ? "md:text-right" : "md:text-left",
                )}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-brand-accent">
                  Step {step.step}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-brand md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-brand-ink">
                  {step.desc}
                </p>
                <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    sizes="(min-width: 768px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  </section>
);
