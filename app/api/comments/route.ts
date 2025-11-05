import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const articleId = searchParams.get("articleId")

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Fetch all comments for the article
    const { data: comments, error } = await supabase
      .from("comments")
      .select(`
        *,
        author:profiles(display_name, avatar_url)
      `)
      .eq("article_id", articleId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching comments:", error)
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error("[v0] Error in comments GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { articleId, content, parentId } = body

    if (!articleId || !content) {
      return NextResponse.json({ error: "Article ID and content are required" }, { status: 400 })
    }

    // Insert comment
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        article_id: articleId,
        author_id: user.id,
        content,
        parent_id: parentId || null,
      })
      .select(`
        *,
        author:profiles(display_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("[v0] Error creating comment:", error)
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("[v0] Error in comments POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const commentId = searchParams.get("id")

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    // Delete comment (only if user is the author)
    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("author_id", user.id)

    if (error) {
      console.error("[v0] Error deleting comment:", error)
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in comments DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
