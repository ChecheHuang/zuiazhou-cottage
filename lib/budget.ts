// 預算試算：把後台自由輸入的價格文字轉成數字。
// 「$4,600」→ 4600；「$6,000 ~ $10,000」→ 6000 起；沒有數字（例如空白、「另洽」）→ 無法計算。

export interface ParsedPrice {
  /** 可加總的金額；null 代表沒有標價 */
  amount: number | null;
  /** 價格是區間或寫了「起」，只能算最低價 */
  from: boolean;
}

export const parsePrice = (text: string): ParsedPrice => {
  const nums = [...text.matchAll(/\d[\d,]*/g)]
    .map((m) => Number(m[0].replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return { amount: null, from: false };
  return {
    amount: Math.min(...nums),
    from: nums.length > 1 || /起|~|～|-|以上/.test(text),
  };
};

export const formatNT = (n: number) => `$${n.toLocaleString("en-US")}`;

/** 「每席 10 位」這類說明代表按桌計價，要讓客人填桌數 */
export const isPerTable = (seats: string) => /席|桌/.test(seats);
