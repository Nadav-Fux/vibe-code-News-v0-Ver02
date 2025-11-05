import { getSiteUrl } from "@/lib/utils/site-url"

export function ArticleStructuredData({
  article,
  author,
}: {
  article: {
    title: string
    excerpt: string
    content: string
    featured_image?: string
    created_at: string
    updated_at: string
    slug: string
  }
  author: {
    full_name: string
    avatar_url?: string
  }
}) {
  const baseUrl = getSiteUrl()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image || `${baseUrl}/icon-512x512.jpg`,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: author.full_name,
      image: author.avatar_url,
    },
    publisher: {
      "@type": "Organization",
      name: "Vibe Code GLM Platform",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon-512x512.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${article.slug}`,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

export function WebsiteStructuredData() {
  const baseUrl = getSiteUrl()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vibe Code GLM Platform",
    description: "פלטפורמת ניהול תוכן מתקדמת עם AI - תמיכה ב-GLM 4.6, Gemini 2.5 ו-Minimax 2",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/articles?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
