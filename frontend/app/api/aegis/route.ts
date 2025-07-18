import { type NextRequest, NextResponse } from "next/server"
import { MOCK_RESPONSES, SAMPLE_PROMPTS } from "@/utils/constants"

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json()

    if (!prompt || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Find matching sample prompt or use default response
    const matchingPrompt = SAMPLE_PROMPTS.find((sample) => sample.prompt === prompt)

    let response
    if (matchingPrompt) {
      response = MOCK_RESPONSES[matchingPrompt.id as keyof typeof MOCK_RESPONSES]
    } else {
      // Default response for unknown prompts
      response = {
        originalPrompt: prompt,
        processedPrompt: prompt,
        response:
          "I understand your request. However, I need to analyze this prompt against our governance policies. This appears to be a custom request that would require additional review by our compliance team.",
        advisoryMessage:
          "This request has been processed through our standard governance workflow. For custom requests not covered by our sample scenarios, please ensure compliance with your organization's data handling policies.",
        agentsInvolved: ["supervisor", "risk-assessor", "prompt-guard", "policy-enforcer"],
        riskScore: 3.5,
        complianceStatus: "modified",
      }
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
      userId,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
