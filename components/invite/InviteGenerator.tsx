"use client";

import { useState } from "react";
import {
  AiModeSwitch,
  useAiGenerate,
  type AiMode,
} from "@/components/ai/AiControls";
import { useContent } from "@/components/SiteContentProvider";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { TimeSlots } from "@/components/ui/TimeSlots";
import { cn } from "@/lib/cn";
import { useGeminiKey } from "@/lib/ai/use-gemini-key";
import {
  INVITE_SCHEMA,
  PARTY_TYPES,
  TONES,
  fillInvite,
  formatDate,
  invitePrompt,
  parseInvite,
  templateInvite,
  type PartyType,
  type Tone,
} from "@/lib/invite/templates";
import { cleanBabyName, MAX_NAME_LENGTH } from "@/lib/play/items";
import { inviteForm } from "@/lib/site-content/blocks/invite";
import { playGame } from "@/lib/site-content/blocks/play";
import { siteBusiness } from "@/lib/site-content/blocks/site";

const Chips = <T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-brand">{label}</span>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm transition-colors",
            value === o
              ? "bg-brand text-white shadow"
              : "bg-white text-brand-ink ring-1 ring-brand-soft/60 hover:bg-brand-soft/30",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const inputClass =
  "w-full rounded-full border border-brand-soft/70 bg-white px-4 py-2 text-brand-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft/40";

export const InviteGenerator = () => {
  const c = useContent(inviteForm);
  const game = useContent(playGame);
  const biz = useContent(siteBusiness);
  const gemini = useGeminiKey();
  const ai = useAiGenerate();

  const venues = [
    game.themeGalaxy,
    game.themeForest,
    game.themeCream,
    game.themeFortune,
    c.venueOther,
  ];
  const [partyType, setPartyType] = useState<PartyType>("抓周派對");
  const [venue, setVenue] = useState(venues[0]);
  const [tone, setTone] = useState<Tone>("溫馨");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<AiMode>("normal");
  const [keyOpen, setKeyOpen] = useState(false);
  /** 產生出來、還沒填入名字日期的訊息（填入在顯示時做，改欄位不用重新產生） */
  const [draft, setDraft] = useState("");
  /** 一般版目前用的是哪種語氣的第幾份範本，「換一個寫法」時避開它 */
  const [variant, setVariant] = useState<{ tone: Tone; index: number } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const useAi = ai.enabled && mode === "ai";
  // 「其他／未定」時不寫店內場地名稱
  const venueText = venue === c.venueOther ? "（待定）" : `${biz.brand} ${venue}`;

  const applyTemplate = (input: Parameters<typeof templateInvite>[0]) => {
    const avoid = variant?.tone === input.tone ? variant.index : undefined;
    const { text, index } = templateInvite(input, avoid);
    setDraft(text);
    setVariant({ tone: input.tone, index });
  };

  const generate = async () => {
    setCopied(false);
    const input = { partyType, venue: venueText, tone };
    if (!useAi) {
      applyTemplate(input);
      return;
    }
    if (!gemini.key) {
      setKeyOpen(true);
      return;
    }
    const fromAi = await ai.run({
      apiKey: gemini.key,
      prompt: invitePrompt(input),
      schema: INVITE_SCHEMA,
      parse: parseInvite,
    });
    if (fromAi) setDraft(fromAi);
    else if (gemini.key) applyTemplate(input);
  };

  const footer =
    venue === c.venueOther
      ? ""
      : `\n\n${c.footerPrefix} ${biz.brand}｜${biz.address}${biz.landmark ? `（${biz.landmark}）` : ""}`;
  const message = draft
    ? fillInvite(draft, {
        name: cleanBabyName(name) || "寶貝",
        date: formatDate(date) || c.unsetValue,
        time: time || c.unsetValue,
      }) + footer
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      window.prompt(c.copyButton, message);
    }
  };

  return (
    <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
        className="flex flex-col gap-4 rounded-[2rem] bg-white/80 p-5 ring-1 ring-brand-soft/60 sm:p-6"
      >
        <Chips label={c.partyTypeLabel} options={PARTY_TYPES} value={partyType} onChange={setPartyType} />
        <Chips label={c.venueLabel} options={venues} value={venue} onChange={setVenue} />
        <Chips label={c.toneLabel} options={TONES} value={tone} onChange={setTone} />

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand">{c.nameLabel}</span>
          <input
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder={c.namePlaceholder}
            className={inputClass}
          />
        </label>
        <DatePickerField
          kind="event"
          label={c.dateLabel}
          value={date}
          onChange={setDate}
        />
        <TimeSlots
          label={c.timeLabel}
          hoursText={biz.hours}
          value={time}
          onChange={setTime}
        />

        <AiModeSwitch
          mode={mode}
          onChange={setMode}
          disabled={ai.busy}
          gemini={gemini}
          keyOpen={keyOpen}
          onKeyOpenChange={setKeyOpen}
        />

        <button
          type="submit"
          disabled={ai.busy}
          className="rounded-full bg-brand px-8 py-3 font-medium tracking-wider text-white shadow-lg shadow-brand/30 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {ai.busy ? ai.generatingText : draft ? c.regenerateButton : c.generateButton}
        </button>
        {ai.error && (
          <p role="alert" className="text-center text-sm text-red-500">
            {ai.error}
          </p>
        )}
      </form>

      <div className="flex flex-col gap-3 rounded-[2rem] bg-brand-beige/70 p-5 ring-1 ring-brand-soft/50 sm:p-6">
        <p className="font-medium text-brand">✉️ {c.resultTitle}</p>
        <div
          aria-live="polite"
          className="min-h-48 flex-1 whitespace-pre-wrap rounded-2xl bg-white p-4 text-[15px] leading-relaxed text-brand-ink shadow-sm"
        >
          {message || (
            <span className="text-brand-ink/40">
              {c.description}
            </span>
          )}
        </div>
        {message && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={copy}
              className="flex-1 rounded-full border border-brand-soft/70 bg-white px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand-soft/30"
            >
              {copied ? c.copied : c.copyButton}
            </button>
            <a
              href={`https://line.me/R/share?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-[#06c755] px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-[#06c755]/30"
            >
              {c.lineShareButton}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
