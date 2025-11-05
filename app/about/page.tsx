export const metadata = {
  title: "אודות | Vibe Code GLM",
  description: "אודות פלטפורמת Vibe Code GLM",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">אודות Vibe Code GLM</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">מי אנחנו</h2>
          <p>
            Vibe Code GLM היא פלטפורמת תוכן מתקדמת המשלבת טכנולוגיות AI לספק חוויית קריאה וכתיבה ייחודית למפתחים ואנשי
            טכנולוגיה.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">החזון שלנו</h2>
          <p>ליצור קהילה תוססת של מפתחים שמשתפים ידע, לומדים ומתפתחים יחד באמצעות תוכן איכותי ומתקדם.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">מה אנחנו מציעים</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>מבזקים בזמן אמת על חדשות טכנולוגיה</li>
            <li>מאמרים ומדריכים מקצועיים</li>
            <li>כלי AI לסיוע בכתיבה ושיפור תוכן</li>
            <li>קהילה תומכת ואינטראקטיבית</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">הטכנולוגיה שלנו</h2>
          <p>הפלטפורמה בנויה על טכנולוגיות מתקדמות כולל Next.js, Supabase, ומודלי AI מובילים כמו Gemini ו-GLM.</p>
        </section>
      </div>
    </div>
  )
}
