import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSecurityHeaders } from "@/lib/security/csp"
import { rateLimit } from "@/lib/security/rate-limit"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip PWA files
  const pwaFiles = ["/manifest.json", "/sw.js", "/workbox", "/icon-"]
  if (pwaFiles.some((file) => pathname.includes(file))) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const identifier = `${ip}-${pathname}`

    const allowed = rateLimit(identifier, {
      interval: 60 * 1000,
      maxRequests: 60,
    })

    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }
  }

  const response = await updateSession(request)

  const securityHeaders = getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
