"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AiModeSwitch,
  useAiGenerate,
  type AiMode,
} from "@/components/ai/AiControls";
import { useContent } from "@/components/SiteContentProvider";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { useGeminiKey } from "@/lib/ai/use-gemini-key";
import {
  FORTUNE_SCHEMA,
  fillName,
  fortunePrompt,
  parseBirthday,
  parseFortune,
  signOf,
  templateFortune,
  zodiacOf,
  type FortuneSections,
} from "@/lib/play/fortune";
import type { PlayItem } from "@/lib/play/items";
import { playFortune } from "@/lib/site-content/blocks/play";
import { ZhuazhouItemIcon } from "@/components/ZhuazhouItemIcon";

interface Fortune {
  zodiac: string;
  sign: string;
  sections: FortuneSections;
}

// 抓周結果下方的命盤小卡（直接展開，不用先點按鈕）。
// 一般版選完生日就出結果；AI 版要按按鈕才送出，避免一選日期就用掉訪客的 key 額度。
// 生日只在瀏覽器裡換算成生肖與星座，不會送出。
export const FortunePanel = ({
  item,
  babyName,
}: {
  item: PlayItem;
  babyName: string;
}) => {
  const c = useContent(playFortune);
  const gemini = useGeminiKey();
  const ai = useAiGenerate();
  const [birthday, setBirthday] = useState("");
  const [mode, setMode] = useState<AiMode>("normal");
  const [keyOpen, setKeyOpen] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [copied, setCopied] = useState(false);

  const useAi = ai.enabled && mode === "ai";
  const date = parseBirthday(birthday);
  const title = c.title.replaceAll("{name}", babyName);

  const generate = async (value: string, withAi: boolean) => {
    const d = parseBirthday(value);
    if (!d) return;
    if (withAi && !gemini.key) {
      setKeyOpen(true);
      return;
    }
    const zodiac = zodiacOf(d.year, d.month, d.day);
    const sign = signOf(d.month, d.day);
    setCopied(false);
    const fromAi = withAi
      ? await ai.run({
          apiKey: gemini.key,
          prompt: fortunePrompt(zodiac, sign, item),
          schema: FORTUNE_SCHEMA,
          parse: parseFortune,
        })
      : null;
    // AI 失敗（或沒選 AI）就用一般版，畫面不會空白
    const sections = fromAi ?? templateFortune(zodiac, sign, item);
    setFortune({ zodiac, sign, sections: fillName(sections, babyName) });
  };

  const copy = async () => {
    if (!fortune) return;
    const text = [
      `${title}（屬${fortune.zodiac}・${fortune.sign}・抓到${item.name}${item.emoji}）`,
      `${c.personality}：${fortune.sections.personality}`,
      `${c.talent}：${fortune.sections.talent}`,
      `${c.blessing}：${fortune.sections.blessing}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      window.prompt(c.copyButton, text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-[2rem] bg-gradient-to-b from-brand-beige to-white p-5 ring-1 ring-brand-soft/60 sm:p-7"
    >
      <h3 className="text-center text-xl font-semibold tracking-wide text-brand">
        🔮 {title}
      </h3>
      {c.intro && (
        <p className="mt-1.5 text-center text-sm text-brand-ink/70">{c.intro}</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate(birthday, useAi);
        }}
        className="mt-4 flex flex-col gap-3"
      >
        <div className="mx-auto w-full max-w-xs">
          <DatePickerField
            kind="birthday"
            label={c.birthdayLabel}
            value={birthday}
            onChange={(value) => {
              setBirthday(value);
              // 一般版選完就出結果
              if (!useAi) generate(value, false);
            }}
            disabled={ai.busy}
          />
        </div>

        <AiModeSwitch
          mode={mode}
          onChange={(m) => {
            setMode(m);
            // 從 AI 版切回一般版時，已選好生日就直接出結果
            if (m === "normal" && !fortune) generate(birthday, false);
          }}
          disabled={ai.busy}
          gemini={gemini}
          keyOpen={keyOpen}
          onKeyOpenChange={setKeyOpen}
        />

        {useAi && (
          <button
            type="submit"
            disabled={!date || ai.busy}
            className="mx-auto rounded-full bg-brand px-8 py-2.5 font-medium text-white shadow-lg shadow-brand/30 transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
          >
            {ai.busy ? ai.generatingText : c.generateButton}
          </button>
        )}
        {ai.error && (
          <p role="alert" className="text-center text-sm text-red-500">
            {ai.error}
          </p>
        )}
      </form>

      <AnimatePresence mode="wait">
        {fortune && (
          <motion.div
            key={`${fortune.zodiac}-${fortune.sign}-${fortune.sections.blessing}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-3xl bg-white p-5 shadow-[0_12px_30px_rgba(237,160,157,0.15)]"
          >
            <p className="text-center text-sm tracking-wider text-brand-accent">
              屬{fortune.zodiac} ・ {fortune.sign} ・ 抓到{item.name}
              <ZhuazhouItemIcon item={item} className="ml-0.5" />
            </p>
            {(
              [
                [c.personality, fortune.sections.personality],
                [c.talent, fortune.sections.talent],
                [c.blessing, fortune.sections.blessing],
              ] as const
            ).map(([label, text]) => (
              <div key={label} className="mt-4">
                <p className="font-medium text-brand">{label}</p>
                <p className="mt-1 leading-relaxed text-brand-ink/85">{text}</p>
              </div>
            ))}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-brand-soft/70 px-5 py-2 text-sm text-brand hover:bg-brand-soft/30"
              >
                {copied ? c.copied : c.copyButton}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 text-center text-xs text-brand-ink/50">{c.disclaimer}</p>
    </motion.div>
  );
};
