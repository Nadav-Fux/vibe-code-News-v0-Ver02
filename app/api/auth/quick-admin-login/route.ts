import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const adminEmail = "admin@vibe-code.dev"
    const adminPassword = "admin123456"

    // Check if admin user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const adminUser = existingUsers?.users.find((u) => u.email === adminEmail)

    let userId: string

    if (!adminUser) {
      // Create admin user with email confirmed
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: "Admin",
          role: "admin",
        },
      })

      if (createError || !newUser.user) {
        return NextResponse.json({ error: "שגיאה ביצירת משתמש admin", details: createError?.message }, { status: 500 })
      }

      userId = newUser.user.id

      // Create profile
      await supabaseAdmin.from("profiles").insert({
        id: userId,
        email: adminEmail,
        role: "admin",
        full_name: "Admin User",
      })
    } else {
      userId = adminUser.id

      // Update to admin role
      await supabaseAdmin.from("profiles").update({ role: "admin" }).eq("id", userId)
    }

    // Now sign in with regular client
    const { createServerClient } = await import("@supabase/ssr")
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (signInError) {
      return NextResponse.json({ error: "שגיאה בהתחברות", details: signInError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "התחברת בהצלחה כאדמין",
      user: signInData.user,
    })
  } catch (error) {
    console.error("[v0] Quick admin login error:", error)
    return NextResponse.json({ error: "שגיאה פנימית" }, { status: 500 })
  }
}
