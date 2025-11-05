export function getSiteUrl(): string {
  // בפריסה ב-Vercel, VERCEL_URL מתווסף אוטומטית
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // ברירת מחדל לפיתוח מקומי
  return "http://localhost:3000"
}
