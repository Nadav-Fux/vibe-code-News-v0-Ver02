import { createClient } from "@/lib/supabase/server"

export type UserRole = "viewer" | "editor" | "admin"

export interface UserPermissions {
  canCreateArticles: boolean
  canEditOwnArticles: boolean
  canEditAllArticles: boolean
  canDeleteOwnArticles: boolean
  canDeleteAllArticles: boolean
  canManageUsers: boolean
  canViewAnalytics: boolean
}

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return (profile?.role as UserRole) || "viewer"
}

export async function getUserPermissions(): Promise<UserPermissions> {
  const role = await getUserRole()

  if (!role) {
    return {
      canCreateArticles: false,
      canEditOwnArticles: false,
      canEditAllArticles: false,
      canDeleteOwnArticles: false,
      canDeleteAllArticles: false,
      canManageUsers: false,
      canViewAnalytics: false,
    }
  }

  const permissions: Record<UserRole, UserPermissions> = {
    viewer: {
      canCreateArticles: false,
      canEditOwnArticles: false,
      canEditAllArticles: false,
      canDeleteOwnArticles: false,
      canDeleteAllArticles: false,
      canManageUsers: false,
      canViewAnalytics: false,
    },
    editor: {
      canCreateArticles: true,
      canEditOwnArticles: true,
      canEditAllArticles: false,
      canDeleteOwnArticles: true,
      canDeleteAllArticles: false,
      canManageUsers: false,
      canViewAnalytics: true,
    },
    admin: {
      canCreateArticles: true,
      canEditOwnArticles: true,
      canEditAllArticles: true,
      canDeleteOwnArticles: true,
      canDeleteAllArticles: true,
      canManageUsers: true,
      canViewAnalytics: true,
    },
  }

  return permissions[role]
}

export async function requirePermission(permission: keyof UserPermissions): Promise<boolean> {
  const permissions = await getUserPermissions()
  return permissions[permission]
}

export async function requireRole(allowedRoles: UserRole[]): Promise<boolean> {
  const role = await getUserRole()
  return role ? allowedRoles.includes(role) : false
}
