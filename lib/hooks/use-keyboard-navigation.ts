"use client"

import { useEffect } from "react"

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          options.onEscape?.()
          break
        case "Enter":
          options.onEnter?.()
          break
        case "ArrowUp":
          e.preventDefault()
          options.onArrowUp?.()
          break
        case "ArrowDown":
          e.preventDefault()
          options.onArrowDown?.()
          break
        case "ArrowLeft":
          options.onArrowLeft?.()
          break
        case "ArrowRight":
          options.onArrowRight?.()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [options])
}
