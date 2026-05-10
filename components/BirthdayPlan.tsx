"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BIRTHDAY_PHOTO } from "@/data/photos";

const features = [
  "場地包場 2.5 小時",
  "背板公版佈置",
  "生日氣球（空飄數字氣球）",
  "拍照佈置",
  "指定主持人，需另加 $2000",
];

const notes = [
  "此方案限定 2-9 歲，10 歲以上價格 +300（多一組生日氣球柱）",
  "此方案不包含餐點和攝影師，如有需要攝影服務或餐點，皆以加購服務",
  "如自帶外食或外匯餐點，酌收 2000 元清潔費",
  "場地有 28 個座位，超過人數也可以席地而坐，最多容納 35 人，場地約 15 坪",
];

export const BirthdayPlan = () => (
  <section
    id="birthday"
    aria-labelledby="birthday-heading"
    className="bg-gradient-to-b from-white to-brand-soft/15 py-20 md:py-28"
  >
    <div className="mx-auto grid max-w-content items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_18px_48px_rgba(237,160,157,0.18)]"
      >
        <Image
          src={BIRTHDAY_PHOTO}
          alt="兒童生日派對佈置"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      >
        <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
          Birthday Party
        </p>
        <h2
          id="birthday-heading"
          className="mt-3 text-3xl font-semibold tracking-wide text-brand md:text-4xl"
        >
          兒童生日派對
        </h2>
        <p className="mt-4 leading-loose text-brand-ink/80">
          寶貝的每個生日都很重要，爸爸媽媽只想陪著你過每個美好瞬間！
        </p>

        <ul className="mt-8 space-y-3 text-brand-ink">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-1 inline-block size-2 shrink-0 rounded-full bg-brand-soft" />
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-2 border-t border-brand-soft/50 pt-6 text-sm leading-relaxed text-brand-ink/80">
          {notes.map((n) => (
            <p key={n}>・{n}</p>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);
