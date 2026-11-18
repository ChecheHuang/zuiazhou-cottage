"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { contactForm } from "@/lib/site-content/blocks/contact";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { cn } from "@/lib/cn";
import { openTracked } from "@/lib/analytics";

type FormState = "idle" | "success";

interface FormFields {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const initialFields: FormFields = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export const ContactForm = () => {
  const c = useContent(contactForm);
  const biz = useContent(siteBusiness);
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [state, setState] = useState<FormState>("idle");

  const update = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  // 網站沒有後端收表單：把內容組成訊息，開官方 LINE 並帶入（oaMessage），同時複製一份備用。
  // 客人要在 LINE 裡按傳送才算送出，所以欄位不清空，方便重試。
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = [
      "您好，我想詢問：",
      `${c.nameLabel}：${fields.name.trim()}`,
      `${c.phoneLabel}：${fields.phone.trim()}`,
      fields.email.trim() ? `${c.emailLabel}：${fields.email.trim()}` : null,
      "",
      fields.message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    const lineId = biz.lineId.trim();
    const url = lineId
      ? `https://line.me/R/oaMessage/${encodeURIComponent(lineId)}/?${encodeURIComponent(text)}`
      : biz.lineUrl;
    // 要在點擊的同步流程裡開視窗，避免被擋彈出視窗
    openTracked(url, "contact_form");
    navigator.clipboard?.writeText(text).catch(() => {});
    setState("success");
  };

  const inputBase =
    "w-full rounded-2xl border border-brand-soft/50 bg-white px-5 py-3.5 text-base text-brand-ink shadow-sm transition-all duration-200 placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onSubmit={onSubmit}
      className="rounded-3xl border border-brand-soft/40 bg-white p-6 shadow-[0_22px_44px_rgba(237,160,157,0.10)] md:p-10"
    >
      <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
        {c.eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-brand md:text-3xl">
        {c.title}
      </h3>
      <p className="mt-3 whitespace-pre-line text-sm text-brand-ink/70">
        {c.description}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-brand-ink">
            {c.nameLabel} <span className="text-brand">*</span>
          </span>
          <input
            type="text"
            required
            placeholder={c.namePlaceholder}
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-brand-ink">
            {c.phoneLabel} <span className="text-brand">*</span>
          </span>
          <input
            type="tel"
            required
            placeholder={c.phonePlaceholder}
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-brand-ink">
            {c.emailLabel}
          </span>
          <input
            type="email"
            placeholder={c.emailPlaceholder}
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-brand-ink">
            {c.messageLabel} <span className="text-brand">*</span>
          </span>
          <textarea
            required
            rows={5}
            placeholder={c.messagePlaceholder}
            value={fields.message}
            onChange={(e) => update("message", e.target.value)}
            className={cn(inputBase, "resize-y leading-relaxed")}
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="whitespace-pre-line text-xs text-brand-ink/60">
          {c.note}
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-strong px-9 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand-strong/90"
        >
          {c.submit}
          <span aria-hidden>→</span>
        </button>
      </div>

      {state === "success" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700"
        >
          {c.success}
        </motion.p>
      )}
    </motion.form>
  );
};
