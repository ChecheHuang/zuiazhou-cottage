// 農曆生日與「抓周吉日推薦」：全部在瀏覽器裡算，不送出任何資料。
// lunar-javascript 檔案不小，用到時才 import（見 loadLunarTools）。

import type { Lunar } from "lunar-javascript";
import { zodiacOf } from "./fortune";

// 套件輸出簡體字，本站用到的只有這幾個字
const TRADITIONAL: Record<string, string> = {
  闰: "閏",
  腊: "臘",
  黄: "黃",
  鸡: "雞",
  马: "馬",
  龙: "龍",
  猪: "豬",
};
const toTraditional = (text: string) =>
  [...text].map((ch) => TRADITIONAL[ch] ?? ch).join("");

const WEEKDAYS = "日一二三四五六";
const DAY = 86_400_000;

/** 例如「十月初九」「閏六月初六」「正月十五」 */
const lunarMonthDay = (l: Lunar) =>
  toTraditional(`${l.getMonthInChinese()}月${l.getDayInChinese()}`);

export interface GoodDay {
  /** YYYY-MM-DD */
  value: string;
  /** 例如「12/6（六）」 */
  label: string;
  /** 例如「農曆十月廿六」 */
  lunar: string;
  /** 黃道吉日且不沖寶寶生肖 */
  good: boolean;
  /** 剛好滿週歲那天 */
  isBirthday: boolean;
}

export interface LunarInfo {
  /** 例如「十月初九（乙巳年）」 */
  lunarBirthday: string;
  /** 寶寶還沒滿週歲太久才有；大人或早就過週歲的不推薦 */
  goodDays: GoodDay[] | null;
}

const toValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** 滿週歲後超過幾天就不推薦吉日 */
const SHOW_UNTIL_DAYS_AFTER = 60;
/** 從滿週歲前幾天找起、找到後幾天 */
const SEARCH_BEFORE = 21;
const SEARCH_AFTER = 45;
const MAX_DAYS = 4;

export const loadLunarTools = async () => {
  const { Solar } = await import("lunar-javascript");
  const lunarOf = (d: Date) =>
    Solar.fromYmd(d.getFullYear(), d.getMonth() + 1, d.getDate()).getLunar();

  return (birthday: { year: number; month: number; day: number }): LunarInfo => {
    const born = lunarOf(new Date(birthday.year, birthday.month - 1, birthday.day));
    const lunarBirthday = `${lunarMonthDay(born)}（${born.getYearInGanZhi()}年）`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 2/29 出生的寶寶，隔年 Date 會自動變成 3/1
    const firstBirthday = new Date(birthday.year + 1, birthday.month - 1, birthday.day);
    if (today.getTime() > firstBirthday.getTime() + SHOW_UNTIL_DAYS_AFTER * DAY) {
      return { lunarBirthday, goodDays: null };
    }

    const zodiac = zodiacOf(birthday.year, birthday.month, birthday.day);
    const start = Math.max(
      today.getTime() + DAY, // 至少從明天起
      firstBirthday.getTime() - SEARCH_BEFORE * DAY,
    );
    const end = firstBirthday.getTime() + SEARCH_AFTER * DAY;

    const candidates: (GoodDay & { weekend: boolean })[] = [];
    for (let t = start; t <= end; t += DAY) {
      const d = new Date(t);
      d.setHours(0, 0, 0, 0);
      const l = lunarOf(d);
      const wd = d.getDay();
      candidates.push({
        value: toValue(d),
        label: `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[wd]}）`,
        lunar: `農曆${lunarMonthDay(l)}`,
        good:
          toTraditional(l.getDayTianShenType()) === "黃道" &&
          toTraditional(l.getDayChongShengXiao()) !== zodiac,
        isBirthday: d.getTime() === firstBirthday.getTime(),
        weekend: wd === 0 || wd === 6,
      });
    }

    // 滿週歲當天一定列出（不論吉凶，讓家長自己決定），再補週末的吉日，不夠才用平日
    const birthdayDay = candidates.find((c) => c.isBirthday);
    // 離滿週歲越近越前面
    const distance = (c: GoodDay) =>
      Math.abs(new Date(c.value).getTime() - firstBirthday.getTime());
    const goods = candidates
      .filter((c) => c.good && !c.isBirthday)
      .sort((a, b) => distance(a) - distance(b));
    const picked = [
      ...goods.filter((c) => c.weekend),
      ...goods.filter((c) => !c.weekend),
    ]
      .slice(0, MAX_DAYS - (birthdayDay ? 1 : 0))
      .concat(birthdayDay ? [birthdayDay] : [])
      .sort((a, b) => a.value.localeCompare(b.value))
      .map((c): GoodDay => ({
        value: c.value,
        label: c.label,
        lunar: c.lunar,
        good: c.good,
        isBirthday: c.isBirthday,
      }));

    return { lunarBirthday, goodDays: picked.length ? picked : null };
  };
};
