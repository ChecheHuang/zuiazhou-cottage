import { ABOUT_PHOTO, GALLERY_PHOTOS, HOST_PHOTO } from "./photos";

export const aboutStory = [
  "我們是一群熱愛主持、注重孩子與家庭溫度的活動工作者。",
  "從婚禮、抓周到各式親子活動，我們始終相信，人生中每個重要的階段，都值得被認真對待、好好紀念。",
  "希望打造一個空間，不只是讓寶寶抓周，更是讓家人能安心相聚、留下真實互動與溫暖笑聲的地方。",
  "從流程設計、主持節奏、拍攝氛圍到活動細節，我們都親自把關，只為了讓每一個家庭都能帶著滿滿的愛與回憶離開。",
  "歡迎來到 Happy 抓週小屋，把寶寶的第一場派對放心交給我們吧。🤍",
];

export const aboutHeroPhoto = ABOUT_PHOTO;
export const aboutHostPhoto = HOST_PHOTO;

export interface AboutTeam {
  eyebrow: string;
  title: string;
  desc: string;
  photo: string;
}

export const aboutTeams: AboutTeam[] = [
  {
    eyebrow: "Host",
    title: "主理人團隊",
    desc: "親自參與每一場派對的流程設計、主持節奏與細節掌控，希望讓爸爸媽媽都能放心把寶貝的第一場派對交給我們。",
    photo: HOST_PHOTO,
  },
  {
    eyebrow: "Catering Partner",
    title: "合作餐點團隊",
    desc: "長期合作的在地喜慶料理夥伴，從寶寶餐盒、桌菜到甜點，提供完整外燴選擇，讓賓客在儀式結束後直接入座享用。",
    photo: GALLERY_PHOTOS[2] ?? HOST_PHOTO,
  },
];

export const aboutPhotoGallery = GALLERY_PHOTOS.slice(0, 12);
export const aboutEnvironmentGallery = GALLERY_PHOTOS.slice(12, 20);
