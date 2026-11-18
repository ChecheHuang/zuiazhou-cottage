// 後台左側選單與「依網頁分頁」的設定（前後端共用，只放純資料）。
//
// 擴充方式：
// - 新增一個網站頁面：在 SITE_PAGES 加一筆，blockPage / slotPages 對應
//   lib/site-content/blocks 的 PAGE 與 lib/site-images/slots.ts 的 page。
//   漏掉的話 lib/admin/page-sections.ts 會在 dev/build 直接報錯。
// - 新增一個後台功能（例如預約、留言）：建立 app/admin/(panel)/<路徑>/page.tsx，
//   再到 ADMIN_NAV 加一筆。

export interface SitePageSection {
  slug: string;
  label: string;
  icon: string;
  /** 前台網址，後台頁面上「查看此頁」用；全站設定沒有 */
  href?: string;
  /** 這一頁的文字區塊（ContentBlock.page） */
  blockPages: string[];
  /** 這一頁的圖片位置（SlotDef.page）；同一個位置可以出現在多頁 */
  slotPages: string[];
}

// 網站的各個頁面：同一頁的圖片和文字放在一起編輯
export const SITE_PAGES: SitePageSection[] = [
  {
    slug: "home",
    label: "首頁",
    icon: "🏠",
    href: "/",
    blockPages: ["首頁"],
    slotPages: ["首頁", "首頁／寶寶派對"],
  },
  {
    slug: "about",
    label: "關於我們",
    icon: "🏡",
    href: "/about",
    blockPages: ["關於我們"],
    slotPages: ["關於我們"],
  },
  {
    slug: "baby-party",
    label: "寶寶派對",
    icon: "🎉",
    href: "/baby-party",
    blockPages: ["寶寶派對"],
    slotPages: ["寶寶派對", "首頁／寶寶派對"],
  },
  {
    slug: "play",
    label: "線上模擬抓周",
    icon: "👶",
    href: "/play",
    blockPages: ["模擬抓周"],
    slotPages: [],
  },
  {
    slug: "invite",
    label: "派對邀請文案",
    icon: "💌",
    href: "/invite",
    blockPages: ["派對邀請文案"],
    slotPages: [],
  },
  {
    slug: "photo",
    label: "派對加購",
    icon: "📸",
    href: "/photo",
    blockPages: ["派對加購"],
    slotPages: ["派對加購"],
  },
  {
    slug: "food",
    label: "餐食加購",
    icon: "🍰",
    href: "/food",
    blockPages: ["餐食加購"],
    slotPages: [],
  },
  {
    slug: "products-page",
    label: "商品專區頁面",
    icon: "🛍️",
    href: "/products",
    blockPages: ["商品專區"],
    slotPages: [],
  },
  {
    slug: "budget",
    label: "預算試算",
    icon: "🧮",
    href: "/budget",
    blockPages: ["預算試算"],
    slotPages: [],
  },
  {
    slug: "faq",
    label: "常見問題",
    icon: "❓",
    href: "/faq",
    blockPages: ["常見問題"],
    slotPages: [],
  },
  {
    slug: "blog",
    label: "部落格",
    icon: "📝",
    href: "/blog",
    blockPages: ["部落格"],
    slotPages: [],
  },
  {
    slug: "contact",
    label: "聯絡我們",
    icon: "📞",
    href: "/contact",
    blockPages: ["聯絡我們"],
    slotPages: [],
  },
];

// 全站共用的設定：不屬於單一頁面
export const SETTINGS_PAGES: SitePageSection[] = [
  {
    slug: "business",
    label: "店家資訊",
    icon: "🏪",
    blockPages: ["全站共用"],
    slotPages: [],
  },
  {
    slug: "layout",
    label: "頁首頁尾",
    icon: "🧭",
    blockPages: ["頁首頁尾"],
    slotPages: [],
  },
  {
    slug: "schedule-settings",
    label: "檔期設定",
    icon: "⏰",
    blockPages: ["檔期設定"],
    slotPages: [],
  },
  {
    slug: "ai",
    label: "AI 功能",
    icon: "✨",
    blockPages: ["AI 功能"],
    slotPages: [],
  },
];

export const ALL_PAGE_SECTIONS = [...SITE_PAGES, ...SETTINGS_PAGES];

export const pageSectionHref = (slug: string) => `/admin/pages/${slug}`;

export interface NavLink {
  href: string;
  label: string;
  icon?: string;
}

// 有 children 的是可展開的父層（跟前台下拉選單一樣），本身沒有頁面
export interface NavParent {
  label: string;
  icon: string;
  children: NavLink[];
}

export type NavItem = NavLink | NavParent;

export const isNavParent = (item: NavItem): item is NavParent =>
  "children" in item;

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

const bySlug = (slug: string) => {
  const page = ALL_PAGE_SECTIONS.find((p) => p.slug === slug);
  if (!page) throw new Error(`[admin] 找不到頁面設定：${slug}`);
  return page;
};

const pageLink = (slug: string, label?: string): NavLink => {
  const page = bySlug(slug);
  return {
    href: pageSectionHref(page.slug),
    label: label ?? page.label,
    icon: page.icon,
  };
};

// 左側選單：「網站頁面」照前台導覽列的順序與階層排（components/SiteHeader.tsx 的 NAV_ITEMS）。
// 前台同一頁的錨點（例如寶寶派對的收涎、生日）在後台是同一頁，不另外列。
// 之後加功能就在這裡加一筆。
export const ADMIN_NAV: NavGroup[] = [
  { items: [{ href: "/admin", label: "總覽", icon: "📊" }] },
  {
    title: "預約",
    items: [{ href: "/admin/schedule", label: "排程日曆", icon: "🗓️" }],
  },
  {
    title: "網站頁面",
    items: [
      pageLink("home"),
      pageLink("about"),
      {
        label: "寶寶派對",
        icon: "🎉",
        children: [
          pageLink("baby-party", "寶寶派對頁"),
          pageLink("play"),
          pageLink("invite"),
        ],
      },
      // 跟前台導覽列一樣：餐食、商品、預算試算都收在「派對加購」底下
      {
        label: "派對加購",
        icon: "📸",
        children: [
          pageLink("photo", "攝影與其他加購"),
          pageLink("food"),
          { href: "/admin/products", label: "商品管理", icon: "📦" },
          pageLink("products-page", "商品專區頁面文字"),
          pageLink("budget"),
        ],
      },
      pageLink("faq"),
      pageLink("blog"),
      pageLink("contact"),
    ],
  },
  { title: "全站設定", items: SETTINGS_PAGES.map((p) => pageLink(p.slug)) },
];

// 頁面上方的麵包屑：找出這個網址在選單裡的父層名稱
export const navParentLabel = (href: string) => {
  for (const group of ADMIN_NAV) {
    for (const item of group.items) {
      if (
        isNavParent(item) &&
        item.children.some(
          (c) => href === c.href || href.startsWith(`${c.href}/`),
        )
      ) {
        return item.label;
      }
    }
  }
  return undefined;
};
