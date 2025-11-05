"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-card border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">התקן את האפליקציה</h3>
            <p className="text-sm text-muted-foreground mb-3">התקן את VCG Platform למכשיר שלך לגישה מהירה</p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm">
                <Download className="h-4 w-4 ml-2" />
                התקן
              </Button>
              <Button onClick={() => setShowInstallPrompt(false)} variant="outline" size="sm">
                אולי מאוחר יותר
              </Button>
            </div>
          </div>
          <Button onClick={() => setShowInstallPrompt(false)} variant="ghost" size="icon" className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
