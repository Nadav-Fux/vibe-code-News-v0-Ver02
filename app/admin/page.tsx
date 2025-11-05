import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Newspaper, Shield, UserCog } from "lucide-react"

export default function AdminDashboard() {
  const adminPages = [
    {
      title: "סורק תוכן AI",
      description: "סרוק אתרים וחשבונות Twitter ליצירת מאמרים אוטומטית",
      href: "/admin/content-scraper",
      icon: Newspaper,
    },
    {
      title: "יצירת מאמרים",
      description: "הכנס 10 מאמרים מקיפים לטבלה בלחיצת כפתור",
      href: "/admin/seed-articles",
      icon: FileText,
    },
    {
      title: "בקשות פרטיות",
      description: "נהל בקשות משתמשים למחיקת נתונים וגישה למידע",
      href: "/admin/privacy-requests",
      icon: Shield,
    },
    {
      title: "הפוך ל-Admin",
      description: "הפוך את המשתמש הנוכחי למנהל מערכת",
      href: "/admin/make-admin",
      icon: UserCog,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">לוח בקרה - מנהל</h1>
        <p className="text-muted-foreground">נהל את המערכת, תוכן, ומשתמשים</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminPages.map((page) => {
          const Icon = page.icon
          return (
            <Link key={page.href} href={page.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{page.title}</CardTitle>
                  </div>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    פתח
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
