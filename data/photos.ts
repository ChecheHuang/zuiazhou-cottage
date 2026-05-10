const photo = (n: number) => {
  const padded = String(n).padStart(2, "0");
  return `/photos/p${padded}.jpg`;
};

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => photo(start + i));

export const PARTY_PLAN_PHOTOS = {
  basic: range(1, 5),
  floral: range(6, 11),
  deluxe: range(20, 24),
};

export const HOST_PHOTO = photo(40);

export const GALLERY_PHOTOS = [
  ...range(25, 39),
  ...range(41, 49),
];

export const BACKGROUND_SLIDESHOW = range(50, 57);

export const BIRTHDAY_PHOTO = photo(12);

export const STEP_PHOTOS = range(13, 19);

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

export const PARALLAX_BG = photo(20);
