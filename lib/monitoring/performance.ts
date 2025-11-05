interface PerformanceMetric {
  name: string
  value: number
  timestamp: string
  url: string
  userAgent: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []

  // Measure page load performance
  measurePageLoad() {
    if (typeof window === "undefined") return

    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      if (navigation) {
        this.recordMetric("page_load", navigation.loadEventEnd - navigation.fetchStart)
        this.recordMetric("dom_content_loaded", navigation.domContentLoadedEventEnd - navigation.fetchStart)
        this.recordMetric("first_paint", this.getFirstPaint())
      }
    })
  }

  // Measure component render time
  measureRender(componentName: string, startTime: number) {
    const duration = performance.now() - startTime
    this.recordMetric(`render_${componentName}`, duration)
  }

  // Measure API call duration
  async measureApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    try {
      const result = await apiCall()
      this.recordMetric(`api_${name}`, performance.now() - startTime)
      return result
    } catch (error) {
      this.recordMetric(`api_${name}_error`, performance.now() - startTime)
      throw error
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType("paint")
    const firstPaint = paintEntries.find((entry) => entry.name === "first-contentful-paint")
    return firstPaint ? firstPaint.startTime : 0
  }

  private recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    this.metrics.push(metric)

    // Send to analytics endpoint
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metric),
    }).catch(console.error)

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`%c[PERF] ${name}`, "color: #10b981", `${value.toFixed(2)}ms`)
    }
  }

  // Get Core Web Vitals
  measureWebVitals() {
    if (typeof window === "undefined") return

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric("lcp", lastEntry.startTime)
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric("fid", entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ["first-input"] })

    // Cumulative Layout Shift (CLS)
    let clsScore = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value
        }
      })
      this.recordMetric("cls", clsScore)
    }).observe({ entryTypes: ["layout-shift"] })
  }
}

export const performanceMonitor = new PerformanceMonitor()
