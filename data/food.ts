import { GALLERY_PHOTOS } from "./photos";

export const foodIntro =
  "不論哪種方式，都是在儀式結束後就能直接入座，不必另找地點，非常省心！\n📍（抓周場地就在餐廳裡，是內屬的抓周部門喔）";

export interface FoodPlanCommon {
  code: string;
  title: string;
  subtitle?: string;
  desc: string;
  photo: string;
}

export interface FoodPlanCombo extends FoodPlanCommon {
  kind: "combo";
  dishes: string[];
  price: string;
  seats: string;
}

export interface FoodPlanSimple extends FoodPlanCommon {
  kind: "simple";
  ctaLabel?: string;
}

export interface BanquetMenu {
  price: string;
  dishes: string[];
}

export interface FoodPlanBanquet extends FoodPlanCommon {
  kind: "banquet";
  priceRange: string;
  seats: string;
  menus: BanquetMenu[];
}

export interface FoodPlanDessert extends FoodPlanCommon {
  kind: "dessert";
  bullets: string[];
  price: string;
  desserts: string[];
}

export type FoodPlan =
  | FoodPlanCombo
  | FoodPlanSimple
  | FoodPlanBanquet
  | FoodPlanDessert;

export const foodPlans: FoodPlan[] = [
  {
    kind: "combo",
    code: "A",
    title: "Happy 抓週小屋 專屬組合菜色",
    subtitle: "為抓周設計的喜氣套餐",
    desc: "我們特別為抓周活動設計的專屬餐點組合，菜色搭配完整又喜氣，適合想一次搞定用餐＋活動的爸媽們。",
    dishes: [
      "招牌脆皮雞",
      "鳳梨蝦球",
      "清蒸海上鮮",
      "招牌芋頭米粉鍋",
      "筍尖燴控肉",
      "蔥花煎蛋",
      "港式避風塘中卷",
      "大骨筍排鍋",
      "季節時蔬",
      "白飯",
    ],
    price: "$4,000",
    seats: "每席 10 位",
    photo: GALLERY_PHOTOS[0] ?? "/photos/p25.jpg",
  },
  {
    kind: "simple",
    code: "B",
    title: "合作餐廳單點菜色",
    desc: "想自由選擇菜色的話，也可以採單點方式，讓每位賓客都能吃到自己喜歡的菜色～",
    photo: GALLERY_PHOTOS[1] ?? "/photos/p26.jpg",
    ctaLabel: "查看菜單",
  },
  {
    kind: "banquet",
    code: "C",
    title: "合作餐廳合菜／桌菜形式",
    subtitle: "圍桌共享，氣氛最熱鬧",
    desc: "最推薦給有長輩或大家庭聚會的客人！大家圍桌吃飯，氣氛更熱鬧，也很有抓周慶典的感覺。",
    priceRange: "$6,000 ~ $10,000",
    seats: "每席 10 位",
    photo: GALLERY_PHOTOS[2] ?? "/photos/p27.jpg",
    menus: [
      {
        price: "$6,000",
        dishes: [
          "富貴孔鮑龍鳳拼",
          "荷香米糕拼蝦捲",
          "窯燒爐烤招牌雞",
          "芋香中卷米粉鍋",
          "泰式清蒸海上鮮",
          "港香蒜味大草蝦",
          "銅盤碧綠燴鮮蛤",
          "黑蒜頭元氣燉雞",
          "四季鮮翠扒時蔬",
          "寶島季節水果盤",
        ],
      },
      {
        price: "$8,000",
        dishes: [
          "御饌滿福山海拼",
          "砂鍋鮮蚵海鮮粥",
          "窯燒爐烤招牌雞",
          "碧綠翠盞扒蝦仁",
          "金麟御海石斑魚",
          "銅盤茴香海大蝦",
          "澎湖香酥避風卷",
          "水岸黃金燜鴨鍋",
          "松坂腰花麵線煲",
          "寶島季節水果盤",
        ],
      },
      {
        price: "$10,000",
        dishes: [
          "饗宴雲裳真味拼",
          "水岸鰻片米糕拼",
          "窯燒爐烤招牌雞",
          "珍饈御品海鮮羹",
          "陶盤歡喜鮮玉帶",
          "金黃酥炸佐生菜",
          "御廚一品豬肋排",
          "麻油雞佛炒雙腰",
          "御品燉鱘龍魚鍋",
          "寶島季節水果盤",
        ],
      },
    ],
  },
  {
    kind: "dessert",
    code: "D",
    title: "點心套組",
    subtitle: "甜鹹兼具的下午茶選擇",
    desc: "提供多樣化的甜點與鹹點，讓大家可以選擇自己喜歡的美食享受。",
    bullets: [
      "餐點：鹹點、甜點總共選三項，每項 20 份，共 60 個小點",
      "5L 飲料一桶（四選一：麥茶、柳橙、可爾必思、綠茶）",
      "寶寶大頭插牌 20 枚",
      "活動使用時間總共 2.5 小時（建議人數：15 位）",
    ],
    price: "$6,000",
    desserts: [
      "咖哩雞一口堡",
      "咖哩蝦一口堡",
      "花枝小丸子（船）",
      "鳳梨蝦球",
      "鮪魚法式三明治",
      "活力沙拉堡",
      "燻雞沙拉可頌",
      "起司熱狗",
      "提拉米蘇",
      "提拉米蘇杯",
      "夢幻黑森林（蛋奶素）",
      "東京千蛋糕（蛋奶素）",
      "焦糖布丁",
      "義式堅果塔（蛋奶素）",
      "芒果奶酪",
      "黃金乳酪蛋糕",
    ],
    photo: GALLERY_PHOTOS[3] ?? "/photos/p28.jpg",
  },
];

export const foodOrderingNotes = [
  "餐點請以五的倍數為單位，例如 25 人／30 人…以此類推",
  "多五人份 +$1,500",
  "或多增加一項種類（20 人份）+$2,000",
  "飲料多一桶 5L +$800",
];

export const banquetExtraNotes = [
  "指定包廂低消：平日每桌 6,000+10%／假日每桌 8,000+10%（不含酒水），最低一桌起跳，使用包廂者外收 10% 包廂費。",
  "素食套餐一份 600 元，敬請提早預約。",
  "本菜單隨季節食材做調整變更，本餐廳保有最終解釋權。",
];
