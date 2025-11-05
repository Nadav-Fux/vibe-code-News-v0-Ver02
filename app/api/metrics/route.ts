import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Store metric in database
    const { error } = await supabase.from("performance_metrics").insert({
      metric_name: body.name,
      metric_value: body.value,
      url: body.url,
      user_agent: body.userAgent,
      timestamp: body.timestamp,
    })

    if (error) {
      console.error("Failed to store metric:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Metrics endpoint failed:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
