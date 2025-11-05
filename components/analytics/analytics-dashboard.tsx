"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Eye, FileText, FilePlus, TrendingUp } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { ScaleIn } from "@/components/ui/scale-in"

type Article = {
  id: string
  title: string
  views: number
  status: string
  created_at: string
  published_at: string | null
}

type AnalyticsEvent = {
  id: string
  event_type: string
  created_at: string
  article_id: string | null
}

type Stats = {
  totalViews: number
  publishedCount: number
  draftCount: number
  totalArticles: number
}

export function AnalyticsDashboard({
  articles,
  events,
  stats,
}: {
  articles: Article[]
  events: AnalyticsEvent[]
  stats: Stats
}) {
  // Prepare data for charts
  const topArticles = articles
    .filter((a) => a.status === "published")
    .slice(0, 5)
    .map((a) => ({
      name: a.title.length > 30 ? a.title.substring(0, 30) + "..." : a.title,
      views: a.views,
    }))

  // Group events by date
  const eventsByDate = events.reduce(
    (acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
      return acc
    },
    {} as Record<string, number>,
  )

  const activityData = Object.entries(eventsByDate)
    .slice(-7)
    .map(([date, count]) => ({
      date,
      events: count,
    }))

  // Status distribution
  const statusData = [
    { name: "Published", value: stats.publishedCount, color: "#10b981" },
    { name: "Draft", value: stats.draftCount, color: "#f59e0b" },
  ]

  return (
    <div className="grid gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <ScaleIn delay={0.1}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
        </ScaleIn>

        <ScaleIn delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
            </CardContent>
          </Card>
        </ScaleIn>

        <ScaleIn delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <FilePlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedCount}</div>
            </CardContent>
          </Card>
        </ScaleIn>

        <ScaleIn delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.publishedCount > 0 ? Math.round(stats.totalViews / stats.publishedCount) : 0}
              </div>
            </CardContent>
          </Card>
        </ScaleIn>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <FadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Top Articles by Views</CardTitle>
            </CardHeader>
            <CardContent>
              {topArticles.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topArticles}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No published articles yet
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle>Activity (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No activity data yet
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.7}>
          <Card>
            <CardHeader>
              <CardTitle>Article Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalArticles > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">No articles yet</div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.8}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => {
                  const article = articles.find((a) => a.id === event.article_id)
                  return (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.event_type.replace("_", " ").toUpperCase()}</p>
                        {article && <p className="text-sm text-muted-foreground">{article.title}</p>}
                        <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )
                })}
                {events.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No recent activity</div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
