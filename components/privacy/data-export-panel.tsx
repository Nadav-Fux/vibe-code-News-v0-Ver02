"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"

export function DataExportPanel() {
  const { toast } = useToast()
  const [format, setFormat] = useState("json")
  const [loading, setLoading] = useState(false)

  const requestExport = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/privacy/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "הייצוא בתהליך",
          description: "נשלח לך קישור להורדה באימייל תוך מספר דקות",
        })
      } else {
        throw new Error("Failed to export")
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו ליצור את הייצוא. נסה שוב.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">ייצוא המידע שלך</h2>
      <p className="text-muted-foreground mb-6">
        הורד עותק של כל המידע שיש לנו עליך בפורמט הנוח לך. הקובץ יכלול את כל הנתונים האישיים, פעילות, הגדרות והסכמות.
      </p>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-bold mb-4 block">בחר פורמט:</Label>
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-muted transition-colors">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileJson className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold">JSON</div>
                  <div className="text-sm text-muted-foreground">פורמט מובנה, מתאים למפתחים</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-muted transition-colors">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-bold">CSV</div>
                  <div className="text-sm text-muted-foreground">ניתן לפתיחה באקסל, מתאים לניתוח</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-muted transition-colors">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-bold">PDF</div>
                  <div className="text-sm text-muted-foreground">מסמך קריא, מתאים להדפסה</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={requestExport} disabled={loading} className="w-full" size="lg">
          <Download className="w-4 h-4 ml-2" />
          {loading ? "מייצא..." : "בקש ייצוא מידע"}
        </Button>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-bold text-sm">מה כלול בייצוא?</h4>
          <ul className="text-sm text-muted-foreground space-y-1 pr-4">
            <li>• פרטים אישיים (שם, אימייל, טלפון)</li>
            <li>• היסטוריית פעילות באתר</li>
            <li>• הגדרות והעדפות</li>
            <li>• הסכמות שניתנו</li>
            <li>• תוכן שיצרת (מאמרים, תגובות)</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm">
            <strong>⏱️ שים לב:</strong> תהליך הייצוא עשוי לקחת מספר דקות. נשלח לך קישור להורדה באימייל ברגע שהקובץ יהיה
            מוכן. הקישור יהיה תקף ל-7 ימים.
          </p>
        </div>
      </div>
    </Card>
  )
}
