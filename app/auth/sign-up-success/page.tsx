import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-center">ההרשמה הושלמה בהצלחה!</CardTitle>
              <CardDescription className="text-center">נא לאשר את כתובת המייל</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                נשלח אליך מייל עם קישור לאישור החשבון. לאחר האישור תוכל להתחבר למערכת.
              </p>
              <p className="text-xs text-muted-foreground text-center bg-muted p-3 rounded-lg">
                💡 <strong>למפתחים:</strong> אם אתה בסביבת פיתוח, אפשר לדלג על אישור המייל ולהפוך את המשתמש ל-admin
                ישירות דרך{" "}
                <Link href="/admin/make-admin" className="underline">
                  דף ה-Admin
                </Link>
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="w-full">
                  <Link href="/">חזרה לעמוד הבית</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/auth/login">מעבר להתחברות</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
