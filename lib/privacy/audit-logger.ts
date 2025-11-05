import { createClient } from "@/lib/supabase/server"

export type AuditAction =
  | "view"
  | "edit"
  | "delete"
  | "export"
  | "consent_given"
  | "consent_revoked"
  | "data_access_request"
  | "data_deletion_request"
  | "sign_up"
  | "sign_in"
  | "sign_out"
  | "profile_update"
  | "password_change"

export type ResourceType = "profile" | "article" | "comment" | "analytics" | "user_data"

interface AuditLogEntry {
  userId?: string
  actionType: AuditAction
  resourceType: ResourceType
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
}

/**
 * רישום פעולות פרטיות - נדרש לפי תיקון 13 לחוק הגנת הפרטיות
 * כל פעולה הקשורה למידע אישי חייבת להירשם
 */
export async function logPrivacyAction(entry: AuditLogEntry) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("privacy_audit_log").insert({
      user_id: entry.userId,
      action_type: entry.actionType,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      details: entry.details,
    })

    if (error) {
      console.error("[Privacy Audit] Failed to log action:", error)
    }
  } catch (error) {
    console.error("[Privacy Audit] Error logging action:", error)
  }
}

/**
 * קבלת לוג הפעולות של משתמש - זכות עיון
 */
export async function getUserAuditLog(userId: string, limit = 100) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("privacy_audit_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[Privacy Audit] Failed to get user audit log:", error)
    return []
  }

  return data
}

/**
 * מחיקת לוג ישן (שמירה ל-24 חודשים לפי תקנות אבטחת מידע)
 */
export async function cleanOldAuditLogs() {
  const supabase = await createClient()

  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const { error } = await supabase.from("privacy_audit_log").delete().lt("created_at", twoYearsAgo.toISOString())

  if (error) {
    console.error("[Privacy Audit] Failed to clean old logs:", error)
  }
}

// Additional updates can be inserted here if needed
