export interface AgentStatus {
  id: string
  name: string
  type: string
  status: "pending" | "processing" | "completed" | "error"
  input?: any
  output?: any
  timestamp: string
  processingTime?: number
  riskScore?: number
  decision?: string
}

export interface ProcessingSession {
  id: string
  userId: string
  prompt: string
  timestamp: string
  status: "processing" | "completed" | "error"
  agents: AgentStatus[]
  finalResponse?: string
  advisoryMessage?: string
  complianceStatus: string
  riskLevel: string
}

// New audit log types for expandable table
export interface LogEntry {
  eventId: string
  timestamp: string
  eventType: "PROMPT_RECEIVED" | "PROMPT_GUARD_PROCESSED" | "POLICY_ENFORCER_PROCESSED" | "FINAL_RESPONSE_SENT"
  details: any
}

export interface Transaction {
  eventId: string
  events: LogEntry[]
  initialPrompt: string
  finalStatus: "PROCESSED" | "BLOCKED" | "UNKNOWN"
  startTime: string
}

export interface UserProfile {
  id: string
  role: string
  permissions: string[]
  createdAt: string
  lastActive: string
}

export interface FeedbackEntry {
  id: string
  sessionId: string
  userId: string
  rating: "positive" | "negative"
  timestamp: string
  context: {
    prompt: string
    response: string
    advisoryMessage?: string
  }
}
