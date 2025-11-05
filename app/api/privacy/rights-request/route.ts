import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    // יצירת בקשה
    const { error } = await supabase.from("user_rights_requests").insert({
      user_id: user.id,
      email: user.email,
      request_type: body.requestType,
      description: body.description,
      status: "pending",
      priority: "normal",
    })

    if (error) throw error

    await supabase.from("privacy_audit_log").insert({
      user_id: user.id,
      action_type: "rights_request_submitted",
      resource_type: "request",
      details: { type: body.requestType },
      ip_address: request.headers.get("x-forwarded-for"),
      user_agent: request.headers.get("user-agent"),
    })

    // שליחת התראה למנהלים (TODO: implement email notification)
    await supabase.from("privacy_notifications").insert({
      user_id: user.id,
      type: "rights_request",
      title: "בקשת זכויות נשלחה",
      message: `בקשתך ל${getRequestTypeName(body.requestType)} נשלחה בהצלחה. נענה תוך 30 יום.`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Rights request error:", error)
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
  }
}

function getRequestTypeName(type: string): string {
  const names: Record<string, string> = {
    access: "עיון במידע",
    correction: "תיקון מידע",
    deletion: "מחיקת מידע",
    export: "העברת מידע",
    objection: "התנגדות לשימוש",
  }
  return names[type] || type
}
