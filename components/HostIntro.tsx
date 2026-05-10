"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HOST_PHOTO } from "@/data/photos";

export const HostIntro = () => (
  <section
    id="host"
    className="relative overflow-hidden bg-white/65 py-20 md:py-28"
  >
    <div className="mx-auto grid max-w-content items-center gap-12 px-6 md:grid-cols-[auto_1fr] md:gap-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto size-56 shrink-0 overflow-hidden rounded-full ring-8 ring-brand-soft/40 md:size-72"
      >
        <Image
          src={HOST_PHOTO}
          alt="主理人團隊"
          fill
          sizes="(min-width: 768px) 288px, 224px"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="text-center md:text-left"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
          Meet your host
        </p>
        <h3 className="mt-3 text-3xl font-semibold text-brand md:text-4xl">
          主理人團隊
        </h3>
        <p className="mt-6 whitespace-pre-line text-base leading-loose text-brand-ink md:text-lg">
          {`擁有多年活動主持經驗，專注於親子互動與抓周流程引導。
善於用溫柔穩定的節奏，帶領寶寶安心參與、讓家人自在融入，
每一場都是獨一無二、充滿笑聲與感動的紀念時刻。`}
        </p>
      </motion.div>
    </div>
  </section>
);
