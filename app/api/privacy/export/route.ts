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

    // יצירת בקשת ייצוא
    const { data: exportData, error } = await supabase
      .from("data_exports")
      .insert({
        user_id: user.id,
        export_type: body.format,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    await supabase.from("privacy_audit_log").insert({
      user_id: user.id,
      action_type: "data_export_requested",
      resource_type: "export",
      details: { format: body.format },
      ip_address: request.headers.get("x-forwarded-for"),
      user_agent: request.headers.get("user-agent"),
    })

    // TODO: Implement actual export generation in background job
    // For now, we'll just create the request

    return NextResponse.json({
      success: true,
      exportId: exportData.id,
    })
  } catch (error) {
    console.error("Export request error:", error)
    return NextResponse.json({ error: "Failed to request export" }, { status: 500 })
  }
}
