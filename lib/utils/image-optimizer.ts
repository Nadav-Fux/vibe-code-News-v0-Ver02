export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: "webp" | "avif" | "jpeg" | "png"
}

export function getOptimizedImageUrl(url: string, options: ImageOptimizationOptions = {}): string {
  const { width, height, quality = 85, format = "webp" } = options

  // If it's a Vercel Blob URL, use Next.js Image Optimization
  if (url.includes("blob.vercel-storage.com")) {
    const params = new URLSearchParams()
    if (width) params.set("w", width.toString())
    if (height) params.set("h", height.toString())
    params.set("q", quality.toString())
    params.set("fm", format)

    return `${url}?${params.toString()}`
  }

  // For other URLs, return as-is (Next.js Image will optimize)
  return url
}

export function getResponsiveSizes(breakpoints: {
  mobile?: number
  tablet?: number
  desktop?: number
}): string {
  const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints

  return `(max-width: 768px) ${mobile}vw, (max-width: 1200px) ${tablet}vw, ${desktop}vw`
}

export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(width, height)
  return `${width / divisor}/${height / divisor}`
}
