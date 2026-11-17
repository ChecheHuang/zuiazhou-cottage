// 抓周統計（前後台共用的型別與顯示格式）

export interface GrabStats {
  /** 所有物品累計被抓到的次數 */
  total: number;
  /** 這個物品被抓到的次數 */
  count: number;
}

/** 累計次數太少時百分比沒有意義（剛上線時會出現 100%），先不顯示 */
export const MIN_STATS_TOTAL = 20;

export const formatPercent = ({ total, count }: GrabStats) => {
  const percent = (count / total) * 100;
  return percent < 1 ? "不到 1%" : `${Math.round(percent)}%`;
};

export const formatTotal = (total: number) => total.toLocaleString("zh-TW");
