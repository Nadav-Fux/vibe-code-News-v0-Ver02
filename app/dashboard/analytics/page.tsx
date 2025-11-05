import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { getUserPermissions } from "@/lib/auth/permissions"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const permissions = await getUserPermissions()
  if (!permissions.canViewAnalytics) {
    redirect("/dashboard")
  }

  // Fetch user's analytics data
  const { data: userArticles } = await supabase
    .from("articles")
    .select("id, title, views, status, created_at, published_at")
    .eq("author_id", user.id)
    .order("views", { ascending: false })

  // Fetch analytics events for user's articles
  const articleIds = userArticles?.map((a) => a.id) || []
  const { data: events } = await supabase
    .from("analytics_events")
    .select("*")
    .in("article_id", articleIds)
    .order("created_at", { ascending: false })
    .limit(1000)

  // Calculate total stats
  const totalViews = userArticles?.reduce((sum, article) => sum + article.views, 0) || 0
  const publishedCount = userArticles?.filter((a) => a.status === "published").length || 0
  const draftCount = userArticles?.filter((a) => a.status === "draft").length || 0

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60" />
            <h1 className="text-xl font-bold">Vibe Code</h1>
          </Link>
          <form action="/auth/signout" method="post">
            <Button variant="outline" type="submit">
              יציאה
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-bold tracking-tight">אנליטיקס</h2>
              <p className="text-lg text-muted-foreground">מעקב אחר ביצועי התוכן שלך</p>
            </div>
          </div>
          <AnalyticsDashboard
            articles={userArticles || []}
            events={events || []}
            stats={{
              totalViews,
              publishedCount,
              draftCount,
              totalArticles: userArticles?.length || 0,
            }}
          />
        </div>
      </main>
    </div>
  )
}
