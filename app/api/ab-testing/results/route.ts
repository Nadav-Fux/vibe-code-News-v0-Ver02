import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const experimentId = searchParams.get("experimentId")

    if (!experimentId) {
      return NextResponse.json({ error: "Missing experimentId" }, { status: 400 })
    }

    const supabase = await createClient()

    // קבלת תוצאות הניסוי
    const { data, error } = await supabase
      .from("ab_test_events")
      .select("variant, event_type")
      .eq("experiment_id", experimentId)

    if (error) {
      console.error("Failed to fetch A/B test results:", error)
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
    }

    // חישוב סטטיסטיקות
    const stats: Record<string, { views: number; conversions: number; rate: number }> = {}

    data.forEach((event) => {
      if (!stats[event.variant]) {
        stats[event.variant] = { views: 0, conversions: 0, rate: 0 }
      }

      if (event.event_type === "view") {
        stats[event.variant].views++
      } else if (event.event_type === "conversion") {
        stats[event.variant].conversions++
      }
    })

    // חישוב שיעור המרה
    Object.keys(stats).forEach((variant) => {
      const { views, conversions } = stats[variant]
      stats[variant].rate = views > 0 ? (conversions / views) * 100 : 0
    })

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("A/B testing results error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
