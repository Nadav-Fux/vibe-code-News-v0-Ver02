import { createClient } from "@/lib/supabase/server"
import { ArticlesList } from "@/components/articles/articles-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search/search-bar"

export default async function ArticlesPage() {
  const supabase = await createClient()

  // Fetch published articles
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name, slug),
      article_tags(tag:tags(name, slug))
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <h1 className="text-xl font-bold">Vibe Code</h1>
          </Link>
          <div className="flex items-center gap-4">
            <SearchBar />
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Explore Our Articles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our community of creators
          </p>
        </div>
      </section>
      <main className="flex-1 container mx-auto px-4 py-12">
        <ArticlesList articles={articles || []} />
      </main>
    </div>
  )
}
