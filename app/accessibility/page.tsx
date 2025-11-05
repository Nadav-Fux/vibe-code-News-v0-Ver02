import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "הצהרת נגישות | Vibe Code GLM",
  description: "הצהרת נגישות לפי תקנות שוויון זכויות לאנשים עם מוגבלות",
}

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">הצהרת נגישות</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">מחויבות לנגישות</h2>
          <p>
            Vibe Code GLM מחויבת להנגיש את האתר שלה בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 ולתקנות
            שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">רמת הנגישות באתר</h2>
          <p>
            האתר עומד ברמת AA של תקן WCAG 2.1 (Web Content Accessibility Guidelines) ומותאם לדפדפנים הנפוצים
            ולטכנולוגיות מסייעות כגון קוראי מסך.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">התאמות נגישות באתר</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>ניווט באמצעות מקלדת בלבד</li>
            <li>תמיכה בקוראי מסך (NVDA, JAWS, VoiceOver)</li>
            <li>ניגודיות צבעים מתאימה</li>
            <li>טקסטים חלופיים לתמונות</li>
            <li>כותרות מסודרות היררכית</li>
            <li>פונטים ברורים וקריאים</li>
            <li>אפשרות להגדלת טקסט</li>
            <li>תמיכה ב-RTL (כתיבה מימין לשמאל)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">בדיקות נגישות</h2>
          <p>האתר נבדק באמצעות כלים אוטומטיים ובדיקות ידניות על ידי מומחי נגישות. הבדיקות כללו:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>בדיקה עם קוראי מסך שונים</li>
            <li>ניווט באמצעות מקלדת בלבד</li>
            <li>בדיקת ניגודיות צבעים</li>
            <li>בדיקה בדפדפנים שונים</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">בעיות נגישות ידועות</h2>
          <p>אנו עובדים באופן שוטף לשיפור הנגישות באתר. אם נתקלת בבעיית נגישות, אנא דווח לנו.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">פניות בנושא נגישות</h2>
          <p>אם נתקלת בבעיית נגישות באתר או שיש לך הצעות לשיפור, נשמח לשמוע ממך:</p>
          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <p className="font-bold mb-2">רכז נגישות:</p>
            <p>אימייל: accessibility@vibecodeglm.com</p>
            <p>טלפון: 03-1234567</p>
            <p className="mt-4">
              <Link href="/contact">
                <Button>צור קשר</Button>
              </Link>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">תאריך עדכון אחרון</h2>
          <p>הצהרת נגישות זו עודכנה לאחרונה בתאריך: ינואר 2025</p>
        </section>
      </div>
    </div>
  )
}
