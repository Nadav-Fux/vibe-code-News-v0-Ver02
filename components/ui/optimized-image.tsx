"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-sm">שגיאה בטעינת תמונה</span>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("duration-700 ease-in-out", isLoading ? "scale-105 blur-lg" : "scale-100 blur-0")}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
      {isLoading && <div className="absolute inset-0 animate-pulse bg-muted" />}
    </div>
  )
}
