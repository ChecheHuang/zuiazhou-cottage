"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { FortunePanel } from "@/components/play/FortunePanel";
import { ItemMenu, type MenuAlign } from "@/components/play/ItemMenu";
import { ItemPickerDialog } from "@/components/play/ItemPickerDialog";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  itemAnnouncements,
  itemScreenReaderInstructions,
  useIsClient,
  useItemSensors,
  useSuppressClickAfterDrag,
} from "@/components/play/itemDnd";
import { RoomScene } from "@/components/play/RoomScene";
import { CrawlingBaby } from "@/components/play/CrawlingBaby";
import { OUTFIT_IDS, DEFAULT_OUTFIT, type OutfitId } from "@/lib/play/outfits";
import {
  ROOM_THEME_IDS,
  type RoomThemeId,
} from "@/components/play/roomThemes";
import { cn } from "@/lib/cn";
import {
  MAT_SIZE,
  MAX_NAME_LENGTH,
  MIN_MAT_SIZE,
  cleanBabyName,
  fillTemplate,
  pickMatItems,
  resultPath,
  type PlayItem,
} from "@/lib/play/items";
import { playGame } from "@/lib/site-content/blocks/play";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";
import confetti from "canvas-confetti";
import { drawResultCard } from "@/lib/play/result-card";
import {
  MIN_STATS_TOTAL,
  formatPercent,
  formatTotal,
  type GrabStats,
} from "@/lib/play/stats";
import { useSfx } from "@/lib/play/use-sfx";
import { ZhuazhouItemIcon } from "@/components/ZhuazhouItemIcon";

interface Result {
  item: PlayItem;
  babyName: string;
  /** 抓周時寶寶穿的衣服（分享網址也會帶） */
  outfit: OutfitId;
}

type Phase =
  | { kind: "idle" }
  | { kind: "grabbing"; highlight: number; target: number; babyName: string }
  | { kind: "result"; result: Result; shared: boolean };

type Mode = "room" | "quick";

// 物品格子：加物品，或替換地上第 index 個物品
type Picker = { kind: "add" } | { kind: "replace"; index: number };

// 地上的物品＋各自在房間裡的位置（第幾個擺放點）。
// 位置跟著物品走：拿掉一樣時其他物品不會跟著換位置，空位留給之後加的物品。
interface BoardEntry {
  item: PlayItem;
  slot: number;
}

const toBoard = (list: PlayItem[]): BoardEntry[] =>
  list.map((item, slot) => ({ item, slot }));

const freeSlot = (board: BoardEntry[]) => {
  const used = new Set(board.map((b) => b.slot));
  let slot = 0;
  while (used.has(slot)) slot += 1;
  return slot;
};

interface ZhuazhouGameProps {
  items: PlayItem[];
  initialMat: PlayItem[];
  /** 從分享連結進來時，先顯示朋友的結果 */
  shared: Result | null;
  lineUrl: string;
}

// 跑馬燈：先繞墊子兩圈，再停在目標上；每一步越來越慢
const buildSteps = (size: number, target: number, reduced: boolean) => {
  const total = reduced ? 1 : size * 2 + target + 1;
  const start = reduced ? target : 0;
  return Array.from({ length: total }, (_, i) => ({
    index: (start + i) % size,
    delay: reduced ? 200 : 70 + Math.round(((i / total) ** 3) * 380),
  }));
};

const lineShareUrl = (url: string) =>
  `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

export const ZhuazhouGame = ({
  items,
  initialMat,
  shared,
  lineUrl,
}: ZhuazhouGameProps) => {
  const c = useContent(playGame);
  const biz = useContent(siteBusiness);
  const reduced = useReducedMotion() ?? false;
  const sfx = useSfx();
  const [board, setBoard] = useState(() => toBoard(initialMat));
  const mat = useMemo(() => board.map((b) => b.item), [board]);
  const slots = useMemo(() => board.map((b) => b.slot), [board]);
  const setMat = (list: PlayItem[]) => setBoard(toBoard(list));
  const [nameInput, setNameInput] = useState("");
  const [phase, setPhase] = useState<Phase>(
    shared ? { kind: "result", result: shared, shared: true } : { kind: "idle" },
  );
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>("room");
  // 點了地上哪個物品（顯示「拿掉／換一個」選單）
  const [editing, setEditing] = useState<number | null>(null);
  const [picker, setPicker] = useState<Picker | null>(null);
  const [theme, setTheme] = useState<RoomThemeId>("galaxy");
  // 從分享連結進來時沿用朋友選的衣服，否則預設虎衣
  const [outfit, setOutfit] = useState<OutfitId>(
    shared?.outfit ?? DEFAULT_OUTFIT,
  );
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // 抓周統計：記在「哪個物品」底下，換結果時舊的數字自然不會顯示
  const [stats, setStats] = useState<{ item: string; value: GrabStats } | null>(
    null,
  );
  const [savingImage, setSavingImage] = useState(false);
  // 同一個結果只記一次（開發模式的 StrictMode 會把 effect 跑兩次）
  const recorded = useRef<Result | null>(null);

  // 出結果時：自己玩的 → 撒彩帶＋音效＋統計 +1；別人分享的 → 只讀統計
  useEffect(() => {
    if (phase.kind !== "result" || recorded.current === phase.result) return;
    const { result, shared: fromLink } = phase;
    recorded.current = result;
    const item = result.item.name;

    if (!fromLink) {
      sfx.fanfare();
      const brand = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-brand")
        .trim();
      void confetti({
        particleCount: 120,
        spread: 80,
        startVelocity: 45,
        origin: { y: 0.35 },
        colors: [brand || "#eda09d", "#ffd36e", "#ffffff", "#8fd3c2"],
        disableForReducedMotion: true,
      });
    }

    const request = fromLink
      ? fetch(`/api/play/stats?item=${encodeURIComponent(item)}`)
      : fetch("/api/play/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item }),
        });
    request
      .then((res) => (res.ok ? (res.json() as Promise<GrabStats | null>) : null))
      .then((value) => {
        if (value) setStats({ item, value });
      })
      .catch(() => undefined);
    // sfx 每次 render 都是新物件，只在結果改變時跑
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const closeEditors = () => {
    setEditing(null);
    setPicker(null);
  };

  const onItemClick = (index: number) => {
    if (phase.kind === "grabbing") return;
    setPicker(null);
    setEditing((current) => (current === index ? null : index));
  };

  // 房間模式拖曳排序：套用每個物品新的擺放點
  const setSlots = (next: number[]) =>
    setBoard((current) =>
      current.map((b, i) => ({ ...b, slot: next[i] ?? b.slot })),
    );

  // 快速模式拖曳排序：把物品移到另一格，中間的往前／往後挪
  const reorderItems = (from: number, to: number) => {
    if (from === to) return;
    setBoard((current) => arrayMove(current, from, to));
  };

  const removeAt = (index: number) => {
    setBoard((current) =>
      current.length > MIN_MAT_SIZE
        ? current.filter((_, i) => i !== index)
        : current,
    );
    closeEditors();
  };

  const pickItem = (item: PlayItem) => {
    if (!picker) return;
    if (picker.kind === "replace") {
      const { index } = picker;
      setBoard((current) =>
        current.some((b) => b.item.name === item.name)
          ? current
          : current.map((b, i) => (i === index ? { ...b, item } : b)),
      );
      closeEditors();
      return;
    }
    // 加物品：面板保持打開，可以連續加
    setBoard((current) =>
      current.length < MAT_SIZE &&
      !current.some((b) => b.item.name === item.name)
        ? [...current, { item, slot: freeSlot(current) }]
        : current,
    );
  };

  const menuFor = (index: number, align: MenuAlign) => (
    <ItemMenu
      key={index}
      align={align}
      canRemove={mat.length > MIN_MAT_SIZE}
      removeLabel={c.removeButton}
      replaceLabel={c.replaceButton}
      minHint={c.removeMinHint.replaceAll("{min}", String(MIN_MAT_SIZE))}
      onRemove={() => removeAt(index)}
      onReplace={() => {
        setEditing(null);
        setPicker({ kind: "replace", index });
      }}
      onClose={() => setEditing(null)}
    />
  );

  const start = () => {
    if (phase.kind === "grabbing" || mat.length === 0) return;
    closeEditors();
    const babyName = cleanBabyName(nameInput);
    const target = Math.floor(Math.random() * mat.length);
    setCopied(false);
    // iOS 要在點擊當下啟用音效
    sfx.unlock();

    // 房間模式：交給 RoomScene 演完再呼叫 finishRoom
    if (mode === "room") {
      setPhase({ kind: "grabbing", highlight: -1, target, babyName });
      return;
    }

    const steps = buildSteps(mat.length, target, reduced);

    const run = (i: number) => {
      if (i >= steps.length) {
        timer.current = setTimeout(
          () =>
            setPhase({
              kind: "result",
              result: { item: mat[target], babyName, outfit },
              shared: false,
            }),
          reduced ? 0 : 600,
        );
        return;
      }
      setPhase({
        kind: "grabbing",
        highlight: steps[i].index,
        target,
        babyName,
      });
      sfx.tick();
      timer.current = setTimeout(() => run(i + 1), steps[i].delay);
    };
    run(0);
  };

  const finishRoom = () =>
    setPhase((p) =>
      p.kind === "grabbing"
        ? {
            kind: "result",
            result: { item: mat[p.target], babyName: p.babyName, outfit },
            shared: false,
          }
        : p,
    );

  // 再抓一次：保留使用者自選的物品，只有從分享連結進來時才重新隨機
  const playAgain = () => {
    clearTimeout(timer.current);
    if (phase.kind === "result" && phase.shared) setMat(pickMatItems(items));
    setCopied(false);
    // 從分享連結進來的人自己玩時，網址列換回乾淨的 /play
    if (window.location.search) window.history.replaceState(null, "", "/play");
    setPhase({ kind: "idle" });
  };

  const shareUrl = (r: Result) =>
    `${window.location.origin}${resultPath(r.item.name, r.babyName, r.outfit)}`;

  const titleFor = (r: Result) =>
    fillTemplate(c.resultTitle, {
      name: r.babyName || c.defaultName,
      item: r.item.name,
    });

  const share = async (r: Result) => {
    const url = shareUrl(r);
    if (navigator.share) {
      try {
        await navigator.share({ title: titleFor(r), text: titleFor(r), url });
        return;
      } catch (error) {
        // 使用者自己關掉分享面板就不用再複製
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(c.copiedText, url);
    }
  };

  const statsLine = (r: Result) => {
    if (!c.statsText || stats?.item !== r.item.name) return "";
    const { value } = stats;
    if (value.total < MIN_STATS_TOTAL) return "";
    return c.statsText
      .replaceAll("{total}", formatTotal(value.total))
      .replaceAll("{percent}", formatPercent(value))
      .replaceAll("{name}", r.babyName || c.defaultName)
      .replaceAll("{item}", r.item.name);
  };

  // 結果卡上那個穿著衣服的寶寶，轉成獨立的 SVG 給存圖用（主題色換成實際顏色）
  const babySvg = () => {
    const el = document.querySelector("[data-result-baby] svg");
    if (!el) return undefined;
    const brand = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-brand")
      .trim();
    return new XMLSerializer()
      .serializeToString(el)
      .replaceAll("var(--color-brand)", brand || "#eda09d");
  };

  // 存成直式圖片：手機能分享檔案就叫出分享面板（可存到相簿、傳 LINE、IG），不行就直接下載
  // LINE 預約：帶入剛剛抓到的物品和選的場地，主理人一看就知道怎麼接話
  const themeNames: Record<RoomThemeId, string> = {
    galaxy: c.themeGalaxy,
    forest: c.themeForest,
    cream: c.themeCream,
    fortune: c.themeFortune,
  };
  const bookingHref = (r: Result) => {
    if (!c.ctaLineMessage.trim()) return lineUrl;
    const message = c.ctaLineMessage
      .replaceAll("{寶寶}", r.babyName || c.defaultName)
      .replaceAll("{物品}", r.item.name)
      .replaceAll(
        "{場地}",
        mode === "room" ? themeNames[theme].replace(/^[^\p{L}\p{N}]+/u, "").trim() : "",
      );
    return lineChatHref(biz, message);
  };

  const saveImage = async (r: Result) => {
    setSavingImage(true);
    try {
      const blob = await drawResultCard({
        title: titleFor(r),
        item: r.item,
        blessing: c.blessing,
        statsLine: statsLine(r),
        babySvg: babySvg(),
        brand: biz.brand,
        cta: c.cardCta,
        link: `${window.location.host}/play`,
        instagram: biz.instagram,
        promo: c.cardPromo,
      });
      const file = new File([blob], `抓周-${r.item.name}.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: titleFor(r) });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (error) {
      console.error("[play] 存成圖片失敗", error);
    } finally {
      setSavingImage(false);
    }
  };

  const highlight = phase.kind === "grabbing" ? phase.highlight : -1;
  const outfitHints: Record<OutfitId, string> = {
    tiger: c.outfitTigerHint,
    onesie: c.outfitOnesieHint,
    overalls: c.outfitOverallsHint,
    tutu: c.outfitTutuHint,
  };
  const activeIndex = picker?.kind === "replace" ? picker.index : editing;

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <AnimatePresence mode="wait" initial={false}>
        {phase.kind === "result" ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <ResultCard
              title={titleFor(phase.result)}
              item={phase.result.item}
              blessing={c.blessing}
              intro={phase.shared ? c.sharedIntro : ""}
              statsLine={statsLine(phase.result)}
              outfit={phase.result.outfit}
            />

            {/* 手機上自己的結果有四顆按鈕，排成 2×2 比較不會拉得太長 */}
            <div
              className={cn(
                "mt-6 gap-3 sm:flex sm:flex-row sm:justify-center",
                phase.shared ? "flex flex-col" : "grid grid-cols-2",
              )}
            >
              {phase.shared ? (
                <button
                  type="button"
                  onClick={playAgain}
                  className="inline-flex items-center justify-center rounded-full bg-brand-strong px-8 py-3 font-medium text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105"
                >
                  {c.playYourselfButton}
                </button>
              ) : (
                <>
                  {/* 存成圖片（發 IG 限動）最常用，放第一個、用主色 */}
                  <button
                    type="button"
                    disabled={savingImage}
                    onClick={() => saveImage(phase.result)}
                    className="inline-flex items-center justify-center rounded-full bg-brand-strong px-7 py-3 font-medium text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105 disabled:opacity-60"
                  >
                    {savingImage ? c.savingImage : c.saveImageButton}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        lineShareUrl(shareUrl(phase.result)),
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="inline-flex items-center justify-center rounded-full bg-[#06c755] px-7 py-3 font-medium text-white shadow-lg shadow-[#06c755]/30 transition-transform duration-300 hover:scale-105"
                  >
                    {c.lineShareButton}
                  </button>
                  <button
                    type="button"
                    onClick={() => share(phase.result)}
                    className="inline-flex items-center justify-center rounded-full border border-brand-soft/60 bg-white px-7 py-3 font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
                  >
                    {c.shareButton}
                  </button>
                  <button
                    type="button"
                    onClick={playAgain}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-brand-ink/70 underline-offset-4 hover:underline"
                  >
                    {c.againButton}
                  </button>
                </>
              )}
            </div>
            <p
              role="status"
              className={cn(
                "mt-3 text-center text-sm text-brand transition-opacity",
                copied ? "opacity-100" : "opacity-0",
              )}
            >
              {copied ? c.copiedText : " "}
            </p>

            {!phase.shared && (
              <FortunePanel
                key={`${phase.result.item.name}-${phase.result.babyName}`}
                item={phase.result.item}
                babyName={phase.result.babyName || c.defaultName}
              />
            )}

            <BookingCta
              inviteLabel={c.inviteLink}
              text={c.ctaText}
              lineLabel={c.ctaLineButton}
              moreLabel={c.ctaMoreButton}
              lineUrl={bookingHref(phase.result)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="play"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                start();
              }}
              className="flex flex-col gap-3"
            >
              <label className="flex flex-col gap-2 text-center">
                <span className="text-sm font-medium tracking-wider text-brand">
                  {c.nameLabel}
                </span>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                  placeholder={c.namePlaceholder}
                  disabled={phase.kind === "grabbing"}
                  className="mx-auto w-full max-w-xs rounded-full border border-brand-soft/70 bg-white px-5 py-3 text-center text-base text-brand-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft/40 disabled:opacity-60"
                />
              </label>

              <ModeSwitch
                mode={mode}
                // 換模式、換場地要重畫整個大場景：標成不急的更新，
                // 讓點擊的回饋先畫出來，場景在背景算（手機上不會卡住 0.3～0.4 秒）
                onChange={(m) => startTransition(() => setMode(m))}
                disabled={phase.kind === "grabbing"}
                labels={{ room: c.modeRoom, quick: c.modeQuick }}
              />

              {mode === "room" && (
                <ChipPicker
                  label={c.themeLabel}
                  ids={ROOM_THEME_IDS}
                  value={theme}
                  onChange={(t) => startTransition(() => setTheme(t))}
                  disabled={phase.kind === "grabbing"}
                  names={{
                    galaxy: c.themeGalaxy,
                    forest: c.themeForest,
                    cream: c.themeCream,
                    fortune: c.themeFortune,
                  }}
                />
              )}

              <ChipPicker
                label={c.outfitLabel}
                ids={OUTFIT_IDS}
                value={outfit}
                onChange={setOutfit}
                disabled={phase.kind === "grabbing"}
                names={{
                  tiger: c.outfitTiger,
                  onesie: c.outfitOnesie,
                  overalls: c.outfitOveralls,
                  tutu: c.outfitTutu,
                }}
              />
              {outfitHints[outfit] && (
                <p className="-mt-1 text-balance text-center text-xs text-brand-ink/65">
                  {outfitHints[outfit]}
                </p>
              )}

              {mode === "room" ? (
                <RoomScene
                  items={mat}
                  slots={slots}
                  theme={theme}
                  outfit={outfit}
                  target={phase.kind === "grabbing" ? phase.target : null}
                  reduced={reduced}
                  onDone={finishRoom}
                  onItemClick={onItemClick}
                  activeIndex={activeIndex}
                  renderMenu={editing === null ? undefined : menuFor}
                  onDragStart={closeEditors}
                  onSlotsChange={setSlots}
                />
              ) : (
                <Mat
                  items={mat}
                  outfit={outfit}
                  highlight={highlight}
                  reduced={reduced}
                  interactive={phase.kind !== "grabbing"}
                  onItemClick={onItemClick}
                  activeIndex={activeIndex}
                  renderMenu={editing === null ? undefined : menuFor}
                  onDragStart={closeEditors}
                  onReorder={reorderItems}
                />
              )}

              {c.tapHint && phase.kind !== "grabbing" && (
                <p className="-mt-1 text-center text-xs text-brand-ink/60">
                  👆 {c.tapHint}
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setPicker((p) =>
                      p?.kind === "add" ? null : { kind: "add" },
                    );
                  }}
                  disabled={
                    phase.kind === "grabbing" || mat.length >= MAT_SIZE
                  }
                  aria-expanded={picker?.kind === "add"}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-50",
                    picker?.kind === "add"
                      ? "border-brand bg-brand-soft/40 text-brand"
                      : "border-brand-soft/70 bg-white text-brand hover:bg-brand-soft/30",
                  )}
                >
                  ＋ {c.pickerButton}（{mat.length}/{MAT_SIZE}）
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeEditors();
                    setMat(pickMatItems(items));
                  }}
                  disabled={phase.kind === "grabbing"}
                  className="rounded-full border border-brand-soft/70 bg-white px-4 py-1.5 text-sm text-brand transition-colors hover:bg-brand-soft/30 disabled:opacity-50"
                >
                  🎲 {c.shuffleButton}
                </button>
              </div>

              <AnimatePresence>
                {picker && (
                  <ItemPickerDialog
                    key={
                      picker.kind === "add" ? "add" : `replace-${picker.index}`
                    }
                    items={items}
                    selected={mat}
                    replacing={
                      picker.kind === "replace" ? mat[picker.index] : undefined
                    }
                    onPick={pickItem}
                    onClose={() => setPicker(null)}
                    title={
                      picker.kind === "replace"
                        ? c.replaceHint.replaceAll(
                            "{item}",
                            mat[picker.index]?.name ?? "",
                          )
                        : `${c.pickerHint
                            .replaceAll("{min}", String(MIN_MAT_SIZE))
                            .replaceAll("{max}", String(MAT_SIZE))}（${mat.length}/${MAT_SIZE}）`
                    }
                    doneLabel={c.pickerDone}
                  />
                )}
              </AnimatePresence>

              <p
                aria-live="polite"
                className="min-h-6 text-center text-sm text-brand-ink/70"
              >
                {phase.kind === "grabbing" ? c.grabbingText : ""}
              </p>

              <button
                type="submit"
                disabled={phase.kind === "grabbing"}
                className="mx-auto inline-flex min-w-48 items-center justify-center rounded-full bg-brand-strong px-10 py-3.5 text-lg font-medium tracking-wider text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-60"
              >
                {c.startButton}
              </button>
              <button
                type="button"
                onClick={sfx.toggle}
                aria-pressed={sfx.enabled}
                className="mx-auto -mt-1 rounded-full px-3 py-1 text-xs text-brand-ink/60 hover:bg-brand-soft/30 hover:text-brand"
              >
                {sfx.enabled ? c.soundOn : c.soundOff}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {c.disclaimer && (
        <p className="mt-10 text-center text-xs text-brand-ink/50">
          {c.disclaimer}
        </p>
      )}
    </div>
  );
};

// 一排可左右滑的單選小鈕（場地、衣服共用）
const ChipPicker = <T extends string>({
  label,
  ids,
  value,
  onChange,
  disabled,
  names,
}: {
  label: string;
  ids: readonly T[];
  value: T;
  onChange: (id: T) => void;
  disabled: boolean;
  names: Record<T, string>;
}) => (
  <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
    <p className="text-center text-xs text-brand-ink/60">{label}</p>
    {/* 自動換行：手機上四個選項都看得到，不用左右滑 */}
    <div className="flex flex-wrap justify-center gap-2 pb-1">
      {ids.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          disabled={disabled}
          onClick={() => onChange(id)}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-all disabled:cursor-not-allowed",
            value === id
              ? "bg-brand-strong font-medium text-white shadow"
              : "bg-white/80 text-brand-ink ring-1 ring-brand-soft/60 hover:bg-brand-soft/30",
          )}
        >
          {names[id]}
        </button>
      ))}
    </div>
  </div>
);

const ModeSwitch = ({
  mode,
  onChange,
  disabled,
  labels,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled: boolean;
  labels: Record<Mode, string>;
}) => (
  <div
    role="radiogroup"
    className="mx-auto inline-flex rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-brand-soft/60"
  >
    {(["room", "quick"] as const).map((m) => (
      <button
        key={m}
        type="button"
        role="radio"
        aria-checked={mode === m}
        disabled={disabled}
        onClick={() => onChange(m)}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
          mode === m
            ? "bg-brand-strong text-white shadow"
            : "text-brand hover:bg-brand-soft/30",
        )}
      >
        {labels[m]}
      </button>
    ))}
  </div>
);

// 4 欄格子：最左、最右欄的選單往內對齊，避免超出畫面
const matAlign = (index: number): MenuAlign =>
  index % 4 === 0 ? "start" : index % 4 === 3 ? "end" : "center";

const Mat = ({
  items,
  outfit,
  highlight,
  reduced,
  interactive,
  onItemClick,
  activeIndex,
  renderMenu,
  onDragStart,
  onReorder,
}: {
  items: PlayItem[];
  outfit: OutfitId;
  highlight: number;
  reduced: boolean;
  interactive: boolean;
  onItemClick: (index: number) => void;
  activeIndex: number | null;
  renderMenu?: (index: number, align: MenuAlign) => React.ReactNode;
  onDragStart: () => void;
  onReorder: (from: number, to: number) => void;
}) => {
  const sensors = useItemSensors();
  const suppress = useSuppressClickAfterDrag();
  const isClient = useIsClient();
  const [dragging, setDragging] = useState<{
    index: number;
    width: number;
  } | null>(null);
  // 物品名稱不重複，當作排序用的 id（index 在排序後會變）
  const ids = items.map((item) => item.name);

  const handleDragStart = ({ active }: DragStartEvent) => {
    suppress.markStart();
    setDragging({
      index: ids.indexOf(String(active.id)),
      width: active.rect.current.initial?.width ?? 0,
    });
    onDragStart();
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(null);
    suppress.markDragged();
    if (!over) return;
    onReorder(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };

  return (
    <div className="rounded-[2rem] bg-brand-soft/40 p-3 ring-1 ring-brand-soft/60 sm:p-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          suppress.markDragged();
          setDragging(null);
        }}
        accessibility={{
          announcements: itemAnnouncements((id) => String(id)),
          screenReaderInstructions: itemScreenReaderInstructions,
        }}
      >
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-4 gap-2 rounded-[1.5rem] border-2 border-dashed border-white/80 bg-white/40 p-3 sm:gap-4 sm:p-5">
            {items.map((item, i) => (
              <MatCell
                key={item.name}
                index={i}
                item={item}
                outfit={outfit}
                active={i === highlight}
                selected={i === activeIndex}
                reduced={reduced}
                interactive={interactive}
                menu={i === activeIndex ? renderMenu?.(i, matAlign(i)) : null}
                onClick={() => {
                  if (dragging === null) onItemClick(i);
                }}
                onClickCapture={suppress.onClickCapture}
              />
            ))}
          </ul>
        </SortableContext>

        {isClient &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              {dragging && items[dragging.index] ? (
                <div
                  style={{ width: dragging.width }}
                  className="cursor-grabbing"
                >
                  <div className="grid aspect-square scale-110 place-items-center rounded-2xl bg-white text-3xl shadow-xl ring-4 ring-brand sm:text-5xl">
                    <span aria-hidden>
                      <ZhuazhouItemIcon item={items[dragging.index]} />
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );
};

// 快速模式的一格：拖曳經過時，其他格子即時往旁邊挪（sortable）
const MatCell = ({
  index,
  item,
  outfit,
  active,
  selected,
  reduced,
  interactive,
  menu,
  onClick,
  onClickCapture,
}: {
  index: number;
  item: PlayItem;
  outfit: OutfitId;
  active: boolean;
  selected: boolean;
  reduced: boolean;
  interactive: boolean;
  menu: React.ReactNode;
  onClick: () => void;
  onClickCapture: (e: React.MouseEvent) => void;
}) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.name,
    data: { index },
    disabled: !interactive,
  });
  return (
    <li
      ref={setNodeRef}
      className={cn("relative text-center", selected && "z-30")}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition: reduced ? undefined : transition,
      }}
    >
      {menu}
      {active && (
        // 穿著選好衣服的小寶寶跳到這一格上方
        <motion.span
          aria-hidden
          layoutId={reduced ? undefined : "baby-hand"}
          className="absolute -top-7 left-1/2 z-10 block w-14 -translate-x-1/2 sm:-top-9 sm:w-[4.5rem]"
        >
          <CrawlingBaby outfit={outfit} />
        </motion.span>
      )}
      <button
        ref={setActivatorNodeRef}
        type="button"
        data-item-button
        disabled={!interactive}
        {...attributes}
        {...listeners}
        aria-label={item.name}
        onClick={onClick}
        onClickCapture={onClickCapture}
        className={cn(
          "block w-full select-none disabled:cursor-default",
          interactive && "cursor-grab",
        )}
      >
        <div
          className={cn(
            "grid aspect-square place-items-center rounded-2xl bg-white text-3xl shadow-sm transition-all duration-150 sm:text-5xl",
            active && "scale-110 bg-brand-beige ring-4 ring-brand",
            selected && "ring-4 ring-brand",
            interactive && !selected && "hover:scale-105",
            // 拖曳中原位顯示成虛線空格，表示放開會落在這裡
            isDragging &&
              "bg-brand-beige/60 opacity-60 outline-2 outline-offset-2 outline-dashed outline-brand/50",
          )}
        >
          <span aria-hidden className={cn(isDragging && "opacity-30")}>
            <ZhuazhouItemIcon item={item} />
          </span>
        </div>
        <p
          className={cn(
            "mt-1.5 truncate text-xs text-brand-ink/80 sm:text-sm",
            (active || selected) && "font-semibold text-brand",
          )}
        >
          {item.name}
        </p>
      </button>
    </li>
  );
};

const ResultCard = ({
  title,
  item,
  blessing,
  intro,
  statsLine,
  outfit,
}: {
  title: string;
  item: PlayItem;
  blessing: string;
  intro: string;
  statsLine: string;
  outfit: OutfitId;
}) => (
  <div className="relative overflow-hidden rounded-[2rem] border border-brand-soft/50 bg-white px-6 py-10 text-center shadow-[0_18px_40px_rgba(237,160,157,0.15)] sm:px-10">
    <span
      aria-hidden
      className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-soft/30 blur-2xl"
    />
    {intro && (
      <p className="mb-4 text-sm tracking-wider text-brand-accent">{intro}</p>
    )}
    <div className="relative mx-auto size-32 sm:size-40">
      <div className="grid size-full place-items-center rounded-full bg-brand-beige text-7xl ring-8 ring-brand-soft/40 sm:text-8xl">
        <span role="img" aria-label={item.name}>
          <ZhuazhouItemIcon item={item} />
        </span>
      </div>
      {/* 穿著選好衣服的寶寶爬到物品旁邊 */}
      <div
        data-result-baby
        className="absolute -bottom-3 -left-16 w-24 sm:-left-20 sm:w-28"
      >
        <CrawlingBaby outfit={outfit} />
      </div>
    </div>
    <h2 className="mt-6 text-2xl font-semibold tracking-wide text-brand sm:text-3xl">
      {title}
    </h2>
    {item.meaning && (
      <p className="mt-3 text-lg text-brand-ink">{item.meaning}</p>
    )}
    {statsLine && (
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-3 inline-block rounded-full bg-brand-beige px-4 py-1.5 text-sm text-brand-ink/75"
      >
        📊 {statsLine}
      </motion.p>
    )}
    {blessing && (
      <p className="mx-auto mt-4 max-w-md whitespace-pre-line leading-loose text-brand-ink/70">
        {blessing}
      </p>
    )}
  </div>
);

const BookingCta = ({
  inviteLabel,
  text,
  lineLabel,
  moreLabel,
  lineUrl,
}: {
  inviteLabel: string;
  text: string;
  lineLabel: string;
  moreLabel: string;
  lineUrl: string;
}) => (
  <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-brand-beige/70 px-6 py-8 text-center ring-1 ring-brand-soft/40">
    <p className="whitespace-pre-line leading-loose text-brand-ink">{text}</p>
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-[#06c755] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-[#06c755]/30 transition-transform duration-300 hover:scale-105"
      >
        {lineLabel}
      </a>
      <Link
        href="/baby-party"
        className="inline-flex items-center justify-center rounded-full border border-brand-soft/60 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
      >
        {moreLabel}
      </Link>
    </div>
    {inviteLabel && (
      <Link
        href="/invite"
        className="text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        {inviteLabel}
      </Link>
    )}
  </div>
);
