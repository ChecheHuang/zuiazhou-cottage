"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { RoomScene } from "@/components/play/RoomScene";
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

interface Result {
  item: PlayItem;
  babyName: string;
}

type Phase =
  | { kind: "idle" }
  | { kind: "grabbing"; highlight: number; target: number; babyName: string }
  | { kind: "result"; result: Result; shared: boolean };

type Mode = "room" | "quick";

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
  const reduced = useReducedMotion() ?? false;
  const [mat, setMat] = useState(initialMat);
  const [nameInput, setNameInput] = useState("");
  const [phase, setPhase] = useState<Phase>(
    shared ? { kind: "result", result: shared, shared: true } : { kind: "idle" },
  );
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>("room");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [theme, setTheme] = useState<RoomThemeId>("galaxy");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggleItem = (item: PlayItem) =>
    setMat((current) => {
      const picked = current.some((m) => m.name === item.name);
      if (picked) {
        return current.length > MIN_MAT_SIZE
          ? current.filter((m) => m.name !== item.name)
          : current;
      }
      return current.length < MAT_SIZE ? [...current, item] : current;
    });

  const start = () => {
    if (phase.kind === "grabbing" || mat.length === 0) return;
    setPickerOpen(false);
    const babyName = cleanBabyName(nameInput);
    const target = Math.floor(Math.random() * mat.length);
    setCopied(false);

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
              result: { item: mat[target], babyName },
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
      timer.current = setTimeout(() => run(i + 1), steps[i].delay);
    };
    run(0);
  };

  const finishRoom = () =>
    setPhase((p) =>
      p.kind === "grabbing"
        ? {
            kind: "result",
            result: { item: mat[p.target], babyName: p.babyName },
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
    `${window.location.origin}${resultPath(r.item.name, r.babyName)}`;

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

  const highlight = phase.kind === "grabbing" ? phase.highlight : -1;

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
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {phase.shared ? (
                <button
                  type="button"
                  onClick={playAgain}
                  className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 font-medium text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105"
                >
                  {c.playYourselfButton}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => share(phase.result)}
                    className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 font-medium text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105"
                  >
                    {c.shareButton}
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
                    onClick={playAgain}
                    className="inline-flex items-center justify-center rounded-full border border-brand-soft/60 bg-white px-7 py-3 font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
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

            <BookingCta
              text={c.ctaText}
              lineLabel={c.ctaLineButton}
              moreLabel={c.ctaMoreButton}
              lineUrl={lineUrl}
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
                onChange={setMode}
                disabled={phase.kind === "grabbing"}
                labels={{ room: c.modeRoom, quick: c.modeQuick }}
              />

              {mode === "room" && (
                <ThemePicker
                  label={c.themeLabel}
                  value={theme}
                  onChange={setTheme}
                  disabled={phase.kind === "grabbing"}
                  names={{
                    galaxy: c.themeGalaxy,
                    forest: c.themeForest,
                    cream: c.themeCream,
                    fortune: c.themeFortune,
                  }}
                />
              )}

              {mode === "room" ? (
                <RoomScene
                  items={mat}
                  theme={theme}
                  target={phase.kind === "grabbing" ? phase.target : null}
                  reduced={reduced}
                  onDone={finishRoom}
                />
              ) : (
                <Mat items={mat} highlight={highlight} reduced={reduced} />
              )}

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  disabled={phase.kind === "grabbing"}
                  aria-expanded={pickerOpen}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-50",
                    pickerOpen
                      ? "border-brand bg-brand-soft/40 text-brand"
                      : "border-brand-soft/70 bg-white text-brand hover:bg-brand-soft/30",
                  )}
                >
                  🧸 {c.pickerButton}（{mat.length}）
                </button>
                <button
                  type="button"
                  onClick={() => setMat(pickMatItems(items))}
                  disabled={phase.kind === "grabbing"}
                  className="rounded-full border border-brand-soft/70 bg-white px-4 py-1.5 text-sm text-brand transition-colors hover:bg-brand-soft/30 disabled:opacity-50"
                >
                  🎲 {c.shuffleButton}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {pickerOpen && (
                  <ItemPicker
                    items={items}
                    selected={mat}
                    onToggle={toggleItem}
                    onClose={() => setPickerOpen(false)}
                    hint={c.pickerHint
                      .replaceAll("{min}", String(MIN_MAT_SIZE))
                      .replaceAll("{max}", String(MAT_SIZE))}
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
                className="mx-auto inline-flex min-w-48 items-center justify-center rounded-full bg-brand px-10 py-3.5 text-lg font-medium tracking-wider text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-60"
              >
                {c.startButton}
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

const ItemPicker = ({
  items,
  selected,
  onToggle,
  onClose,
  hint,
  doneLabel,
}: {
  items: PlayItem[];
  selected: PlayItem[];
  onToggle: (item: PlayItem) => void;
  onClose: () => void;
  hint: string;
  doneLabel: string;
}) => {
  const picked = new Set(selected.map((m) => m.name));
  const full = selected.length >= MAT_SIZE;
  const minimum = selected.length <= MIN_MAT_SIZE;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="rounded-3xl bg-white/85 p-4 ring-1 ring-brand-soft/60">
        <p className="mb-3 text-center text-sm text-brand-ink/70">
          {hint}（{selected.length}/{MAT_SIZE}）
        </p>
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {items.map((item) => {
            const on = picked.has(item.name);
            const locked = on ? minimum : full;
            return (
              <li key={item.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={locked}
                  onClick={() => onToggle(item)}
                  className={cn(
                    "flex w-full flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-xs transition-all",
                    on
                      ? "bg-brand-soft/50 text-brand ring-2 ring-brand"
                      : "bg-brand-beige/60 text-brand-ink/80 hover:bg-brand-soft/30",
                    locked && !on && "opacity-40",
                  )}
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="w-full truncate">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand px-6 py-2 text-sm font-medium text-white"
          >
            {doneLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ThemePicker = ({
  label,
  value,
  onChange,
  disabled,
  names,
}: {
  label: string;
  value: RoomThemeId;
  onChange: (theme: RoomThemeId) => void;
  disabled: boolean;
  names: Record<RoomThemeId, string>;
}) => (
  <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
    <p className="text-center text-xs text-brand-ink/60">{label}</p>
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
      {ROOM_THEME_IDS.map((id) => (
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
              ? "bg-brand font-medium text-white shadow"
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
            ? "bg-brand text-white shadow"
            : "text-brand hover:bg-brand-soft/30",
        )}
      >
        {labels[m]}
      </button>
    ))}
  </div>
);

const Mat = ({
  items,
  highlight,
  reduced,
}: {
  items: PlayItem[];
  highlight: number;
  reduced: boolean;
}) => (
  <div className="rounded-[2rem] bg-brand-soft/40 p-3 ring-1 ring-brand-soft/60 sm:p-5">
    <ul className="grid grid-cols-4 gap-2 rounded-[1.5rem] border-2 border-dashed border-white/80 bg-white/40 p-3 sm:gap-4 sm:p-5">
      {items.map((item, i) => {
        const active = i === highlight;
        return (
          <li key={`${i}-${item.name}`} className="relative text-center">
            {active && (
              <motion.span
                aria-hidden
                layoutId={reduced ? undefined : "baby-hand"}
                className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 text-2xl sm:text-3xl"
              >
                👶
              </motion.span>
            )}
            <div
              className={cn(
                "grid aspect-square place-items-center rounded-2xl bg-white text-3xl shadow-sm transition-all duration-150 sm:text-5xl",
                active && "scale-110 bg-brand-beige ring-4 ring-brand",
              )}
            >
              <span role="img" aria-label={item.name}>
                {item.emoji}
              </span>
            </div>
            <p
              className={cn(
                "mt-1.5 truncate text-xs text-brand-ink/80 sm:text-sm",
                active && "font-semibold text-brand",
              )}
            >
              {item.name}
            </p>
          </li>
        );
      })}
    </ul>
  </div>
);

const ResultCard = ({
  title,
  item,
  blessing,
  intro,
}: {
  title: string;
  item: PlayItem;
  blessing: string;
  intro: string;
}) => (
  <div className="relative overflow-hidden rounded-[2rem] border border-brand-soft/50 bg-white px-6 py-10 text-center shadow-[0_18px_40px_rgba(237,160,157,0.15)] sm:px-10">
    <span
      aria-hidden
      className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-soft/30 blur-2xl"
    />
    {intro && (
      <p className="mb-4 text-sm tracking-wider text-brand-accent">{intro}</p>
    )}
    <div className="mx-auto grid size-32 place-items-center rounded-full bg-brand-beige text-7xl ring-8 ring-brand-soft/40 sm:size-40 sm:text-8xl">
      <span role="img" aria-label={item.name}>
        {item.emoji}
      </span>
    </div>
    <h2 className="mt-6 text-2xl font-semibold tracking-wide text-brand sm:text-3xl">
      {title}
    </h2>
    {item.meaning && (
      <p className="mt-3 text-lg text-brand-ink">{item.meaning}</p>
    )}
    {blessing && (
      <p className="mx-auto mt-4 max-w-md whitespace-pre-line leading-loose text-brand-ink/70">
        {blessing}
      </p>
    )}
  </div>
);

const BookingCta = ({
  text,
  lineLabel,
  moreLabel,
  lineUrl,
}: {
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
  </div>
);
