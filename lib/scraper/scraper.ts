import * as cheerio from "cheerio"

export interface ScraperConfig {
  title?: string
  content?: string
  link?: string
  date?: string
}

export interface ScrapedData {
  title: string
  content: string
  url: string
  publishedAt?: Date
}

export async function scrapeWebsite(url: string, config: ScraperConfig): Promise<ScrapedData[]> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const results: ScrapedData[] = []

    // Find all article containers
    const articles = $("article, .post, .entry").slice(0, 10)

    articles.each((_, element) => {
      const $article = $(element)

      // Extract title
      const titleSelector = config.title || "h2, h3, .title"
      const title = $article.find(titleSelector).first().text().trim()

      // Extract content/excerpt
      const contentSelector = config.content || "p, .excerpt, .summary"
      const content = $article.find(contentSelector).first().text().trim()

      // Extract link
      const linkSelector = config.link || "a"
      let link = $article.find(linkSelector).first().attr("href") || ""

      // Make link absolute
      if (link && !link.startsWith("http")) {
        const baseUrl = new URL(url)
        link = new URL(link, baseUrl.origin).toString()
      }

      if (title && content && link) {
        results.push({
          title,
          content: content.substring(0, 500), // Limit content length
          url: link,
        })
      }
    })

    return results
  } catch (error) {
    console.error("[v0] Scraping error:", error)
    throw error
  }
}

export async function scrapeRSS(url: string): Promise<ScrapedData[]> {
  try {
    const response = await fetch(url)
    const xml = await response.text()
    const $ = cheerio.load(xml, { xmlMode: true })

    const results: ScrapedData[] = []

    $("item").each((_, element) => {
      const $item = $(element)
      const title = $item.find("title").text().trim()
      const content = $item.find("description").text().trim() || $item.find("content\\:encoded").text().trim()
      const link = $item.find("link").text().trim()
      const pubDate = $item.find("pubDate").text().trim()

      if (title && link) {
        results.push({
          title,
          content: content.substring(0, 500),
          url: link,
          publishedAt: pubDate ? new Date(pubDate) : undefined,
        })
      }
    })

    return results
  } catch (error) {
    console.error("[v0] RSS scraping error:", error)
    throw error
  }
}

export async function scrapeNitter(url: string): Promise<ScrapedData[]> {
  try {
    // Nitter provides RSS feeds, so we can use the RSS scraper
    const response = await fetch(url)
    const xml = await response.text()
    const $ = cheerio.load(xml, { xmlMode: true })

    const results: ScrapedData[] = []

    $("item").each((_, element) => {
      const $item = $(element)
      const title = $item.find("title").text().trim()
      const content = $item.find("description").text().trim()
      const link = $item.find("link").text().trim()
      const pubDate = $item.find("pubDate").text().trim()

      // Clean up tweet content (remove HTML tags)
      const cleanContent = content.replace(/<[^>]*>/g, "").trim()

      if (title && link && cleanContent) {
        results.push({
          title: `Tweet: ${title.substring(0, 100)}`,
          content: cleanContent,
          url: link,
          publishedAt: pubDate ? new Date(pubDate) : undefined,
        })
      }
    })

    return results
  } catch (error) {
    console.error("[v0] Nitter scraping error:", error)
    throw error
  }
}
