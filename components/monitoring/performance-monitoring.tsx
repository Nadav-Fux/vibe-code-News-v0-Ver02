"use client"

import { useEffect } from "react"
import { performanceMonitor } from "@/lib/monitoring/performance"

export function PerformanceMonitoring() {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.measurePageLoad()
    performanceMonitor.measureWebVitals()
  }, [])

  return null
}
