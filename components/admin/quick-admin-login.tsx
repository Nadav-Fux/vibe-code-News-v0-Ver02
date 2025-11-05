"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function QuickAdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleQuickLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/quick-admin-login", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to admin page
        router.push("/admin")
        router.refresh()
      } else {
        alert("שגיאה בכניסה: " + data.error)
      }
    } catch (error) {
      console.error("[v0] Quick login error:", error)
      alert("שגיאה בכניסה")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleQuickLogin} variant="destructive" size="sm" disabled={loading}>
      {loading ? "מתחבר..." : "🔑 כניסה מהירה כאדמין"}
    </Button>
  )
}
