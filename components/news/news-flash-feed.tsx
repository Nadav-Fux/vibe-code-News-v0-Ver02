import { createClient } from "@/lib/supabase/server"
import { NewsFlashFeedClient } from "./news-flash-feed-client"

export async function NewsFlashFeed() {
  const supabase = await createClient()

  const { data: flashes, error } = await supabase
    .from("news_flashes")
    .select("id, content, image_url, created_at, is_pinned")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("[v0] Error fetching news flashes:", error)
    return (
      <div className="text-center py-12">
        <p className="text-red-500">שגיאה בטעינת המבזקים</p>
      </div>
    )
  }

  return <NewsFlashFeedClient flashes={flashes || []} />
}
