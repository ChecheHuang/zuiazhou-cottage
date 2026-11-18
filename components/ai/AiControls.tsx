"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/SiteContentProvider";
import { cn } from "@/lib/cn";
import { GeminiError, generateJson } from "@/lib/ai/gemini-client";
import { useGeminiKey } from "@/lib/ai/use-gemini-key";
import { aiSettings } from "@/lib/site-content/blocks/ai";

export type AiMode = "normal" | "ai";

// 一般版／AI 版切換；後台關閉 AI 功能時整個不顯示。
// 選 AI 版時旁邊多一個 ⚙️，API key 設定收在點開的小視窗裡，平常不佔版面；
// 沒有 key 時切到 AI 版會自動打開小視窗。
export const AiModeSwitch = ({
  mode,
  onChange,
  disabled,
  gemini,
  keyOpen,
  onKeyOpenChange,
}: {
  mode: AiMode;
  onChange: (mode: AiMode) => void;
  disabled?: boolean;
  gemini: ReturnType<typeof useGeminiKey>;
  keyOpen: boolean;
  onKeyOpenChange: (open: boolean) => void;
}) => {
  const c = useContent(aiSettings);
  if (!c.enabled) return null;
  const hasKey = gemini.key !== "";
  return (
    <div className="relative mx-auto flex items-center gap-1.5">
      <div
        role="radiogroup"
        className="inline-flex rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-brand-soft/60"
      >
        {(["normal", "ai"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            disabled={disabled}
            onClick={() => {
              onChange(m);
              if (m === "ai" && !hasKey) onKeyOpenChange(true);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed",
              mode === m
                ? "bg-brand-strong text-white shadow"
                : "text-brand hover:bg-brand-soft/30",
            )}
          >
            {m === "normal" ? c.modeNormal : c.modeAi}
          </button>
        ))}
      </div>
      {mode === "ai" && (
        <button
          type="button"
          aria-label={c.keyLabel}
          aria-haspopup="dialog"
          aria-expanded={keyOpen}
          title={c.keyLabel}
          disabled={disabled}
          onClick={() => onKeyOpenChange(!keyOpen)}
          className="relative grid size-9 place-items-center rounded-full bg-white/80 text-base shadow-sm ring-1 ring-brand-soft/60 transition-colors hover:bg-brand-soft/30 disabled:opacity-50"
        >
          <span aria-hidden>⚙️</span>
          {!hasKey && (
            <span
              aria-hidden
              className="absolute right-0 top-0 size-2.5 rounded-full bg-brand ring-2 ring-white"
            />
          )}
        </button>
      )}
      {mode === "ai" && keyOpen && (
        <KeyDialog gemini={gemini} onClose={() => onKeyOpenChange(false)} />
      )}
    </div>
  );
};

// key 設定小視窗：桌機在按鈕下方浮出，手機從底部滑出（跟日期選擇器一樣）
const KeyDialog = ({
  gemini,
  onClose,
}: {
  gemini: ReturnType<typeof useGeminiKey>;
  onClose: () => void;
}) => {
  const c = useContent(aiSettings);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element;
      // 點 ⚙️ 本身交給按鈕切換，不然會先關再開
      if (target.closest?.("[aria-haspopup=dialog]")) return;
      if (!ref.current?.contains(target)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-[60] bg-brand-ink/25 sm:hidden" />
      <div
        ref={ref}
        role="dialog"
        aria-label={c.keyLabel}
        className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl bg-white px-3 pb-5 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-full sm:mt-2 sm:w-[24rem] sm:-translate-x-1/2 sm:rounded-3xl sm:p-2 sm:shadow-[0_18px_40px_rgba(237,160,157,0.25)] sm:ring-1 sm:ring-brand-soft/60"
      >
        <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-brand-soft sm:hidden" />
        <GeminiKeyField gemini={gemini} />
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-strong px-6 py-1.5 text-sm font-medium text-white shadow-sm hover:scale-105"
          >
            完成
          </button>
        </div>
      </div>
    </>
  );
};

// 只露出末四碼，例如 ••••••••a1b2
const maskKey = (key: string) => `${"•".repeat(8)}${key.trim().slice(-4)}`;

// 輸入訪客自己的 Gemini API key（只存在瀏覽器）
export const GeminiKeyField = ({
  gemini,
}: {
  gemini: ReturnType<typeof useGeminiKey>;
}) => {
  const c = useContent(aiSettings);
  const [helpOpen, setHelpOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasKey = gemini.rawKey.trim() !== "";
  // 一開始沒有 key 就是輸入中；不然打第一個字就會切成遮罩
  const [editing, setEditing] = useState(!hasKey);
  // 沒有 key 或正在輸入／按了「修改」才顯示輸入框；其他時候只顯示遮罩後的純文字
  const showInput = !hasKey || editing;
  return (
    <div className="rounded-2xl bg-white/85 p-3 text-left">
      {/* 不做成密碼欄位（type="password" 或 CSS -webkit-text-security 遮罩都不行）：
          Chrome 會把它當成登入表單，之後每次換頁都跳「要儲存密碼嗎？」。
          輸入時是一般文字欄位，存好後只顯示「••••末四碼」的文字。 */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-brand">{c.keyLabel}</span>
        {showInput ? (
          <input
            type="text"
            name="gemini-api-key"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus
            data-1p-ignore
            data-lpignore="true"
            data-bwignore
            data-form-type="other"
            value={gemini.rawKey}
            onChange={(e) => gemini.setKey(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setEditing(false);
              }
            }}
            placeholder={c.keyPlaceholder}
            className="w-full rounded-full border border-brand-soft/70 bg-white px-4 py-2 font-mono text-sm text-brand-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft/40"
          />
        ) : (
          <span className="flex items-center gap-1 rounded-full border border-brand-soft/70 bg-white py-1 pl-4 pr-1">
            <span className="min-w-0 flex-1 truncate font-mono text-sm text-brand-ink">
              {revealed ? gemini.rawKey : maskKey(gemini.rawKey)}
            </span>
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? "隱藏 key" : "顯示 key"}
              aria-pressed={revealed}
              className="grid size-8 shrink-0 place-items-center rounded-full text-base hover:bg-brand-soft/30"
            >
              <span aria-hidden>{revealed ? "🙈" : "👁"}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs text-brand hover:bg-brand-soft/30"
            >
              修改
            </button>
          </span>
        )}
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
            className="inline-flex items-center gap-1 rounded-full bg-brand-strong px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-transform hover:scale-105"
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
