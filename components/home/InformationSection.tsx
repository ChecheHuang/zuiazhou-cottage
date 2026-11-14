"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { businessInfo, mapEmbedUrl } from "@/data/home";
import { SectionHeading } from "@/components/SectionHeading";

const InfoLine = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft/40 text-lg">
      {icon}
    </span>
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
        {label}
      </p>
      <p className="mt-1 leading-relaxed text-brand-ink">{value}</p>
    </div>
  </div>
);

export const InformationSection = () => (
  <section
    id="info"
    aria-labelledby="info-heading"
    className="bg-white/65 py-24 md:py-32"
  >
    <div className="mx-auto max-w-content px-6">
      <SectionHeading watermark="Information" title="位置資訊" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-12 text-center"
      >
        <h3 className="text-xl font-semibold text-brand md:text-2xl">
          {businessInfo.subtitle}
        </h3>
        <p className="mt-3 text-base text-brand-accent md:text-lg">
          {businessInfo.tagline}
        </p>
      </motion.div>

      <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(237,160,157,0.16)]"
        >
          <iframe
            title="抓周小屋位置地圖"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 380 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col gap-6 rounded-3xl bg-brand-beige/60 p-8 ring-1 ring-brand-soft/40 md:p-10"
        >
          <InfoLine
            icon="📍"
            label="地址"
            value={`${businessInfo.address}（${businessInfo.landmark}）`}
          />
          <InfoLine icon="💬" label="官方 LINE" value={businessInfo.lineId} />
          <InfoLine
            icon="⏰"
            label="營業時間"
            value={businessInfo.hours}
          />
          <InfoLine icon="📞" label="電話" value={businessInfo.phone} />
          <InfoLine
            icon="📷"
            label="Instagram"
            value={businessInfo.instagram}
          />

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${businessInfo.phone.replace(/[\s-]/g, "")}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
            >
              立即來電
            </a>
            <Link
              href="/baby-party"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-soft/60 bg-white px-6 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
            >
              查看派對方案
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
