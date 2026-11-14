// 瀏覽器直接呼叫 Gemini API，用的是「訪客自己輸入的 API key」。
// key 不會經過本站伺服器，也不會被記錄；本站不提供自己的 key。
// 只能在 Client Component 使用。

export type GeminiErrorKind =
  | "invalid-key"
  | "quota"
  | "model"
  | "blocked"
  | "network"
  | "bad-response";

export class GeminiError extends Error {
  constructor(
    public kind: GeminiErrorKind,
    message: string,
  ) {
    super(message);
  }
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 30_000;

interface GenerateOptions {
  apiKey: string;
  model: string;
  prompt: string;
  /** Gemini responseSchema（OpenAPI 子集） */
  schema: object;
}

const kindFromStatus = (status: number, body: string): GeminiErrorKind => {
  if (status === 429) return "quota";
  if (status === 404) return "model";
  if (status === 401 || status === 403) return "invalid-key";
  if (status === 400 && /API_KEY_INVALID|API key not valid/i.test(body)) {
    return "invalid-key";
  }
  return "bad-response";
};

/** 呼叫 Gemini 並把回應解析成 JSON；失敗時丟出 GeminiError */
export const generateJson = async ({
  apiKey,
  model,
  prompt,
  schema,
}: GenerateOptions): Promise<unknown> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `${ENDPOINT}/${encodeURIComponent(model.trim())}:generateContent`,
      {
        method: "POST",
        signal: controller.signal,
        // 不送 cookie、不送 referrer 以外的資訊
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.9,
          },
        }),
      },
    );
    const text = await res.text();
    if (!res.ok) {
      throw new GeminiError(kindFromStatus(res.status, text), `HTTP ${res.status}`);
    }

    const data = JSON.parse(text) as {
      promptFeedback?: { blockReason?: string };
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    if (data.promptFeedback?.blockReason) {
      throw new GeminiError("blocked", data.promptFeedback.blockReason);
    }
    const output = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("");
    if (!output) throw new GeminiError("bad-response", "沒有回應內容");
    return JSON.parse(output);
  } catch (error) {
    if (error instanceof GeminiError) throw error;
    if (error instanceof SyntaxError) {
      throw new GeminiError("bad-response", "回應不是 JSON");
    }
    throw new GeminiError("network", error instanceof Error ? error.message : "連線失敗");
  } finally {
    clearTimeout(timer);
  }
};
