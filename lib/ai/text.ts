// 整理 AI 回傳的文字（前後台共用）。

/** AI 有時會把換行寫成字面上的「\n」兩個字元，而不是真正的換行，這裡統一轉換 */
export const normalizeAiText = (text: string) =>
  text
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const isAsciiWord = (ch: string | undefined) => !!ch && /[A-Za-z0-9]/.test(ch);

/**
 * 把 {name} 這類預留位置換成實際內容。
 * AI 常在預留位置前後加半形空格（「參與 {name} 的派對」），
 * 旁邊是中文或標點時去掉空格；旁邊是英數字時保留。
 */
export const fillPlaceholders = (
  text: string,
  values: Record<string, string>,
) =>
  Object.entries(values).reduce(
    (acc, [key, value]) =>
      acc.replace(
        new RegExp(`( ?)\\{${key}\\}( ?)`, "g"),
        (match: string, pre: string, post: string, offset: number, whole: string) => {
          const before = whole[offset - 1];
          const after = whole[offset + match.length];
          return `${pre && isAsciiWord(before) ? " " : ""}${value}${post && isAsciiWord(after) ? " " : ""}`;
        },
      ),
    text,
  );
