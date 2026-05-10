"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "@/data/faq";
import { cn } from "@/lib/cn";

const PlusIcon = ({ open }: { open: boolean }) => (
  <span
    aria-hidden
    className={cn(
      "grid size-9 shrink-0 place-items-center rounded-full border border-brand-soft/60 text-brand transition-all duration-300",
      open ? "rotate-45 bg-brand text-white" : "bg-white",
    )}
  >
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  </span>
);

export const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } },
      }}
      className="mx-auto mt-14 max-w-3xl space-y-4"
    >
      {faqItems.map((item, i) => {
        const open = openIndex === i;
        return (
          <motion.li
            key={item.q}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <div
              className={cn(
                "rounded-2xl border bg-white transition-all duration-300",
                open
                  ? "border-brand/30 shadow-[0_18px_40px_rgba(237,160,157,0.18)]"
                  : "border-brand-soft/40 shadow-[0_8px_24px_rgba(237,160,157,0.06)] hover:border-brand-soft",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
              >
                <span className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft/40 font-display text-sm font-semibold text-brand"
                  >
                    Q{(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="pt-1.5 text-base font-medium leading-snug text-brand-ink md:text-lg">
                    {item.q}
                  </span>
                </span>
                <PlusIcon open={open} />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-brand-soft/40 px-5 py-5 md:px-6 md:py-6">
                      <p className="leading-loose text-brand-ink md:text-[15px]">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};
