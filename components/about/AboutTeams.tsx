"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutTeams } from "@/data/about";
import { SectionHeading } from "@/components/SectionHeading";

export const AboutTeams = () => (
  <section className="bg-white/65 py-20 md:py-28">
    <div className="mx-auto max-w-content px-6">
      <SectionHeading
        watermark="Team"
        title="與我們同行的夥伴"
        description="主理人團隊與長期合作的餐點夥伴，一起把每一場派對的細節照顧到位。"
      />

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.18 } },
        }}
        className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10"
      >
        {aboutTeams.map((team) => (
          <motion.li
            key={team.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0 },
            }}
            className="group flex flex-col gap-6 rounded-[32px] border border-brand-soft/40 bg-brand-beige/40 p-6 shadow-[0_18px_40px_rgba(237,160,157,0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(237,160,157,0.20)] md:flex-row md:items-center md:gap-8 md:p-8"
          >
            <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-3xl ring-4 ring-white md:w-40">
              <Image
                src={team.photo}
                alt={team.title}
                fill
                sizes="(min-width: 768px) 160px, 128px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-accent">
                {team.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-brand md:text-2xl">
                {team.title}
              </h3>
              <p className="mt-3 leading-loose text-brand-ink">{team.desc}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);
