import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ErrorBoundary } from "@/components/error/error-boundary"
import { PerformanceMonitoring } from "@/components/monitoring/performance-monitoring"
import { CookieBanner } from "@/components/privacy/cookie-banner"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vibe Code GLM - פלטפורמת תוכן מתקדמת",
  description: "פלטפורמה מתקדמת לניהול תוכן עם AI, מאמרים, ומבזקים בזמן אמת",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`font-sans antialiased`}>
        <ErrorBoundary>
          <PerformanceMonitoring />
          {children}
          <CookieBanner />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ErrorBoundary>
      </body>
    </html>
  )
}
