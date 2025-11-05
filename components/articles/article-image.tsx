"use client"

import { OptimizedImage } from "@/components/ui/optimized-image"
import { getResponsiveSizes } from "@/lib/utils/image-optimizer"

interface ArticleImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function ArticleImage({ src, alt, priority = false, className }: ArticleImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority={priority}
      sizes={getResponsiveSizes({ mobile: 100, tablet: 100, desktop: 75 })}
      quality={90}
      className={className}
    />
  )
}
