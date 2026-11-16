import type { NextConfig } from "next";
import { codeInspectorPlugin } from "code-inspector-plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        // 後台上傳的圖片（Vercel Blob）
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    // 看過的動態頁面（後台、/play）在瀏覽器暫存 30 秒，切回去不用重新跟伺服器要。
    // 後台存檔的 Server Action 會呼叫 revalidatePath，暫存會一併清掉，不會看到舊資料。
    staleTimes: {
      dynamic: 30,
    },
  },
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }));
    }
    return config;
  },
};

export default nextConfig;
