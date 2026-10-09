import { GoogleGenAI, Type } from "@google/genai";

// Security guarantee: ensure this module is never run in client-side bundle
if (typeof window !== "undefined") {
  throw new Error(
    "Security Violation: lib/ai/gemini.ts can only be executed on the server."
  );
}

export interface SnippetMetadataInput {
  title: string;
  codeContent: string;
  language: string;
}

export interface GeneratedSnippetMetadata {
  tags: string[];
  summary: string | null;
}

/**
 * Fallback order for Gemini models:
 * 1. gemini-3.7-flash (Primary GA model)
 * 2. gemini-3.6-flash (First fallback)
 * 3. gemini-3.5-flash-lite (Second fallback for high availability)
 */
const GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
] as const;

/**
 * Initializes GoogleGenAI client using process.env.GEMINI_API_KEY.
 * Never exposes the API key to client or logs.
 */
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim() || apiKey === "your_gemini_api_key") {
    console.warn(
      "[Gemini Service] GEMINI_API_KEY is not configured or is a placeholder. Skipping AI generation."
    );
    return null;
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
  });
}

/**
 * Generates 3-5 tags and a single-sentence plain-English summary using Gemini structured JSON output.
 * Tries models in priority order: gemini-3.7-flash -> gemini-3.6-flash -> gemini-3.5-flash-lite.
 * Returns null if all models fail or API is unavailable (does not throw, non-blocking).
 */
export async function generateSnippetMetadata(
  input: SnippetMetadataInput
): Promise<GeneratedSnippetMetadata | null> {
  const { title, codeContent, language } = input;

  if (!title?.trim() || !codeContent?.trim() || !language?.trim()) {
    return null;
  }

  const ai = getGeminiClient();
  if (!ai) {
    return null;
  }

  const prompt = `You are a technical code analyzer. Analyze the provided code snippet and generate:
1. "tags": 3 to 5 relevant lowercase tags (e.g. algorithm, framework, utility, data structure). No "#" symbols. No duplicates.
2. "summary": Exactly one plain-English sentence describing what this code snippet does. Do not invent functionality not present in the code.

Snippet Title: ${title.trim()}
Programming Language: ${language.trim()}
Code:
\`\`\`${language.toLowerCase().trim()}
${codeContent}
\`\`\``;

  const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        tags: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description:
            "3 to 5 relevant lowercase tags, no # symbols, no duplicates",
        },
        summary: {
          type: Type.STRING,
          description:
            "Exactly one plain-English sentence summarizing what the code snippet does",
        },
      },
      required: ["tags", "summary"],
    },
  };

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: generationConfig,
      });

      if (!response || !response.text) {
        console.warn(
          `[Gemini Service] Received empty response from model ${model}. Trying next fallback...`
        );
        continue;
      }

      const rawJson = response.text.trim();
      const parsed = JSON.parse(rawJson);

      // Clean and validate tags
      let tags: string[] = [];
      if (Array.isArray(parsed.tags)) {
        const seen = new Set<string>();
        for (const t of parsed.tags) {
          if (typeof t === "string") {
            const cleaned = t.trim().toLowerCase().replace(/^#+/, "");
            if (cleaned && !seen.has(cleaned)) {
              seen.add(cleaned);
              tags.push(cleaned);
            }
          }
        }
      }

      if (tags.length > 5) {
        tags = tags.slice(0, 5);
      }

      // Clean and validate summary
      let summary: string | null = null;
      if (typeof parsed.summary === "string" && parsed.summary.trim()) {
        summary = parsed.summary.trim();
      }

      return {
        tags,
        summary,
      };
    } catch (modelErr: unknown) {
      const errMsg =
        modelErr instanceof Error ? modelErr.message : String(modelErr);
      console.warn(
        `[Gemini Service] Model ${model} encountered an error: ${errMsg}. Trying next fallback...`
      );
    }
  }

  // All models in fallback chain failed
  console.error(
    "[Gemini Service] All Gemini models in fallback order failed. Gracefully falling back to null metadata."
  );
  return null;
}
