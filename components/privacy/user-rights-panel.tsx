"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Eye, Edit, Trash2, Ban, Download } from "lucide-react"

export function UserRightsPanel() {
  const { toast } = useToast()
  const [requestType, setRequestType] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const submitRequest = async () => {
    if (!requestType) {
      toast({
        title: "שגיאה",
        description: "אנא בחר סוג בקשה",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/privacy/rights-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType, description }),
      })

      if (response.ok) {
        toast({
          title: "הבקשה נשלחה",
          description: "נטפל בבקשתך תוך 30 יום כנדרש בחוק",
        })
        setRequestType("")
        setDescription("")
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשלוח את הבקשה. נסה שוב.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">הזכויות שלך במידע</h2>
        <p className="text-muted-foreground mb-6">
          לפי תיקון 13 לחוק הגנת הפרטיות, יש לך זכויות מלאות על המידע שלך. נענה לבקשתך תוך 30 יום.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <Eye className="w-8 h-8 mb-2 text-blue-600" />
            <h3 className="font-bold mb-1">זכות עיון</h3>
            <p className="text-sm text-muted-foreground">צפה בכל המידע שיש לנו עליך</p>
          </div>

          <div className="p-4 border rounded-lg">
            <Edit className="w-8 h-8 mb-2 text-green-600" />
            <h3 className="font-bold mb-1">זכות תיקון</h3>
            <p className="text-sm text-muted-foreground">תקן מידע שגוי או לא מדויק</p>
          </div>

          <div className="p-4 border rounded-lg">
            <Trash2 className="w-8 h-8 mb-2 text-red-600" />
            <h3 className="font-bold mb-1">זכות מחיקה</h3>
            <p className="text-sm text-muted-foreground">מחק את המידע שלך מהמערכת</p>
          </div>

          <div className="p-4 border rounded-lg">
            <Download className="w-8 h-8 mb-2 text-purple-600" />
            <h3 className="font-bold mb-1">זכות העברה</h3>
            <p className="text-sm text-muted-foreground">קבל את המידע שלך בפורמט נייד</p>
          </div>

          <div className="p-4 border rounded-lg md:col-span-2">
            <Ban className="w-8 h-8 mb-2 text-orange-600" />
            <h3 className="font-bold mb-1">זכות התנגדות</h3>
            <p className="text-sm text-muted-foreground">התנגד לשימושים מסוימים במידע שלך</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="request-type">סוג הבקשה</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger id="request-type">
                <SelectValue placeholder="בחר סוג בקשה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access">עיון במידע</SelectItem>
                <SelectItem value="correction">תיקון מידע</SelectItem>
                <SelectItem value="deletion">מחיקת מידע</SelectItem>
                <SelectItem value="export">העברת מידע</SelectItem>
                <SelectItem value="objection">התנגדות לשימוש</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">פרטים נוספים (אופציונלי)</Label>
            <Textarea
              id="description"
              placeholder="תאר את הבקשה שלך בפירוט..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={submitRequest} disabled={loading} className="w-full">
            {loading ? "שולח..." : "שלח בקשה"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h3 className="font-bold mb-2">⚖️ זכויותיך מוגנות בחוק</h3>
        <p className="text-sm text-muted-foreground">
          לפי תיקון 13 לחוק הגנת הפרטיות, אנו מחויבים לענות לבקשתך תוך 30 יום. אם לא נענה בזמן, תוכל לפנות לרשות להגנת
          הפרטיות בטלפון 02-6467064 או באתר www.gov.il/ppa
        </p>
      </Card>
    </div>
  )
}
