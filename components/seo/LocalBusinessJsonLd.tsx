import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { layoutSeo } from "@/lib/site-content/blocks/layout";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { parseOpeningHours } from "@/lib/business-hours";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

// 「桃園市平鎮區延平路…」→ 縣市 / 區 / 其餘地址；格式不符時整串當作街道地址。
// 先比對「區」：像「平鎮區」的「鎮」本身也是鄉鎮字尾，不能先停在那裡。
const parseTwAddress = (address: string) => {
  const compact = address.replace(/\s+/g, " ").trim();
  const m = compact.match(
    /^(\S{2}[市縣])\s?(\S{1,3}?區|\S{1,3}?[鄉鎮市])\s?(.+)$/,
  );
  return m
    ? { addressRegion: m[1], addressLocality: m[2], streetAddress: m[3] }
    : { streetAddress: compact };
};

// 「0981 987 355」→「+886-981-987-355」
const toE164 = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("886")) return `+${digits}`;
  if (digits.startsWith("0")) {
    const rest = digits.slice(1);
    return `+886-${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
  }
  return phone;
};

// 從場地方案的價格（例如「$8,880」）算出價格區間
const priceRangeOf = (prices: string[]) => {
  const values = prices
    .map((p) => Number(p.replace(/[^\d]/g, "")))
    .filter((n) => n > 0);
  if (values.length === 0) return undefined;
  const fmt = (n: number) => `NT$${n.toLocaleString("en-US")}`;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? fmt(min) : `${fmt(min)}–${fmt(max)}`;
};

const EVERY_DAY = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const LocalBusinessJsonLd = async () => {
  const [biz, seo, plans] = await Promise.all([
    getContent(siteBusiness),
    getContent(layoutSeo),
    getContent(partyPlans),
  ]);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#business"),
    name: biz.brand,
    description: seo.description,
    url: absoluteUrl("/"),
    image: absoluteUrl(seo.image),
    logo: absoluteUrl("/photos/logo.png"),
    telephone: toE164(biz.phone),
    address: {
      "@type": "PostalAddress",
      addressCountry: "TW",
      ...parseTwAddress(biz.address),
    },
    sameAs: [biz.instagramUrl, biz.facebookUrl, biz.lineUrl].filter(Boolean),
  };

  const priceRange = priceRangeOf(plans.plans.map((p) => p.price));
  if (priceRange) data.priceRange = priceRange;

  // 解析不了的寫法（例如分平假日）就不輸出，避免給 Google 錯誤資訊；每天營業時間相同
  const hours = parseOpeningHours(biz.hours);
  if (hours) {
    data.openingHoursSpecification = {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: EVERY_DAY,
      opens: hours.opens,
      closes: hours.closes,
    };
  }

  return <JsonLd data={data} />;
};
