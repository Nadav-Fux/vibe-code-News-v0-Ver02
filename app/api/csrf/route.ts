import { NextResponse } from "next/server"
import { generateCSRFToken } from "@/lib/security/csrf"

export async function GET() {
  try {
    const token = await generateCSRFToken()

    return NextResponse.json({ token })
  } catch (error) {
    console.error("[v0] Error generating CSRF token:", error)
    return NextResponse.json({ error: "Failed to generate CSRF token" }, { status: 500 })
  }
}
