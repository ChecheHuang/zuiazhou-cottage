// lunar-javascript 沒有附型別，只宣告本站用到的部分
declare module "lunar-javascript" {
  export interface Lunar {
    /** 閏月是負數 */
    getMonth(): number;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearInGanZhi(): string;
    /** 「黄道」或「黑道」（簡體） */
    getDayTianShenType(): string;
    /** 這天沖的生肖（簡體） */
    getDayChongShengXiao(): string;
  }
  export const Solar: {
    fromYmd(year: number, month: number, day: number): { getLunar(): Lunar };
  };
}
