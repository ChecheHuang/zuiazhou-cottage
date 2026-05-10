"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PARALLAX_BG } from "@/data/photos";

export const ParallaxBreak = () => (
  <section
    aria-label="環境照片"
    className="relative h-[420px] w-full overflow-hidden md:h-[520px]"
  >
    <div
      aria-hidden
      className="absolute inset-0 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${PARALLAX_BG})` }}
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40"
    />

    <div className="relative flex h-full items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative text-center"
      >
        <span className="block font-display italic tracking-tight text-white/35 text-[64px] leading-none drop-shadow-md sm:text-[88px] md:text-[128px]">
          Environment
        </span>
        <h3 className="relative -mt-6 text-2xl font-semibold text-white drop-shadow-md md:-mt-10 md:text-3xl">
          走進溫柔的派對小屋
        </h3>
        <div className="mx-auto mt-5 flex justify-center">
          <Image
            src="/decorations/line-divider.png"
            alt=""
            width={120}
            height={22}
            className="opacity-90"
          />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-loose text-white/90 drop-shadow md:text-base">
          一片大草皮、一間木屋、一束自然光——所有讓你拍照不踩雷的元素，我們都準備好了。
        </p>
      </motion.div>
    </div>
  </section>
);
