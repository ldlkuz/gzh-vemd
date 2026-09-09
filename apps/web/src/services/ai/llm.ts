/**
 * llm.ts —— 共享的 OpenAI 兼容 LLM 调用
 *
 * 从 analysisAgent 抽出，供 rewriteAgent 等消费。统一走 aiConfig 的 provider 配置。
 */
import { formatAiHttpError, getAiConfig, validateAiConfig } from "./aiConfig";

/** 规范化 baseUrl：去末尾斜杠 */
function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

/** 构造 chat/completions 请求 URL */
function chatCompletionsUrl(baseUrl: string): string {
  const base = normalizeBaseUrl(baseUrl);
  if (base.endsWith("/v1")) {
    return `${base}/chat/completions`;
  }
  return `${base}/v1/chat/completions`;
}

/** 构造请求头 */
function buildHeaders(apiKey: string, baseUrl: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey.trim()) {
    headers["Authorization"] = `Bearer ${apiKey.trim()}`;
  }
  if (baseUrl.includes("openrouter.ai")) {
    headers["HTTP-Referer"] = "https://wemd.app";
    headers["X-Title"] = "WeMD";
  }
  return headers;
}

/** 单次 LLM 调用 */
export async function callLLM(
  systemPrompt: string,
  userContent: string,
  temperature: number,
): Promise<string> {
  const config = getAiConfig();
  const configError = validateAiConfig(config);
  if (configError) {
    throw new Error(configError);
  }

  const url = chatCompletionsUrl(config.baseUrl);
  const resp = await fetch(url, {
    method: "POST",
    headers: buildHeaders(config.apiKey, config.baseUrl),
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature,
      stream: false,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => resp.statusText);
    throw new Error(formatAiHttpError(config.baseUrl, resp.status, errText));
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("模型返回内容为空");
  }
  return content;
}
