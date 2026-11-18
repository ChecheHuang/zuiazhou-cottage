"use client";

import { useContent } from "@/components/SiteContentProvider";
import { cn } from "@/lib/cn";
import { siteBusiness } from "@/lib/site-content/blocks/site";

// 「到 IG 看更多現場影片」按鈕：照片放官網、影片交給 IG，網站不會因為嵌入影片變慢。
// 文字或店家資訊的 IG 連結留空時不顯示。
export const InstagramButton = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  const biz = useContent(siteBusiness);
  if (!label.trim() || !biz.instagramUrl) return null;
  return (
    <a
      href={biz.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-7 py-3 text-sm font-medium text-white shadow-md transition-transform duration-300 hover:scale-105",
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
      {label}
    </a>
  );
};
