import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t mt-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">אודות</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Vibe Code GLM - פלטפורמת תוכן מתקדמת עם AI למפתחים ואנשי טכנולוגיה
            </p>
            <Link href="/about">
              <Button variant="link" className="p-0 h-auto">
                קרא עוד
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/articles"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  מאמרים
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  קטגוריות
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">משפטי</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  תנאי שימוש
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  הצהרת נגישות
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-center"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 font-bold"
                >
                  <Shield className="w-4 h-4" />
                  מרכז הפרטיות שלי
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">יצירת קשר</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="mailto:info@vibecodeglm.com" className="hover:text-gray-900 dark:hover:text-gray-100">
                  info@vibecodeglm.com
                </a>
              </li>
              <li>
                <a href="mailto:privacy@vibecodeglm.com" className="hover:text-gray-900 dark:hover:text-gray-100">
                  privacy@vibecodeglm.com
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-100">
                  טופס יצירת קשר
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-center">
            <strong>🔒 הפרטיות שלך חשובה לנו</strong> - האתר עומד בתיקון 13 לחוק הגנת הפרטיות ובתקנות אבטחת מידע.{" "}
            <Link href="/privacy-center" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
              נהל את הפרטיות שלך כאן
            </Link>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 Vibe Code GLM. כל הזכויות שמורות.</p>
          <p className="mt-2 text-xs">מאגר רשום לפי חוק הגנת הפרטיות | תואם תיקון 13 | מעודכן ל-14.8.2025</p>
        </div>
      </div>
    </footer>
  )
}
