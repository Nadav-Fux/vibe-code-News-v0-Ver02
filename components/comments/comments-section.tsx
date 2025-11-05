"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Reply, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Comment = {
  id: string
  content: string
  created_at: string
  author_id: string
  parent_id: string | null
  author: {
    display_name: string
    avatar_url: string | null
  }
}

type CommentsSectionProps = {
  articleId: string
  currentUserId?: string
}

export function CommentsSection({ articleId, currentUserId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?articleId=${articleId}`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error("[v0] Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (content: string, parentId: string | null = null) => {
    if (!currentUserId) {
      router.push("/auth/login")
      return
    }

    if (!content.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          content: content.trim(),
          parentId,
        }),
      })

      if (response.ok) {
        setNewComment("")
        setReplyContent("")
        setReplyingTo(null)
        await fetchComments()
      }
    } catch (error) {
      console.error("[v0] Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchComments()
      }
    } catch (error) {
      console.error("[v0] Error deleting comment:", error)
    }
  }

  const organizeComments = () => {
    const topLevel = comments.filter((c) => !c.parent_id)
    const replies = comments.filter((c) => c.parent_id)

    return topLevel.map((comment) => ({
      ...comment,
      replies: replies.filter((r) => r.parent_id === comment.id),
    }))
  }

  const organizedComments = organizeComments()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Comments ({comments.length})
      </h2>

      {/* New Comment Form */}
      <div className="mb-8">
        {currentUserId ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button onClick={() => handleSubmitComment(newComment)} disabled={submitting || !newComment.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {organizedComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
        ) : (
          organizedComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar_url || undefined} />
                  <AvatarFallback>{comment.author.display_name[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.author.display_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-2">
                    {currentUserId && (
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)}>
                        <Reply className="mr-1 h-3 w-3" />
                        Reply
                      </Button>
                    )}
                    {currentUserId === comment.author_id && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitComment(replyContent, comment.id)}
                          disabled={submitting || !replyContent.trim()}
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-4 border-l-2 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.author.avatar_url || undefined} />
                        <AvatarFallback>{reply.author.display_name[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{reply.author.display_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                        {currentUserId === reply.author_id && (
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(reply.id)}>
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
