"use client"

import { useExperiment, type Variant } from "@/lib/ab-testing/experiments"
import type { ReactNode } from "react"

interface ExperimentWrapperProps {
  experimentId: string
  variants: Record<Variant, ReactNode>
  fallback?: ReactNode
}

export function ExperimentWrapper({ experimentId, variants, fallback }: ExperimentWrapperProps) {
  const { variant, isLoading } = useExperiment(experimentId)

  if (isLoading) {
    return fallback || variants.control || null
  }

  return <>{variants[variant] || variants.control}</>
}
