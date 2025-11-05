import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("privacy_settings").select("*").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") throw error

    // אם אין הגדרות, החזר ברירות מחדל
    if (!data) {
      return NextResponse.json({
        marketing_emails: false,
        analytics_cookies: false,
        functional_cookies: true,
        advertising_cookies: false,
        data_sharing: false,
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // עדכון או יצירת הגדרות
    const { error } = await supabase.from("privacy_settings").upsert({
      user_id: user.id,
      marketing_emails: body.marketing_emails,
      analytics_cookies: body.analytics_cookies,
      functional_cookies: body.functional_cookies,
      advertising_cookies: body.advertising_cookies,
      data_sharing: body.data_sharing,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    await supabase.from("privacy_audit_log").insert({
      user_id: user.id,
      action_type: "privacy_settings_updated",
      resource_type: "settings",
      details: body,
      ip_address: request.headers.get("x-forwarded-for"),
      user_agent: request.headers.get("user-agent"),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
