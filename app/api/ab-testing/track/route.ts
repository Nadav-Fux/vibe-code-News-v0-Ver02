import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { experimentId, variant, event } = await request.json()

    if (!experimentId || !variant || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // שמירת האירוע
    const { error } = await supabase.from("ab_test_events").insert({
      experiment_id: experimentId,
      variant,
      event_type: event,
      user_agent: request.headers.get("user-agent"),
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    if (error) {
      console.error("Failed to track A/B test event:", error)
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("A/B testing tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
