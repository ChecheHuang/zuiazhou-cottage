import { STEP_PHOTOS } from "./photos";

export interface RitualStep {
  step: number;
  title: string;
  desc: string;
  img: string;
}

const STEP_DATA: Omit<RitualStep, "img">[] = [
  {
    step: 1,
    title: "穿虎衣、虎鞋",
    desc: "爸爸媽媽幫寶寶穿戴虎帽、穿虎鞋。寓意：在中國傳統習俗認為「老虎」可以避邪保平安，更被人們視為吉祥物、鎮煞之寶。",
  },
  {
    step: 2,
    title: "摸摸小老虎",
    desc: "寶寶抓周穿虎衣、虎帽、虎鞋，用意便是希望藉此嚇退邪煞，保其平安成長。",
  },
  {
    step: 3,
    title: "踏紅龜求百歲",
    desc: "爸爸媽媽抱著寶貝踏紅龜。寓意：祝福寶寶長命百歲、頭好壯壯。",
  },
  {
    step: 4,
    title: "說說吉祥話",
    desc: "準備 6-8 種不同含義的祝福物品（雞腿、蔥、蒜頭、芹菜、蘋果、米餅）。寓意：祝福寶貝未來人生道路平平安安、身體健康。",
  },
  {
    step: 5,
    title: "開智啟鑼",
    desc: "爸爸媽媽和寶寶一起敲鑼。寓意：一敲智慧打開，二敲及第登科，三敲財運興旺。",
  },
  {
    step: 6,
    title: "過蔥門",
    desc: "準備一把小青蔥，用紅絲帶鑲在門上面，由爸爸抱著寶寶從門下走過。寓意：青蔥門下過，寶寶聰明又可愛。",
  },
  {
    step: 7,
    title: "抓周",
    desc: "重頭戲！由寶寶自己挑選抓周物品，象徵未來人生方向，全家一起留下難忘的回憶。",
  },
  {
    step: 8,
    title: "生日快樂",
    desc: "邀請所有親友一同為寶貝慶祝人生第一個生日。",
  },
  {
    step: 9,
    title: "合影留念",
    desc: "家人合影留下紀念。",
  },
];

export const ritualSteps: RitualStep[] = STEP_DATA.map((s, i) => ({
  ...s,
  img: STEP_PHOTOS[i % STEP_PHOTOS.length],
}));
