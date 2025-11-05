"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Smile, Meh, Frown } from "lucide-react"

interface SentimentBadgeProps {
  text: string
  showExplanation?: boolean
}

export function SentimentBadge({ text, showExplanation = false }: SentimentBadgeProps) {
  const [sentiment, setSentiment] = useState<{
    score: "positive" | "neutral" | "negative"
    confidence: number
    explanation: string
  } | null>(null)

  useEffect(() => {
    const analyzeSentiment = async () => {
      try {
        const response = await fetch("/api/ai/sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })

        if (response.ok) {
          const result = await response.json()
          setSentiment(result)
        }
      } catch (error) {
        console.error("Failed to analyze sentiment:", error)
      }
    }

    if (text) {
      analyzeSentiment()
    }
  }, [text])

  if (!sentiment) return null

  const icon = {
    positive: <Smile className="h-3 w-3" />,
    neutral: <Meh className="h-3 w-3" />,
    negative: <Frown className="h-3 w-3" />,
  }[sentiment.score]

  const variant = {
    positive: "default" as const,
    neutral: "secondary" as const,
    negative: "destructive" as const,
  }[sentiment.score]

  const label = {
    positive: "חיובי",
    neutral: "ניטרלי",
    negative: "שלילי",
  }[sentiment.score]

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {label}
      </Badge>
      {showExplanation && <span className="text-sm text-muted-foreground">{sentiment.explanation}</span>}
    </div>
  )
}
