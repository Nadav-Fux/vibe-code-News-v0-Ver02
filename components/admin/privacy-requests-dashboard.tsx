"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash2, Download, Ban, Clock, CheckCircle } from "lucide-react"

interface Request {
  id: string
  email: string
  request_type: string
  status: string
  priority: string
  requested_at: string
  description?: string
}

export function PrivacyRequestsDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      // TODO: Implement API call to fetch requests
      setLoading(false)
    } catch (error) {
      console.error("Failed to load requests:", error)
      setLoading(false)
    }
  }

  const getRequestIcon = (type: string) => {
    const icons: Record<string, any> = {
      access: Eye,
      correction: Edit,
      deletion: Trash2,
      export: Download,
      objection: Ban,
    }
    const Icon = icons[type] || Eye
    return <Icon className="w-4 h-4" />
  }

  const getRequestTypeName = (type: string) => {
    const names: Record<string, string> = {
      access: "עיון במידע",
      correction: "תיקון מידע",
      deletion: "מחיקת מידע",
      export: "העברת מידע",
      objection: "התנגדות",
    }
    return names[type] || type
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "ממתין" },
      in_progress: { variant: "default", label: "בטיפול" },
      completed: { variant: "default", label: "הושלם" },
      rejected: { variant: "destructive", label: "נדחה" },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      normal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    }
    return (
      <Badge className={colors[priority] || colors.normal}>
        {priority === "urgent" ? "דחוף" : priority === "high" ? "גבוה" : priority === "low" ? "נמוך" : "רגיל"}
      </Badge>
    )
  }

  const getDaysRemaining = (requestedAt: string) => {
    const requested = new Date(requestedAt)
    const deadline = new Date(requested)
    deadline.setDate(deadline.getDate() + 30)
    const now = new Date()
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) {
      return <span className="text-red-600 font-bold">איחור של {Math.abs(daysLeft)} ימים!</span>
    } else if (daysLeft <= 7) {
      return <span className="text-orange-600 font-bold">{daysLeft} ימים</span>
    } else {
      return <span className="text-green-600">{daysLeft} ימים</span>
    }
  }

  if (loading) {
    return <div>טוען בקשות...</div>
  }

  return (
    <div className="space-y-6">
      {/* סטטיסטיקות */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">ממתינות</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">בטיפול</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">הושלמו</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Ban className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">דחופות</p>
            </div>
          </div>
        </Card>
      </div>

      {/* טבלת בקשות */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>סוג בקשה</TableHead>
              <TableHead>אימייל</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>עדיפות</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead>זמן נותר</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  אין בקשות פרטיות כרגע
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRequestIcon(request.request_type)}
                      {getRequestTypeName(request.request_type)}
                    </div>
                  </TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{new Date(request.requested_at).toLocaleDateString("he-IL")}</TableCell>
                  <TableCell>{getDaysRemaining(request.requested_at)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      טפל
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
