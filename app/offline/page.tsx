import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">אין חיבור לאינטרנט</h1>
        <p className="text-muted-foreground mb-6">נראה שאתה לא מחובר לאינטרנט. בדוק את החיבור שלך ונסה שוב.</p>
        <Button asChild>
          <Link href="/">חזור לדף הבית</Link>
        </Button>
      </div>
    </div>
  )
}
