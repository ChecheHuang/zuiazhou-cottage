"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";

interface SubLink {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  children?: SubLink[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "關於我們" },
  {
    href: "/baby-party",
    label: "寶寶派對",
    children: [
      { href: "/baby-party", label: "抓周派對" },
      { href: "/baby-party#party", label: "收涎派對" },
      { href: "/baby-party#birthday", label: "生日派對" },
      { href: "/baby-party#gender", label: "性別揭曉派對" },
    ],
  },
  {
    href: "/photo",
    label: "派對加購方案",
    children: [
      { href: "/photo", label: "攝影師加購" },
      { href: "/photo#other", label: "其他加購" },
    ],
  },
  { href: "/food", label: "餐食加購" },
  { href: "/faq", label: "常見問題" },
  { href: "/contact", label: "聯絡我們" },
];

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

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

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md transition-all duration-300",
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
          aria-label="Happy 抓週小屋"
          className="flex items-center gap-3"
        >
          <Image
            src="/photos/logo.png"
            alt="Happy 抓週小屋"
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
            抓週小屋
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="主選單"
        >
          {NAV_ITEMS.map((item) => {
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
                    {item.label}
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
                          {sub.label}
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
                {item.label}
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
          menuOpen
            ? "max-h-[640px] opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-6 py-4" aria-label="行動選單">
          {NAV_ITEMS.map((item) => {
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
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-2 ml-7 flex flex-col gap-1">
                    {item.children.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="block py-1.5 text-sm text-brand-ink/80 transition-colors hover:text-brand"
                        >
                          · {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
