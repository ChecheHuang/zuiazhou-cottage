"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useAnimate } from "framer-motion";
import { CrawlingBaby } from "@/components/play/CrawlingBaby";
import {
  ROOM_BACKGROUNDS,
  type RoomThemeId,
} from "@/components/play/roomThemes";
import type { MenuAlign } from "@/components/play/ItemMenu";
import { cn } from "@/lib/cn";
import type { PlayItem } from "@/lib/play/items";

// 房間模式：物品擺在地毯上，嬰兒從左邊爬進來，
// 先到一兩樣物品前面摸摸、張望，最後爬到目標物品前伸手抓起來。
//
// 位置都用「容器寬高的百分比」，物品與嬰兒都以底部中央為錨點。

interface Point {
  x: number;
  y: number;
}

// 8 個物品位置：地毯上前後兩排
const SPOTS: Point[] = [
  { x: 24, y: 63 },
  { x: 43, y: 59 },
  { x: 62, y: 59 },
  { x: 80, y: 64 },
  { x: 16, y: 84 },
  { x: 38, y: 87 },
  { x: 62, y: 87 },
  { x: 85, y: 83 },
];

// 起點：從左下角探出半個身體，等著開始
// 物品少於 8 樣時，先用中間的位置，看起來才不會擠在一邊
const SPOT_ORDER = [5, 6, 1, 2, 4, 7, 0, 3];
// slot 是「第幾個擺放點」（照 SPOT_ORDER 的順序）；沒指定時依物品順序排
const spotsFor = (count: number, slots?: number[]) =>
  Array.from(
    { length: Math.min(count, SPOTS.length) },
    (_, i) => SPOTS[SPOT_ORDER[slots?.[i] ?? i] ?? SPOT_ORDER[i]],
  );

const START: Point = { x: -4, y: 97 };
/** 嬰兒寬度（容器寬度的百分比，scale = 1 時） */
const BABY_WIDTH = 27;
/** 手的位置在嬰兒中心往前多少（以嬰兒寬度為單位） */
const HAND_OFFSET = 0.38;

// 越後面（y 越小）越小，做出遠近感
const scaleAt = (y: number) => 0.7 + ((y - 58) / 34) * 0.42;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const shuffle = <T,>(list: T[]) =>
  list
    .map((v) => ({ v, k: Math.random() }))
    .sort((a, b) => a.k - b.k)
    .map(({ v }) => v);

interface RoomSceneProps {
  items: PlayItem[];
  /** 每個物品的擺放點；拿掉物品時其他物品才不會跟著換位置 */
  slots?: number[];
  theme: RoomThemeId;
  /** 有值時開始一輪：嬰兒最後會抓這個 index 的物品 */
  target: number | null;
  reduced: boolean;
  onDone: () => void;
  /** 點地上的物品（抓周進行中不會觸發） */
  onItemClick?: (index: number) => void;
  /** 被點選、要標示出來的物品 */
  activeIndex?: number | null;
  /** 浮在 activeIndex 物品上方的選單 */
  renderMenu?: (index: number, align: MenuAlign) => ReactNode;
}

// 靠左右邊的物品，選單改成往內對齊，避免被場景邊緣裁掉
const alignFor = (x: number): MenuAlign =>
  x < 30 ? "start" : x > 70 ? "end" : "center";

export const RoomScene = ({
  items,
  slots,
  theme,
  target,
  reduced,
  onDone,
  onItemClick,
  activeIndex = null,
  renderMenu,
}: RoomSceneProps) => {
  const interactive = target === null && !!onItemClick;
  const Background = ROOM_BACKGROUNDS[theme];
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const babyRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const baby = babyRef.current;
    if (target === null || !baby) return;
    let cancelled = false;
    const pos: Point & { dir: 1 | -1 } = { ...START, dir: 1 };

    const setState = (key: "crawling" | "looking" | "reaching", on: boolean) => {
      baby.dataset[key] = String(on);
    };

    const face = async (dir: 1 | -1, scale: number) => {
      if (dir === pos.dir) return;
      pos.dir = dir;
      await animate(
        "[data-baby-body]",
        { scaleX: dir * scale, scaleY: scale },
        { duration: reduced ? 0 : 0.3, ease: "easeInOut" },
      );
    };

    const spots = spotsFor(items.length, slots);

    const crawlTo = async (index: number) => {
      const spot = spots[index];
      const dir: 1 | -1 =
        Math.abs(spot.x - pos.x) < 4 ? pos.dir : spot.x > pos.x ? 1 : -1;
      const y = spot.y + 3;
      const scale = scaleAt(y);
      const x = spot.x - dir * BABY_WIDTH * scale * HAND_OFFSET;

      await face(dir, scaleAt(pos.y));
      // 寬高比 4:3，垂直距離換算成和水平同樣的單位
      const dist = Math.hypot(x - pos.x, (y - pos.y) * 0.75);
      const duration = reduced ? 0 : Math.min(2.4, Math.max(0.8, dist * 0.05));

      setState("crawling", true);
      await Promise.all([
        animate(
          "[data-baby]",
          { left: `${x}%`, top: `${y}%` },
          { duration, ease: [0.3, 0.1, 0.4, 1] },
        ),
        animate(
          "[data-baby-body]",
          { scaleX: dir * scale, scaleY: scale },
          { duration, ease: "linear" },
        ),
      ]);
      setState("crawling", false);
      Object.assign(pos, { x, y });
    };

    const reach = async (on: boolean) => {
      setState("reaching", on);
      await sleep(reduced ? 0 : 450);
    };

    const lookAround = async () => {
      setState("looking", true);
      await sleep(1200);
      setState("looking", false);
    };

    // 摸一下但不拿：物品晃一晃
    const touch = async (index: number) => {
      await reach(true);
      await animate(
        `[data-item="${index}"] [data-item-icon]`,
        { rotate: [0, -14, 11, -6, 0] },
        { duration: 0.7 },
      );
      await reach(false);
    };

    const grab = async (index: number) => {
      await reach(true);
      // 被抓起來的物品浮到嬰兒上面，不會被身體擋住
      const picked = baby.parentElement?.querySelector<HTMLElement>(
        `[data-item="${index}"]`,
      );
      if (picked) picked.style.zIndex = "20";
      await Promise.all([
        animate(
          `[data-item="${index}"] [data-item-icon]`,
          reduced
            ? { y: "-70%", scale: 1.45 }
            : { y: "-70%", scale: 1.45, rotate: [0, -8, 6, 0] },
          { duration: reduced ? 0 : 0.6, ease: "backOut" },
        ),
        animate(
          `[data-item="${index}"] [data-item-halo]`,
          { opacity: [0, 1], scale: [0.4, 1.3] },
          { duration: reduced ? 0 : 0.6 },
        ),
      ]);
    };

    const run = async () => {
      await sleep(250);
      if (!reduced) {
        const decoys = shuffle(
          items.map((_, i) => i).filter((i) => i !== target),
        ).slice(0, Math.random() < 0.3 ? 2 : 1); // 大多繞一次，偶爾兩次
        for (const d of decoys) {
          if (cancelled) return;
          await crawlTo(d);
          if (cancelled) return;
          await sleep(250);
          if (cancelled) return;
          await (Math.random() < 0.6 ? touch(d) : lookAround());
          await sleep(300);
        }
      }
      if (cancelled) return;
      await crawlTo(target);
      if (cancelled) return;
      if (!reduced) await lookAround();
      if (cancelled) return;
      await grab(target);
      await sleep(reduced ? 300 : 900);
      if (!cancelled) onDoneRef.current();
    };

    // 卸載後還在跑的動畫找不到元素會丟錯，直接忽略；
    // 沒卸載卻失敗時還是要結束流程，不然按鈕會一直停在不能按
    run().catch((error) => {
      if (cancelled) return;
      console.error("[play] 爬行動畫失敗", error);
      onDoneRef.current();
    });
    return () => {
      cancelled = true;
    };
  }, [target, items, slots, reduced, animate]);

  return (
    <div
      ref={scope}
      className="@container relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_18px_40px_rgba(237,160,157,0.18)] ring-1 ring-brand-soft/60"
    >
      <Background />

      {spotsFor(items.length, slots).map((spot, i) => (
        <div
          key={items[i].name}
          data-item={i}
          className={cn(
            "absolute flex -translate-x-1/2 -translate-y-full flex-col items-center",
            // translate 會讓每個物品自成一層，被點的要整個拉到最上面，選單才不會被其他物品蓋住
            activeIndex === i && "z-30",
          )}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          {activeIndex === i && renderMenu?.(i, alignFor(spot.x))}
          <button
            type="button"
            data-item-button
            disabled={!interactive}
            aria-label={items[i].name}
            onClick={() => onItemClick?.(i)}
            className={cn(
              "flex flex-col items-center rounded-2xl transition-transform disabled:cursor-default",
              interactive && "cursor-pointer hover:scale-105",
              activeIndex === i && "scale-105",
            )}
          >
            <span className="relative">
              <span
                data-item-halo
                aria-hidden
                className="absolute inset-[-35%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,236,170,0.6)_45%,transparent_70%)] opacity-0"
              />
              <span
                data-item-icon
                role="img"
                aria-label={items[i].name}
                className="relative block text-[8.5cqw] leading-none drop-shadow-[0_3px_2px_rgba(0,0,0,0.18)]"
              >
                {items[i].emoji}
              </span>
            </span>
            <span
              className={cn(
                "mt-[0.6cqw] whitespace-nowrap rounded-full px-[1.6cqw] py-[0.3cqw] text-[2.6cqw] leading-tight shadow-sm",
                activeIndex === i
                  ? "bg-brand text-white"
                  : "bg-white/85 text-brand-ink",
              )}
            >
              {items[i].name}
            </span>
          </button>
        </div>
      ))}

      <motion.div
        ref={babyRef}
        data-baby
        data-crawling="false"
        data-looking="false"
        data-reaching="false"
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[94%]"
        style={{
          left: `${START.x}%`,
          top: `${START.y}%`,
          width: `${BABY_WIDTH}%`,
        }}
      >
        <motion.div
          data-baby-body
          style={{
            scaleX: scaleAt(START.y),
            scaleY: scaleAt(START.y),
            originX: 0.5,
            originY: 1,
          }}
        >
          <CrawlingBaby />
        </motion.div>
      </motion.div>
    </div>
  );
};
