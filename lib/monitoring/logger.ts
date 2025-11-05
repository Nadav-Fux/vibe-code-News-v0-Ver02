type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
}

class Logger {
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      sessionId: this.sessionId,
    }

    // Console output in development
    if (process.env.NODE_ENV === "development") {
      const style = {
        info: "color: #3b82f6",
        warn: "color: #f59e0b",
        error: "color: #ef4444",
        debug: "color: #8b5cf6",
      }[level]

      console.log(`%c[${level.toUpperCase()}]`, style, message, context || "")
    }

    // Send to logging endpoint
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        })
      } catch (error) {
        console.error("Failed to send log:", error)
      }
    }
  }

  info(message: string, context?: Record<string, any>) {
    return this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    return this.log("warn", message, context)
  }

  error(message: string, context?: Record<string, any>) {
    return this.log("error", message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    return this.log("debug", message, context)
  }
}

export const logger = new Logger()
