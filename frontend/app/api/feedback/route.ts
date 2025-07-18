import { type NextRequest, NextResponse } from "next/server"
import type { FeedbackEntry } from "@/types"

const mockFeedback: FeedbackEntry[] = []

export async function POST(request: NextRequest) {
  try {
    const feedbackData: Omit<FeedbackEntry, "id" | "timestamp"> = await request.json()

    const newFeedback: FeedbackEntry = {
      ...feedbackData,
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    mockFeedback.unshift(newFeedback)

    return NextResponse.json(newFeedback)
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let filteredFeedback = mockFeedback
    if (userId) {
      filteredFeedback = mockFeedback.filter((f) => f.userId === userId)
    }

    return NextResponse.json(filteredFeedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
