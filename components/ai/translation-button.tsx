"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Languages, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TranslationButtonProps {
  text: string
  onTranslated: (translatedText: string) => void
  targetLanguage: "he" | "en"
}

export function TranslationButton({ text, onTranslated, targetLanguage }: TranslationButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    setIsTranslating(true)
    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage }),
      })

      if (!response.ok) throw new Error("Translation failed")

      const result = await response.json()
      onTranslated(result.translatedText)
      toast({
        title: "תורגם בהצלחה",
        description: `התוכן תורגם ל${targetLanguage === "he" ? "עברית" : "אנגלית"}`,
      })
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לתרגם את התוכן",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleTranslate} disabled={isTranslating}>
      {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
      <span className="mr-2">תרגם ל{targetLanguage === "he" ? "עברית" : "אנגלית"}</span>
    </Button>
  )
}
