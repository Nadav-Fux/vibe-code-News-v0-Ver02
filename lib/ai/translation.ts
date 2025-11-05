import { generateText } from "ai"

export type Language = "he" | "en"

export interface TranslationResult {
  translatedText: string
  sourceLanguage: Language
  targetLanguage: Language
}

export async function translateText(
  text: string,
  targetLanguage: Language,
  sourceLanguage?: Language,
): Promise<TranslationResult> {
  const prompt = sourceLanguage
    ? `Translate the following text from ${sourceLanguage === "he" ? "Hebrew" : "English"} to ${targetLanguage === "he" ? "Hebrew" : "English"}. Only return the translated text, nothing else.\n\nText: ${text}`
    : `Translate the following text to ${targetLanguage === "he" ? "Hebrew" : "English"}. Only return the translated text, nothing else.\n\nText: ${text}`

  const { text: translatedText } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt,
  })

  return {
    translatedText: translatedText.trim(),
    sourceLanguage: sourceLanguage || (targetLanguage === "he" ? "en" : "he"),
    targetLanguage,
  }
}

export async function detectLanguage(text: string): Promise<Language> {
  // Simple heuristic: check for Hebrew characters
  const hebrewRegex = /[\u0590-\u05FF]/
  return hebrewRegex.test(text) ? "he" : "en"
}
