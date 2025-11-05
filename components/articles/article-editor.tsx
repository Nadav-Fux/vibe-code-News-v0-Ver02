"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AIAssistant } from "@/components/ai/ai-assistant"
import { ImageUpload } from "@/components/upload/image-upload"
import { useAnalytics } from "@/lib/analytics/tracker"

type Category = {
  id: string
  name: string
  slug: string
}

type Tag = {
  id: string
  name: string
  slug: string
}

type ArticleEditorProps = {
  categories: Category[]
  tags: Tag[]
  userId: string
  article?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    category_id: string | null
    status: string
    article_tags: { tag_id: string }[]
    featured_image: string | null
  }
}

export function ArticleEditor({ categories, tags, userId, article }: ArticleEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const analytics = useAnalytics()

  const [title, setTitle] = useState(article?.title || "")
  const [content, setContent] = useState(article?.content || "")
  const [excerpt, setExcerpt] = useState(article?.excerpt || "")
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || "")
  const [categoryId, setCategoryId] = useState(article?.category_id || "")
  const [selectedTags, setSelectedTags] = useState<string[]>(article?.article_tags.map((at) => at.tag_id) || [])
  const [status, setStatus] = useState(article?.status || "draft")

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const slug = article?.slug || generateSlug(title)
    const wasPublished = article?.status === "published"
    const isNowPublished = status === "published"

    try {
      if (article) {
        const { error: updateError } = await supabase
          .from("articles")
          .update({
            title,
            content,
            excerpt: excerpt || null,
            featured_image: featuredImage || null,
            category_id: categoryId || null,
            status,
            updated_at: new Date().toISOString(),
            published_at: status === "published" ? new Date().toISOString() : null,
          })
          .eq("id", article.id)

        if (updateError) throw updateError

        await supabase.from("article_tags").delete().eq("article_id", article.id)

        if (selectedTags.length > 0) {
          const { error: tagsError } = await supabase.from("article_tags").insert(
            selectedTags.map((tagId) => ({
              article_id: article.id,
              tag_id: tagId,
            })),
          )

          if (tagsError) throw tagsError
        }

        analytics.trackArticleUpdate(article.id, userId)
        if (!wasPublished && isNowPublished) {
          analytics.trackArticlePublish(article.id, userId)
        }
      } else {
        const { data: newArticle, error: insertError } = await supabase
          .from("articles")
          .insert({
            title,
            slug,
            content,
            excerpt: excerpt || null,
            featured_image: featuredImage || null,
            author_id: userId,
            category_id: categoryId || null,
            status,
            published_at: status === "published" ? new Date().toISOString() : null,
          })
          .select()
          .single()

        if (insertError) throw insertError

        if (selectedTags.length > 0 && newArticle) {
          const { error: tagsError } = await supabase.from("article_tags").insert(
            selectedTags.map((tagId) => ({
              article_id: newArticle.id,
              tag_id: tagId,
            })),
          )

          if (tagsError) throw tagsError
        }

        if (newArticle) {
          analytics.trackArticleCreate(newArticle.id, userId)
          if (status === "published") {
            analytics.trackArticlePublish(newArticle.id, userId)
          }
        }
      }

      router.push("/dashboard/articles")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Featured Image</Label>
            <ImageUpload value={featuredImage} onChange={setFeaturedImage} onRemove={() => setFeaturedImage("")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of the article"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              rows={15}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-4">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <Checkbox
                    id={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <Label htmlFor={tag.id} className="cursor-pointer">
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : article ? "Update Article" : "Create Article"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <AIAssistant
            onContentGenerated={(generatedContent) => {
              setContent(generatedContent)
            }}
            currentContent={content}
          />
        </div>
      </div>
    </div>
  )
}
