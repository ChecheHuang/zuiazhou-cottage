import { getImageProps } from "next/image";

// CSS 背景圖也走 Next.js 圖片最佳化（WebP/AVIF、壓縮、依螢幕密度選尺寸）。
// 做法來自 Next.js 文件：getImageProps 產生 srcSet，再轉成 image-set()。
export const optimizedBackground = (src: string, width = 1280) => {
  const {
    props: { srcSet },
  } = getImageProps({ alt: "", src, width, height: Math.round(width * 0.6) });
  if (!srcSet) return `url("${src}")`;
  const set = srcSet
    .split(", ")
    .map((entry) => {
      const [url, density] = entry.split(" ");
      return `url("${url}") ${density}`;
    })
    .join(", ");
  return `image-set(${set})`;
};
