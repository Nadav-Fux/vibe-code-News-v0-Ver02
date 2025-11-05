import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // קבלת מידע על המשתמש (אם מחובר)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // יצירת session ID ייחודי
    const sessionId = request.cookies.get("session-id")?.value || crypto.randomUUID()

    // שמירת ההסכמה
    const { error } = await supabase.from("cookie_consents").insert({
      user_id: user?.id || null,
      session_id: sessionId,
      necessary: body.necessary,
      functional: body.functional,
      analytics: body.analytics,
      advertising: body.advertising,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    })

    if (error) throw error

    await supabase.from("privacy_audit_log").insert({
      user_id: user?.id || null,
      action_type: "cookie_consent_given",
      resource_type: "consent",
      details: body,
      ip_address: request.headers.get("x-forwarded-for"),
      user_agent: request.headers.get("user-agent"),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cookie consent error:", error)
    return NextResponse.json({ error: "Failed to save consent" }, { status: 500 })
  }
}
