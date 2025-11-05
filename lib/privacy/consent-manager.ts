import { createClient } from "@/lib/supabase/server"
import { logPrivacyAction } from "./audit-logger"

export type ConsentType = "marketing" | "analytics" | "data_processing"

/**
 * ניהול הסכמות משתמשים - נדרש לפי תיקון 13
 */
export async function grantConsent(userId: string, consentType: ConsentType, ipAddress?: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("user_consents").upsert({
    user_id: userId,
    consent_type: consentType,
    granted: true,
    granted_at: new Date().toISOString(),
    revoked_at: null,
    ip_address: ipAddress,
  })

  if (!error) {
    await logPrivacyAction({
      userId,
      actionType: "consent_given",
      resourceType: "user_data",
      ipAddress,
      details: { consentType },
    })
  }

  return { error }
}

/**
 * ביטול הסכמה
 */
export async function revokeConsent(userId: string, consentType: ConsentType, ipAddress?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("user_consents")
    .update({
      granted: false,
      revoked_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("consent_type", consentType)

  if (!error) {
    await logPrivacyAction({
      userId,
      actionType: "consent_revoked",
      resourceType: "user_data",
      ipAddress,
      details: { consentType },
    })
  }

  return { error }
}

/**
 * בדיקת הסכמה
 */
export async function checkConsent(userId: string, consentType: ConsentType) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("user_consents")
    .select("granted")
    .eq("user_id", userId)
    .eq("consent_type", consentType)
    .single()

  return data?.granted ?? false
}

// Additional functionality for managing consent status history
export async function getConsentHistory(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase.from("user_consents").select("*").eq("user_id", userId)

  return data ?? []
}
