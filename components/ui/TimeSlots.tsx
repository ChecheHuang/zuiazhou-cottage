"use client";

import { partyTimeSlots } from "@/lib/business-hours";

// 派對時間：依店家營業時間產生每 30 分鐘一格的時段，用下拉選單選（手機上不會佔掉半個畫面）。
export const TimeSlots = ({
  label,
  hoursText,
  value,
  onChange,
  placeholder = "還沒決定",
}: {
  label: string;
  /** 後台「店家資訊 › 營業時間」的文字 */
  hoursText: string;
  value: string;
  onChange: (value: string) => void;
  /** 沒選時顯示的文字 */
  placeholder?: string;
}) => {
  const slots = partyTimeSlots(hoursText);
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-brand">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-brand-soft/70 bg-white px-4 py-2 text-brand-ink tabular-nums outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft/40"
      >
        <option value="">{placeholder}</option>
        {slots.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
};
