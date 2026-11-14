"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { CrawlingBaby } from "@/components/play/CrawlingBaby";
import {
  ROOM_BACKGROUNDS,
  type RoomThemeId,
} from "@/components/play/roomThemes";
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
const spotsFor = (count: number) =>
  SPOT_ORDER.slice(0, Math.min(count, SPOTS.length)).map((i) => SPOTS[i]);

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
  theme: RoomThemeId;
  /** 有值時開始一輪：嬰兒最後會抓這個 index 的物品 */
  target: number | null;
  reduced: boolean;
  onDone: () => void;
}

export const RoomScene = ({
  items,
  theme,
  target,
  reduced,
  onDone,
}: RoomSceneProps) => {
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

    const spots = spotsFor(items.length);

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
          { y: "-70%", scale: 1.45, rotate: [0, -8, 6, 0] },
          { duration: 0.6, ease: "backOut" },
        ),
        animate(
          `[data-item="${index}"] [data-item-halo]`,
          { opacity: [0, 1], scale: [0.4, 1.3] },
          { duration: 0.6 },
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
          await (Math.random() < 0.6 ? touch(d) : lookAround());
          await sleep(300);
        }
      }
      if (cancelled) return;
      await crawlTo(target);
      if (cancelled) return;
      if (!reduced) await lookAround();
      await grab(target);
      await sleep(reduced ? 300 : 900);
      if (!cancelled) onDoneRef.current();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [target, items, reduced, animate]);

  return (
    <div
      ref={scope}
      className="@container relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_18px_40px_rgba(237,160,157,0.18)] ring-1 ring-brand-soft/60"
    >
      <Background />

      {spotsFor(items.length).map((spot, i) => (
        <div
          key={`${i}-${items[i].name}`}
          data-item={i}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
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
          <span className="mt-[0.6cqw] whitespace-nowrap rounded-full bg-white/85 px-[1.6cqw] py-[0.3cqw] text-[2.6cqw] leading-tight text-brand-ink shadow-sm">
            {items[i].name}
          </span>
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
