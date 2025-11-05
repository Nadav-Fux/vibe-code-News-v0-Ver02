"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar } from "lucide-react"
import { FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in"

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string
  created_at: string
  published_at: string | null
  views: number
  category: { name: string; slug: string } | null
  article_tags: { tag: { name: string; slug: string } }[]
}

export function ArticlesList({
  articles,
  isOwner = false,
}: {
  articles: Article[]
  isOwner?: boolean
}) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground mb-4">No articles found.</p>
        {isOwner && (
          <Link href="/dashboard/articles/new">
            <Button size="lg">Create Your First Article</Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <FadeInStagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <FadeInStaggerItem key={article.id}>
          <div className="group border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50 bg-card">
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                  {article.category && <Badge variant="outline">{article.category.name}</Badge>}
                </div>
                <Link href={isOwner ? `/dashboard/articles/${article.slug}` : `/articles/${article.slug}`}>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                {article.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{article.excerpt}</p>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{article.views}</span>
                  </div>
                </div>
                {isOwner && (
                  <Link href={`/dashboard/articles/${article.slug}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
              {article.article_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.article_tags.slice(0, 3).map(({ tag }) => (
                    <Badge key={tag.slug} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeInStaggerItem>
      ))}
    </FadeInStagger>
  )
}
