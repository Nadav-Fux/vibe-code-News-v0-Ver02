import { createClient } from "@/lib/supabase/server"
import { NewsFlashFeedClient } from "./news-flash-feed-client"

export async function NewsFlashFeed() {
  console.log("[v0] NewsFlashFeed component loading...")

  const supabase = await createClient()
  console.log("[v0] Supabase client created")

  const { data: flashes, error } = await supabase
    .from("news_flashes")
    .select("id, content, image_url, created_at, is_pinned")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10)

  console.log("[v0] Flashes fetched:", { count: flashes?.length, error })

  if (error) {
    console.error("[v0] Error fetching news flashes:", error)
    return (
      <div className="text-center py-12">
        <p className="text-red-500">שגיאה בטעינת המבזקים: {error.message}</p>
      </div>
    )
  }

  return <NewsFlashFeedClient flashes={flashes || []} />
}
