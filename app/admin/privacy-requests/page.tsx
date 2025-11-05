import { Suspense } from "react"
import { PrivacyRequestsDashboard } from "@/components/admin/privacy-requests-dashboard"
import { Shield } from "lucide-react"

export const metadata = {
  title: "ניהול בקשות פרטיות | Admin",
  description: "דשבורד לניהול בקשות זכויות משתמשים",
}

export default function PrivacyRequestsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold">ניהול בקשות פרטיות</h1>
        </div>
        <p className="text-muted-foreground">מעקב וטיפול בבקשות זכויות משתמשים לפי תיקון 13</p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-6">
        <p className="text-sm">
          <strong>⚠️ חשוב:</strong> חובה חוקית לענות לבקשות תוך 30 יום. בקשות דחופות מסומנות באדום.
        </p>
      </div>

      <Suspense fallback={<div>טוען...</div>}>
        <PrivacyRequestsDashboard />
      </Suspense>
    </div>
  )
}
