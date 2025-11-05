"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[v0] Service Worker registered:", registration)

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  if (window.confirm("גרסה חדשה זמינה! לטעון מחדש את הדף?")) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error("[v0] Service Worker registration failed:", error)
        })

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (window.confirm("האפליקציה עודכנה! לטעון מחדש את הדף?")) {
          window.location.reload()
        }
      })
    }
  }, [])

  return null
}
