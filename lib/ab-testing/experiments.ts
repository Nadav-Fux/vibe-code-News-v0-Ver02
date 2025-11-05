"use client"

import { useEffect, useState } from "react"

export type Variant = "control" | "variant_a" | "variant_b"

export interface Experiment {
  id: string
  name: string
  description: string
  variants: {
    id: Variant
    name: string
    weight: number
  }[]
  status: "draft" | "running" | "completed"
  startDate?: Date
  endDate?: Date
}

// ניהול ניסויים
const experiments: Record<string, Experiment> = {
  "homepage-hero": {
    id: "homepage-hero",
    name: "כותרת דף הבית",
    description: "בדיקת וריאציות שונות של הכותרת בדף הבית",
    variants: [
      { id: "control", name: "מקורי", weight: 34 },
      { id: "variant_a", name: "וריאציה A", weight: 33 },
      { id: "variant_b", name: "וריאציה B", weight: 33 },
    ],
    status: "running",
  },
  "cta-button": {
    id: "cta-button",
    name: "כפתור CTA",
    description: "בדיקת צבעים שונים לכפתור הרשמה",
    variants: [
      { id: "control", name: "כחול", weight: 50 },
      { id: "variant_a", name: "ירוק", weight: 50 },
    ],
    status: "running",
  },
}

// בחירת וריאנט לפי משקל
function selectVariant(experiment: Experiment): Variant {
  const random = Math.random() * 100
  let cumulative = 0

  for (const variant of experiment.variants) {
    cumulative += variant.weight
    if (random <= cumulative) {
      return variant.id
    }
  }

  return "control"
}

// שמירה ב-localStorage
function getStoredVariant(experimentId: string): Variant | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(`experiment_${experimentId}`)
  return stored as Variant | null
}

function storeVariant(experimentId: string, variant: Variant) {
  if (typeof window === "undefined") return
  localStorage.setItem(`experiment_${experimentId}`, variant)
}

// Hook לשימוש בניסוי
export function useExperiment(experimentId: string): {
  variant: Variant
  isLoading: boolean
} {
  const [variant, setVariant] = useState<Variant>("control")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const experiment = experiments[experimentId]
    if (!experiment || experiment.status !== "running") {
      setVariant("control")
      setIsLoading(false)
      return
    }

    // בדיקה אם כבר יש וריאנט שמור
    const stored = getStoredVariant(experimentId)
    if (stored) {
      setVariant(stored)
      setIsLoading(false)
      return
    }

    // בחירת וריאנט חדש
    const selected = selectVariant(experiment)
    storeVariant(experimentId, selected)
    setVariant(selected)
    setIsLoading(false)

    // שליחת אירוע לאנליטיקס
    trackExperimentView(experimentId, selected)
  }, [experimentId])

  return { variant, isLoading }
}

// מעקב אחר צפייה בניסוי
async function trackExperimentView(experimentId: string, variant: Variant) {
  try {
    await fetch("/api/ab-testing/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experimentId,
        variant,
        event: "view",
      }),
    })
  } catch (error) {
    console.error("Failed to track experiment view:", error)
  }
}

// מעקב אחר המרה
export async function trackConversion(experimentId: string, variant: Variant) {
  try {
    await fetch("/api/ab-testing/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experimentId,
        variant,
        event: "conversion",
      }),
    })
  } catch (error) {
    console.error("Failed to track conversion:", error)
  }
}

// קבלת כל הניסויים
export function getExperiments(): Experiment[] {
  return Object.values(experiments)
}

// קבלת ניסוי ספציפי
export function getExperiment(id: string): Experiment | undefined {
  return experiments[id]
}
