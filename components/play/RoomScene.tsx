"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { CrawlingBaby } from "@/components/play/CrawlingBaby";
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
  /** 有值時開始一輪：嬰兒最後會抓這個 index 的物品 */
  target: number | null;
  reduced: boolean;
  onDone: () => void;
}

export const RoomScene = ({ items, target, reduced, onDone }: RoomSceneProps) => {
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
      <RoomBackground />

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

// ─── 房間背景（純 SVG，配色跟主題色走） ─────────────────────
const brand = (v: string, opacity = 1) => ({
  fill: `var(--color-${v})`,
  opacity,
});

const FLAG_COLORS = ["brand", "brand-soft", "brand-accent", "white"] as const;

// 牆上的三角旗：沿著二次貝茲曲線排
const flags = Array.from({ length: 11 }, (_, i) => {
  const t = (i + 0.5) / 11;
  const x = 400 * t;
  const y = (1 - t) ** 2 * 14 + 2 * (1 - t) * t * 58 + t ** 2 * 14;
  return { x, y, color: FLAG_COLORS[i % FLAG_COLORS.length] };
});

const RoomBackground = () => (
  <svg
    viewBox="0 0 400 300"
    preserveAspectRatio="none"
    className="absolute inset-0 size-full"
    aria-hidden
  >
    <defs>
      <pattern id="room-dots" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2" style={brand("brand-soft", 0.55)} />
        <circle cx="16" cy="16" r="1.4" style={brand("brand-accent", 0.35)} />
      </pattern>
      <linearGradient id="room-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6c9a6" />
        <stop offset="1" stopColor="#f1dcc2" />
      </linearGradient>
      <linearGradient id="room-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfeaf6" />
        <stop offset="1" stopColor="#eef8fc" />
      </linearGradient>
    </defs>

    {/* 牆 */}
    <rect width="400" height="152" style={brand("brand-beige")} />
    <rect width="400" height="152" fill="url(#room-dots)" />

    {/* 窗戶＋窗簾 */}
    <rect x="270" y="34" width="92" height="80" rx="6" fill="url(#room-sky)" />
    <ellipse cx="300" cy="62" rx="16" ry="7" fill="#fff" opacity="0.9" />
    <ellipse cx="312" cy="58" rx="11" ry="6" fill="#fff" opacity="0.9" />
    <rect
      x="270"
      y="34"
      width="92"
      height="80"
      rx="6"
      fill="none"
      stroke="#fff"
      strokeWidth="6"
    />
    <path d="M316 34 V114 M270 74 H362" stroke="#fff" strokeWidth="4" />
    <path
      d="M260 28 q14 40 4 92 h-10 q-6-50 -4-92z"
      style={brand("brand-soft", 0.9)}
    />
    <path
      d="M372 28 q-14 40 -4 92 h10 q6-50 4-92z"
      style={brand("brand-soft", 0.9)}
    />
    <rect x="252" y="24" width="128" height="6" rx="3" fill="#c9a98f" />

    {/* 三角旗 */}
    <path d="M0 14 Q200 102 400 14" stroke="#c9a98f" strokeWidth="1.5" fill="none" />
    {flags.map((f) => (
      <path
        key={f.x}
        d={`M${f.x - 9} ${f.y - 1} L${f.x + 9} ${f.y - 1} L${f.x} ${f.y + 19}z`}
        style={f.color === "white" ? { fill: "#fff" } : brand(f.color)}
      />
    ))}

    {/* 氣球 */}
    <path d="M72 108 q-6 18 2 40 M92 104 q4 22 -4 44" stroke="#bfa58f" strokeWidth="1" fill="none" />
    <ellipse cx="72" cy="88" rx="15" ry="19" style={brand("brand")} />
    <ellipse cx="94" cy="84" rx="14" ry="18" style={brand("brand-accent")} />
    <ellipse cx="67" cy="81" rx="4" ry="6" fill="#fff" opacity="0.45" />
    <ellipse cx="89" cy="77" rx="3.5" ry="5.5" fill="#fff" opacity="0.45" />

    {/* 窗外的光灑在地上 */}
    <path d="M276 152 L362 152 L330 230 L210 230z" fill="#fff" opacity="0.18" />

    {/* 踢腳板＋木地板 */}
    <rect y="146" width="400" height="8" fill="#fff" opacity="0.95" />
    <rect y="154" width="400" height="146" fill="url(#room-floor)" />
    {[172, 194, 222, 256, 296].map((y) => (
      <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#d9bb98" strokeWidth="1" />
    ))}

    {/* 地毯 */}
    <ellipse cx="200" cy="226" rx="188" ry="66" fill="#fff" opacity="0.6" />
    <ellipse cx="200" cy="226" rx="176" ry="57" style={brand("brand-soft", 0.5)} />
    <ellipse
      cx="200"
      cy="226"
      rx="164"
      ry="49"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeDasharray="6 6"
      opacity="0.9"
    />
  </svg>
);
