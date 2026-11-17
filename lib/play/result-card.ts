// 「存成圖片」用的直式結果卡（1080×1920，適合手機相簿與 IG 限動）。
// 在瀏覽器用 canvas 畫：寶寶小名不會送到任何伺服器或字型服務。

import type { PlayItem } from "./items";

export interface ResultCardInput {
  /** 例如「小湯圓抓到了算盤！」 */
  title: string;
  item: PlayItem;
  blessing: string;
  /** 例如「有 8% 的寶寶也抓到算盤」，沒有就不畫 */
  statsLine?: string;
  /** 結果卡上穿著衣服的寶寶（獨立 SVG 字串），有的話畫在物品旁邊 */
  babySvg?: string;
  brand: string;
  /** 例如「線上模擬抓周，換你家寶寶試試！」 */
  cta: string;
  /** 例如「example.com/play」 */
  link: string;
}

const W = 1080;
const H = 1920;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`圖片載入失敗：${src}`));
    img.src = src;
  });

// 外部圖片（Vercel Blob）經過 Next 的圖片最佳化轉成同網域，canvas 才不會被污染而無法匯出
const sameOrigin = (src: string) =>
  src.startsWith("/")
    ? src
    : `/_next/image?url=${encodeURIComponent(src)}&w=640&q=90`;

const NO_LINE_START = "，。！？、；：」』）…～!?,.)";

// 中文逐字換行，最多 maxLines 行，超過的最後一行加「…」
const wrap = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) => {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const ch of paragraph) {
      // 標點不放在行首（避免「！」自己一行），寧可那一行稍微超出一點
      if (
        ctx.measureText(line + ch).width > maxWidth &&
        line &&
        !NO_LINE_START.includes(ch)
      ) {
        lines.push(line);
        line = ch;
      } else {
        line += ch;
      }
    }
    lines.push(line);
  }
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, -1)}…`;
  return kept;
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

export const drawResultCard = async (input: ResultCardInput): Promise<Blob> => {
  const css = getComputedStyle(document.documentElement);
  const color = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  const brand = color("--color-brand", "#eda09d");
  const soft = color("--color-brand-soft", "#f5c9c7");
  const ink = color("--color-brand-ink", "#555555");
  const beige = color("--color-brand-beige", "#ffeee1");
  const cream = color("--color-brand-cream", "#f5eae2");
  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  const font = (weight: number, size: number) => `${weight} ${size}px ${family}`;

  const { title, item, blessing, statsLine, cta, link } = input;
  const allText = [title, item.name, item.meaning, blessing, statsLine, input.brand, cta, link].join("");
  // 中文字型是依字分批載入的，先把會用到的字載好，不然會畫成系統字型
  await Promise.all([
    document.fonts.load(font(700, 60), allText),
    document.fonts.load(font(400, 40), allText),
  ]).catch(() => undefined);

  const [icon, logo, baby] = await Promise.all([
    item.image ? loadImage(sameOrigin(item.image)).catch(() => null) : null,
    loadImage("/photos/logo.png").catch(() => null),
    input.babySvg
      ? loadImage(
          `data:image/svg+xml;charset=utf-8,${encodeURIComponent(input.babySvg)}`,
        ).catch(() => null)
      : null,
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("瀏覽器不支援 canvas");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 背景：漸層＋幾顆柔和的圓點
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, beige);
  bg.addColorStop(0.55, cream);
  bg.addColorStop(1, "#ffffff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = soft;
  for (const [x, y, r] of [
    [90, 260, 120],
    [1000, 520, 170],
    [60, 1500, 150],
    [990, 1640, 110],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 店名
  let y = 150;
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, y, 56, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, W / 2 - 56, y - 56, 112, 112);
    ctx.restore();
    y += 100;
  }
  ctx.fillStyle = brand;
  ctx.font = font(700, 44);
  ctx.fillText(input.brand, W / 2, y);

  // 標題
  ctx.font = font(700, 76);
  y = 400;
  for (const line of wrap(ctx, title, 900, 2)) {
    ctx.fillText(line, W / 2, y);
    y += 96;
  }

  // 物品大圖
  const cy = 820;
  ctx.fillStyle = soft;
  ctx.beginPath();
  ctx.arc(W / 2, cy, 330, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(W / 2, cy, 300, 0, Math.PI * 2);
  ctx.fill();
  if (icon) {
    const size = 380;
    ctx.drawImage(icon, W / 2 - size / 2, cy - size / 2, size, size);
  } else {
    ctx.font = `300px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText(item.emoji, W / 2, cy + 20);
  }

  // 穿著衣服的寶寶爬到物品左下方
  if (baby) {
    const bw = 360;
    ctx.drawImage(baby, 70, cy + 95, bw, bw * (100 / 150));
  }

  // 物品名稱與象徵意義
  y = 1250;
  ctx.fillStyle = brand;
  ctx.font = font(700, 120);
  ctx.fillText(item.name, W / 2, y);
  y += 120;
  if (item.meaning) {
    ctx.fillStyle = ink;
    ctx.font = font(700, 54);
    ctx.fillText(item.meaning, W / 2, y);
    y += 90;
  }
  if (statsLine) {
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.6;
    ctx.font = font(400, 40);
    ctx.fillText(statsLine, W / 2, y);
    ctx.globalAlpha = 1;
    y += 80;
  }
  if (blessing) {
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.75;
    ctx.font = font(400, 40);
    for (const line of wrap(ctx, blessing, 860, 3)) {
      ctx.fillText(line, W / 2, y);
      y += 58;
    }
    ctx.globalAlpha = 1;
  }

  // 日期
  const now = new Date();
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.5;
  ctx.font = font(400, 34);
  ctx.fillText(
    `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,
    W / 2,
    1680,
  );
  ctx.globalAlpha = 1;

  // 底部邀請
  roundRect(ctx, 110, 1730, W - 220, 120, 60);
  ctx.fillStyle = brand;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = font(700, 38);
  ctx.fillText(cta, W / 2, 1772);
  ctx.font = font(400, 30);
  ctx.fillText(link, W / 2, 1818);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("產生圖片失敗"))),
      "image/png",
    ),
  );
};
