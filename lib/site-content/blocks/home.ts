import { SERVICE_PHOTOS } from "@/data/photos";
import { defineBlock } from "../schema";

// 首頁的文字區塊。每個 export 的 defineBlock(...) 會自動出現在後台。
const PAGE = "首頁";

const watermarkField = {
  type: "text",
  key: "watermark",
  label: "背景英文浮水印",
  hint: "標題後方的淡色大字",
} as const;

export const homeSeo = defineBlock({
  key: "home.seo",
  page: PAGE,
  label: "搜尋引擎設定（SEO）",
  description: "首頁在 Google 搜尋結果與瀏覽器分頁上顯示的標題與說明。",
  fields: [
    { type: "text", key: "title", label: "網頁標題" },
    { type: "text", key: "description", label: "網頁說明", multiline: true },
  ],
  defaults: {
    title: "Happy 抓周小屋｜桃園平鎮抓週派對推薦",
    description:
      "桃園平鎮包場抓週派對、兒童生日派對、性別揭曉派對，從場佈、流程到攝影一站式包辦，給寶貝最美的人生第一場派對。",
  },
});

export const homeHero = defineBlock({
  key: "home.hero",
  page: PAGE,
  label: "首頁大圖輪播文字",
  description: "首頁最上方輪播大圖上的標語與按鈕。",
  fields: [
    { type: "text", key: "eyebrow", label: "英文小標", hint: "主標題上方" },
    {
      type: "text",
      key: "titleLine1",
      label: "主標題（第一段）",
      hint: "手機版會在第一段後換行",
    },
    { type: "text", key: "titleLine2", label: "主標題（第二段）" },
    {
      type: "text",
      key: "subtitle",
      label: "副標說明",
      multiline: true,
      hint: "可以換行",
    },
    { type: "text", key: "primaryButton", label: "主要按鈕文字" },
    { type: "text", key: "secondaryButton", label: "次要按鈕文字" },
  ],
  defaults: {
    eyebrow: "Happy moments, lasting memories",
    titleLine1: "為寶貝留下",
    titleLine2: "最珍貴的派對時光",
    subtitle:
      "桃園平鎮 ｜ 抓週派對 × 兒童生日派對 × 性別揭曉派對\n場佈、流程、主持、攝影一站式包辦",
    primaryButton: "查看派對方案",
    secondaryButton: "認識 Happy 抓周小屋",
  },
});

export const homeAbout = defineBlock({
  key: "home.about",
  page: PAGE,
  label: "關於我們",
  description: "首頁大圖下方的「關於我們」介紹區。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    {
      type: "text",
      key: "photoAlt",
      label: "照片說明文字",
      hint: "給搜尋引擎與視障朋友看的圖片描述",
    },
    { type: "text", key: "eyebrow", label: "卡片英文小標" },
    { type: "text", key: "heading", label: "卡片標題" },
    {
      type: "list",
      key: "paragraphs",
      label: "介紹內文",
      of: "text",
      itemLabel: "段落",
      multiline: true,
    },
    { type: "text", key: "button", label: "按鈕文字" },
  ],
  defaults: {
    watermark: "About",
    title: "關於我們",
    photoAlt: "抓周小屋的派對佈置與寶寶互動",
    eyebrow: "We are Happy Cottage",
    heading: "👶 Happy 抓周小屋｜寶寶的專屬派對",
    paragraphs: [
      "從性別揭曉、抓週活動，到寶寶的生日派對，我們提供溫馨、有儀式感、好拍照的一條龍服務，讓每位爸媽都能安心參與寶貝最珍貴的時刻。",
      "我們用心打造專屬的抓週儀式，結合溫馨佈置、專業主持、活動流程引導與攝影紀錄，讓每一場派對都是獨一無二的回憶。",
      "由「桃園抓周阿花」花花主持人帶領的團隊，從流程引導、互動遊戲、拍照帶位到現場氣氛通通顧好，阿公阿嬤、爸爸媽媽和親朋好友都能一起參與，現場笑聲不斷、回憶滿滿。歡迎一同走進 Happy 抓周小屋的故事。",
    ],
    button: "瞭解詳情",
  },
});

export const homeService = defineBlock({
  key: "home.service",
  page: PAGE,
  label: "服務項目",
  description: "首頁「服務項目」卡片區，點卡片會前往抓週派對頁。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "list",
      key: "items",
      label: "服務卡片",
      itemLabel: "服務",
      titleKey: "title",
      of: [
        { type: "image", key: "image", label: "卡片照片" },
        { type: "text", key: "title", label: "服務名稱" },
        { type: "text", key: "desc", label: "服務介紹", multiline: true },
      ],
    },
    {
      type: "text",
      key: "cardLink",
      label: "卡片連結文字",
      hint: "每張卡片底部的小字",
    },
    { type: "text", key: "button", label: "下方按鈕文字" },
  ],
  defaults: {
    watermark: "Service",
    title: "服務項目",
    description: "從佈置到主持，每一場派對都為您量身打造。",
    items: [
      {
        image: SERVICE_PHOTOS.babyParty,
        title: "寶寶抓周派對",
        desc: "傳承華人習俗的抓周儀式，搭配溫馨佈置與主持，為寶貝寫下人生第一個職業願望。",
      },
      {
        image: SERVICE_PHOTOS.shouxian,
        title: "收涎派對",
        desc: "四個月前的小儀式，邀請親友為寶寶集滿祝福，留下軟萌可愛的紀念照片。",
      },
      {
        image: SERVICE_PHOTOS.genderReveal,
        title: "性別揭曉派對",
        desc: "充滿驚喜的揭曉時刻，從氣球佈置到拍照效果，讓全家一起見證新生命的祝福。",
      },
    ],
    cardLink: "查看詳情",
    button: "查看所有服務",
  },
});

export const homeParallax = defineBlock({
  key: "home.parallax",
  page: PAGE,
  label: "環境照片橫幅",
  description: "首頁中段滿版環境照片上的文字。",
  fields: [
    { ...watermarkField, hint: "照片上的淡色英文大字" },
    { type: "text", key: "title", label: "標題" },
    { type: "text", key: "description", label: "說明", multiline: true },
  ],
  defaults: {
    watermark: "Environment",
    title: "走進溫柔的派對小屋",
    description:
      "四大主題空間、專業主持、滿滿的祝福儀式——所有讓你拍照不踩雷的元素，我們都準備好了。",
  },
});

export const homeReviews = defineBlock({
  key: "home.reviews",
  page: PAGE,
  label: "好評分享",
  description: "首頁的顧客評論卡片。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "list",
      key: "items",
      label: "評論",
      itemLabel: "評論",
      titleKey: "name",
      of: [
        { type: "text", key: "name", label: "顧客稱呼" },
        {
          type: "text",
          key: "relation",
          label: "派對類型",
          hint: "顯示在稱呼下方",
        },
        {
          type: "text",
          key: "avatarText",
          label: "頭像文字",
          hint: "圓形頭像裡的一個字",
        },
        {
          type: "text",
          key: "rating",
          label: "星等",
          hint: "填 1 到 5 的數字",
        },
        { type: "text", key: "body", label: "評論內容", multiline: true },
      ],
    },
  ],
  defaults: {
    watermark: "Testimonial",
    title: "好評分享",
    description: "爸爸媽媽們的真實回饋，是我們繼續用心做下去的最大動力。",
    items: [
      {
        name: "派對主辦媽咪",
        relation: "周歲派對",
        avatarText: "媽",
        rating: "5",
        body: "主理人超會帶氣氛，寶寶從一進場就被吸引，全家人都笑到肚子痛。佈置漂亮拍照超好看，根本是行動相館！",
      },
      {
        name: "派對主辦媽媽",
        relation: "性別揭曉派對",
        avatarText: "媽",
        rating: "5",
        body: "原本只是想簡單慶祝，沒想到從佈置、流程到攝影都被照顧得很好，整個過程超有儀式感，親友都讚不絕口。",
      },
      {
        name: "派對主辦爸爸",
        relation: "雙寶抓周",
        avatarText: "爸",
        rating: "5",
        body: "雙胞胎的抓周道具雙份準備不馬虎，主持人節奏穩、互動好，照片影片都拍得很到位，誠心推薦！",
      },
    ],
  },
});

export const homeGallery = defineBlock({
  key: "home.gallery",
  page: PAGE,
  label: "攝影作品",
  description: "首頁的作品照片牆（照片請到「網站圖片」管理）。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    { type: "text", key: "button", label: "按鈕文字" },
  ],
  defaults: {
    watermark: "Photo Portfolio",
    title: "攝影作品",
    description: "點擊任一張照片，看見每場派對最動人的瞬間。",
    button: "觀看完整作品集",
  },
});

export const homeBooking = defineBlock({
  key: "home.booking",
  page: PAGE,
  label: "預約流程",
  description:
    "首頁的預約步驟卡片與 LINE 按鈕（LINE 連結、電話請到「全站共用 › 店家資訊」修改）。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "text",
      key: "stepPrefix",
      label: "步驟編號前綴",
      hint: "例如「Step」會顯示成 Step 1、Step 2…",
    },
    {
      type: "list",
      key: "steps",
      label: "步驟",
      itemLabel: "步驟",
      titleKey: "title",
      of: [
        { type: "text", key: "emoji", label: "圖示（表情符號）" },
        { type: "text", key: "title", label: "步驟名稱" },
        { type: "text", key: "desc", label: "步驟說明", multiline: true },
      ],
    },
    { type: "text", key: "lineButton", label: "LINE 按鈕文字" },
    {
      type: "text",
      key: "phonePrefix",
      label: "電話前的文字",
      hint: "後面會自動接上店家電話",
    },
  ],
  defaults: {
    watermark: "Booking Step",
    title: "預約流程",
    description: "從加入官方 LINE 到派對完成，四個簡單步驟陪你走完整段旅程。",
    stepPrefix: "Step",
    steps: [
      {
        emoji: "💬",
        title: "預約諮詢",
        desc: "加入官方 LINE 後，提供想預約的派對服務、日期時間、寶寶資料、人數及加購餐點與攝影需求，我們會與您逐項討論。",
      },
      {
        emoji: "📅",
        title: "服務預約",
        desc: "確認預約檔期後，請先匯款訂金以保留派對日期，正式進入準備期。",
      },
      {
        emoji: "🎉",
        title: "派對當天",
        desc: "爸爸、媽媽、寶寶只要漂漂亮亮出席，所有佈置與儀式主持由我們完成。活動結束後支付尾款即可。",
      },
      {
        emoji: "🎁",
        title: "成品交付",
        desc: "若有加購攝影服務，將於 7-14 個工作天內提供精修照片或影片給爸爸媽媽。",
      },
    ],
    lineButton: "加入官方 LINE",
    phonePrefix: "或來電諮詢",
  },
});

export const homeInformation = defineBlock({
  key: "home.information",
  page: PAGE,
  label: "位置資訊",
  description:
    "首頁下方的地圖與聯絡資訊標題（地址、電話等內容請到「全站共用 › 店家資訊」修改）。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    {
      type: "text",
      key: "mapTitle",
      label: "地圖說明文字",
      hint: "給視障朋友的地圖描述",
    },
    { type: "text", key: "addressLabel", label: "「地址」標籤" },
    { type: "text", key: "lineLabel", label: "「官方 LINE」標籤" },
    { type: "text", key: "hoursLabel", label: "「營業時間」標籤" },
    { type: "text", key: "phoneLabel", label: "「電話」標籤" },
    { type: "text", key: "instagramLabel", label: "「Instagram」標籤" },
    { type: "text", key: "callButton", label: "來電按鈕文字" },
    { type: "text", key: "plansButton", label: "方案按鈕文字" },
  ],
  defaults: {
    watermark: "Information",
    title: "位置資訊",
    mapTitle: "抓周小屋位置地圖",
    addressLabel: "地址",
    lineLabel: "官方 LINE",
    hoursLabel: "營業時間",
    phoneLabel: "電話",
    instagramLabel: "Instagram",
    callButton: "立即來電",
    plansButton: "查看派對方案",
  },
});

export const homeBlog = defineBlock({
  key: "home.blog",
  page: PAGE,
  label: "部落格",
  description: "首頁最下方的文章卡片（文章頁尚未上線，卡片目前不能點）。",
  fields: [
    watermarkField,
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "text",
      key: "readLabel",
      label: "閱讀時間前綴",
      hint: "例如「Read」會顯示成 Read · 8 分鐘",
    },
    { type: "text", key: "comingSoon", label: "「即將推出」標籤" },
    {
      type: "list",
      key: "posts",
      label: "文章",
      itemLabel: "文章",
      titleKey: "title",
      of: [
        { type: "image", key: "cover", label: "封面照片" },
        {
          type: "text",
          key: "category",
          label: "分類",
          hint: "顯示在封面左上角",
        },
        { type: "text", key: "readTime", label: "閱讀時間" },
        { type: "text", key: "title", label: "文章標題" },
        { type: "text", key: "excerpt", label: "文章摘要", multiline: true },
      ],
    },
  ],
  defaults: {
    watermark: "Blog",
    title: "部落格",
    description:
      "一邊籌備派對，一邊累積知識：場地、道具、流程、禁忌全部一次告訴你。",
    readLabel: "Read",
    comingSoon: "即將推出",
    posts: [
      {
        cover: "/photos/fb-venue.jpg",
        category: "場地推薦",
        readTime: "8 分鐘",
        title:
          "桃園平鎮抓週場地全攻略！5 大類型場地＋費用比較，爸媽不再選擇困難！",
        excerpt:
          "從專業派對小屋到自家客廳，五種場地各有什麼優缺點？費用、空間、便利性一次比較給你看。",
      },
      {
        cover: "/photos/p33.jpg",
        category: "抓周指南",
        readTime: "10 分鐘",
        title: "抓周要準備哪些道具？抓周物品清單、吉祥話、意義全都告訴你！",
        excerpt:
          "完整列出 21 種職業道具與 10 種傳統祈福物，每個物品的吉祥話與寓意一次解析。",
      },
      {
        cover: "/photos/fb-decor.jpg",
        category: "派對攻略",
        readTime: "12 分鐘",
        title: "寶寶周歲派對怎麼辦？抓周流程、禁忌與舉辦模式選擇全攻略",
        excerpt:
          "從吉時挑選、流程設計到傳統禁忌，第一次幫寶貝辦派對也能輕鬆上手的完整指南。",
      },
    ],
  },
});
