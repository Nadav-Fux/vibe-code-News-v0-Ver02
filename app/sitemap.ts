import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { getSiteUrl } from "@/lib/utils/site-url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = getSiteUrl()

  // Get all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })

  const articleUrls: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articleUrls,
  ]
}
