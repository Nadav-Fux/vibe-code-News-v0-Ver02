import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update user role to admin
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", email.toLowerCase())
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating user role:", error)
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User updated to admin",
      user: data,
    })
  } catch (error) {
    console.error("[v0] Error in make-admin route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
