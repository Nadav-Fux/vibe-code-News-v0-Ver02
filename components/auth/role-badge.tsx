import { Badge } from "@/components/ui/badge"
import { Shield, Edit, Eye } from "lucide-react"

interface RoleBadgeProps {
  role: "viewer" | "editor" | "admin"
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = {
    viewer: {
      label: "צופה",
      icon: Eye,
      variant: "secondary" as const,
    },
    editor: {
      label: "עורך",
      icon: Edit,
      variant: "default" as const,
    },
    admin: {
      label: "מנהל",
      icon: Shield,
      variant: "destructive" as const,
    },
  }

  const { label, icon: Icon, variant } = config[role]

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
