import Link from "next/link"

export const metadata = {
  title: "מדיניות פרטיות | Vibe Code GLM",
  description: "מדיניות פרטיות מעודכנת לפי תיקון 13 לחוק הגנת הפרטיות",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">מדיניות פרטיות</h1>
        <p className="text-muted-foreground">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        <section className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold mb-4">הכי חשוב שתדע</h2>
          <p className="mb-4">
            צוות האתר "Vibe Code GLM" ("אנחנו", "האתר") מתייחס בכבוד לפרטיותך ומחויב לשמור ולאבטח את המידע האישי שלך.
            מדיניות הפרטיות להלן מתארת את האופן בו אנו אוספים מידע, סוג המידע שנאסף, הסיבות לאיסוף המידע, וכן הדרך בה
            אתה, כבעל המידע, יכול לעיין בו, לעדכנו או למחוק.
          </p>
          <p className="font-bold">על פי חוק, אינך מחויב למסור לנו מידע אישי, ומסירת המידע נעשית מרצונך ובהסכמתך.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">איזה מידע אנו אוספים?</h2>

          <h3 className="text-xl font-bold mb-3 mt-6">מידע אישי שאתה מוסר לנו:</h3>
          <p className="mb-3">אנו אוספים מידע אישי שאתה מספק לנו מתוך חופש הבחירה שלך:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>פרטים מזהים:</strong> שם פרטי, שם משפחה, כתובת דואר אלקטרוני
            </li>
            <li>
              <strong>פרטי התחברות:</strong> סיסמה מוצפנת, שיטת אימות
            </li>
            <li>
              <strong>מידע מקצועי:</strong> תחום עיסוק, תפקיד, התמחויות
            </li>
            <li>
              <strong>תוכן שנוצר:</strong> מאמרים, תגובות, מבזקים
            </li>
            <li>
              <strong>מידע ביומטרי:</strong> תמונת פרופיל (אם תבחר להעלות)
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">מידע שנאסף אוטומטית:</h3>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, סוג מכשיר
            </li>
            <li>
              <strong>מידע על שימוש:</strong> דפים שביקרת, זמן שהייה, לחיצות
            </li>
            <li>
              <strong>Cookies:</strong> עוגיות לשיפור חוויית המשתמש (ראה פירוט בהמשך)
            </li>
            <li>
              <strong>מידע על מיקום:</strong> מיקום כללי על בסיס IP (לא GPS מדויק)
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">מידע מצדדים שלישיים:</h3>
          <p>אנו עשויים לקבל מידע מ:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>Google Authentication:</strong> שם, אימייל, תמונת פרופיל (בהסכמתך)
            </li>
            <li>
              <strong>ספקי שירות:</strong> Vercel (אחסון), Supabase (מסד נתונים)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">למה אנו משתמשים במידע שלך?</h2>
          <p className="mb-4">אנו משתמשים במידע האישי שלך למטרות הבאות בלבד:</p>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">✅ אספקת השירות</h4>
              <p className="text-sm text-muted-foreground">
                יצירת וניהול חשבון המשתמש שלך, אפשור גישה לתכונות, שמירת העדפות
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">📧 תקשורת</h4>
              <p className="text-sm text-muted-foreground">שליחת עדכונים חשובים, התראות על פעילות, מענה לפניות שלך</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">📊 שיפור השירות</h4>
              <p className="text-sm text-muted-foreground">ניתוח שימוש באתר, זיהוי בעיות, פיתוח תכונות חדשות</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🔒 אבטחה</h4>
              <p className="text-sm text-muted-foreground">מניעת הונאות, זיהוי פעילות חשודה, הגנה על המשתמשים</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">📢 שיווק (רק בהסכמה)</h4>
              <p className="text-sm text-muted-foreground">
                שליחת ניוזלטר, הצעות מיוחדות, תכנים שיווקיים - רק אם הסכמת במפורש
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">⚖️ עמידה בחוק</h4>
              <p className="text-sm text-muted-foreground">
                קיום חובות חוקיות, שמירת רישומים נדרשים, שיתוף פעולה עם רשויות
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">עם מי אנו משתפים את המידע שלך?</h2>
          <p className="mb-4 font-bold">אנו לא מוכרים או משכירים את המידע האישי שלך. לעולם.</p>

          <p className="mb-4">אנו עשויים לשתף מידע עם הגורמים הבאים בלבד:</p>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🔧 ספקי שירות</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Vercel:</strong> אחסון ותפעול האתר
                </li>
                <li>
                  • <strong>Supabase:</strong> מסד נתונים ואימות משתמשים
                </li>
                <li>
                  • <strong>Google:</strong> שירותי אימות (אם בחרת באפשרות זו)
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                כל הספקים מחויבים לאבטחת מידע ולא רשאים להשתמש במידע למטרות אחרות.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">⚖️ רשויות אכיפת חוק</h4>
              <p className="text-sm text-muted-foreground">
                במקרים חריגים, כאשר נדרש על פי חוק או צו שיפוטי, אנו עשויים למסור מידע לרשויות.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🤝 שותפים עסקיים (רק בהסכמה)</h4>
              <p className="text-sm text-muted-foreground">
                אם תסכים במפורש, אנו עשויים לשתף מידע עם שותפים לצורך שיפור השירות.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">האם אנו מעבירים את המידע שלך לחו"ל?</h2>
          <p className="mb-4">
            כן. חלק מספקי השירות שלנו (Vercel, Supabase) מאחסנים מידע בשרתים מחוץ לישראל, במדינות עם רמת הגנה מספקת על
            פרטיות (ארה"ב, אירופה).
          </p>
          <p className="font-bold">העברת המידע נעשית בהתאם לחוק הגנת הפרטיות ותקנותיו, ורק למדינות מאושרות.</p>
        </section>

        <section className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold mb-4">הזכויות שלך במידע (תיקון 13)</h2>
          <p className="mb-4">בהתאם לתיקון 13 לחוק הגנת הפרטיות, יש לך זכויות מלאות על המידע שלך:</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👁️</span>
              <div>
                <h4 className="font-bold">זכות עיון</h4>
                <p className="text-sm text-muted-foreground">לעיין בכל המידע שמוחזק עליך במאגר שלנו, ללא תשלום</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✏️</span>
              <div>
                <h4 className="font-bold">זכות תיקון</h4>
                <p className="text-sm text-muted-foreground">לתקן מידע שגוי, לא מדויק או לא מלא</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🗑️</span>
              <div>
                <h4 className="font-bold">זכות מחיקה</h4>
                <p className="text-sm text-muted-foreground">למחוק את המידע שלך מהמערכת (בכפוף לחובות חוקיות)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <h4 className="font-bold">זכות לניידות מידע</h4>
                <p className="text-sm text-muted-foreground">לקבל את המידע שלך בפורמט נפוץ ונייד (JSON, CSV, PDF)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🚫</span>
              <div>
                <h4 className="font-bold">זכות התנגדות</h4>
                <p className="text-sm text-muted-foreground">להתנגד לעיבוד מידע מסוים, במיוחד לצורכי שיווק</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⏸️</span>
              <div>
                <h4 className="font-bold">זכות להגבלת עיבוד</h4>
                <p className="text-sm text-muted-foreground">לבקש הגבלה זמנית של עיבוד המידע במקרים מסוימים</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg">
            <p className="font-bold mb-2">איך מממשים את הזכויות?</p>
            <p className="text-sm mb-3">
              אנו מחויבים לענות לבקשתך תוך 30 יום. אם לא נענה בזמן, תוכל לפנות לרשות להגנת הפרטיות.
            </p>
            <Link href="/privacy-center" className="text-blue-600 hover:underline font-bold">
              👉 עבור למרכז הפרטיות שלי
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cookies (עוגיות)</h2>
          <p className="mb-4">
            אנו משתמשים ב-Cookies לשיפור חוויית המשתמש. לפי חוק, אנו זקוקים להסכמתך לשימוש בעוגיות שאינן הכרחיות.
          </p>

          <h3 className="text-xl font-bold mb-3">סוגי העוגיות שאנו משתמשים בהן:</h3>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>עוגיות הכרחיות:</strong> נדרשות לתפקוד בסיסי של האתר (אבטחה, ניווט)
            </li>
            <li>
              <strong>עוגיות פונקציונליות:</strong> שמירת העדפות, תכונות משופרות
            </li>
            <li>
              <strong>עוגיות אנליטיות:</strong> ניתוח שימוש לשיפור השירות
            </li>
            <li>
              <strong>עוגיות פרסום:</strong> הצגת תוכן מותאם אישית
            </li>
          </ul>

          <p className="mt-4">
            אתה יכול לנהל את העדפות העוגיות שלך בכל עת דרך{" "}
            <Link href="/privacy-center" className="text-blue-600 hover:underline">
              מרכז הפרטיות
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">אבטחת מידע</h2>
          <p className="mb-4">אנו נוקטים באמצעי אבטחה מתקדמים בהתאם לתקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🔐 הצפנה</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SSL/TLS לכל התקשורת</li>
                <li>• הצפנת סיסמאות</li>
                <li>• הצפנת מידע רגיש</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">👥 בקרת גישה</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• אימות דו-שלבי</li>
                <li>• הרשאות מוגבלות</li>
                <li>• ניטור גישה</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">📊 ניטור</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ניטור אבטחה 24/7</li>
                <li>• זיהוי איומים</li>
                <li>• תיעוד פעילות</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">💾 גיבוי</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• גיבויים אוטומטיים</li>
                <li>• שחזור מהיר</li>
                <li>• אחסון מבוזר</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm">
              <strong>⚠️ חשוב:</strong> למרות כל המאמצים, אין מערכת אבטחה חסינה לחלוטין. אנו ממליצים לשמור על סיסמאות
              חזקות ולא לשתף אותן עם אחרים.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">כמה זמן אנו שומרים את המידע שלך?</h2>
          <p className="mb-4">אנו שומרים את המידע שלך למשך הזמן הנדרש:</p>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>חשבון פעיל:</strong> כל עוד החשבון שלך פעיל
            </li>
            <li>
              <strong>לאחר מחיקה:</strong> עד 90 יום לצורכי גיבוי ואבטחה
            </li>
            <li>
              <strong>לוגים ותיעוד:</strong> 24 חודשים (כנדרש בחוק)
            </li>
            <li>
              <strong>חובות חוקיות:</strong> כל עוד נדרש על פי חוק (מס, ביטוח לאומי וכו')
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">יצירת קשר וממונה על הגנת הפרטיות</h2>
          <p className="mb-4">לשאלות, בקשות או תלונות בנושא פרטיות:</p>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
            <div>
              <p className="font-bold mb-2">ממונה על הגנת הפרטיות:</p>
              <p>אימייל: privacy@vibecodeglm.com</p>
              <p>טלפון: 03-1234567</p>
            </div>

            <div>
              <p className="font-bold mb-2">רשות להגנת הפרטיות:</p>
              <p>אתר: www.gov.il/ppa</p>
              <p>טלפון: 02-6467064 או 03-7634050</p>
              <p>כתובת: קרית הממשלה, ת.ד. 7360, תל אביב 6107202</p>
            </div>

            <Link href="/contact" className="inline-block mt-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">טופס יצירת קשר</button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">פרטי המאגר (רישום לפי חוק)</h2>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-2">
            <p>
              <strong>שם המאגר:</strong> מאגר משתמשי Vibe Code GLM
            </p>
            <p>
              <strong>בעל המאגר:</strong> Vibe Code GLM
            </p>
            <p>
              <strong>מטרת המאגר:</strong> ניהול משתמשים, תוכן ושירותי הפלטפורמה
            </p>
            <p>
              <strong>סוגי מידע:</strong> מידע אישי, מידע מקצועי, תוכן שנוצר
            </p>
            <p>
              <strong>מספר רישום:</strong> [יש להשלים לאחר רישום במשרד המשפטים]
            </p>
            <p>
              <strong>תאריך עדכון אחרון:</strong> {new Date().toLocaleDateString("he-IL")}
            </p>
            <p>
              <strong>גרסה:</strong> 2.0 (תואם תיקון 13)
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
