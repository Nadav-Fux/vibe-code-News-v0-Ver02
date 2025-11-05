import { type NextRequest, NextResponse } from "next/server"
import { translateText, type Language } from "@/lib/ai/translation"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, targetLanguage, sourceLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await translateText(text, targetLanguage as Language, sourceLanguage as Language | undefined)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Failed to translate text" }, { status: 500 })
  }
}
