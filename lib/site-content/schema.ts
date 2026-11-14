import { isAllowedImageUrl } from "@/lib/site-images/urls";

// ─── 欄位定義 ────────────────────────────────────────────────
// 後台表單會依照這些定義自動產生，前台用 useContent / getContent 讀取。
//
// 欄位型別與值：
//   text   → string            （multiline: true 會顯示多行輸入框）
//   image  → string            （圖片網址，後台可上傳）
//   images → string[]          （一組圖片，後台可新增、移除、排序）
//   toggle → boolean           （開關，例如選單項目要不要顯示）
//   list   → string[]          （of: "text"，文字清單）
//          → Record<string, …>[]（of: Field[]，每一項是一組欄位）

interface BaseField {
  key: string;
  label: string;
  hint?: string;
}

export interface TextField extends BaseField {
  type: "text";
  multiline?: boolean;
}

export interface ImageField extends BaseField {
  type: "image";
}

export interface ImagesField extends BaseField {
  type: "images";
}

export interface ToggleField extends BaseField {
  type: "toggle";
}

export interface ListField extends BaseField {
  type: "list";
  of: "text" | Field[];
  /** 清單每一項的名稱，例如「題目」「方案」，用在「新增題目」按鈕 */
  itemLabel?: string;
  /** of: "text" 時是否用多行輸入框 */
  multiline?: boolean;
  /** of: Field[] 時，用哪個欄位當作卡片標題 */
  titleKey?: string;
}

export type Field =
  | TextField
  | ImageField
  | ImagesField
  | ToggleField
  | ListField;

export type ContentValue =
  | string
  | boolean
  | string[]
  | ContentRecord[]
  | ContentRecord;
export type ContentRecord = { [key: string]: ContentValue };

export interface ContentBlock<T extends ContentRecord = ContentRecord> {
  readonly __block: true;
  key: string;
  page: string;
  label: string;
  description?: string;
  fields: Field[];
  defaults: T;
}

// 記錄定義順序，後台依檔案裡由上而下的順序顯示
// （import * as 取得的 export 會被依字母排序，不能拿來決定順序）
let definitionCounter = 0;
const blockOrder = new WeakMap<ContentBlock, number>();
export const getBlockOrder = (block: ContentBlock) =>
  blockOrder.get(block) ?? Number.MAX_SAFE_INTEGER;

// 用法：export const homeAbout = defineBlock({ key, page, label, fields, defaults })
// defaults 的型別會被保留，useContent(homeAbout) 回傳同樣的型別。
export const defineBlock = <T extends ContentRecord>(
  def: Omit<ContentBlock<T>, "__block">,
): ContentBlock<T> => {
  const block: ContentBlock<T> = { __block: true, ...def };
  blockOrder.set(block as unknown as ContentBlock, definitionCounter++);
  return block;
};

export const isContentBlock = (v: unknown): v is ContentBlock =>
  typeof v === "object" && v !== null && "__block" in v;

// ─── 驗證 ────────────────────────────────────────────────────
const MAX_TEXT = 5000;
const MAX_ITEMS = 100;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const validateField = (
  field: Field,
  value: unknown,
  path: string,
): Result<ContentValue> => {
  const where = `${path}${field.label}`;
  switch (field.type) {
    case "text":
      if (typeof value !== "string")
        return { ok: false, error: `${where}：必須是文字` };
      if (value.length > MAX_TEXT)
        return { ok: false, error: `${where}：文字太長` };
      return { ok: true, value };
    case "image":
      if (typeof value !== "string" || !isAllowedImageUrl(value)) {
        return { ok: false, error: `${where}：請上傳圖片` };
      }
      return { ok: true, value };
    case "toggle":
      if (typeof value !== "boolean")
        return { ok: false, error: `${where}：必須是開或關` };
      return { ok: true, value };
    case "images":
      if (!Array.isArray(value) || value.length === 0) {
        return { ok: false, error: `${where}：至少需要 1 張圖片` };
      }
      if (value.length > MAX_ITEMS)
        return { ok: false, error: `${where}：圖片太多` };
      if (!value.every((v) => typeof v === "string" && isAllowedImageUrl(v))) {
        return { ok: false, error: `${where}：圖片網址不合法` };
      }
      return { ok: true, value: value as string[] };
    case "list": {
      if (!Array.isArray(value))
        return { ok: false, error: `${where}：必須是清單` };
      if (value.length > MAX_ITEMS)
        return { ok: false, error: `${where}：項目太多` };
      if (field.of === "text") {
        if (
          !value.every((v) => typeof v === "string" && v.length <= MAX_TEXT)
        ) {
          return { ok: false, error: `${where}：清單內容必須是文字` };
        }
        return { ok: true, value: value as string[] };
      }
      const items: ContentRecord[] = [];
      for (const [i, item] of value.entries()) {
        const r = validateRecord(field.of, item, `${where} 第 ${i + 1} 項 › `);
        if (!r.ok) return r;
        items.push(r.value);
      }
      return { ok: true, value: items };
    }
  }
};

const validateRecord = (
  fields: Field[],
  value: unknown,
  path = "",
): Result<ContentRecord> => {
  if (!isRecord(value)) return { ok: false, error: `${path}資料格式錯誤` };
  const out: ContentRecord = {};
  for (const field of fields) {
    const r = validateField(field, value[field.key], path);
    if (!r.ok) return r;
    out[field.key] = r.value;
  }
  return { ok: true, value: out };
};

// 後台存檔前驗證整個區塊；只保留有定義的欄位
export const validateBlockValue = (block: ContentBlock, value: unknown) =>
  validateRecord(block.fields, value);

// 讀取時合併：存的值每個欄位個別驗證，不合格（例如改版後欄位變了）就用預設
export const mergeBlockValue = <T extends ContentRecord>(
  block: ContentBlock<T>,
  stored: unknown,
): T => {
  if (!isRecord(stored)) return block.defaults;
  const merged: ContentRecord = { ...block.defaults };
  for (const field of block.fields) {
    if (!(field.key in stored)) continue;
    const r = validateField(field, stored[field.key], "");
    if (r.ok) merged[field.key] = r.value;
  }
  return merged as T;
};

// 新增清單項目時的空白值
export const emptyRecord = (fields: Field[]): ContentRecord =>
  Object.fromEntries(
    fields.map((f) => [
      f.key,
      f.type === "images" || f.type === "list"
        ? []
        : f.type === "toggle"
          ? false
          : "",
    ]),
  );

// 收集區塊內所有圖片網址（用來清理不再使用的 Blob 檔案）
export const collectImageUrls = (fields: Field[], value: unknown): string[] => {
  if (!isRecord(value)) return [];
  return fields.flatMap((field) => {
    const v = value[field.key];
    if (field.type === "image") return typeof v === "string" ? [v] : [];
    if (field.type === "images") {
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    }
    if (field.type === "list" && field.of !== "text" && Array.isArray(v)) {
      const sub = field.of;
      return v.flatMap((item) => collectImageUrls(sub, item));
    }
    return [];
  });
};
