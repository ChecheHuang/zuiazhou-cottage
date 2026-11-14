// 解析後台「店家資訊 › 營業時間」的文字（前後台共用）。
// 支援「24 小時營業」與「09:30–21:30」（分隔可用 - – — ~ ～ 至 到）；
// 其他寫法（例如分平假日）回傳 null，由呼叫端決定怎麼處理。

export interface OpeningHours {
  opens: string;
  closes: string;
  allDay: boolean;
}

const pad = (t: string) => t.padStart(5, "0");

export const parseOpeningHours = (text: string): OpeningHours | null => {
  if (/24\s*小時/.test(text)) {
    return { opens: "00:00", closes: "23:59", allDay: true };
  }
  const m = /(\d{1,2}:\d{2})\s*[-–—~～至到]\s*(\d{1,2}:\d{2})/.exec(text);
  return m ? { opens: pad(m[1]), closes: pad(m[2]), allDay: false } : null;
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** 派對可選的開始時段：營業時間內每 30 分鐘一格，最後一格比打烊早 30 分鐘。
 *  24 小時營業或無法解析時，用 09:00–21:00。 */
export const partyTimeSlots = (hoursText: string, step = 30): string[] => {
  const parsed = parseOpeningHours(hoursText);
  const [start, end] =
    parsed && !parsed.allDay
      ? [toMinutes(parsed.opens), toMinutes(parsed.closes)]
      : [9 * 60, 21 * 60 + step];
  const first = Math.ceil(start / step) * step;
  return Array.from(
    { length: Math.max(0, Math.floor((end - step - first) / step) + 1) },
    (_, i) => toTime(first + i * step),
  );
};
