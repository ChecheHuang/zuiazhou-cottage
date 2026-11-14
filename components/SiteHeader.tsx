"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent } from "@/components/SiteContentProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  layoutHeader,
  layoutNavVisibility,
} from "@/lib/site-content/blocks/layout";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { cn } from "@/lib/cn";

type LabelKey = keyof typeof layoutHeader.defaults;

interface SubLink {
  href: string;
  labelKey: LabelKey;
}

interface NavItem {
  href: string;
  labelKey: LabelKey;
  children?: SubLink[];
}

// 連結固定，顯示文字從後台「頁首頁尾 › 頁首導覽列」讀取
const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "navHome" },
  { href: "/about", labelKey: "navAbout" },
  {
    href: "/baby-party",
    labelKey: "navBabyParty",
    children: [
      { href: "/baby-party", labelKey: "navBabyPartyZhuazhou" },
      { href: "/baby-party#party", labelKey: "navBabyPartySaliva" },
      { href: "/baby-party#birthday", labelKey: "navBabyPartyBirthday" },
      { href: "/baby-party#gender", labelKey: "navBabyPartyGender" },
      { href: "/play", labelKey: "navBabyPartyPlay" },
      { href: "/invite", labelKey: "navBabyPartyInvite" },
    ],
  },
  {
    href: "/photo",
    labelKey: "navPhoto",
    children: [
      { href: "/photo", labelKey: "navPhotoPhotographer" },
      { href: "/photo#other", labelKey: "navPhotoOther" },
    ],
  },
  { href: "/food", labelKey: "navFood" },
  { href: "/products", labelKey: "navProducts" },
  { href: "/faq", labelKey: "navFaq" },
  { href: "/contact", labelKey: "navContact" },
];

type Visibility = typeof layoutNavVisibility.defaults;

// 依後台開關過濾選單；沒有開關設定的項目一律顯示
const visibleNavItems = (visibility: Visibility): NavItem[] => {
  const shown = (key: LabelKey) =>
    (visibility as Record<string, boolean | undefined>)[key] !== false;
  return NAV_ITEMS.filter((item) => shown(item.labelKey)).map((item) => ({
    ...item,
    children: item.children?.filter((sub) => shown(sub.labelKey)),
  }));
};

const isItemActive = (item: NavItem, pathname: string) => {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};

const ChevronIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="size-3"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const SiteHeader = () => {
  const pathname = usePathname();
  const c = useContent(layoutHeader);
  const biz = useContent(siteBusiness);
  const navItems = visibleNavItems(useContent(layoutNavVisibility));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 換頁時關閉選單：render 階段比對 pathname，避免在 effect 裡 setState
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  // 緩衝區間：超過 48px 才縮小、回到 16px 以下才放大，門檻附近小幅滑動不會來回切換
  useEffect(() => {
    const onScroll = () =>
      setScrolled((prev) =>
        prev ? window.scrollY > 16 : window.scrollY > 48,
      );
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const openMenu = (href: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDropdown(href);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  // header 用 fixed 固定在頂端，原位置放一塊固定高度的佔位。
  // 若用 sticky，header 縮小會讓下面內容跟著移動，瀏覽器的捲動錨定會把捲動位置調回門檻以下，
  // header 又放大……形成來回抖動。
  return (
    <>
    <div aria-hidden className="h-20 shrink-0 md:h-24" />
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full bg-white/85 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "shadow-[0_2px_18px_rgba(237,160,157,0.15)] border-b border-brand-soft/40"
          : "shadow-none border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-content items-center justify-between px-6 transition-all duration-300",
          scrolled ? "h-16" : "h-20 md:h-24",
        )}
      >
        <Link
          href="/"
          aria-label={biz.brand}
          className="flex items-center gap-3"
        >
          <Image
            src="/photos/logo.png"
            alt={biz.brand}
            width={64}
            height={64}
            priority
            className={cn(
              "transition-all duration-300",
              scrolled ? "h-10 w-10" : "h-14 w-14 md:h-16 md:w-16",
            )}
          />
          <span
            className={cn(
              "hidden font-semibold tracking-wide text-brand transition-all duration-300 sm:block",
              scrolled ? "text-base" : "text-lg md:text-xl",
            )}
          >
            {c.logoText}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="主選單">
          {navItems.map((item) => {
            const active = isItemActive(item, pathname);
            const hasChildren = !!item.children?.length;

            if (hasChildren) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => openMenu(item.href)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === item.href}
                    className={cn(
                      "group relative flex items-center gap-1 py-1 text-sm transition-colors duration-300",
                      active
                        ? "font-semibold text-brand"
                        : "font-medium text-brand-ink hover:text-brand",
                    )}
                  >
                    {c[item.labelKey]}
                    <ChevronIcon />
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand transition-all duration-300",
                        active ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>

                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 transition-all duration-200",
                      openDropdown === item.href
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none",
                    )}
                    onMouseEnter={() => openMenu(item.href)}
                    onMouseLeave={scheduleClose}
                  >
                    <div
                      role="menu"
                      className="min-w-[200px] rounded-2xl border border-brand-soft/50 bg-white p-2 shadow-xl shadow-brand/10"
                    >
                      {item.children?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          role="menuitem"
                          className="block rounded-xl px-4 py-2.5 text-sm text-brand-ink transition-colors duration-200 hover:bg-brand-soft/30 hover:text-brand"
                        >
                          {c[sub.labelKey]}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative py-1 text-sm transition-colors duration-300",
                  active
                    ? "font-semibold text-brand"
                    : "font-medium text-brand-ink hover:text-brand",
                )}
              >
                {c[item.labelKey]}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            aria-label="開啟選單"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full text-brand transition-colors hover:bg-brand-soft/30 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-brand-soft/40 bg-white/95 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden",
          menuOpen ? "max-h-[760px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-6 py-4" aria-label="行動選單">
          {navItems.map((item) => {
            const active = isItemActive(item, pathname);
            return (
              <div
                key={item.href}
                className="border-b border-brand-soft/30 last:border-b-0"
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base transition-colors",
                    active
                      ? "font-semibold text-brand"
                      : "text-brand-ink hover:text-brand",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "inline-block h-1.5 rounded-full bg-brand transition-all duration-300",
                      active ? "w-4 opacity-100" : "w-0 opacity-0",
                    )}
                  />
                  {c[item.labelKey]}
                </Link>
                {item.children?.length ? (
                  <ul className="mb-2 ml-7 flex flex-col gap-1">
                    {item.children.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="block py-1.5 text-sm text-brand-ink/80 transition-colors hover:text-brand"
                        >
                          · {c[sub.labelKey]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
    </>
  );
};
