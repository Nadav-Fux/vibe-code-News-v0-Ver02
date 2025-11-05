import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { getModelConfig, type AIModelKey } from "@/lib/ai/models"

const recommendationsSchema = z.object({
  articles: z.array(
    z.object({
      id: z.string(),
      relevanceScore: z.number().min(0).max(1),
      reason: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  const { articleId, userId, model = "openai" } = await req.json()

  if (!articleId) {
    return Response.json({ error: "Article ID is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Get current article
    const { data: currentArticle } = await supabase
      .from("articles")
      .select("title, content, category:categories(name), article_tags(tag:tags(name))")
      .eq("id", articleId)
      .single()

    if (!currentArticle) {
      return Response.json({ error: "Article not found" }, { status: 404 })
    }

    // Get other published articles
    const { data: otherArticles } = await supabase
      .from("articles")
      .select("id, title, excerpt, category:categories(name), article_tags(tag:tags(name))")
      .eq("status", "published")
      .neq("id", articleId)
      .limit(20)

    if (!otherArticles || otherArticles.length === 0) {
      return Response.json({ recommendations: [] })
    }

    const currentTags = currentArticle.article_tags.map((at: any) => at.tag.name).join(", ")
    const articlesContext = otherArticles.map((a: any) => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category?.name,
      tags: a.article_tags.map((at: any) => at.tag.name).join(", "),
    }))

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

    const { object } = await generateObject({
      model: modelInstance,
      schema: recommendationsSchema,
      prompt: `Given the current article:
Title: ${currentArticle.title}
Category: ${currentArticle.category?.name || "None"}
Tags: ${currentTags}

Recommend the top 5 most relevant articles from this list:
${JSON.stringify(articlesContext, null, 2)}

Return article IDs with relevance scores (0-1) and brief reasons for recommendation.`,
    })

    // Fetch full details of recommended articles
    const recommendedIds = object.articles.map((a) => a.id)
    const { data: recommendations } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, category:categories(name)")
      .in("id", recommendedIds)

    const enrichedRecommendations = recommendations?.map((article) => {
      const aiData = object.articles.find((a) => a.id === article.id)
      return {
        ...article,
        relevanceScore: aiData?.relevanceScore || 0,
        reason: aiData?.reason || "",
      }
    })

    return Response.json({ recommendations: enrichedRecommendations || [] })
  } catch (error) {
    console.error("AI Recommendations Error:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
