// food 頁的文字區塊。每個 export 的 defineBlock(...) 會自動出現在後台。
import { GALLERY_PHOTOS } from "@/data/photos";
import { defineBlock } from "../schema";

const PAGE = "餐食加購";

export const foodSeo = defineBlock({
  key: "food.seo",
  page: PAGE,
  label: "搜尋引擎與分頁標題",
  description: "瀏覽器分頁上的標題，以及 Google 搜尋結果下方的說明文字。",
  fields: [
    { type: "text", key: "title", label: "分頁標題" },
    { type: "text", key: "description", label: "頁面說明", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "餐食加購 - Happy 抓周小屋",
    description:
      "Happy 抓周小屋專屬組合菜色、單點、合菜桌菜、下午茶點心，儀式結束後直接入座。",
    image: "/og/food.jpg",
  },
});

export const foodHero = defineBlock({
  key: "food.hero",
  page: PAGE,
  label: "頁首介紹",
  description: "餐食加購頁最上方的標題與介紹文字。",
  fields: [
    { type: "text", key: "watermark", label: "標題後方的大字（英文裝飾字）" },
    { type: "text", key: "title", label: "主標題" },
    {
      type: "text",
      key: "intro",
      label: "介紹文字",
      multiline: true,
      hint: "可換行，換行會照樣顯示",
    },
  ],
  defaults: {
    watermark: "Food",
    title: "餐食加購",
    intro:
      "不論哪種方式，都是在儀式結束後就能直接入座，不必另找地點，非常省心！\n📍（抓周場地就在餐廳裡，是內屬的抓周部門喔）",
  },
});

export type FoodMenu = { title: string; dishes: string[] };

export type FoodPlanItem = {
  image: string;
  code: string;
  subtitle: string;
  title: string;
  desc: string;
  dishes: string[];
  bullets: string[];
  price: string;
  seats: string;
  menus: FoodMenu[];
  dessertsTitle: string;
  desserts: string[];
  ctaLabel: string;
};

const plans: FoodPlanItem[] = [
  {
    image: GALLERY_PHOTOS[0] ?? "/photos/p25.jpg",
    code: "A",
    subtitle: "為抓周設計的喜氣套餐",
    title: "Happy 抓周小屋 專屬組合菜色",
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
    bullets: [],
    price: "$4,000",
    seats: "每席 10 位",
    menus: [],
    dessertsTitle: "",
    desserts: [],
    ctaLabel: "",
  },
  {
    image: GALLERY_PHOTOS[1] ?? "/photos/p26.jpg",
    code: "B",
    subtitle: "",
    title: "合作餐廳單點菜色",
    desc: "想自由選擇菜色的話，也可以採單點方式，讓每位賓客都能吃到自己喜歡的菜色～",
    dishes: [],
    bullets: [],
    price: "",
    seats: "",
    menus: [],
    dessertsTitle: "",
    desserts: [],
    ctaLabel: "查看菜單",
  },
  {
    image: GALLERY_PHOTOS[2] ?? "/photos/p27.jpg",
    code: "C",
    subtitle: "圍桌共享，氣氛最熱鬧",
    title: "合作餐廳合菜／桌菜形式",
    desc: "最推薦給有長輩或大家庭聚會的客人！大家圍桌吃飯，氣氛更熱鬧，也很有抓周慶典的感覺。",
    dishes: [],
    bullets: [],
    price: "$6,000 ~ $10,000",
    seats: "每席 10 位",
    menus: [
      {
        title: "$6,000 套餐菜色",
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
        title: "$8,000 套餐菜色",
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
        title: "$10,000 套餐菜色",
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
    dessertsTitle: "",
    desserts: [],
    ctaLabel: "",
  },
  {
    image: GALLERY_PHOTOS[3] ?? "/photos/p28.jpg",
    code: "D",
    subtitle: "甜鹹兼具的下午茶選擇",
    title: "點心套組",
    desc: "提供多樣化的甜點與鹹點，讓大家可以選擇自己喜歡的美食享受。",
    dishes: [],
    bullets: [
      "餐點：鹹點、甜點總共選三項，每項 20 份，共 60 個小點",
      "5L 飲料一桶（四選一：麥茶、柳橙、可爾必思、綠茶）",
      "寶寶大頭插牌 20 枚",
      "活動使用時間總共 2.5 小時（建議人數：15 位）",
    ],
    price: "$6,000",
    seats: "",
    menus: [],
    dessertsTitle: "可選餐點種類",
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
    ctaLabel: "",
  },
];

export const foodPlans = defineBlock({
  key: "food.plans",
  page: PAGE,
  label: "用餐方案",
  description:
    "每個方案是一張大卡片（照片＋介紹）。不需要的部分留空即可，留空的部分不會顯示在網站上。",
  fields: [
    { type: "text", key: "watermark", label: "標題後方的大字（英文裝飾字）" },
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "list",
      key: "plans",
      label: "用餐方案",
      itemLabel: "方案",
      titleKey: "title",
      of: [
        { type: "image", key: "image", label: "方案照片" },
        {
          type: "text",
          key: "code",
          label: "照片左上角的代號",
          hint: "例如 A、B、C",
        },
        { type: "text", key: "subtitle", label: "標題上方的小字" },
        { type: "text", key: "title", label: "方案名稱" },
        { type: "text", key: "desc", label: "方案介紹", multiline: true },
        {
          type: "list",
          key: "dishes",
          label: "菜色（介紹下方的菜名格）",
          of: "text",
          itemLabel: "菜色",
        },
        {
          type: "list",
          key: "bullets",
          label: "方案內容（介紹下方的條列說明）",
          of: "text",
          itemLabel: "項目",
        },
        { type: "text", key: "price", label: "價格（粉色價格標籤）" },
        {
          type: "text",
          key: "seats",
          label: "價格後的人數說明",
          hint: "例如「每席 10 位」，會顯示在價格後面",
        },
        {
          type: "list",
          key: "menus",
          label: "可展開的套餐菜單",
          itemLabel: "套餐",
          titleKey: "title",
          of: [
            { type: "text", key: "title", label: "套餐名稱" },
            {
              type: "list",
              key: "dishes",
              label: "套餐菜色",
              of: "text",
              itemLabel: "菜色",
            },
          ],
        },
        { type: "text", key: "dessertsTitle", label: "可選餐點的標題" },
        {
          type: "list",
          key: "desserts",
          label: "可選餐點清單",
          of: "text",
          itemLabel: "餐點",
        },
        {
          type: "text",
          key: "ctaLabel",
          label: "LINE 按鈕文字",
          hint: "有填寫才會顯示按鈕，點了會開啟 LINE",
        },
      ],
    },
  ],
  defaults: {
    watermark: "Plans",
    title: "四種用餐方案",
    description:
      "從專屬組合套餐到桌菜辦桌、下午茶點心，依參加人數與場合自由選擇。",
    plans,
  },
});

export const foodNotice = defineBlock({
  key: "food.notice",
  page: PAGE,
  label: "餐點注意事項",
  description: "用餐方案下方的白色注意事項框，以及框內的按鈕文字。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方的英文小字" },
    { type: "text", key: "title", label: "標題" },
    {
      type: "list",
      key: "notes",
      label: "注意事項",
      of: "text",
      itemLabel: "注意事項",
    },
    { type: "text", key: "banquetTitle", label: "補充規範標題" },
    {
      type: "list",
      key: "banquetNotes",
      label: "補充規範內容",
      of: "text",
      itemLabel: "規範",
      multiline: true,
    },
    { type: "text", key: "lineButton", label: "LINE 按鈕文字" },
    { type: "text", key: "partyButton", label: "「查看派對方案」按鈕文字" },
    {
      type: "text",
      key: "budgetButton",
      label: "「預算試算」按鈕文字",
      hint: "連到預算試算頁；留空就不顯示",
    },
  ],
  defaults: {
    eyebrow: "Notice",
    title: "❗ 餐點注意事項",
    notes: [
      "餐點請以五的倍數為單位，例如 25 人／30 人…以此類推",
      "多五人份 +$1,500",
      "或多增加一項種類（20 人份）+$2,000",
      "飲料多一桶 5L +$800",
    ],
    banquetTitle: "桌菜補充規範",
    banquetNotes: [
      "指定包廂低消：平日每桌 6,000+10%／假日每桌 8,000+10%（不含酒水），最低一桌起跳，使用包廂者外收 10% 包廂費。",
      "素食套餐一份 600 元，敬請提早預約。",
      "本菜單隨季節食材做調整變更，本餐廳保有最終解釋權。",
    ],
    lineButton: "LINE 線上諮詢",
    partyButton: "查看派對方案",
    budgetButton: "🧮 試算派對總預算",
  },
});
