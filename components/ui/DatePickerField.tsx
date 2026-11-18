"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { cn } from "@/lib/cn";

// 品牌風格的日期選擇器（取代原生 <input type="date">）。
// 值與原生一樣用「YYYY-MM-DD」字串；桌機從按鈕下方展開，手機從底部滑出。

type Kind = "birthday" | "event";

const WEEKDAYS = "日一二三四五六";

const toDate = (value: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
};

const toValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const display = (d: Date) =>
  `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（${WEEKDAYS[d.getDay()]}）`;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const BIRTHDAY_FIRST_YEAR = 1920;

// 生日快速鈕：點了把日曆翻到 N 年前的這個月（日子還是要自己點）
// 快速鈕依「今天」計算，伺服器（UTC）跟台灣時間在半夜會差一天，只在瀏覽器端顯示
const noopSubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(noopSubscribe, () => true, () => false);

const AGE_PRESETS = [
  { label: "週歲寶寶", years: 1 },
  { label: "2 歲", years: 2 },
  { label: "3 歲", years: 3 },
];

// 派對日期快速鈕：接下來的兩個週末（今天是週六／週日也算進去）
const mondayOf = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)).getTime();

const upcomingWeekends = (today: Date) => {
  const days: { date: Date; label: string }[] = [];
  for (let i = 0; days.length < 4 && i < 14; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) continue;
    // 以週一為一週的開始，判斷是這週還是下週
    const weeks = Math.round((mondayOf(d) - mondayOf(today)) / (7 * 86_400_000));
    const week = ["這", "下", "下下"][weeks] ?? "";
    days.push({
      date: d,
      label: `${i === 0 ? "今天" : `${week}週${WEEKDAYS[wd]}`} ${d.getMonth() + 1}/${d.getDate()}`,
    });
  }
  return days;
};

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** birthday：1920 年到今天，可下拉選年月；event：只能選今天以後 */
  kind: Kind;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  kind,
  placeholder = "請選擇日期",
  disabled,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const isClient = useIsClient();
  const selected = toDate(value);
  const today = startOfToday();
  // 生日：抓周寶寶多半剛滿一歲，預設翻到一年前的這個月（只是翻頁，不會自動選日期）
  const initialMonth = () =>
    selected ?? (kind === "birthday" ? addMonths(today, -12) : today);
  const [month, setMonth] = useState(initialMonth);
  const chipClass = (on: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs transition-colors disabled:opacity-50",
      on
        ? "border-brand bg-brand-strong text-white"
        : "border-brand-soft/70 bg-white text-brand hover:bg-brand-soft/30",
    );

  // 點外面或按 Esc 關閉
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const range =
    kind === "birthday"
      ? {
          // 大人也可能想玩，年份往前開放到 1920 年
          startMonth: new Date(BIRTHDAY_FIRST_YEAR, 0, 1),
          endMonth: today,
          disabled: { after: today },
          captionLayout: "dropdown" as const,
          reverseYears: true,
        }
      : {
          startMonth: today,
          endMonth: addMonths(today, 24),
          disabled: { before: today },
          captionLayout: "label" as const,
        };

  return (
    <div ref={rootRef} className="relative flex flex-col gap-1.5">
      <span id={labelId} className="text-sm font-medium text-brand">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        aria-labelledby={labelId}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open) setMonth(initialMonth());
          setOpen((v) => !v);
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-full border bg-white px-4 py-2 text-left outline-none transition",
          open
            ? "border-brand ring-4 ring-brand-soft/40"
            : "border-brand-soft/70 hover:border-brand-soft",
          "disabled:opacity-60",
        )}
      >
        <span className={selected ? "text-brand-ink" : "text-brand-ink/40"}>
          {selected ? display(selected) : placeholder}
        </span>
        <span aria-hidden className="text-brand">
          📅
        </span>
      </button>

      <div
        className={cn(
          "flex min-h-7 flex-wrap gap-1.5",
          kind === "birthday" ? "justify-center" : "justify-start",
        )}
      >
        {!isClient ? null : kind === "birthday"
          ? AGE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setMonth(addMonths(today, -12 * p.years));
                  setOpen(true);
                }}
                className={chipClass(false)}
              >
                {p.label}
              </button>
            ))
          : upcomingWeekends(today).map((d) => {
              const v = toValue(d.date);
              return (
                <button
                  key={v}
                  type="button"
                  disabled={disabled}
                  aria-pressed={value === v}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                  className={chipClass(value === v)}
                >
                  {d.label}
                </button>
              );
            })}
      </div>

      {open && (
        <>
          {/* 手機：半透明底 + 從底部滑出；桌機：按鈕下方的浮動面板 */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-brand-ink/25 sm:hidden"
          />
          <div
            role="dialog"
            aria-label={label}
            className="brand-calendar fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl bg-white px-4 pb-6 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:rounded-3xl sm:p-3 sm:shadow-[0_18px_40px_rgba(237,160,157,0.25)] sm:ring-1 sm:ring-brand-soft/60"
          >
            <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-brand-soft sm:hidden" />
            <DayPicker
              mode="single"
              locale={zhTW}
              // 台灣日曆習慣週日開頭（zh-TW 語系預設是週一）
              weekStartsOn={0}
              selected={selected}
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                if (!d) return;
                onChange(toValue(d));
                setOpen(false);
              }}
              {...range}
            />
          </div>
        </>
      )}
    </div>
  );
};
