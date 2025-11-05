"use client"

import { useEffect, useState } from "react"

export function useCSRF() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/csrf")
        const data = await response.json()
        setToken(data.token)
      } catch (error) {
        console.error("[v0] Failed to fetch CSRF token:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [])

  return { token, loading }
}
