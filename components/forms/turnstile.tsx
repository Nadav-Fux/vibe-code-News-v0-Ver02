"use client"

import { useEffect, useRef, useState } from "react"

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

// Cloudflare Turnstile - CAPTCHA חכם וחינמי
export function Turnstile({ siteKey, onVerify, onError, theme = "auto", size = "normal" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // טעינת סקריפט Turnstile
    if (!document.getElementById("turnstile-script")) {
      const script = document.createElement("script")
      script.id = "turnstile-script"
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      script.onload = () => setIsLoaded(true)
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile) {
      window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        "error-callback": onError,
        theme,
        size,
      })
    }
  }, [isLoaded, siteKey, onVerify, onError, theme, size])

  return <div ref={containerRef} className="flex justify-center" />
}

// הרחבת Window type
declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: Record<string, unknown>) => void
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}
