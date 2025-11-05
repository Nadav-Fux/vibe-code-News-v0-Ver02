import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { getModelConfig, type AIModelKey } from "@/lib/ai/models"

export const maxDuration = 30

export async function POST(req: Request) {
  const { title, category, tags, tone, model = "openai" } = await req.json()

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 })
  }

  const prompt = `Write a comprehensive article about "${title}".
${category ? `Category: ${category}` : ""}
${tags && tags.length > 0 ? `Tags: ${tags.join(", ")}` : ""}
${tone ? `Tone: ${tone}` : "Tone: Professional and informative"}

Write a well-structured article with:
- An engaging introduction
- Clear main points with examples
- A conclusion that summarizes key takeaways

Make it informative, engaging, and suitable for a technical blog.`

  try {
    const modelConfig = getModelConfig(model as AIModelKey)
    let modelInstance: any

    switch (modelConfig.provider) {
      case "google":
        const google = createGoogleGenerativeAI({
          apiKey: modelConfig.apiKey,
        })
        modelInstance = google(modelConfig.model)
        break

      case "zhipu":
        const zhipu = createOpenAI({
          apiKey: modelConfig.apiKey,
          baseURL: "https://open.bigmodel.cn/api/paas/v4",
        })
        modelInstance = zhipu(modelConfig.model)
        break

      case "minimax":
        const minimax = createOpenAI({
          apiKey: modelConfig.apiKey,
          baseURL: "https://api.minimax.chat/v1",
        })
        modelInstance = minimax(modelConfig.model)
        break

      case "openai":
      default:
        modelInstance = "openai/gpt-5-mini"
        break
    }

    const result = streamText({
      model: modelInstance,
      prompt,
      maxTokens: 2000,
      temperature: 0.8,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI Content Generation Error:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
