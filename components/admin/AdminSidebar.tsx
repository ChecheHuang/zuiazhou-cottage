"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_NAV,
  isNavParent,
  type NavLink,
  type NavParent,
} from "@/lib/admin/sections";
import { cn } from "@/lib/cn";

// 後台左側選單：電腦版固定在左邊；手機版收成抽屜，從頂端的 ☰ 打開。
// 選單項目來自 lib/admin/sections.ts 的 ADMIN_NAV。

const isActive = (href: string, pathname: string) =>
  href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`);

const linkClass = (active: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
    active
      ? "bg-brand/10 font-medium text-brand"
      : "text-brand-ink/80 hover:bg-brand-soft/30 hover:text-brand-ink",
  );

const LinkRow = ({
  link,
  pathname,
  onNavigate,
  nested,
}: {
  link: NavLink;
  pathname: string;
  onNavigate?: () => void;
  nested?: boolean;
}) => {
  const active = isActive(link.href, pathname);
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={linkClass(active)}
    >
      {/* 子層不放圖示，靠縮排和左邊的線表示階層 */}
      {!nested && (
        <span aria-hidden className="w-5 text-center">
          {link.icon}
        </span>
      )}
      {link.label}
    </Link>
  );
};

// 可展開的父層：子頁面是目前頁面時自動展開；使用者手動收合／展開後以手動為準
const ParentRow = ({
  item,
  pathname,
  onNavigate,
}: {
  item: NavParent;
  pathname: string;
  onNavigate?: () => void;
}) => {
  const hasActiveChild = item.children.some((c) => isActive(c.href, pathname));
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? hasActiveChild;
  const listId = useId();
  return (
    <>
      <button
        type="button"
        onClick={() => setToggled(!open)}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-brand-soft/30",
          hasActiveChild ? "font-medium text-brand" : "text-brand-ink/80",
        )}
      >
        <span aria-hidden className="w-5 text-center">
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn(
            "size-3.5 text-brand-ink/40 transition-transform",
            open && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          id={listId}
          className="mb-1 ml-[1.35rem] mt-0.5 flex flex-col gap-0.5 border-l border-brand-soft/60 pl-2"
        >
          {item.children.map((child) => (
            <li key={child.href}>
              <LinkRow
                link={child}
                pathname={pathname}
                onNavigate={onNavigate}
                nested
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const NavLinks = ({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) => (
  <nav aria-label="後台選單" className="flex flex-col gap-5 px-3 py-4">
    {ADMIN_NAV.map((group, gi) => (
      <div key={group.title ?? gi}>
        {group.title && (
          <p className="mb-1.5 px-3 text-xs font-medium tracking-wider text-brand-ink/45">
            {group.title}
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {group.items.map((item) => (
            <li key={item.label}>
              {isNavParent(item) ? (
                <ParentRow
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ) : (
                <LinkRow
                  link={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
);

export const AdminSidebar = ({ footer }: { footer: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // 換頁時關閉抽屜（render 階段比對，避免在 effect 裡 setState）
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // 抽屜打開時鎖住背景捲動、Esc 關閉
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const brand = (
    <Link href="/admin" className="font-semibold text-brand">
      抓周小屋後台
    </Link>
  );

  return (
    <>
      {/* 手機版頂端列 */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-brand-soft/40 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="開啟後台選單"
          aria-expanded={open}
          className="grid size-9 place-items-center rounded-full text-brand hover:bg-brand-soft/30"
        >
          ☰
        </button>
      </div>

      {/* 電腦版側邊欄 */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-brand-soft/40 bg-white lg:flex">
        <div className="border-b border-brand-soft/40 px-6 py-4">{brand}</div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-brand-soft/40 p-3">{footer}</div>
      </aside>

      {/* 手機版抽屜 */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="關閉後台選單"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-brand-ink/30 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-soft/40 px-5 py-3">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="關閉後台選單"
                className="grid size-9 place-items-center rounded-full text-brand-ink/60 hover:bg-brand-soft/30"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            </div>
            <div className="border-t border-brand-soft/40 p-3">{footer}</div>
          </aside>
        </div>
      )}
    </>
  );
};
