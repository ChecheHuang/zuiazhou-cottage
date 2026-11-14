import { upload } from "@vercel/blob/client";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MULTIPART_THRESHOLD = 8 * 1024 * 1024;

const extOf = (file: File) => {
  const fromType = file.type.split("/")[1];
  if (fromType) return fromType === "jpeg" ? "jpg" : fromType;
  return file.name.split(".").pop()?.toLowerCase() ?? "jpg";
};

// Blob 路徑只用英數字，避免中文檔名造成網址問題
const safeBase = (file: File) =>
  file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "photo";

const safeFolder = (folder: string) =>
  folder.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80) || "misc";

// 瀏覽器直接上傳到 Vercel Blob，回傳圖片網址
export const uploadImage = async (folder: string, file: File) => {
  const pathname = `site-images/${safeFolder(folder)}/${safeBase(file)}.${extOf(file)}`;
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    multipart: file.size > MULTIPART_THRESHOLD,
  });
  return blob.url;
};
