export const metadata = {
  title: "תנאי שימוש | Vibe Code GLM",
  description: "תנאי שימוש בפלטפורמת Vibe Code GLM",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">תנאי שימוש</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. כללי</h2>
          <p>
            ברוכים הבאים ל-Vibe Code GLM. השימוש באתר זה כפוף לתנאי שימוש אלה. על ידי גישה לאתר או שימוש בו, אתה מסכים
            לתנאים אלה במלואם.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. שימוש מותר</h2>
          <p>אתה מתחייב:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>להשתמש באתר למטרות חוקיות בלבד</li>
            <li>לא להעלות תוכן פוגעני, מעליב או בלתי חוקי</li>
            <li>לא לפגוע בזכויות אחרים</li>
            <li>לא לנסות לפרוץ או לפגוע באבטחת האתר</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. תוכן משתמשים</h2>
          <p>אתה אחראי לתוכן שאתה מעלה לאתר. אנו שומרים לעצמנו את הזכות להסיר תוכן שאינו עומד בתנאי השימוש.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. קניין רוחני</h2>
          <p>כל התוכן באתר, למעט תוכן משתמשים, הוא רכושנו או של מעניקי הרישיון שלנו ומוגן בזכויות יוצרים.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. הגבלת אחריות</h2>
          <p>האתר מסופק "כמות שהוא". אנו לא אחראים לנזקים הנובעים משימוש באתר או מאי-יכולת להשתמש בו.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. שינויים בתנאים</h2>
          <p>אנו רשאים לשנות תנאים אלה בכל עת. המשך שימוש באתר לאחר שינוי מהווה הסכמה לתנאים המעודכנים.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. דין וסמכות שיפוט</h2>
          <p>תנאים אלה כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית נתונה לבתי המשפט בישראל.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. יצירת קשר</h2>
          <p>לשאלות בנושא תנאי השימוש: info@vibecodeglm.com</p>
        </section>
      </div>
    </div>
  )
}
