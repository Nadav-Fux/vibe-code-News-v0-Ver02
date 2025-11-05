import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Store log in database
    const { error } = await supabase.from("application_logs").insert({
      level: body.level,
      message: body.message,
      context: body.context,
      session_id: body.sessionId,
      user_id: body.userId,
      timestamp: body.timestamp,
    })

    if (error) {
      console.error("Failed to store log:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logging endpoint failed:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
