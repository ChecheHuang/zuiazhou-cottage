"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { resetContent, saveContent } from "@/app/admin/(panel)/content/actions";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/admin/upload-client";
import { cn } from "@/lib/cn";
import {
  emptyRecord,
  type ContentRecord,
  type ContentValue,
  type Field,
  type ListField,
} from "@/lib/site-content/schema";

type Status =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "saved" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-xl border border-brand-soft/50 bg-white px-3 py-2 text-[15px] text-brand-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";
const smallBtn =
  "rounded-md px-2 py-1 text-sm text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-30";

// 欄位變更一律用「更新函式」往上傳，最上層才套到 setDraft(prev => ...)。
// 圖片上傳要等好幾秒，若直接傳整份新值，會用上傳開始時的舊內容蓋掉這段時間的其他修改。
type Update<T> = (fn: (prev: T) => T) => void;

const move = <T,>(list: T[], index: number, delta: -1 | 1): T[] => {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

// ─── 單一欄位 ────────────────────────────────────────────────

const TextInput = ({
  value,
  onChange,
  multiline,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  label: string;
}) =>
  multiline ? (
    <textarea
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={Math.min(10, Math.max(3, value.split("\n").length + 1))}
      className={cn(inputClass, "leading-relaxed")}
    />
  ) : (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );

const useUploader = (folder: string) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const run = async (files: File[]) => {
    setUploading(true);
    setError(undefined);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadImage(folder, file));
      return urls;
    } catch (e) {
      setError(e instanceof Error ? `上傳失敗：${e.message}` : "上傳失敗");
      return [];
    } finally {
      setUploading(false);
    }
  };
  return { uploading, error, run };
};

const Thumb = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-beige">
    {src ? (
      <Image src={src} alt={alt} fill sizes="140px" className="object-cover" />
    ) : (
      <span className="absolute inset-0 grid place-items-center text-xs text-brand-ink/50">
        尚未上傳
      </span>
    )}
  </div>
);

const ImageInput = ({
  value,
  onChange,
  folder,
  label,
  optional,
}: {
  value: string;
  onChange: (v: string) => void;
  folder: string;
  label: string;
  optional?: boolean;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const { uploading, error, run } = useUploader(folder);
  return (
    <div className="flex items-end gap-3">
      <div className="w-28">
        <Thumb src={value} alt={label} />
      </div>
      <div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => input.current?.click()}
          className="rounded-full border border-brand-soft/60 px-3 py-1.5 text-sm text-brand-ink hover:bg-brand-soft/30 disabled:opacity-50"
        >
          {uploading ? "上傳中…" : value ? "更換圖片" : "上傳圖片"}
        </button>
        {optional && value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-2 rounded-full px-3 py-1.5 text-sm text-brand-ink/60 hover:bg-brand-ink/5"
          >
            移除圖片
          </button>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <input
        ref={input}
        type="file"
        accept={IMAGE_ACCEPT}
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const [url] = await run([file]);
          if (url) onChange(url);
        }}
      />
    </div>
  );
};

export const ImagesInput = ({
  value,
  onChange,
  folder,
  label,
}: {
  value: string[];
  onChange: Update<string[]>;
  folder: string;
  label: string;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const { uploading, error, run } = useUploader(folder);
  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {value.map((src, i) => (
          <li key={`${i}-${src}`}>
            <Thumb src={src} alt={`${label} 第 ${i + 1} 張`} />
            <div className="mt-1 flex justify-between">
              <span>
                <button
                  type="button"
                  aria-label="往前移"
                  disabled={i === 0}
                  onClick={() => onChange((prev) => move(prev, i, -1))}
                  className={smallBtn}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="往後移"
                  disabled={i === value.length - 1}
                  onClick={() => onChange((prev) => move(prev, i, 1))}
                  className={smallBtn}
                >
                  →
                </button>
              </span>
              <button
                type="button"
                aria-label="移除"
                onClick={() =>
                  onChange((prev) => prev.filter((_, j) => j !== i))
                }
                className={cn(smallBtn, "text-red-600")}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        className="mt-2 rounded-full border border-brand-soft/60 px-3 py-1.5 text-sm text-brand-ink hover:bg-brand-soft/30 disabled:opacity-50"
      >
        {uploading ? "上傳中…" : "＋ 新增圖片"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input
        ref={input}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        hidden
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length === 0) return;
          const urls = await run(files);
          if (urls.length) onChange((prev) => [...prev, ...urls]);
        }}
      />
    </div>
  );
};

const TextListInput = ({
  field,
  value,
  onChange,
}: {
  field: ListField;
  value: string[];
  onChange: (v: string[]) => void;
}) => (
  <div className="space-y-2">
    {value.map((item, i) => (
      <div key={i} className="flex items-start gap-1">
        <span className="mt-2 w-6 shrink-0 text-right text-xs text-brand-ink/50">
          {i + 1}.
        </span>
        <div className="flex-1">
          <TextInput
            label={`${field.label} 第 ${i + 1} 項`}
            value={item}
            multiline={field.multiline}
            onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
          />
        </div>
        <button
          type="button"
          aria-label="往上移"
          disabled={i === 0}
          onClick={() => onChange(move(value, i, -1))}
          className={smallBtn}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label="往下移"
          disabled={i === value.length - 1}
          onClick={() => onChange(move(value, i, 1))}
          className={smallBtn}
        >
          ↓
        </button>
        <button
          type="button"
          aria-label="刪除"
          onClick={() => onChange(value.filter((_, j) => j !== i))}
          className={cn(smallBtn, "text-red-600")}
        >
          ✕
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => onChange([...value, ""])}
      className="ml-7 rounded-full border border-dashed border-brand-soft px-3 py-1 text-sm text-brand-ink/80 hover:bg-brand-soft/20"
    >
      ＋ 新增{field.itemLabel ?? "一項"}
    </button>
  </div>
);

const recordTitle = (
  fields: Field[],
  item: ContentRecord,
  titleKey?: string,
) => {
  const key =
    titleKey ?? fields.find((f) => f.type === "text")?.key ?? fields[0]?.key;
  const v = key ? item[key] : undefined;
  return typeof v === "string" && v.trim()
    ? v.trim().slice(0, 40)
    : "（未命名）";
};

const RecordListInput = ({
  field,
  fields,
  value,
  onChange,
  folder,
}: {
  field: ListField;
  fields: Field[];
  value: ContentRecord[];
  onChange: Update<ContentRecord[]>;
  folder: string;
}) => (
  <div className="space-y-2">
    {value.map((item, i) => (
      <details
        key={i}
        className="group rounded-xl border border-brand-soft/40 bg-brand-beige/30"
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2">
          <span className="text-xs text-brand-ink/50 transition group-open:rotate-90">
            ▶
          </span>
          <span className="flex-1 truncate text-sm font-medium text-brand-ink">
            {i + 1}. {recordTitle(fields, item, field.titleKey)}
          </span>
          <button
            type="button"
            aria-label="往上移"
            disabled={i === 0}
            onClick={(e) => {
              e.preventDefault();
              onChange((prev) => move(prev, i, -1));
            }}
            className={smallBtn}
          >
            ↑
          </button>
          <button
            type="button"
            aria-label="往下移"
            disabled={i === value.length - 1}
            onClick={(e) => {
              e.preventDefault();
              onChange((prev) => move(prev, i, 1));
            }}
            className={smallBtn}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm(`確定要刪除第 ${i + 1} 項嗎？`)) {
                onChange((prev) => prev.filter((_, j) => j !== i));
              }
            }}
            className={cn(smallBtn, "text-red-600")}
          >
            刪除
          </button>
        </summary>
        <div className="space-y-4 border-t border-brand-soft/30 px-3 py-3">
          <FieldsEditor
            fields={fields}
            value={item}
            onChange={(fn) =>
              onChange((prev) => prev.map((x, j) => (j === i ? fn(x) : x)))
            }
            folder={folder}
          />
        </div>
      </details>
    ))}
    <button
      type="button"
      onClick={() => onChange((prev) => [...prev, emptyRecord(fields)])}
      className="rounded-full border border-dashed border-brand-soft px-3 py-1 text-sm text-brand-ink/80 hover:bg-brand-soft/20"
    >
      ＋ 新增{field.itemLabel ?? "一項"}
    </button>
  </div>
);

const ToggleInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={value}
    aria-label={label}
    onClick={() => onChange(!value)}
    className="inline-flex items-center gap-3 text-sm text-brand-ink"
  >
    <span
      className={`relative h-6 w-11 rounded-full transition-colors ${
        value ? "bg-brand" : "bg-brand-ink/20"
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
          value ? "left-[22px]" : "left-0.5"
        }`}
      />
    </span>
    {value ? "顯示" : "隱藏"}
  </button>
);

const FieldEditor = ({
  field,
  value,
  onChange,
  folder,
}: {
  field: Field;
  value: ContentValue | undefined;
  onChange: Update<ContentValue | undefined>;
  folder: string;
}) => {
  const set = (v: ContentValue) => onChange(() => v);
  // 陣列欄位：把子元件的更新函式套在「最新的值」上
  const updateArray =
    <T,>() =>
    (fn: (prev: T[]) => T[]) =>
      onChange((prev) => fn(Array.isArray(prev) ? (prev as T[]) : []) as ContentValue);
  const body = (() => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            label={field.label}
            value={typeof value === "string" ? value : ""}
            multiline={field.multiline}
            onChange={set}
          />
        );
      case "image":
        return (
          <ImageInput
            label={field.label}
            value={typeof value === "string" ? value : ""}
            onChange={set}
            folder={folder}
            optional={field.optional}
          />
        );
      case "images":
        return (
          <ImagesInput
            label={field.label}
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={updateArray<string>()}
            folder={folder}
          />
        );
      case "toggle":
        return (
          <ToggleInput
            label={field.label}
            value={value === true}
            onChange={set}
          />
        );
      case "list":
        return field.of === "text" ? (
          <TextListInput
            field={field}
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={set}
          />
        ) : (
          <RecordListInput
            field={field}
            fields={field.of}
            value={Array.isArray(value) ? (value as ContentRecord[]) : []}
            onChange={updateArray<ContentRecord>()}
            folder={folder}
          />
        );
    }
  })();

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-brand-ink">{field.label}</p>
      {field.hint && (
        <p className="-mt-1 mb-1.5 text-xs text-brand-ink/55">{field.hint}</p>
      )}
      {body}
    </div>
  );
};

const FieldsEditor = ({
  fields,
  value,
  onChange,
  folder,
}: {
  fields: Field[];
  value: ContentRecord;
  onChange: Update<ContentRecord>;
  folder: string;
}) => (
  <>
    {fields.map((field) => (
      <FieldEditor
        key={field.key}
        field={field}
        value={value[field.key]}
        onChange={(fn) =>
          onChange((prev) => {
            const next = fn(prev[field.key]);
            return next === undefined ? prev : { ...prev, [field.key]: next };
          })
        }
        folder={folder}
      />
    ))}
  </>
);

// ─── 區塊 ───────────────────────────────────────────────────

interface ContentEditorProps {
  blockKey: string;
  label: string;
  description?: string;
  fields: Field[];
  defaults: ContentRecord;
  initialValue: ContentRecord;
  initialIsCustom: boolean;
}

export const ContentEditor = ({
  blockKey,
  label,
  description,
  fields,
  defaults,
  initialValue,
  initialIsCustom,
}: ContentEditorProps) => {
  const [saved, setSaved] = useState(initialValue);
  const [draft, setDraft] = useState(initialValue);
  const [isCustom, setIsCustom] = useState(initialIsCustom);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const busy = status.kind === "busy";

  // 有未儲存的修改時，離開頁面前提醒
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onSave = async () => {
    setStatus({ kind: "busy", message: "儲存中…" });
    const result = await saveContent(blockKey, draft);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setSaved(draft);
    setIsCustom(JSON.stringify(draft) !== JSON.stringify(defaults));
    setStatus({ kind: "saved" });
  };

  const onReset = async () => {
    if (!window.confirm(`確定要把「${label}」恢復成預設內容嗎？`)) return;
    setStatus({ kind: "busy", message: "恢復預設中…" });
    const result = await resetContent(blockKey);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setSaved(defaults);
    setDraft(defaults);
    setIsCustom(false);
    setStatus({ kind: "saved" });
  };

  return (
    <article className="rounded-2xl border border-brand-soft/40 bg-white p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex flex-wrap items-center gap-2 font-semibold text-brand-ink">
            {label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-normal",
                isCustom
                  ? "bg-brand/10 text-brand"
                  : "bg-brand-ink/5 text-brand-ink/60",
              )}
            >
              {isCustom ? "已自訂" : "預設"}
            </span>
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-normal text-amber-800">
                未儲存
              </span>
            )}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-brand-ink/60">{description}</p>
          )}
        </div>
      </header>

      <div className="mt-5 space-y-5">
        <FieldsEditor
          fields={fields}
          value={draft}
          onChange={setDraft}
          folder={`content-${blockKey}`}
        />
      </div>

      <footer className="sticky bottom-0 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-brand-soft/30 bg-white/95 px-4 pb-1 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
        <p
          aria-live="polite"
          className={cn(
            "text-sm",
            status.kind === "error" ? "text-red-600" : "text-brand-ink/60",
          )}
        >
          {status.kind === "busy" && status.message}
          {status.kind === "saved" && !dirty && "已儲存，網站已更新"}
          {status.kind === "error" && status.message}
        </p>
        <div className="flex gap-2">
          {isCustom && (
            <button
              type="button"
              onClick={onReset}
              disabled={busy}
              className="rounded-full px-4 py-2 text-sm text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-50"
            >
              恢復預設
            </button>
          )}
          {dirty && (
            <button
              type="button"
              onClick={() => {
                setDraft(saved);
                setStatus({ kind: "idle" });
              }}
              disabled={busy}
              className="rounded-full border border-brand-soft/60 px-4 py-2 text-sm text-brand-ink hover:bg-brand-soft/30 disabled:opacity-50"
            >
              取消修改
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={busy || !dirty}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            儲存
          </button>
        </div>
      </footer>
    </article>
  );
};
