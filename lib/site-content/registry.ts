import * as about from "./blocks/about";
import * as ai from "./blocks/ai";
import * as babyParty from "./blocks/baby-party";
import * as blog from "./blocks/blog";
import * as budget from "./blocks/budget";
import * as contact from "./blocks/contact";
import * as faq from "./blocks/faq";
import * as food from "./blocks/food";
import * as home from "./blocks/home";
import * as invite from "./blocks/invite";
import * as layout from "./blocks/layout";
import * as photo from "./blocks/photo";
import * as play from "./blocks/play";
import * as productsBlocks from "./blocks/products";
import * as schedule from "./blocks/schedule";
import * as site from "./blocks/site";
import { getBlockOrder, isContentBlock, type ContentBlock } from "./schema";

// 後台依這個順序顯示；各頁檔案裡 export 的區塊會自動收進來
const modules = [
  site,
  layout,
  home,
  babyParty,
  play,
  invite,
  ai,
  about,
  photo,
  food,
  productsBlocks,
  budget,
  faq,
  blog,
  contact,
  schedule,
];

// 每頁內依檔案中定義的順序（＝頁面由上而下），SEO 設定放最後
const isSeo = (b: ContentBlock) => b.key.endsWith(".seo");
const byPageOrder = (a: ContentBlock, b: ContentBlock) =>
  Number(isSeo(a)) - Number(isSeo(b)) || getBlockOrder(a) - getBlockOrder(b);

export const BLOCKS: ContentBlock[] = modules.flatMap((m) =>
  Object.values(m).filter(isContentBlock).sort(byPageOrder),
);

export const BLOCK_MAP: ReadonlyMap<string, ContentBlock> = new Map(
  BLOCKS.map((b) => [b.key, b]),
);

export const BLOCK_PAGES = [...new Set(BLOCKS.map((b) => b.page))];
