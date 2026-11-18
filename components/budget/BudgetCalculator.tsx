"use client";

import { useState } from "react";
import { useContent } from "@/components/SiteContentProvider";
import { cn } from "@/lib/cn";
import { formatNT, isPerTable, parsePrice, type ParsedPrice } from "@/lib/budget";
import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { budgetText } from "@/lib/site-content/blocks/budget";
import { foodPlans } from "@/lib/site-content/blocks/food";
import { photoAddons, photoPlan } from "@/lib/site-content/blocks/photo";
import { lineChatHref, siteBusiness } from "@/lib/site-content/blocks/site";

// 預算試算：項目與價格全部沿用後台其他頁的內容，這裡只負責勾選與加總。

interface Option {
  id: string;
  name: string;
  priceText: string;
  price: ParsedPrice;
  /** 按桌計價（餐點） */
  perTable?: boolean;
  /** 例如「每席 10 位」，顯示在桌數旁 */
  seats?: string;
}

const stripEmoji = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, "").trim();

const PriceTag = ({ p, askPrice }: { p: ParsedPrice; askPrice: string }) => (
  <span className="shrink-0 font-semibold text-brand-accent">
    {p.amount === null ? (
      <span className="text-sm font-normal text-brand-ink/50">{askPrice}</span>
    ) : (
      <>
        {formatNT(p.amount)}
        {p.from && <span className="ml-0.5 text-xs font-normal">起</span>}
      </>
    )}
  </span>
);

const Step = ({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-brand-soft/50 sm:p-6">
    <h2 className="flex items-center gap-3 text-lg font-semibold text-brand">
      <span className="grid size-8 place-items-center rounded-full bg-brand-strong text-sm text-white">
        {n}
      </span>
      {title}
    </h2>
    <div className="mt-4 grid gap-2">{children}</div>
  </section>
);

const choiceClass = (active: boolean) =>
  cn(
    "flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-colors",
    active ? "bg-brand/10 ring-brand" : "ring-brand-soft/60 hover:bg-brand-soft/15",
  );

export const BudgetCalculator = () => {
  const c = useContent(budgetText);
  const biz = useContent(siteBusiness);
  const plans = useContent(partyPlans).plans;
  const photo = useContent(photoPlan);
  const addons = useContent(photoAddons).items;
  const foods = useContent(foodPlans).plans;

  const rooms: Option[] = plans.map((p, i) => ({
    id: `room-${i}`,
    name: stripEmoji(p.title),
    priceText: p.price,
    price: parsePrice(p.price),
  }));
  const photographer: Option = {
    id: "photo",
    name: photo.title,
    priceText: photo.price,
    price: parsePrice(photo.price),
  };
  const addonOptions: Option[] = addons.map((a, i) => ({
    id: `addon-${i}`,
    name: a.name,
    priceText: a.price,
    price: parsePrice(a.price),
  }));
  // 有分套餐價格的方案（例如合菜 $6,000／$8,000／$10,000）拆成各自的選項
  const foodOptions: Option[] = foods.flatMap((f, i) => {
    const perTable = isPerTable(f.seats);
    const priced = f.menus.filter((m) => parsePrice(m.title).amount !== null);
    if (priced.length > 0) {
      return priced.map((m, j) => ({
        id: `food-${i}-${j}`,
        name: `${f.title}｜${m.title}`,
        priceText: m.title,
        price: { amount: parsePrice(m.title).amount, from: false },
        perTable,
        seats: f.seats,
      }));
    }
    return [
      {
        id: `food-${i}`,
        name: f.title,
        priceText: f.price,
        price: parsePrice(f.price),
        perTable,
        seats: f.seats,
      },
    ];
  });

  const [room, setRoom] = useState(rooms[0]?.id ?? "");
  const [withPhoto, setWithPhoto] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [food, setFood] = useState("");
  const [tables, setTables] = useState(1);

  const foodChoice = foodOptions.find((f) => f.id === food);
  const selected: { option: Option; qty: number }[] = [
    ...rooms.filter((r) => r.id === room).map((option) => ({ option, qty: 1 })),
    ...(withPhoto ? [{ option: photographer, qty: 1 }] : []),
    ...addonOptions.filter((a) => picked.has(a.id)).map((option) => ({ option, qty: 1 })),
    ...(foodChoice ? [{ option: foodChoice, qty: foodChoice.perTable ? tables : 1 }] : []),
  ];

  const total = selected.reduce((sum, s) => sum + (s.option.price.amount ?? 0) * s.qty, 0);
  const isFrom = selected.some((s) => s.option.price.from);
  // 選了沒標價的項目（例如單點）：總計不含它，要提醒另計
  const hasUnpriced = selected.some((s) => s.option.price.amount === null);

  const togglePick = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const lineMessage = [
    c.lineIntro,
    ...selected.map(({ option, qty }) => {
      const p = option.price;
      const price = p.amount === null ? c.askPrice : `${formatNT(p.amount * qty)}${p.from ? " 起" : ""}`;
      return `・${option.name}${qty > 1 ? ` × ${qty}` : ""}：${price}`;
    }),
    `${c.totalLabel}：${formatNT(total)}${isFrom ? " 起" : ""}${hasUnpriced ? ` ${c.partialNote}` : ""}`,
    "預計日期：",
    "人數約：",
  ].join("\n");

  return (
    <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-6">
        {rooms.length > 0 && (
          <Step n={1} title={c.roomStep}>
            {rooms.map((r) => (
              <label key={r.id} className={choiceClass(room === r.id)}>
                <input
                  type="radio"
                  name="room"
                  checked={room === r.id}
                  onChange={() => setRoom(r.id)}
                  className="accent-brand"
                />
                <span className="flex-1">{r.name}</span>
                <PriceTag p={r.price} askPrice={c.askPrice} />
              </label>
            ))}
          </Step>
        )}

        <Step n={2} title={c.photoStep}>
          <label className={choiceClass(withPhoto)}>
            <input
              type="checkbox"
              checked={withPhoto}
              onChange={(e) => setWithPhoto(e.target.checked)}
              className="accent-brand"
            />
            <span className="flex-1">{photographer.name}</span>
            <PriceTag p={photographer.price} askPrice={c.askPrice} />
          </label>
        </Step>

        {addonOptions.length > 0 && (
          <Step n={3} title={c.addonStep}>
            {addonOptions.map((a, i) => (
              <label key={a.id} className={choiceClass(picked.has(a.id))}>
                <input
                  type="checkbox"
                  checked={picked.has(a.id)}
                  onChange={() => togglePick(a.id)}
                  className="accent-brand"
                />
                <span aria-hidden>{addons[i]?.emoji}</span>
                <span className="flex-1">{a.name}</span>
                <PriceTag p={a.price} askPrice={c.askPrice} />
              </label>
            ))}
          </Step>
        )}

        {foodOptions.length > 0 && (
          <Step n={4} title={c.foodStep}>
            <label className={choiceClass(food === "")}>
              <input
                type="radio"
                name="food"
                checked={food === ""}
                onChange={() => setFood("")}
                className="accent-brand"
              />
              <span className="flex-1">{c.noFood}</span>
            </label>
            {foodOptions.map((f) => (
              <label key={f.id} className={choiceClass(food === f.id)}>
                <input
                  type="radio"
                  name="food"
                  checked={food === f.id}
                  onChange={() => setFood(f.id)}
                  className="accent-brand"
                />
                <span className="flex-1">{f.name}</span>
                <PriceTag p={f.price} askPrice={c.askPrice} />
              </label>
            ))}
            {foodChoice?.perTable && (
              <div className="mt-2 flex flex-wrap items-center gap-3 px-1 text-sm">
                <span>{c.tablesLabel}</span>
                {/* 加減按鈕：手機上不用叫出鍵盤，也不會填成 0 */}
                <div className="flex items-center rounded-full ring-1 ring-brand-soft/70">
                  <button
                    type="button"
                    aria-label="減少一桌"
                    onClick={() => setTables((n) => Math.max(1, n - 1))}
                    disabled={tables <= 1}
                    className="grid size-10 place-items-center rounded-full text-lg text-brand disabled:opacity-30"
                  >
                    －
                  </button>
                  <span aria-live="polite" className="w-8 text-center font-semibold tabular-nums">
                    {tables}
                  </span>
                  <button
                    type="button"
                    aria-label="增加一桌"
                    onClick={() => setTables((n) => Math.min(30, n + 1))}
                    className="grid size-10 place-items-center rounded-full text-lg text-brand"
                  >
                    ＋
                  </button>
                </div>
                {foodChoice.seats && (
                  <span className="text-brand-ink/60">（{foodChoice.seats}）</span>
                )}
              </div>
            )}
          </Step>
        )}
      </div>

      {/* 總計：手機版固定在畫面下方，電腦版黏在右側 */}
      <aside className="sticky bottom-0 z-10 -mx-6 h-fit border-t border-brand-soft/50 bg-white/95 px-6 py-4 backdrop-blur lg:top-24 lg:mx-0 lg:rounded-3xl lg:border-0 lg:p-6 lg:shadow-md lg:ring-1 lg:ring-brand-soft/50">
        <ul className="hidden space-y-1.5 text-sm lg:block">
          {selected.map(({ option, qty }) => (
            <li key={option.id} className="flex justify-between gap-3">
              <span className="text-brand-ink/80">
                {option.name}
                {qty > 1 && ` × ${qty}`}
              </span>
              <span className="shrink-0">
                {option.price.amount === null
                  ? c.askPrice
                  : formatNT(option.price.amount * qty)}
              </span>
            </li>
          ))}
        </ul>
        <p className="flex items-baseline justify-between gap-3 lg:mt-4 lg:border-t lg:border-brand-soft/50 lg:pt-4">
          <span className="font-medium text-brand-ink">{c.totalLabel}</span>
          <span className="text-2xl font-semibold text-brand">
            {formatNT(total)}
            {isFrom && <span className="ml-1 text-sm font-normal">起</span>}
          </span>
        </p>
        {hasUnpriced && (
          <p className="text-right text-xs text-brand-ink/60">{c.partialNote}</p>
        )}
        <a
          href={lineChatHref(biz, lineMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-full bg-[#06c755] px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-[#06c755]/30"
        >
          {c.lineButton}
        </a>
        {c.note && (
          <p className="mt-3 hidden whitespace-pre-line text-xs leading-relaxed text-brand-ink/60 lg:block">
            {c.note}
          </p>
        )}
      </aside>
      {c.note && (
        <p className="whitespace-pre-line text-xs leading-relaxed text-brand-ink/60 lg:hidden">
          {c.note}
        </p>
      )}
    </div>
  );
};
