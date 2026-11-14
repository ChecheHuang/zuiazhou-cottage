"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  resetSlotImages,
  saveSlotImages,
  type SaveResult,
} from "@/app/admin/(panel)/actions";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/admin/upload-client";
import { cn } from "@/lib/cn";

interface SlotEditorProps {
  slotKey: string;
  label: string;
  hint?: string;
  multiple: boolean;
  defaults: string[];
  initialImages: string[];
  initialIsCustom: boolean;
}

type Status =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "saved" }
  | { kind: "error"; message: string };

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export const SlotEditor = ({
  slotKey,
  label,
  hint,
  multiple,
  defaults,
  initialImages,
  initialIsCustom,
}: SlotEditorProps) => {
  const [images, setImages] = useState(initialImages);
  const [isCustom, setIsCustom] = useState(initialIsCustom);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const fileInput = useRef<HTMLInputElement>(null);
  const busy = status.kind === "busy";

  const commit = async (
    next: string[],
    run: () => Promise<SaveResult>,
    message = "儲存中…",
  ) => {
    const previous = images;
    const previousCustom = isCustom;
    setImages(next);
    setStatus({ kind: "busy", message });
    const result = await run();
    if (result.ok) {
      setIsCustom(!sameList(next, defaults));
      setStatus({ kind: "saved" });
      return;
    }
    setImages(previous);
    setIsCustom(previousCustom);
    setStatus({ kind: "error", message: result.error });
  };

  const save = (next: string[]) =>
    commit(next, () => saveSlotImages(slotKey, next));

  const onFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (fileInput.current) fileInput.current.value = "";
    if (files.length === 0) return;

    try {
      const urls: string[] = [];
      for (const [i, file] of files.entries()) {
        setStatus({
          kind: "busy",
          message: `上傳中 ${i + 1}/${files.length}…`,
        });
        urls.push(await uploadImage(slotKey, file));
      }
      await save(multiple ? [...images, ...urls] : [urls[0]]);
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? `上傳失敗：${error.message}`
            : "上傳失敗，請再試一次",
      });
    }
  };

  const remove = (index: number) => {
    if (!window.confirm("確定要移除這張照片嗎？")) return;
    void save(images.filter((_, i) => i !== index));
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    void save(next);
  };

  const reset = () => {
    if (!window.confirm("確定要恢復成預設照片嗎？已上傳的照片會被刪除。")) {
      return;
    }
    void commit(defaults, () => resetSlotImages(slotKey), "恢復預設中…");
  };

  return (
    <article className="rounded-2xl border border-brand-soft/40 bg-white p-4 shadow-sm sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex flex-wrap items-center gap-2 font-medium text-brand-ink">
            {label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                isCustom
                  ? "bg-brand/10 text-brand"
                  : "bg-brand-ink/5 text-brand-ink/60",
              )}
            >
              {isCustom ? "已自訂" : "預設"}
            </span>
            <span className="text-xs text-brand-ink/50">
              {multiple ? `${images.length} 張` : "單張"}
            </span>
          </h3>
          {hint && <p className="mt-1 text-xs text-brand-ink/60">{hint}</p>}
        </div>
        <div className="flex items-center gap-2">
          {isCustom && (
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="rounded-full px-3 py-1.5 text-sm text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-50"
            >
              恢復預設
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {multiple ? "新增照片" : "更換照片"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept={IMAGE_ACCEPT}
            multiple={multiple}
            hidden
            onChange={(e) => void onFiles(e.target.files)}
          />
        </div>
      </header>

      <ul
        className={cn(
          "mt-4 grid gap-3",
          multiple
            ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {images.map((src, i) => (
          <li key={`${i}-${src}`} className="group">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-beige">
              <Image
                src={src}
                alt={`${label} 第 ${i + 1} 張`}
                fill
                sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 50vw"
                className="object-cover"
              />
              {multiple && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white">
                  {i + 1}
                </span>
              )}
            </div>
            {multiple && (
              <div className="mt-1.5 flex items-center justify-between text-sm">
                <div className="flex">
                  <button
                    type="button"
                    aria-label="往前移"
                    onClick={() => move(i, -1)}
                    disabled={busy || i === 0}
                    className="rounded-md px-2 py-1 text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="往後移"
                    onClick={() => move(i, 1)}
                    disabled={busy || i === images.length - 1}
                    className="rounded-md px-2 py-1 text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={busy || images.length <= 1}
                  className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-30"
                >
                  移除
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p
        aria-live="polite"
        className={cn(
          "mt-3 min-h-5 text-sm",
          status.kind === "error" ? "text-red-600" : "text-brand-ink/60",
        )}
      >
        {status.kind === "busy" && status.message}
        {status.kind === "saved" && "已儲存，網站已更新"}
        {status.kind === "error" && status.message}
      </p>
    </article>
  );
};
