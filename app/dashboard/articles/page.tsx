import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArticlesList } from "@/components/articles/articles-list"
import { PlusCircle } from "lucide-react"

export default async function MyArticlesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's articles
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name, slug),
      article_tags(tag:tags(name, slug))
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
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
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">המאמרים שלי</h2>
              <p className="text-lg text-muted-foreground">נהל וערוך את התוכן שלך</p>
            </div>
            <Link href="/dashboard/articles/new">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                מאמר חדש
              </Button>
            </Link>
          </div>
          <ArticlesList articles={articles || []} isOwner={true} />
        </div>
      </main>
    </div>
  )
}
