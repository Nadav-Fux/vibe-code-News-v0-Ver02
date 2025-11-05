import { createClient } from "@/lib/supabase/server"
import { scrapeWebsite, scrapeRSS, scrapeNitter } from "@/lib/scraper/scraper"
import { processWithAI } from "@/lib/scraper/ai-processor"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    const { data: sources, error: sourcesError } = await supabase
      .from("scraper_sources")
      .select("*")
      .eq("is_active", true)

    if (sourcesError) throw sourcesError

    const apiKey = process.env.GLM_API_KEY || process.env.GEMINI_API_KEY || ""
    const model = process.env.GLM_API_KEY ? "glm-4-flash" : "gemini-2.0-flash-exp"

    let totalProcessed = 0

    for (const source of sources || []) {
      try {
        console.log(`[v0] Scraping ${source.name}...`)

        let scrapedData
        if (source.type === "rss") {
          scrapedData = await scrapeRSS(source.url)
        } else if (source.type === "nitter") {
          scrapedData = await scrapeNitter(source.url)
        } else if (source.type === "html") {
          scrapedData = await scrapeWebsite(source.url, {})
        } else {
          console.log(`[v0] Unknown source type: ${source.type}`)
          continue
        }

        console.log(`[v0] Found ${scrapedData.length} items from ${source.name}`)

        if (scrapedData.length === 0) continue

        // Save scraped content
        const { data: savedContent } = await supabase
          .from("scraped_content")
          .insert(
            scrapedData.map((item) => ({
              source_id: source.id,
              url: item.url,
              title: item.title,
              content: item.content,
              published_at: item.publishedAt,
            })),
          )
          .select()

        if (savedContent && savedContent.length > 0) {
          console.log(`[v0] Processing with AI model: ${model}`)
          const processedContent = await processWithAI(scrapedData, source.type, apiKey, model)

          // Save pending content
          await supabase.from("pending_content").insert(
            processedContent.map((item, index) => ({
              scraped_content_id: savedContent[index]?.id,
              content_type: item.type,
              title: item.title,
              content: item.content,
              excerpt: item.excerpt,
              ai_model_used: model,
              confidence_score: item.confidence,
            })),
          )

          totalProcessed += processedContent.length
        }

        // Update last scraped time
        await supabase.from("scraper_sources").update({ last_scraped_at: new Date().toISOString() }).eq("id", source.id)
      } catch (error) {
        console.error(`[v0] Error processing ${source.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      processed: totalProcessed,
      message: `Successfully processed ${totalProcessed} items`,
    })
  } catch (error) {
    console.error("[v0] Scraper error:", error)
    return NextResponse.json({ error: "Failed to run scraper" }, { status: 500 })
  }
}
