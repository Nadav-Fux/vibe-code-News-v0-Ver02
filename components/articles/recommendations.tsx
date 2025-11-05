"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Recommendation = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: { name: string } | null
  relevanceScore: number
  reason: string
}

export function ArticleRecommendations({ articleId }: { articleId: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/ai/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId }),
        })

        if (response.ok) {
          const { recommendations } = await response.json()
          setRecommendations(recommendations)
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [articleId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="border-t pt-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Articles</h2>
      <div className="grid gap-4">
        {recommendations.map((rec) => (
          <Link key={rec.id} href={`/articles/${rec.slug}`}>
            <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {rec.category && (
                    <Badge variant="outline" className="mb-2">
                      {rec.category.name}
                    </Badge>
                  )}
                  <h3 className="font-semibold hover:underline">{rec.title}</h3>
                  {rec.excerpt && <p className="text-sm text-muted-foreground mt-1">{rec.excerpt}</p>}
                  <p className="text-xs text-muted-foreground mt-2 italic">{rec.reason}</p>
                </div>
                <Badge variant="secondary">{Math.round(rec.relevanceScore * 100)}% match</Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
