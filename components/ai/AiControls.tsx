"use client";

import { useState } from "react";
import { useContent } from "@/components/SiteContentProvider";
import { cn } from "@/lib/cn";
import { GeminiError, generateJson } from "@/lib/ai/gemini-client";
import { useGeminiKey } from "@/lib/ai/use-gemini-key";
import { aiSettings } from "@/lib/site-content/blocks/ai";

export type AiMode = "normal" | "ai";

// 一般版／AI 版切換；後台關閉 AI 功能時整個不顯示
export const AiModeSwitch = ({
  mode,
  onChange,
  disabled,
}: {
  mode: AiMode;
  onChange: (mode: AiMode) => void;
  disabled?: boolean;
}) => {
  const c = useContent(aiSettings);
  if (!c.enabled) return null;
  return (
    <div
      role="radiogroup"
      className="mx-auto inline-flex rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-brand-soft/60"
    >
      {(["normal", "ai"] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          disabled={disabled}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed",
            mode === m
              ? "bg-brand text-white shadow"
              : "text-brand hover:bg-brand-soft/30",
          )}
        >
          {m === "normal" ? c.modeNormal : c.modeAi}
        </button>
      ))}
    </div>
  );
};

// 輸入訪客自己的 Gemini API key（只存在瀏覽器）
export const GeminiKeyField = ({
  gemini,
}: {
  gemini: ReturnType<typeof useGeminiKey>;
}) => {
  const c = useContent(aiSettings);
  const [helpOpen, setHelpOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-2xl bg-white/85 p-4 text-left ring-1 ring-brand-soft/60">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-brand">{c.keyLabel}</span>
        <span className="relative">
          {/* 不用 type="password"：瀏覽器會把它當登入表單，每次送出都跳「要儲存密碼嗎？」。
              改用一般文字欄位＋CSS 遮罩成圓點，並請密碼管理器忽略這個欄位。 */}
          <input
            type="text"
            name="gemini-api-key"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            data-bwignore
            data-form-type="other"
            value={gemini.rawKey}
            onChange={(e) => gemini.setKey(e.target.value)}
            placeholder={c.keyPlaceholder}
            className={cn(
              !revealed && "[-webkit-text-security:disc]",
              "w-full rounded-full border border-brand-soft/70 bg-white py-2 pl-4 pr-11 font-mono text-sm text-brand-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft/40",
            )}
          />
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "隱藏 key" : "顯示 key"}
            aria-pressed={revealed}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-base hover:bg-brand-soft/30"
          >
            <span aria-hidden>{revealed ? "🙈" : "👁"}</span>
          </button>
        </span>
      </label>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-ink/70">
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={gemini.remember}
            onChange={(e) => gemini.setRemember(e.target.checked)}
            className="accent-brand"
          />
          {c.rememberLabel}
        </label>
        {gemini.rawKey && (
          <button
            type="button"
            onClick={gemini.clear}
            className="text-brand underline-offset-2 hover:underline"
          >
            {c.clearKey}
          </button>
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-brand-ink/60">
        🔒 {c.keyPrivacy}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        {/^https:\/\//.test(c.keyHelpUrl) && (
          <a
            href={c.keyHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-brand px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-transform hover:scale-105"
          >
            🔑 {c.keyHelpLinkText}
            <span aria-hidden>↗</span>
          </a>
        )}
        <button
          type="button"
          aria-expanded={helpOpen}
          onClick={() => setHelpOpen((v) => !v)}
          className="text-xs font-medium text-brand underline-offset-2 hover:underline"
        >
          {helpOpen ? "▾" : "▸"} {c.keyHelpTitle}
        </button>
      </div>
      {helpOpen && (
        <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-xs leading-relaxed text-brand-ink/75">
          {c.keyHelpSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
};

// 呼叫 AI；失敗時回傳給畫面顯示的錯誤訊息（由呼叫端決定是否退回一般版）
export const useAiGenerate = () => {
  const c = useContent(aiSettings);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async <T,>(opts: {
    apiKey: string;
    prompt: string;
    schema: object;
    parse: (value: unknown) => T | null;
  }): Promise<T | null> => {
    setError("");
    if (!opts.apiKey) {
      setError(c.errorNoKey);
      return null;
    }
    setBusy(true);
    try {
      const value = await generateJson({
        apiKey: opts.apiKey,
        model: c.model,
        prompt: opts.prompt,
        schema: opts.schema,
      });
      const parsed = opts.parse(value);
      if (!parsed) setError(c.errorGeneric);
      return parsed;
    } catch (e) {
      const kind = e instanceof GeminiError ? e.kind : "network";
      setError(
        kind === "invalid-key"
          ? c.errorInvalidKey
          : kind === "quota"
            ? c.errorQuota
            : kind === "model"
              ? c.errorModel
              : c.errorGeneric,
      );
      return null;
    } finally {
      setBusy(false);
    }
  };

  return { run, busy, error, generatingText: c.generating, enabled: c.enabled };
};
