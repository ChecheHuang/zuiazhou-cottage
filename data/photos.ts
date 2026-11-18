const photo = (n: number) => {
  const padded = String(n).padStart(2, "0");
  return `/photos/p${padded}.jpg`;
};

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => photo(start + i));

const roomPhotos = (key: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/photos/rooms/${key}-${i + 1}.jpg`);

// 截自 FB Reel「寶寶抓周場地怎麼選？四大主題一次看！」，每張都對應影片中標示的場地
export const THEME_ROOM_PHOTOS = {
  galaxy: roomPhotos("galaxy", 4),
  forest: roomPhotos("forest", 3),
  cream: roomPhotos("cream", 3),
  fortune: roomPhotos("fortune", 4),
};

export const HOST_PHOTO = photo(40);

export const GALLERY_PHOTOS = [...range(25, 39), ...range(41, 49)];

export const BACKGROUND_SLIDESHOW = range(50, 57);

export const BIRTHDAY_PHOTO = photo(12);

// 抓周流程 10 步，依序作為 party.ritual 各步驟的預設照片，截自 FB Reels 的儀式畫面
export const STEP_PHOTOS = Array.from(
  { length: 10 },
  (_, i) => `/photos/ritual/step${String(i + 1).padStart(2, "0")}.jpg`,
);

export const HERO_SLIDESHOW = [
  photo(1),
  photo(10),
  photo(20),
  photo(30),
  photo(40),
  photo(50),
  photo(57),
];

export const ABOUT_PHOTO = photo(11);

export const SERVICE_PHOTOS = {
  babyParty: photo(2),
  shouxian: photo(15),
  genderReveal: photo(20),
};

export const REVIEW_PHOTOS = range(35, 42);

