"use client";

import { motion } from "framer-motion";
import { businessInfo } from "@/data/home";

interface InfoCardProps {
  eyebrow: string;
  title: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
}

const InfoCard = ({ eyebrow, title, value, href, icon }: InfoCardProps) => {
  const content = (
    <>
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft/40 text-brand">
        {icon}
      </span>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-accent">
          {eyebrow}
        </p>
        <p className="mt-2 text-base font-semibold text-brand md:text-lg">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-brand-ink/85">
          {value}
        </p>
      </div>
    </>
  );

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className="group"
    >
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="block h-full rounded-3xl border border-brand-soft/40 bg-white p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand/30 group-hover:shadow-[0_18px_40px_rgba(237,160,157,0.18)]"
        >
          {content}
        </a>
      ) : (
        <div className="block h-full rounded-3xl border border-brand-soft/40 bg-white p-6">
          {content}
        </div>
      )}
    </motion.li>
  );
};

export const ContactInfo = () => (
  <motion.ul
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.08 } },
    }}
    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
  >
    <InfoCard
      eyebrow="Address"
      title="地址"
      value={businessInfo.address}
      icon={<span className="text-xl">📍</span>}
    />
    <InfoCard
      eyebrow="Phone"
      title="電話"
      value={businessInfo.phone}
      href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
      icon={<span className="text-xl">📞</span>}
    />
    <InfoCard
      eyebrow="Instagram"
      title={businessInfo.instagram}
      value="@happyonehouse"
      href={businessInfo.socials.instagram}
      icon={<span className="text-xl">📷</span>}
    />
    <InfoCard
      eyebrow="LINE"
      title="官方 LINE"
      value="點擊加入線上諮詢"
      href={businessInfo.socials.line}
      icon={<span className="text-xl">💬</span>}
    />
  </motion.ul>
);
