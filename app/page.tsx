import { NewsFlashFeed } from "@/components/news/news-flash-feed"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { QuickAdminLogin } from "@/components/admin/quick-admin-login"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-4">
            <QuickAdminLogin />
            <Link href="/auth/sign-up">
              <Button>הרשמה</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">כניסה</Button>
            </Link>
            <Link href="/articles">
              <Button variant="ghost">מאמרים</Button>
            </Link>
          </nav>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Vibe Code GLM
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">פלטפורמת תוכן מתקדמת עם AI</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          קבל עדכונים בזמן אמת, קרא מאמרים מעניינים, והצטרף לקהילה של מפתחים
        </p>
      </section>

      {/* News Flash Feed */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold mb-6 text-center">מבזקים אחרונים</h3>
        <NewsFlashFeed />
      </section>

      {/* Recent Articles */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold">מאמרים אחרונים</h3>
          <Link href="/articles">
            <Button variant="outline">כל המאמרים</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Placeholder for articles - will be populated from DB */}
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-lg mb-2">מדריכים ומאמרים</h4>
            <p className="text-gray-600">גלה מאמרים מעניינים בתחום הפיתוח וה-AI</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">מוכנים להצטרף?</h3>
          <p className="text-xl mb-8 opacity-90">הירשם עכשיו וקבל גישה לכל התכונות המתקדמות</p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary">
              הרשמה חינם
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
