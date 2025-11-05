"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MakeAdminPage() {
  const [email, setEmail] = useState("nadavf@gmail.com")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleMakeAdmin = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ המשתמש עודכן ל-Admin בהצלחה!")
      } else {
        setMessage(`❌ שגיאה: ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ שגיאה בעדכון המשתמש")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8" dir="rtl">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>הפוך משתמש ל-Admin</CardTitle>
          <CardDescription>עדכן משתמש קיים להרשאות מנהל</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">אימייל המשתמש</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <Button onClick={handleMakeAdmin} disabled={loading} className="w-full">
            {loading ? "מעדכן..." : "הפוך ל-Admin"}
          </Button>

          {message && <div className="text-sm text-center p-3 rounded-lg bg-muted">{message}</div>}

          <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
            <p className="font-medium">הוראות:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                הירשם תחילה ב-
                <a href="/auth/sign-up" className="text-primary underline">
                  /auth/sign-up
                </a>
              </li>
              <li>חזור לדף זה ולחץ "הפוך ל-Admin"</li>
              <li>
                רענן את הדף ונווט ל-
                <a href="/admin/content-scraper" className="text-primary underline">
                  /admin/content-scraper
                </a>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
