import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { getModelConfig, type AIModelKey } from "@/lib/ai/models"

export async function POST(req: Request) {
  const { content, instruction, model = "openai" } = await req.json()

  if (!content) {
    return Response.json({ error: "Content is required" }, { status: 400 })
  }

  const defaultInstruction = "Improve the writing quality, fix grammar, and make it more engaging"
  const prompt = `${instruction || defaultInstruction}:\n\n${content}`

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
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return Response.json({ improvedContent: text })
  } catch (error) {
    console.error("AI Content Improvement Error:", error)
    return Response.json({ error: "Failed to improve content" }, { status: 500 })
  }
}
