import { SERVICE_PHOTOS } from "./photos";

export interface ServiceCard {
  title: string;
  desc: string;
  href: string;
  img: string;
}

export const services: ServiceCard[] = [
  {
    title: "寶寶抓周派對",
    desc: "傳承華人習俗的抓周儀式，搭配溫馨佈置與主持，為寶貝寫下人生第一個職業願望。",
    href: "/baby-party",
    img: SERVICE_PHOTOS.babyParty,
  },
  {
    title: "收涎派對",
    desc: "四個月前的小儀式，邀請親友為寶寶集滿祝福，留下軟萌可愛的紀念照片。",
    href: "/baby-party",
    img: SERVICE_PHOTOS.shouxian,
  },
  {
    title: "性別揭曉派對",
    desc: "充滿驚喜的揭曉時刻，從氣球佈置到拍照效果，讓全家一起見證新生命的祝福。",
    href: "/baby-party",
    img: SERVICE_PHOTOS.genderReveal,
  },
];

export interface BookingStep {
  step: number;
  title: string;
  desc: string;
  emoji: string;
}

export const bookingSteps: BookingStep[] = [
  {
    step: 1,
    title: "預約諮詢",
    desc: "加入官方 LINE 後，提供想預約的派對服務、日期時間、寶寶資料、人數及加購餐點與攝影需求，我們會與您逐項討論。",
    emoji: "💬",
  },
  {
    step: 2,
    title: "服務預約",
    desc: "確認預約檔期後，請先匯款訂金以保留派對日期，正式進入準備期。",
    emoji: "📅",
  },
  {
    step: 3,
    title: "派對當天",
    desc: "爸爸、媽媽、寶寶只要漂漂亮亮出席，所有佈置與儀式主持由我們完成。活動結束後支付尾款即可。",
    emoji: "🎉",
  },
  {
    step: 4,
    title: "成品交付",
    desc: "若有加購攝影服務，將於 7-14 個工作天內提供精修照片或影片給爸爸媽媽。",
    emoji: "🎁",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  cover: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "venue-guide",
    title: "桃園楊梅抓週場地全攻略！5 大類型場地＋費用比較，爸媽不再選擇困難！",
    excerpt:
      "從專業派對小屋到自家客廳，五種場地各有什麼優缺點？費用、空間、便利性一次比較給你看。",
    category: "場地推薦",
    readTime: "8 分鐘",
    cover: "https://picsum.photos/seed/blog-1/800/500",
  },
  {
    slug: "props-checklist",
    title: "抓周要準備哪些道具？抓周物品清單、吉祥話、意義全都告訴你！",
    excerpt:
      "完整列出 21 種職業道具與 10 種傳統祈福物，每個物品的吉祥話與寓意一次解析。",
    category: "抓周指南",
    readTime: "10 分鐘",
    cover: "https://picsum.photos/seed/blog-2/800/500",
  },
  {
    slug: "first-birthday",
    title: "寶寶周歲派對怎麼辦？抓周流程、禁忌與舉辦模式選擇全攻略",
    excerpt:
      "從吉時挑選、流程設計到傳統禁忌，第一次幫寶貝辦派對也能輕鬆上手的完整指南。",
    category: "派對攻略",
    readTime: "12 分鐘",
    cover: "https://picsum.photos/seed/blog-3/800/500",
  },
];

export interface Review {
  name: string;
  relation: string;
  rating: number;
  body: string;
  avatar: string;
}

export const reviews: Review[] = [
  {
    name: "派對主辦媽咪",
    relation: "周歲派對",
    rating: 5,
    body: "主理人超會帶氣氛，寶寶從一進場就被吸引，全家人都笑到肚子痛。佈置漂亮拍照超好看，根本是行動相館！",
    avatar: "https://picsum.photos/seed/review-1/120/120",
  },
  {
    name: "派對主辦媽媽",
    relation: "性別揭曉派對",
    rating: 5,
    body: "原本只是想簡單慶祝，沒想到從佈置、流程到攝影都被照顧得很好，整個過程超有儀式感，親友都讚不絕口。",
    avatar: "https://picsum.photos/seed/review-2/120/120",
  },
  {
    name: "派對主辦爸爸",
    relation: "雙寶抓周",
    rating: 5,
    body: "雙胞胎的抓周道具雙份準備不馬虎，主持人節奏穩、互動好，照片影片都拍得很到位，誠心推薦！",
    avatar: "https://picsum.photos/seed/review-3/120/120",
  },
];

export const businessInfo = {
  brand: "Happy 抓週小屋",
  subtitle: "桃園楊梅 · 抓週派對小屋",
  tagline: "抓週 × 派對 × 慶生 × 性別趴 × 婚宴 × 求婚",
  address: "桃園市楊梅區幼獅路二段 218 巷 360 弄 43 號",
  hours: "週一至週日 07:30 – 21:00（全日預約制）",
  phone: "0981 987 355",
  instagram: "@happyonehouse",
  access: [
    "🚗 楊梅交流道 10 分鐘",
    "🚌 楊梅火車站 8 分鐘",
    "🅿 免費停車 20 格",
  ],
  socials: {
    instagram: "https://www.instagram.com/happyonehouse",
    facebook: "https://www.facebook.com/",
    line: "https://line.me/",
  },
};
