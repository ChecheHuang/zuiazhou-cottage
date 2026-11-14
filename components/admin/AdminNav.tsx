"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "圖片" },
  { href: "/admin/content", label: "文字" },
];

export const AdminNav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 text-sm">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-full px-4 py-2",
            pathname === tab.href
              ? "bg-brand/10 font-medium text-brand"
              : "text-brand-ink hover:bg-brand-soft/30",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};
