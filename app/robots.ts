import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/error"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
