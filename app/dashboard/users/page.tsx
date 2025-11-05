import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/auth/role-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FadeIn } from "@/components/ui/fade-in"
import { Users } from "lucide-react"

export default async function UsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const isAdmin = await requireRole(["admin"])
  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Fetch all users
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">ניהול משתמשים</h1>
          </div>
          <p className="text-muted-foreground text-lg">ניהול תפקידים והרשאות משתמשים</p>
        </div>
      </FadeIn>

      <div className="grid gap-4">
        {users?.map((profile, index) => (
          <FadeIn key={profile.id} delay={index * 0.1}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{profile.full_name || "משתמש"}</CardTitle>
                      <CardDescription className="text-base">{profile.email}</CardDescription>
                    </div>
                  </div>
                  <RoleBadge role={profile.role} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  הצטרף ב-{new Date(profile.created_at).toLocaleDateString("he-IL")}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
