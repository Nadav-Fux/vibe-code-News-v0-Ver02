import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArticleRecommendations } from "@/components/articles/recommendations"
import { CommentsSection } from "@/components/comments/comments-section"
import { ArrowLeft, Eye, Calendar, User } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { SlideIn } from "@/components/ui/slide-in"
import { ArticleStructuredData } from "@/components/seo/structured-data"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the article
  const { data: article } = await supabase
    .from("articles")
    .select(`
      *,
      author:profiles(display_name, avatar_url),
      category:categories(name, slug),
      article_tags(tag:tags(name, slug))
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!article) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("articles")
    .update({ views: article.views + 1 })
    .eq("id", article.id)

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <ArticleStructuredData
        article={article}
        author={{
          full_name: article.author?.display_name || "Anonymous",
          avatar_url: article.author?.avatar_url,
        }}
      />
      <div className="flex min-h-svh flex-col bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <h1 className="text-xl font-bold">Vibe Code</h1>
            </Link>
            <Link href="/articles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1">
          <div className="border-b bg-muted/30">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
              <SlideIn direction="down">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {article.category && (
                    <Badge variant="default" className="text-sm">
                      {article.category.name}
                    </Badge>
                  )}
                  {article.article_tags.map(({ tag }) => (
                    <Badge key={tag.slug} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </SlideIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-balance">{article.title}</h1>
              </FadeIn>
              <SlideIn delay={0.2} direction="up">
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author?.display_name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{article.views + 1} views</span>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <FadeIn delay={0.3}>
              <article className="flex flex-col gap-8">
                {article.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed text-pretty">{article.excerpt}</p>
                )}
                <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">{article.content}</div>
                </div>
              </article>
            </FadeIn>

            <SlideIn delay={0.4} direction="up">
              <div className="mt-16 pt-8 border-t">
                <CommentsSection articleId={article.id} currentUserId={user?.id} />
              </div>
            </SlideIn>

            <FadeIn delay={0.5}>
              <div className="mt-16">
                <ArticleRecommendations articleId={article.id} />
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
    </>
  )
}
