import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], total: 0 })
    }

    const supabase = await createServerClient()

    // Use the search function
    const { data: results, error } = await supabase.rpc("search_articles", {
      search_query: query,
      limit_count: limit,
      offset_count: offset,
    })

    if (error) {
      console.error("[v0] Search error:", error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    // Get author and category info
    const enrichedResults = await Promise.all(
      (results || []).map(async (article) => {
        const [authorData, categoryData] = await Promise.all([
          supabase.from("profiles").select("full_name, avatar_url").eq("id", article.author_id).single(),
          article.category_id
            ? supabase.from("categories").select("name, slug").eq("id", article.category_id).single()
            : null,
        ])

        return {
          ...article,
          author: authorData.data,
          category: categoryData?.data,
        }
      }),
    )

    return NextResponse.json({
      results: enrichedResults,
      total: enrichedResults.length,
      query,
    })
  } catch (error) {
    console.error("[v0] Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
