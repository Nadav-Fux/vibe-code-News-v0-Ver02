import { generateText } from "ai"

export type SentimentScore = "positive" | "neutral" | "negative"

export interface SentimentResult {
  score: SentimentScore
  confidence: number
  explanation: string
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const prompt = `Analyze the sentiment of the following text. Respond with a JSON object containing:
- score: "positive", "neutral", or "negative"
- confidence: a number between 0 and 1
- explanation: a brief explanation in Hebrew

Text: ${text}

Respond only with the JSON object, no additional text.`

  const { text: response } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt,
  })

  try {
    const result = JSON.parse(response)
    return {
      score: result.score,
      confidence: result.confidence,
      explanation: result.explanation,
    }
  } catch (error) {
    // Fallback if parsing fails
    return {
      score: "neutral",
      confidence: 0.5,
      explanation: "לא ניתן לנתח את הסנטימנט",
    }
  }
}

export async function moderateContent(text: string): Promise<{
  isAppropriate: boolean
  reason?: string
}> {
  const prompt = `Analyze if the following text is appropriate for a professional coding platform. Check for:
- Offensive language
- Spam
- Harassment
- Inappropriate content

Respond with a JSON object containing:
- isAppropriate: true or false
- reason: explanation in Hebrew if not appropriate

Text: ${text}

Respond only with the JSON object.`

  const { text: response } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt,
  })

  try {
    const result = JSON.parse(response)
    return result
  } catch (error) {
    // Fallback: assume appropriate if parsing fails
    return { isAppropriate: true }
  }
}
