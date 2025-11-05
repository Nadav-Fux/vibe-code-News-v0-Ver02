import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { getModelConfig, type AIModelKey } from "@/lib/ai/models"

export async function POST(req: Request) {
  const { content, model = "openai" } = await req.json()

  if (!content) {
    return Response.json({ error: "Content is required" }, { status: 400 })
  }

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

    const { text } = await generateText({
      model: modelInstance,
      prompt: `Summarize the following article content in 2-3 sentences. Focus on the main points and key takeaways:\n\n${content}`,
      maxTokens: 200,
      temperature: 0.7,
    })

    return Response.json({ summary: text })
  } catch (error) {
    console.error("AI Summary Error:", error)
    return Response.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
