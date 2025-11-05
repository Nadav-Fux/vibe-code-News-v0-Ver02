import { createClient } from "@/lib/supabase/client"

type AnalyticsEvent = {
  eventType:
    | "page_view"
    | "article_view"
    | "article_create"
    | "article_update"
    | "article_publish"
    | "user_signup"
    | "user_login"
  userId?: string
  articleId?: string
  metadata?: Record<string, any>
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("analytics_events").insert({
      event_type: event.eventType,
      user_id: event.userId || null,
      article_id: event.articleId || null,
      metadata: event.metadata || {},
    })

    if (error) {
      console.error("[Analytics] Failed to track event:", error)
    }
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error)
  }
}

export function useAnalytics() {
  return {
    trackPageView: (path: string, userId?: string) => {
      trackEvent({
        eventType: "page_view",
        userId,
        metadata: { path },
      })
    },
    trackArticleView: (articleId: string, userId?: string) => {
      trackEvent({
        eventType: "article_view",
        articleId,
        userId,
      })
    },
    trackArticleCreate: (articleId: string, userId: string) => {
      trackEvent({
        eventType: "article_create",
        articleId,
        userId,
      })
    },
    trackArticleUpdate: (articleId: string, userId: string) => {
      trackEvent({
        eventType: "article_update",
        articleId,
        userId,
      })
    },
    trackArticlePublish: (articleId: string, userId: string) => {
      trackEvent({
        eventType: "article_publish",
        articleId,
        userId,
      })
    },
  }
}
