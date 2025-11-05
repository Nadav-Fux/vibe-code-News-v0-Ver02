import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ArticleEditor } from "@/components/articles/article-editor"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getUserPermissions } from "@/lib/auth/permissions"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const permissions = await getUserPermissions()

  const query = supabase
    .from("articles")
    .select(`
      *,
      article_tags(tag_id)
    `)
    .eq("slug", slug)

  if (!permissions.canEditAllArticles) {
    query.eq("author_id", user.id)
  }

  const { data: article } = await query.single()

  if (!article) {
    notFound()
  }

  if (!permissions.canEditOwnArticles && article.author_id !== user.id) {
    redirect("/dashboard")
  }

  // Fetch categories and tags
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  const { data: tags } = await supabase.from("tags").select("*").order("name")

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60" />
              <h1 className="text-xl font-bold">Vibe Code</h1>
            </Link>
            <span className="text-muted-foreground">/</span>
            <h2 className="text-lg font-semibold">עריכת מאמר</h2>
          </div>
          <Link href="/dashboard/articles">
            <Button variant="ghost" className="gap-2">
              חזרה למאמרים
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <ArticleEditor categories={categories || []} tags={tags || []} userId={user.id} article={article} />
      </main>
    </div>
  )
}
