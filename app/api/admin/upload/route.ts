import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-auth";

// 瀏覽器直接把圖片傳到 Vercel Blob，這支 API 只負責簽發上傳權杖。
// 這樣就不受 Vercel Function 4.5MB 請求大小的限制。
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("未登入或登入已過期");
        if (!pathname.startsWith("site-images/")) {
          throw new Error("上傳路徑不合法");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // 上傳完成後由前端呼叫 Server Action 寫入資料庫，這裡不需要做事
    });
    return Response.json(json);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "上傳失敗" },
      { status: 400 },
    );
  }
}
