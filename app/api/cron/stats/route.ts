import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Vercel Cron Job - חישוב סטטיסטיקות יומיות
// מתוזמן לרוץ כל יום ב-1:00 בלילה
export const runtime = "edge"

export async function GET(request: Request) {
  // אימות שהבקשה מגיעה מ-Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    // חישוב צפיות יומיות למאמרים
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: articles } = await supabase
      .from("articles")
      .select("id, views")
      .gte("updated_at", yesterday.toISOString())
      .lt("updated_at", today.toISOString())

    // חישוב מבזקים פופולריים
    const { data: flashes } = await supabase
      .from("news_flashes")
      .select("id, views")
      .order("views", { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      stats: {
        articles: articles?.length || 0,
        topFlashes: flashes?.length || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Cron stats error:", error)
    return NextResponse.json({ error: "Stats calculation failed" }, { status: 500 })
  }
}
