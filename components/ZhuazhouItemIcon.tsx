import Image from "next/image";
import { cn } from "@/lib/cn";

interface IconItem {
  emoji: string;
  image?: string;
}

// 抓周物品的圖示：後台有上傳圖片就顯示圖片，否則顯示 emoji。
// 圖片大小是 1em × 1em，跟原本 emoji 一樣由外層的 font-size 決定，可以直接替換 {item.emoji}。
export const ZhuazhouItemIcon = ({
  item,
  className,
}: {
  item: IconItem;
  className?: string;
}) =>
  item.image ? (
    <Image
      src={item.image}
      alt=""
      width={160}
      height={160}
      draggable={false}
      className={cn(
        "inline-block size-[1em] select-none object-contain align-middle",
        className,
      )}
    />
  ) : (
    <>{item.emoji}</>
  );
