import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Store error in database
    const { error } = await supabase.from("error_logs").insert({
      error_message: body.error,
      stack_trace: body.stack,
      component_stack: body.componentStack,
      url: body.url,
      user_agent: body.userAgent,
      timestamp: body.timestamp,
    })

    if (error) {
      console.error("Failed to store error:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging endpoint failed:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
