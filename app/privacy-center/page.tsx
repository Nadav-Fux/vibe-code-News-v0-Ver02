import { Suspense } from "react"
import { ConsentManager } from "@/components/privacy/consent-manager"
import { UserRightsPanel } from "@/components/privacy/user-rights-panel"
import { DataExportPanel } from "@/components/privacy/data-export-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Download, Settings, FileText } from "lucide-react"

export default function PrivacyCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">מרכז הפרטיות שלי</h1>
        <p className="text-muted-foreground">נהל את הפרטיות שלך, הסכמות ובקש גישה למידע שלך</p>
      </div>

      <Tabs defaultValue="consents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consents">
            <Settings className="w-4 h-4 ml-2" />
            הסכמות
          </TabsTrigger>
          <TabsTrigger value="rights">
            <Shield className="w-4 h-4 ml-2" />
            זכויות
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="w-4 h-4 ml-2" />
            ייצוא מידע
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 ml-2" />
            מסמכים
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consents">
          <Suspense fallback={<div>טוען...</div>}>
            <ConsentManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="rights">
          <Suspense fallback={<div>טוען...</div>}>
            <UserRightsPanel />
          </Suspense>
        </TabsContent>

        <TabsContent value="export">
          <Suspense fallback={<div>טוען...</div>}>
            <DataExportPanel />
          </Suspense>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">מסמכים משפטיים</h2>
            <div className="grid gap-4">
              <a href="/privacy" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <h3 className="font-bold">מדיניות פרטיות</h3>
                <p className="text-sm text-muted-foreground">קרא את מדיניות הפרטיות המלאה שלנו</p>
              </a>
              <a href="/accessibility" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <h3 className="font-bold">הצהרת נגישות</h3>
                <p className="text-sm text-muted-foreground">הצהרת הנגישות שלנו לפי חוקי ישראל</p>
              </a>
              <a href="/terms" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <h3 className="font-bold">תנאי שימוש</h3>
                <p className="text-sm text-muted-foreground">תנאי השימוש באתר ובשירותים</p>
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
