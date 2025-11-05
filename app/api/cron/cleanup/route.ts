import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Vercel Cron Job - ניקוי אוטומטי של נתונים ישנים
// מתוזמן לרוץ כל יום ב-2:00 בלילה
export const runtime = "edge"

export async function GET(request: Request) {
  // אימות שהבקשה מגיעה מ-Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    // ניקוי לוגים ישנים (מעל 30 יום)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await supabase.from("error_logs").delete().lt("created_at", thirtyDaysAgo.toISOString())

    await supabase.from("performance_logs").delete().lt("created_at", thirtyDaysAgo.toISOString())

    // ניקוי אירועי אנליטיקס ישנים (מעל 90 יום)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    await supabase.from("analytics_events").delete().lt("created_at", ninetyDaysAgo.toISOString())

    return NextResponse.json({
      success: true,
      message: "Cleanup completed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Cron cleanup error:", error)
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 })
  }
}
