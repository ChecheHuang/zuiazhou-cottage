"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type FormState = "idle" | "submitting" | "success" | "error";

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
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [state, setState] = useState<FormState>("idle");

  const update = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    await new Promise((r) => setTimeout(r, 800));
    setState("success");
    setFields(initialFields);
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
        Message us
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-brand md:text-3xl">
        填寫表單，我們將盡快回覆
      </h3>
      <p className="mt-3 text-sm text-brand-ink/70">
        想預約派對或了解詳細方案？留下聯絡資訊，我們會在 1-2 個工作天內回覆。
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-brand-ink">
            姓名 <span className="text-brand">*</span>
          </span>
          <input
            type="text"
            required
            placeholder="您的稱呼"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-brand-ink">
            電話 <span className="text-brand">*</span>
          </span>
          <input
            type="tel"
            required
            placeholder="0900-000-000"
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-brand-ink">
            Email <span className="text-brand">*</span>
          </span>
          <input
            type="email"
            required
            placeholder="hello@example.com"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-brand-ink">
            留言訊息 <span className="text-brand">*</span>
          </span>
          <textarea
            required
            rows={5}
            placeholder="想了解的派對方案、預計日期、寶寶月齡、預估人數…"
            value={fields.message}
            onChange={(e) => update("message", e.target.value)}
            className={cn(inputBase, "resize-y leading-relaxed")}
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-ink/60">
          送出後我們會以 LINE 或電話與您聯繫，請留意通知。
        </p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-9 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-300",
            state === "submitting"
              ? "cursor-wait bg-brand/70 shadow-brand/20"
              : "bg-brand shadow-brand/30 hover:scale-105 hover:bg-brand/90",
          )}
        >
          {state === "submitting" ? "送出中…" : "確認送出"}
          <span aria-hidden>→</span>
        </button>
      </div>

      {state === "success" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700"
        >
          ✅ 表單已送出！我們收到您的訊息了，將盡快與您聯絡。
        </motion.p>
      )}
    </motion.form>
  );
};
