import { generateText } from "ai"

export interface ProcessedContent {
  type: "news_flash" | "article"
  title: string
  content: string
  excerpt: string
  confidence: number
}

export async function processWithAI(
  scrapedData: {
    title: string
    content: string
    url: string
  }[],
  sourceType: string,
  apiKey: string,
  model = "glm-4-flash",
): Promise<ProcessedContent[]> {
  const results: ProcessedContent[] = []

  for (const data of scrapedData.slice(0, 5)) {
    try {
      // Special handling for tweets
      const isTweet = sourceType === "nitter" || data.title.startsWith("Tweet:")

      if (isTweet) {
        // For tweets, always create news flash
        const { text: newsContent } = await generateText({
          model,
          prompt: `צור חדשה קצרה בעברית (2-3 משפטים) מהציוץ הבא:

${data.content}

הכן חדשה קצרה, מעניינת ואינפורמטיבית. השתמש באימוג'י רלוונטי אחד בתחילת<|im_start|> החדשה. אל תציין שזה ציוץ, פשוט דווח על המידע.`,
        })

        results.push({
          type: "news_flash",
          title: data.title.replace("Tweet: ", ""),
          content: newsContent,
          excerpt: newsContent.substring(0, 100),
          confidence: 0.8,
        })
      } else {
        // Determine if it should be a news flash or article
        const { text: typeDecision } = await generateText({
          model,
          prompt: `בהתבסס על הכותרת והתוכן הבא, האם זה מתאים יותר לחדשה קצרה (news_flash) או למאמר מפורט (article)?

כותרת: ${data.title}
תוכן: ${data.content}

ענה רק במילה אחת: news_flash או article`,
        })

        const contentType = typeDecision.trim().toLowerCase().includes("article") ? "article" : "news_flash"

        if (contentType === "news_flash") {
          const { text: newsContent } = await generateText({
            model,
            prompt: `צור חדשה קצרה בעברית (2-3 משפטים) על הנושא הבא:

כותרת: ${data.title}
תוכן מקורי: ${data.content}
מקור: ${data.url}

הכן חדשה קצרה, מעניינת ואינפורמטיבית. השתמש באימוג'י רלוונטי אחד בתחילת<|im_start|> החדשה.`,
          })

          results.push({
            type: "news_flash",
            title: data.title,
            content: newsContent,
            excerpt: newsContent.substring(0, 100),
            confidence: 0.85,
          })
        } else {
          const { text: articleContent } = await generateText({
            model,
            prompt: `כתוב מאמר מפורט בעברית (לפחות 1000 מילים) על הנושא הבא:

כותרת: ${data.title}
תוכן מקורי: ${data.content}
מקור: ${data.url}

המאמר צריך לכלול:
1. הקדמה מעניינת
2. הסבר מפורט על הנושא
3. השלכות וחשיבות
4. דוגמאות ומקרי שימוש
5. סיכום

השתמש בכותרות משנה (##) לארגון התוכן. כתוב בסגנון מקצועי אך נגיש.`,
          })

          const { text: excerpt } = await generateText({
            model,
            prompt: `צור תקציר קצר (1-2 משפטים) למאמר הבא:

${articleContent.substring(0, 500)}...

התקציר צריך להיות מושך ולסכם את הנקודה המרכזית.`,
          })

          results.push({
            type: "article",
            title: data.title,
            content: articleContent,
            excerpt: excerpt.trim(),
            confidence: 0.9,
          })
        }
      }
    } catch (error) {
      console.error("[v0] AI processing error:", error)
    }
  }

  return results
}
