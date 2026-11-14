// 預設圖片放在 public/，上傳的圖片放在 Vercel Blob
export const isAllowedImageUrl = (url: string) => {
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("..")) {
    return /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(url);
  }
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
};

export const isBlobUrl = (url: string) =>
  url.startsWith("https://") && isAllowedImageUrl(url);
