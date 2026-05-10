export interface ZhuazhouItem {
  name: string;
  meaning?: string;
  img: string;
}

const careerNames = [
  "飛機",
  "算盤",
  "相機",
  "攝影機",
  "梳子",
  "畫架",
  "太空人",
  "槌子",
  "汽車",
  "聽診器",
  "手槍",
  "麥克風",
  "電腦",
  "元寶",
  "蒸籠",
  "藤球",
  "尺",
  "望遠鏡",
  "鋼琴",
  "放大鏡",
  "毛筆",
];

const careerMeanings: Record<string, string> = {
  飛機: "機師、航空業",
  算盤: "商人、會計",
  相機: "攝影師",
  攝影機: "導演、媒體",
  梳子: "美容造型師",
  畫架: "畫家、藝術家",
  太空人: "太空科學家",
  槌子: "工程師、法官",
  汽車: "工程師、賽車手",
  聽診器: "醫師、護理",
  手槍: "軍警、保家衛國",
  麥克風: "歌手、主持人",
  電腦: "工程師、程式設計",
  元寶: "財運亨通",
  蒸籠: "廚師、餐飲業",
  藤球: "運動員",
  尺: "建築師、設計師",
  望遠鏡: "探險家、天文",
  鋼琴: "音樂家",
  放大鏡: "研究員、科學家",
  毛筆: "文學家、書法家",
};

const traditionalNames = [
  "籐籃",
  "紅龜粿",
  "蔥",
  "雞腿",
  "金元寶",
  "蒜",
  "蘋果",
  "芹菜",
  "米香",
  "花生",
];

const traditionalMeanings: Record<string, string> = {
  籐籃: "盛裝祝福，事事如意",
  紅龜粿: "長命百歲、平安健康",
  蔥: "聰明伶俐",
  雞腿: "豐衣足食",
  金元寶: "財運亨通、富貴吉祥",
  蒜: "會精打細算",
  蘋果: "平平安安",
  芹菜: "勤奮努力",
  米香: "好人緣、人見人愛",
  花生: "長生不老、福氣綿延",
};

export const careerItems: ZhuazhouItem[] = careerNames.map((name, i) => ({
  name,
  meaning: careerMeanings[name],
  img: `https://picsum.photos/seed/career-${i}/400/400`,
}));

export const traditionalItems: ZhuazhouItem[] = traditionalNames.map(
  (name, i) => ({
    name,
    meaning: traditionalMeanings[name],
    img: `https://picsum.photos/seed/trad-${i}/400/400`,
  }),
);
