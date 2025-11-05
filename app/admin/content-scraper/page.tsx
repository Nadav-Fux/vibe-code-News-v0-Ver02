"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, Check, X, ExternalLink, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function ContentScraperPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [pendingContent, setPendingContent] = useState<any[]>([])
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSource, setShowAddSource] = useState(false)

  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    type: "rss",
    category: "tech_news",
    scrape_frequency_minutes: 60,
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: pending } = await supabase
      .from("pending_content")
      .select("*, scraped_content(url, source_id, scraper_sources(name))")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    setPendingContent(pending || [])

    const { data: sourcesData } = await supabase.from("scraper_sources").select("*").order("name")

    setSources(sourcesData || [])
    setLoading(false)
  }

  async function addSource() {
    try {
      await supabase.from("scraper_sources").insert(newSource)
      setShowAddSource(false)
      setNewSource({
        name: "",
        url: "",
        type: "rss",
        category: "tech_news",
        scrape_frequency_minutes: 60,
      })
      loadData()
    } catch (error) {
      alert("שגיאה בהוספת מקור")
    }
  }

  async function toggleSource(id: string, isActive: boolean) {
    await supabase.from("scraper_sources").update({ is_active: !isActive }).eq("id", id)
    loadData()
  }

  async function runScraper() {
    setIsRunning(true)
    try {
      const response = await fetch("/api/scraper/run", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        alert(`הצלחה! עובדו ${data.processed} פריטים`)
        loadData()
      }
    } catch (error) {
      alert("שגיאה בהרצת הסורק")
    } finally {
      setIsRunning(false)
    }
  }

  async function approveContent(id: string, type: string) {
    const content = pendingContent.find((c) => c.id === id)
    if (!content) return

    try {
      if (type === "news_flash") {
        await supabase.from("news_flashes").insert({
          content: content.content,
          author_id: (await supabase.auth.getUser()).data.user?.id,
        })
      } else {
        await supabase.from("articles").insert({
          title: content.title,
          content: content.content,
          excerpt: content.excerpt,
          slug: content.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
          author_id: (await supabase.auth.getUser()).data.user?.id,
          status: "published",
          published_at: new Date().toISOString(),
        })
      }

      await supabase
        .from("pending_content")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", id)

      loadData()
    } catch (error) {
      alert("שגיאה באישור התוכן")
    }
  }

  async function rejectContent(id: string) {
    await supabase
      .from("pending_content")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id)

    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl" dir="rtl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">מערכת AI Scraper</h1>
        <p className="text-muted-foreground">סריקה אוטומטית של אתרים וטוויטר ויצירת תוכן בעזרת AI</p>
      </div>

      {/* Run Scraper Button */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">הרץ סריקה</h2>
            <p className="text-sm text-muted-foreground">סרוק את כל המקורות הפעילים ויצור תוכן חדש</p>
          </div>
          <Button onClick={runScraper} disabled={isRunning} size="lg" className="gap-2">
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                רץ...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                הרץ סריקה
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Sources */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">מקורות תוכן ({sources.length})</h2>
          <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                הוסף מקור
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>הוסף מקור חדש</DialogTitle>
                <DialogDescription>הוסף אתר או חשבון Twitter לסריקה אוטומטית</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">שם המקור</Label>
                  <Input
                    id="name"
                    value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    placeholder="לדוגמה: TechCrunch"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">סוג</Label>
                  <Select value={newSource.type} onValueChange={(value) => setNewSource({ ...newSource, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rss">RSS Feed</SelectItem>
                      <SelectItem value="nitter">Twitter (Nitter)</SelectItem>
                      <SelectItem value="html">HTML Scraping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select
                    value={newSource.category}
                    onValueChange={(value) => setNewSource({ ...newSource, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech_news">חדשות טכנולוגיה</SelectItem>
                      <SelectItem value="ai_news">חדשות AI</SelectItem>
                      <SelectItem value="company">חברה</SelectItem>
                      <SelectItem value="influencer">משפיען</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addSource}>הוסף מקור</Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-3">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <Switch checked={source.is_active} onCheckedChange={() => toggleSource(source.id, source.is_active)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{source.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {source.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {source.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{source.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Content */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">תוכן ממתין לאישור ({pendingContent.length})</h2>
        <div className="grid gap-4">
          {pendingContent.map((content) => (
            <Card key={content.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{content.content_type === "news_flash" ? "חדשה" : "מאמר"}</Badge>
                    <Badge variant="outline">{content.scraped_content?.scraper_sources?.name}</Badge>
                    <Badge variant="secondary">ביטחון: {(content.confidence_score * 100).toFixed(0)}%</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                  {content.excerpt && <p className="text-muted-foreground mb-3">{content.excerpt}</p>}
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-4 p-4 bg-muted rounded-lg">
                <div className="whitespace-pre-wrap">{content.content}</div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => approveContent(content.id, content.content_type)} className="gap-2">
                  <Check className="w-4 h-4" />
                  אשר ופרסם
                </Button>
                <Button onClick={() => rejectContent(content.id)} variant="outline" className="gap-2">
                  <X className="w-4 h-4" />
                  דחה
                </Button>
                {content.scraped_content?.url && (
                  <Button variant="ghost" size="sm" className="gap-2 mr-auto" asChild>
                    <a href={content.scraped_content.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      מקור
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {pendingContent.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">אין תוכן ממתין לאישור</p>
              <p className="text-sm text-muted-foreground mt-2">הרץ סריקה כדי ליצור תוכן חדש</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
