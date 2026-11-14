"use client";

import { cn } from "@/lib/cn";
import { partyTimeSlots } from "@/lib/business-hours";

// 派對時間：依店家營業時間產生每 30 分鐘一格的時段按鈕（取代原生 <input type="time">）。
// 再點一次已選的時段可以取消。
export const TimeSlots = ({
  label,
  hoursText,
  value,
  onChange,
}: {
  label: string;
  /** 後台「店家資訊 › 營業時間」的文字 */
  hoursText: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const slots = partyTimeSlots(hoursText);
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-brand">{label}</span>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
        {slots.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={value === t}
            onClick={() => onChange(value === t ? "" : t)}
            className={cn(
              "rounded-full py-1.5 text-sm tabular-nums transition-colors",
              value === t
                ? "bg-brand font-medium text-white shadow"
                : "bg-white text-brand-ink ring-1 ring-brand-soft/60 hover:bg-brand-soft/30",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};
