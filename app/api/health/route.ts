import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {
      database: "unknown",
      api: "healthy",
    },
  }

  try {
    // Check database connection
    const supabase = await createClient()
    const { error } = await supabase.from("articles").select("id").limit(1)

    checks.checks.database = error ? "unhealthy" : "healthy"

    if (error) {
      checks.status = "degraded"
    }
  } catch (error) {
    checks.checks.database = "unhealthy"
    checks.status = "unhealthy"
  }

  const statusCode = checks.status === "healthy" ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}
