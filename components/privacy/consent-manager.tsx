"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface ConsentSettings {
  marketing_emails: boolean
  analytics_cookies: boolean
  functional_cookies: boolean
  advertising_cookies: boolean
  data_sharing: boolean
}

export function ConsentManager() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<ConsentSettings>({
    marketing_emails: false,
    analytics_cookies: false,
    functional_cookies: true,
    advertising_cookies: false,
    data_sharing: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/privacy/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/privacy/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "ההגדרות נשמרו",
          description: "העדפות הפרטיות שלך עודכנו בהצלחה",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשמור את ההגדרות. נסה שוב.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">ניהול הסכמות</h2>
      <p className="text-muted-foreground mb-6">
        בחר אילו שימושים במידע שלך אתה מאשר. אתה יכול לשנות את ההעדפות בכל עת.
      </p>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">דיוור שיווקי</Label>
            <p className="text-sm text-muted-foreground">קבל עדכונים, הצעות ותכנים שיווקיים באימייל</p>
          </div>
          <Switch
            id="marketing"
            checked={settings.marketing_emails}
            onCheckedChange={(checked) => setSettings({ ...settings, marketing_emails: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">עוגיות אנליטיות</Label>
            <p className="text-sm text-muted-foreground">עזור לנו לשפר את השירות באמצעות ניתוח שימוש</p>
          </div>
          <Switch
            id="analytics"
            checked={settings.analytics_cookies}
            onCheckedChange={(checked) => setSettings({ ...settings, analytics_cookies: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="functional">עוגיות פונקציונליות</Label>
            <p className="text-sm text-muted-foreground">שמירת העדפות ותכונות משופרות (מומלץ)</p>
          </div>
          <Switch
            id="functional"
            checked={settings.functional_cookies}
            onCheckedChange={(checked) => setSettings({ ...settings, functional_cookies: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="advertising">עוגיות פרסום</Label>
            <p className="text-sm text-muted-foreground">הצגת פרסומות מותאמות אישית</p>
          </div>
          <Switch
            id="advertising"
            checked={settings.advertising_cookies}
            onCheckedChange={(checked) => setSettings({ ...settings, advertising_cookies: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sharing">שיתוף מידע עם שותפים</Label>
            <p className="text-sm text-muted-foreground">שיתוף מידע עם שותפים עסקיים לשיפור השירות</p>
          </div>
          <Switch
            id="sharing"
            checked={settings.data_sharing}
            onCheckedChange={(checked) => setSettings({ ...settings, data_sharing: checked })}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? "שומר..." : "שמור הגדרות"}
        </Button>
        <Button variant="outline" onClick={loadSettings}>
          בטל שינויים
        </Button>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>לתשומת ליבך:</strong> שינוי ההגדרות ייכנס לתוקף מיידית. אתה יכול לשנות את ההעדפות שלך בכל עת.
        </p>
      </div>
    </Card>
  )
}
