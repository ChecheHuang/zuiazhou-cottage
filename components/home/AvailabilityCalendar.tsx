"use client";

import { useSyncExternalStore } from "react";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useContent } from "@/components/SiteContentProvider";
import { cn } from "@/lib/cn";
import { homeAvailability } from "@/lib/site-content/blocks/home";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import {
  formatDateLabel,
  fromDateKey,
  toDateKey,
  todayKey,
  type DayStatus,
  type PublicAvailability,
} from "@/lib/schedule/shared";

// 首頁檔期日曆：只顯示每天「有空／快滿／已滿／公休」，點日期開 LINE 並帶入日期。

const STATUS_CLASS: Record<DayStatus, string> = {
  open: "text-brand",
  few: "text-brand-accent",
  full: "text-brand-ink/45",
  closed: "text-brand-ink/45",
};

// 頁面可能被快取到隔天，「今天」以瀏覽器時間為準，伺服器輸出時沿用資料的起始日
const subscribe = () => () => {};

export const AvailabilityCalendar = ({ data }: { data: PublicAvailability }) => {
  const c = useContent(homeAvailability);
  const biz = useContent(siteBusiness);
  const today = useSyncExternalStore(subscribe, () => todayKey(), () => data.from);
  const from = today > data.from ? today : data.from;

  const label: Record<DayStatus, string> = {
    open: c.openLabel,
    few: c.fewLabel,
    full: c.fullLabel,
    closed: c.closedLabel,
  };
  const statusOf = (key: string): DayStatus => data.statuses[key] ?? "open";
  const inRange = (key: string) => key >= from && key <= data.to;

  const openLine = (key: string) => {
    const message = c.lineMessage.replaceAll("{日期}", formatDateLabel(key));
    window.open(lineChatHref(biz, message), "_blank", "noopener,noreferrer");
  };

  // 日期下方加一行狀態小字；範圍外的日子維持原樣（會被 disabled）
  const DayButton = ({ day, modifiers, className, children, ...rest }: DayButtonProps) => {
    const key = toDateKey(day.date);
    const status = statusOf(key);
    const show = inRange(key) && !modifiers.outside;
    return (
      <button
        {...rest}
        className={cn(className, "flex-col gap-0 leading-tight")}
        aria-label={show ? `${formatDateLabel(key)} ${label[status]}` : rest["aria-label"]}
      >
        <span className={cn(show && (status === "full" || status === "closed") && "line-through decoration-1")}>
          {children}
        </span>
        {show && (
          <span className={cn("text-[10px] font-medium", STATUS_CLASS[status])}>
            {label[status]}
          </span>
        )}
      </button>
    );
  };

  return (
    <section
      id="calendar"
      aria-labelledby="calendar-heading"
      className="bg-white/65 py-24 md:py-32"
    >
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          watermark={c.watermark}
          title={c.title}
          description={c.description}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="brand-calendar availability-calendar mx-auto mt-12 flex w-fit max-w-full justify-center rounded-3xl bg-white p-4 shadow-[0_12px_32px_rgba(237,160,157,0.12)] ring-1 ring-brand-soft/40 sm:p-6"
        >
          <DayPicker
            locale={zhTW}
            weekStartsOn={0}
            startMonth={fromDateKey(from)}
            endMonth={fromDateKey(data.to)}
            disabled={(d) => !inRange(toDateKey(d))}
            onDayClick={(d, m) => {
              if (!m.disabled) openLine(toDateKey(d));
            }}
            components={{ DayButton }}
          />
        </motion.div>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {(Object.keys(label) as DayStatus[]).map((s) => (
            <li key={s} className={cn("font-medium", STATUS_CLASS[s])}>
              ● {label[s]}
            </li>
          ))}
        </ul>
        {c.footnote && (
          <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-center text-sm leading-relaxed text-brand-ink/70">
            {c.footnote}
          </p>
        )}
      </div>
    </section>
  );
};
