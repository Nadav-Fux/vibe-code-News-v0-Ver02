"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  advertising: boolean
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    advertising: false,
  })

  useEffect(() => {
    // בדיקה אם המשתמש כבר נתן הסכמה
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const saveConsent = async (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }

    localStorage.setItem("cookie-consent", JSON.stringify(consentData))

    // שמירה ב-DB
    try {
      await fetch("/api/privacy/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consentData),
      })
    } catch (error) {
      console.error("Failed to save consent:", error)
    }

    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true,
    }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
  }

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      advertising: false,
    }
    setPreferences(onlyNecessary)
    saveConsent(onlyNecessary)
  }

  const saveCustom = () => {
    saveConsent(preferences)
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
        <Card className="max-w-4xl mx-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">🍪 אנחנו משתמשים בעוגיות</h3>
              <p className="text-sm text-muted-foreground mb-4">
                אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה שלך, לנתח תנועה באתר ולהציג תוכן מותאם אישית. לפי חוק הגנת
                הפרטיות, אנו זקוקים להסכמתך לשימוש בעוגיות שאינן הכרחיות.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={acceptAll} size="sm">
                  קבל הכל
                </Button>
                <Button onClick={rejectAll} variant="outline" size="sm">
                  דחה הכל
                </Button>
                <Button onClick={() => setShowSettings(true)} variant="ghost" size="sm">
                  <Settings className="w-4 h-4 ml-2" />
                  התאמה אישית
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={rejectAll} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>הגדרות עוגיות</DialogTitle>
            <DialogDescription>
              בחר אילו סוגי עוגיות אתה מאשר. עוגיות הכרחיות נדרשות לתפקוד האתר ולא ניתן לבטל אותן.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* עוגיות הכרחיות */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked disabled />
                  <Label className="font-bold">עוגיות הכרחיות (חובה)</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pr-6">
                עוגיות אלה נדרשות לתפקוד בסיסי של האתר, כולל אבטחה וניווט. לא ניתן לבטל אותן.
              </p>
            </div>

            {/* עוגיות פונקציונליות */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={preferences.functional}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, functional: !!checked })}
                  />
                  <Label className="font-bold">עוגיות פונקציונליות</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pr-6">
                עוגיות אלה מאפשרות תכונות משופרות כמו שמירת העדפות ותוכן מותאם אישית.
              </p>
            </div>

            {/* עוגיות אנליטיות */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: !!checked })}
                  />
                  <Label className="font-bold">עוגיות אנליטיות</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pr-6">
                עוגיות אלה עוזרות לנו להבין כיצד המשתמשים מתקשרים עם האתר, כדי לשפר את השירות.
              </p>
            </div>

            {/* עוגיות פרסום */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={preferences.advertising}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, advertising: !!checked })}
                  />
                  <Label className="font-bold">עוגיות פרסום</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pr-6">
                עוגיות אלה משמשות להצגת פרסומות רלוונטיות ומותאמות אישית.
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={saveCustom}>שמור העדפות</Button>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              ביטול
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
