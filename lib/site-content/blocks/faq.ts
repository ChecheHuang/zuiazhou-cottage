import { defineBlock } from "../schema";

// 常見問題頁（/faq）

export const faqSeo = defineBlock({
  key: "faq.seo",
  page: "常見問題",
  label: "頁面標題與描述（SEO）",
  description: "顯示在瀏覽器分頁與 Google 搜尋結果。",
  fields: [
    { type: "text", key: "title", label: "頁面標題" },
    { type: "text", key: "description", label: "頁面描述", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "常見問題 - Happy 抓周小屋",
    description:
      "抓周流程、人數限制、攝影、寵物入場、雙寶加價等常見問題與貼心提醒。",
    image: "/og/faq.jpg",
  },
});

export const faqIntro = defineBlock({
  key: "faq.intro",
  page: "常見問題",
  label: "頁面開頭標題",
  description: "常見問題頁最上方的大標題與說明。",
  fields: [
    {
      type: "text",
      key: "watermark",
      label: "背景浮水印英文字",
      hint: "標題後方淡色的大字",
    },
    { type: "text", key: "title", label: "標題" },
    {
      type: "text",
      key: "description",
      label: "標題下方說明",
      hint: "如果有寫題目數量，新增或刪除題目後記得一起改",
    },
  ],
  defaults: {
    watermark: "FAQ",
    title: "常見問題",
    description: "新手爸媽最常問的問題與貼心提醒，這裡整理好了 12 個常見疑問。",
  },
});

export const faqList = defineBlock({
  key: "faq.list",
  page: "常見問題",
  label: "問題與回答",
  description:
    "常見問題頁的問答清單，可新增、刪除、調整順序。題號（Q01、Q02…）會依順序自動產生。",
  fields: [
    {
      type: "list",
      key: "items",
      label: "問答",
      itemLabel: "問答",
      titleKey: "q",
      of: [
        { type: "text", key: "q", label: "問題" },
        { type: "text", key: "a", label: "回答", multiline: true },
      ],
    },
  ],
  defaults: {
    items: [
      {
        q: "抓周活動需要準備什麼？",
        a: "寶寶只要可愛的到現場🥰 我們會提供完整道具、流程與主持，爸媽只需要輕鬆參加、開心拍照！",
      },
      {
        q: "幾個月可以抓周？一定是一歲嗎？",
        a: "最適合的時間是寶寶 11–13 個月之間，也有些爸媽選在週歲當天或前後假日，我們都能配合安排。",
      },
      {
        q: "活動時間多長？需要提早到嗎？",
        a: "整體活動約 45 分鐘至 1 小時，建議提前 10–15 分鐘抵達，我們會先協助寶寶熟悉環境喔！",
      },
      {
        q: "有提供攝影嗎？可以自帶攝影師嗎？",
        a: "有的！我們配合的專業攝影師非常懂得抓寶寶的笑容，能捕捉孩子最可愛的畫面，活動結束後 7–14 天內會交付完整檔案。",
      },
      {
        q: "活動可以加訂佈置或其他服務嗎？",
        a: "可以！我們提供主題背板、客製立牌、氣球佈置、寶寶水、甜點等多款選配，也能延伸到性別揭曉、生日派對的一條龍服務。",
      },
      {
        q: "活動完可以在現場用餐嗎？",
        a: "可以喔！我們與在地合作的餐廳搭配，提供單點圓桌與桌菜辦桌兩種用餐方式，適合家庭聚餐與長輩共聚。",
      },
      {
        q: "場地最多可以容納幾人？",
        a: "依主題場地而定：福氣滿滿屋推薦 10～15 人；森林童話屋、奶油寶貝屋推薦 15～25 人；星河派對屋推薦 25～100 人，最多可容納 150 人。",
      },
      {
        q: "要怎麼預約抓周？",
        a: "歡迎直接私訊粉專、加入官方 LINE（@262qhmgi）或來電 0981-987-355 預約，我們會回傳可選時段與報價，選好後即協助保留名額！",
      },
      {
        q: "可以先到現場參觀嗎？",
        a: "可以喔！歡迎私訊小編詢問檔期、預約參觀，我們在平鎮秉坤婦幼醫院正對面巷子。",
      },
      {
        q: "除了抓周，還可以辦什麼活動？",
        a: "不只抓周，家庭聚會、慶生、性別揭曉派對、包場都沒問題！星河派對屋最多可容納 150 人，大家族聚會也不用分場。",
      },
      {
        q: "抓周方案有人數限制嗎？超過人數需要加價嗎？",
        a: "我們的抓周方案不限人數，但需配合場地空間。為了讓每位親友都有舒適的參與體驗，建議提前告知人數，我們會協助安排最合適的座位 ☺️",
      },
      {
        q: "是否有無障礙空間？",
        a: "有的！我們設有無障礙坡道，行動不便或使用推車的家人都能輕鬆進出。",
      },
      {
        q: "是否可以帶寵物？",
        a: "本場所友善寵物，毛孩可以落地活動，但請家長留意毛孩的衛生問題，避免隨地便溺。",
      },
      {
        q: "如果有兩個寶寶一起參加，需要另外收費嗎？",
        a: "是的，加一位寶寶需加價 $2,000 🍼 因流程與道具會準備雙份、儀式時間也會延長，讓每位寶貝都能完整參與屬於自己的祝福時刻 💖",
      },
    ],
  },
});

export const faqCta = defineBlock({
  key: "faq.cta",
  page: "常見問題",
  label: "頁尾詢問區",
  description: "問答清單下方「找不到答案」的白色卡片與兩個按鈕。",
  fields: [
    { type: "text", key: "eyebrow", label: "卡片上方小字（英文）" },
    { type: "text", key: "text", label: "卡片說明文字", multiline: true },
    {
      type: "text",
      key: "lineButton",
      label: "LINE 按鈕文字",
      hint: "連結會用「全站共用 › 店家資訊」的 LINE 加好友連結",
    },
    {
      type: "text",
      key: "formButton",
      label: "聯絡表單按鈕文字",
      hint: "點了會前往「聯絡我們」頁",
    },
  ],
  defaults: {
    eyebrow: "Still have questions?",
    text: "找不到您要的答案？歡迎直接 LINE 線上諮詢，我們會逐項回覆。",
    lineButton: "LINE 線上諮詢",
    formButton: "填寫聯絡表單",
  },
});
