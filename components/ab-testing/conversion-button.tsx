"use client"

import { trackConversion } from "@/lib/ab-testing/experiments"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface ConversionButtonProps {
  experimentId: string
  variant: string
  onClick?: () => void
  children: ReactNode
  className?: string
}

export function ConversionButton({ experimentId, variant, onClick, children, className }: ConversionButtonProps) {
  const handleClick = () => {
    trackConversion(experimentId, variant as any)
    onClick?.()
  }

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  )
}
