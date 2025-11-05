import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchBar } from "@/components/search/search-bar"
import { FileText, BarChart3, BookOpen, PlusCircle, Users } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { SlideIn } from "@/components/ui/slide-in"
import { RoleBadge } from "@/components/auth/role-badge"
import { getUserRole, getUserPermissions } from "@/lib/auth/permissions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const role = await getUserRole()
  const permissions = await getUserPermissions()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const { data: articles } = await supabase.from("articles").select("id, status, views").eq("author_id", data.user.id)

  const totalArticles = articles?.length || 0
  const publishedArticles = articles?.filter((a) => a.status === "published").length || 0
  const totalViews = articles?.reduce((sum, a) => sum + a.views, 0) || 0

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60" />
            <h1 className="text-xl font-bold">Vibe Code</h1>
          </Link>
          <div className="flex items-center gap-4">
            <SearchBar />
            <form action="/auth/signout" method="post">
              <Button variant="outline" type="submit">
                יציאה
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <FadeIn>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold tracking-tight">שלום, {profile?.display_name || "משתמש"}</h2>
                {role && <RoleBadge role={role} />}
              </div>
              <p className="text-lg text-muted-foreground">{data.user.email}</p>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            <SlideIn delay={0.1}>
              <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">סה״כ מאמרים</p>
                    <p className="text-3xl font-bold">{totalArticles}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </SlideIn>

            <SlideIn delay={0.2}>
              <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">מאמרים מפורסמים</p>
                    <p className="text-3xl font-bold">{publishedArticles}</p>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </SlideIn>

            <SlideIn delay={0.3}>
              <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">סה״כ צפיות</p>
                    <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">פעולות מהירות</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {permissions.canCreateArticles && (
                  <Link href="/dashboard/articles/new">
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/20 p-3">
                          <PlusCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">מאמר חדש</h4>
                          <p className="text-sm text-muted-foreground">צור תוכן חדש</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <Link href="/dashboard/articles">
                  <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">המאמרים שלי</h4>
                        <p className="text-sm text-muted-foreground">נהל את התוכן שלך</p>
                      </div>
                    </div>
                  </div>
                </Link>

                {permissions.canViewAnalytics && (
                  <Link href="/dashboard/analytics">
                    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-muted p-3">
                          <BarChart3 className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">אנליטיקס</h4>
                          <p className="text-sm text-muted-foreground">צפה בסטטיסטיקות</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <Link href="/articles">
                  <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">עיון במאמרים</h4>
                        <p className="text-sm text-muted-foreground">גלה תוכן חדש</p>
                      </div>
                    </div>
                  </div>
                </Link>

                {permissions.canManageUsers && (
                  <Link href="/dashboard/users">
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-500/5 to-purple-500/10 p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-purple-500/20 p-3">
                          <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">ניהול משתמשים</h4>
                          <p className="text-sm text-muted-foreground">נהל תפקידים והרשאות</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}
