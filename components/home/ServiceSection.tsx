"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/data/home";
import { SectionHeading } from "@/components/SectionHeading";

export const ServiceSection = () => (
  <section
    id="service"
    aria-labelledby="service-heading"
    className="bg-white/65 py-24 md:py-32"
  >
    <div className="mx-auto max-w-content px-6">
      <SectionHeading
        watermark="Service"
        title="服務項目"
        description="從佈置到主持，每一場派對都為您量身打造。"
      />

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.18 } },
        }}
        className="mt-16 grid gap-8 md:grid-cols-3 md:gap-10"
      >
        {services.map((s) => (
          <motion.li
            key={s.title}
            variants={{
              hidden: { opacity: 0, y: 32 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Link
              href={s.href}
              className="group block overflow-hidden rounded-3xl bg-white shadow-[0_8px_32px_rgba(237,160,157,0.10)] ring-1 ring-brand-soft/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(237,160,157,0.20)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="p-6 md:p-7">
                <h3 className="text-xl font-semibold text-brand md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-brand-ink/85">
                  {s.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition-all duration-300 group-hover:gap-3">
                  查看詳情
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <Link
          href="/baby-party"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
        >
          查看所有服務
          <span aria-hidden>→</span>
        </Link>
      </motion.div>
    </div>
  </section>
);
