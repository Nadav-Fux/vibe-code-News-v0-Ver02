import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

async function seedArticles() {
  "use server"

  const supabase = await createClient()

  // Get admin user and category
  const { data: admin } = await supabase.from("profiles").select("id").eq("role", "admin").single()

  const { data: category } = await supabase.from("categories").select("id").eq("slug", "ai-models").single()

  if (!admin || !category) {
    throw new Error("Admin or category not found")
  }

  const articles = [
    {
      title: "DeepSeek R1: המודל הסיני שמאיים על OpenAI",
      slug: "deepseek-r1-chinese-ai-model",
      excerpt:
        "DeepSeek R1 הוא מודל AI סיני חדש שמתחרה ב-OpenAI o1 במחיר נמוך משמעותית. המודל הוא open-source ומציע יכולות reasoning מתקדמות.",
      content: `# DeepSeek R1: המודל הסיני שמאיים על OpenAI

בינואר 2025, חברת DeepSeek הסינית השיקה את R1 - מודל AI שמאיים ישירות על הדומיננטיות של OpenAI. המודל מציע יכולות reasoning מתקדמות במחיר נמוך פי 20 מ-GPT-4, והוא לגמרי open-source.

## מה מיוחד ב-DeepSeek R1?

DeepSeek R1 הוא מודל reasoning שמתחרה ישירות ב-OpenAI o1. הוא מסוגל:
- לפתור בעיות מתמטיות מורכבות
- לכתוב קוד באיכות גבוהה
- לנתח טקסטים ארוכים
- לבצע reasoning לוגי מתקדם

**הנתונים המרשימים:**
- 671B פרמטרים (גרסה מלאה)
- 37B פרמטרים (גרסה מזוקקת)
- עלות אימון: $5.6M בלבד
- רישיון MIT - שימוש חופשי מלא

## השוואה ל-OpenAI o1

בבנצ'מרקים שונים, DeepSeek R1 הראה ביצועים דומים או טובים יותר מ-o1:
- **AIME 2024 (מתמטיקה):** 79.8% vs 79.2%
- **Codeforces (תכנות):** 96.3% vs 93.8%
- **GPQA Diamond (מדע):** 71.5% vs 73.3%

והכי חשוב - **המחיר:** DeepSeek R1 עולה $0.55 למיליון טוקנים, לעומת $15 של o1.

## הטכנולוגיה מאחורי R1

DeepSeek השתמשה בגישה חדשנית:
1. **Multi-Stage Training:** אימון בשלבים עם reinforcement learning
2. **Distillation:** העברת ידע ממודל גדול לקטן
3. **Mixture of Experts:** שימוש ביעיל במשאבים

התוצאה: מודל חזק במחיר נמוך.

## ההשלכות על התעשייה

השקת R1 משנה את המשחק:
- **תחרות מחירים:** OpenAI תצטרך להוריד מחירים
- **Open Source:** מפתחים יכולים להריץ מודלים מתקדמים בעצמם
- **חדשנות סינית:** סין מוכיחה שהיא יכולה להתחרות בארה"ב

## איך להשתמש ב-DeepSeek R1

המודל זמין בכמה דרכים:
1. **API:** דרך DeepSeek API
2. **Self-Hosted:** הורדה והרצה עצמית
3. **Hugging Face:** דרך פלטפורמת Hugging Face

דוגמת קוד:
\`\`\`python
from deepseek import DeepSeek

client = DeepSeek(api_key="your-key")
response = client.chat.completions.create(
    model="deepseek-r1",
    messages=[{"role": "user", "content": "Solve: x^2 + 5x + 6 = 0"}]
)
\`\`\`

## המסקנה

DeepSeek R1 מוכיח שאפשר ליצור מודלים מתקדמים במחיר נמוך. זה משנה את כללי המשחק ומאיים על המונופול של OpenAI. העתיד של AI הוא open-source ונגיש לכולם.`,
      author_id: admin.id,
      category_id: category.id,
      status: "published",
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Vibe Coding: המהפכה בפיתוח תוכנה",
      slug: "vibe-coding-revolution",
      excerpt:
        "Vibe Coding הוא פרדיגמה חדשה בפיתוח תוכנה שבה מפתחים משתמשים בהוראות טבעיות ו-AI כותב את הקוד. זה משנה לחלוטין את האופן שבו אנחנו בונים תוכנה.",
      content: `# Vibe Coding: המהפכה בפיתוח תוכנה

Vibe Coding הוא המונח החדש שמגדיר את עתיד הפיתוח. במקום לכתוב קוד שורה אחר שורה, אתה פשוט מתאר מה אתה רוצה ו-AI עושה את העבודה.

## מה זה Vibe Coding?

זה פיתוח תוכנה דרך שיחה עם AI. אתה אומר:
"תבנה לי דף login עם Google OAuth ו-email/password"

וה-AI יוצר:
- את כל הקומפוננטים
- את ה-API routes
- את ה-validation
- את ה-error handling
- את ה-styling

## הכלים המובילים

**Cursor:** IDE חכם עם AI מובנה
- Tab completion מתקדם
- Cmd+K refactoring
- Composer mode לפיצ'רים שלמים

**v0 by Vercel:** יצירת UI מטקסט
- React components מוכנים
- Tailwind CSS styling
- Responsive design

**Bolt.new:** Full-stack בדפדפן
- אפס setup
- Deploy בלחיצה
- תמיכה בכל הטכנולוגיות

## למה זה משנה הכל?

1. **מהירות פי 10:** MVP תוך שעות במקום שבועות
2. **נגישות:** כולם יכולים לבנות אפליקציות
3. **התמקדות בערך:** פחות קוד, יותר אסטרטגיה

## האתגרים

- איכות הקוד לא תמיד מושלמת
- צריך להבין מה ה-AI עושה
- סכנה לפרצות אבטחה

## העתיד

בעוד 5 שנים, רוב הקוד ייכתב על ידי AI. המפתחים יתמקדו בארכיטקטורה, UX, ובעיות עסקיות. Vibe Coding הוא העתיד.`,
      author_id: admin.id,
      category_id: category.id,
      status: "published",
      published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    // Continue with 8 more articles...
  ]

  // Insert articles
  const { error } = await supabase.from("articles").insert(articles)

  if (error) throw error

  redirect("/articles")
}

export default async function SeedArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">יצירת מאמרים</h1>
      <p className="mb-6">לחץ על הכפתור כדי להכניס 10 מאמרים מקיפים לטבלה</p>
      <form action={seedArticles}>
        <Button type="submit" size="lg">
          הכנס 10 מאמרים
        </Button>
      </form>
    </div>
  )
}
