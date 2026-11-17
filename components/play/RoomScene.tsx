"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { motion, useAnimate } from "framer-motion";
import { CrawlingBaby } from "@/components/play/CrawlingBaby";
import type { OutfitId } from "@/lib/play/outfits";
import {
  ROOM_BACKGROUNDS,
  type RoomThemeId,
} from "@/components/play/roomThemes";
import type { MenuAlign } from "@/components/play/ItemMenu";
import {
  itemAnnouncements,
  itemScreenReaderInstructions,
  pointerFirst,
  useIsClient,
  useItemSensors,
  useSuppressClickAfterDrag,
} from "@/components/play/itemDnd";
import { cn } from "@/lib/cn";
import type { PlayItem } from "@/lib/play/items";
import { ZhuazhouItemIcon } from "@/components/ZhuazhouItemIcon";

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
  /** 寶寶穿的衣服 */
  outfit?: OutfitId;
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
  /** 開始拖曳物品（用來關掉選單） */
  onDragStart?: () => void;
  /** 拖曳放開後，每個物品新的擺放點（跟 slots 同格式） */
  onSlotsChange?: (slots: number[]) => void;
}

// 拖曳排序：把物品拖到某個擺放點時，其他物品要怎麼讓位。
// 擺放點照「後排左→右、前排左→右」排成一串（就是 SPOTS 的 index 順序），
// - 拖到空位：直接移過去，其他物品不動
// - 拖到有物品的位置：照這串順序把拖曳的物品插進去，中間的物品各往前／往後挪一格
// 回傳每個物品新的 slot；位置沒變時回傳 null
const reorderSlots = (
  slotList: number[],
  index: number,
  targetSpot: number,
): number[] | null => {
  const spotsOf = slotList.map((slot) => SPOT_ORDER[slot]);
  if (spotsOf[index] === targetSpot) return null;
  const occupant = spotsOf.indexOf(targetSpot);
  const next = [...spotsOf];
  if (occupant < 0) {
    next[index] = targetSpot;
  } else {
    const order = spotsOf
      .map((spot, i) => ({ spot, i }))
      .sort((a, b) => a.spot - b.spot);
    const occupied = order.map((o) => o.spot);
    const moved = arrayMove(
      order.map((o) => o.i),
      order.findIndex((o) => o.i === index),
      order.findIndex((o) => o.i === occupant),
    );
    moved.forEach((i, k) => {
      next[i] = occupied[k];
    });
  }
  return next.map((spot) => SPOT_ORDER.indexOf(spot));
};

// 靠左右邊的物品，選單改成往內對齊，避免被場景邊緣裁掉
const alignFor = (x: number): MenuAlign =>
  x < 30 ? "start" : x > 70 ? "end" : "center";

export const RoomScene = ({
  items,
  slots,
  theme,
  outfit,
  target,
  reduced,
  onDone,
  onItemClick,
  activeIndex = null,
  renderMenu,
  onDragStart,
  onSlotsChange,
}: RoomSceneProps) => {
  const interactive = target === null && !!onItemClick;
  const slotList = items.map((_, i) => slots?.[i] ?? i);
  // 拖曳中的物品 index，以及拖曳開始時的場景寬度（浮動圖層用來換算字級）
  const [dragging, setDragging] = useState<number | null>(null);
  const [sceneWidth, setSceneWidth] = useState(0);
  // 拖曳中的預覽：其他物品即時讓位到的位置（放開才真的套用）
  const [preview, setPreview] = useState<number[] | null>(null);
  const sensors = useItemSensors();
  const suppress = useSuppressClickAfterDrag();
  const isClient = useIsClient();
  const canDrag = interactive && !!onSlotsChange;
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

  const spotOf = (index: number) => SPOT_ORDER[slotList[index]];
  const nameOf = (id: string | number) => {
    const [kind, n] = String(id).split("-");
    if (kind === "item") return items[Number(n)]?.name ?? "物品";
    const slot = SPOT_ORDER.indexOf(Number(n));
    const occupant = slotList.indexOf(slot);
    return occupant >= 0 ? `${items[occupant].name}的位置` : "空位";
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    suppress.markStart();
    setDragging(Number(active.data.current?.index));
    setSceneWidth(scope.current?.offsetWidth ?? 0);
    onDragStart?.();
  };

  // 經過擺放點時即時算出其他物品要讓到哪裡（一律從拖曳前的位置算，移回原位就恢復）
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      setPreview(null);
      return;
    }
    setPreview(
      reorderSlots(
        slotList,
        Number(active.data.current?.index),
        Number(over.data.current?.spot),
      ),
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(null);
    setPreview(null);
    suppress.markDragged();
    if (!over) return;
    const next = reorderSlots(
      slotList,
      Number(active.data.current?.index),
      Number(over.data.current?.spot),
    );
    if (next) onSlotsChange?.(next);
  };

  return (
    <div
      ref={scope}
      className="@container relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_18px_40px_rgba(237,160,157,0.18)] ring-1 ring-brand-soft/60"
    >
      <Background />

      <DndContext
        sensors={sensors}
        collisionDetection={pointerFirst}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          suppress.markDragged();
          setDragging(null);
          setPreview(null);
        }}
        accessibility={{
          announcements: itemAnnouncements(nameOf),
          screenReaderInstructions: itemScreenReaderInstructions,
        }}
      >
        {/* 8 個擺放點都是投放區（看不見，拖曳時才顯示虛線圈） */}
        {canDrag &&
          SPOTS.map((spot, i) => (
            <SpotDrop
              key={i}
              spotIndex={i}
              spot={spot}
              // 空位才顯示虛線圈；有物品的位置看物品讓位就知道會放到哪
              highlight={
                dragging !== null &&
                i !== spotOf(dragging) &&
                !slotList.some((slot) => SPOT_ORDER[slot] === i)
              }
            />
          ))}

        {spotsFor(items.length, preview ?? slots).map((spot, i) => (
          <RoomItem
            key={items[i].name}
            index={i}
            item={items[i]}
            spot={spot}
            // 讓位時滑過去；拖曳的那個原位影子也跟著移到要落下的位置
            glide={dragging !== null && !reduced}
            interactive={interactive}
            draggable={canDrag}
            selected={activeIndex === i}
            menu={activeIndex === i ? renderMenu?.(i, alignFor(spot.x)) : null}
            onClick={() => {
              if (dragging === null) onItemClick?.(i);
            }}
            onClickCapture={suppress.onClickCapture}
          />
        ))}

        {/* 拖曳中跟著指標走的物品；portal 到 body，才不會被場景的 overflow-hidden 裁掉 */}
        {isClient &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              {dragging !== null && items[dragging] ? (
                <ItemVisual
                  item={items[dragging]}
                  sceneWidth={sceneWidth}
                  lifted
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>

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
          <CrawlingBaby outfit={outfit} />
        </motion.div>
      </motion.div>
    </div>
  );
};

// 物品的樣子（圖示＋名牌）。場景裡用 cqw（跟著場景寬度縮放）；
// 拖曳浮動圖層在 body 底下，沒有 container，改用場景寬度換算成 px
const ItemVisual = ({
  item,
  selected,
  sceneWidth,
  lifted,
}: {
  item: PlayItem;
  selected?: boolean;
  sceneWidth?: number;
  lifted?: boolean;
}) => {
  const px = (ratio: number) =>
    sceneWidth ? { fontSize: `${sceneWidth * ratio}px` } : undefined;
  return (
    <span
      className={cn(
        "flex flex-col items-center",
        lifted && "scale-110 cursor-grabbing drop-shadow-xl",
      )}
    >
      <span className="relative">
        {!lifted && (
          <span
            data-item-halo
            aria-hidden
            className="absolute inset-[-35%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,236,170,0.6)_45%,transparent_70%)] opacity-0"
          />
        )}
        <span
          data-item-icon={lifted ? undefined : ""}
          role="img"
          aria-label={item.name}
          className={cn(
            "relative block leading-none drop-shadow-[0_3px_2px_rgba(0,0,0,0.18)]",
            !sceneWidth && "text-[8.5cqw]",
          )}
          style={px(0.085)}
        >
          <ZhuazhouItemIcon item={item} />
        </span>
      </span>
      <span
        className={cn(
          "whitespace-nowrap rounded-full leading-tight shadow-sm",
          sceneWidth
            ? "mt-1 px-2 py-0.5"
            : "mt-[0.6cqw] px-[1.6cqw] py-[0.3cqw] text-[2.6cqw]",
          selected || lifted
            ? "bg-brand text-white"
            : "bg-white/85 text-brand-ink",
        )}
        style={px(0.026)}
      >
        {item.name}
      </span>
    </span>
  );
};

const RoomItem = ({
  index,
  item,
  spot,
  interactive,
  draggable,
  selected,
  menu,
  onClick,
  onClickCapture,
  glide,
}: {
  index: number;
  item: PlayItem;
  spot: Point;
  glide: boolean;
  interactive: boolean;
  draggable: boolean;
  selected: boolean;
  menu: ReactNode;
  onClick: () => void;
  onClickCapture: (e: React.MouseEvent) => void;
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `item-${index}`,
    data: { index },
    disabled: !draggable,
  });
  return (
    <div
      data-item={index}
      className={cn(
        "absolute flex -translate-x-1/2 -translate-y-full flex-col items-center",
        // translate 會讓每個物品自成一層，被點的要整個拉到最上面，選單才不會被其他物品蓋住
        selected && "z-30",
        glide && "transition-[left,top] duration-300 ease-out",
      )}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      {menu}
      <button
        ref={setNodeRef}
        type="button"
        data-item-button
        disabled={!interactive}
        {...attributes}
        {...listeners}
        aria-label={item.name}
        onClick={onClick}
        onClickCapture={onClickCapture}
        className={cn(
          "flex select-none flex-col items-center rounded-2xl transition-transform disabled:cursor-default",
          interactive && "hover:scale-105",
          draggable && "cursor-grab",
          selected && "scale-105",
          // 拖曳中原位留一個淡淡的影子，浮動圖層才是跟著指標走的那個
          isDragging && "opacity-30",
        )}
      >
        <ItemVisual item={item} selected={selected} />
      </button>
    </div>
  );
};

// 擺放點的投放區：涵蓋物品圖示＋名牌的範圍，拖到上面時顯示虛線圈
const SpotDrop = ({
  spotIndex,
  spot,
  highlight,
}: {
  spotIndex: number;
  spot: Point;
  highlight: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `spot-${spotIndex}`,
    data: { spot: spotIndex },
  });
  return (
    <div
      ref={setNodeRef}
      aria-hidden
      className="pointer-events-none absolute h-[22%] w-[17%] -translate-x-1/2 -translate-y-[85%]"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      {highlight && isOver && (
        <span className="absolute inset-x-[6%] bottom-0 aspect-[2/1] translate-y-[35%] rounded-[50%] border-2 border-dashed border-white bg-white/35" />
      )}
    </div>
  );
};
