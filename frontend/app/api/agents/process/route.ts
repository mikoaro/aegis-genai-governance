import { type NextRequest, NextResponse } from "next/server"
import { AGENT_TYPES, RISK_LEVELS, COMPLIANCE_STATUS } from "@/utils/constants"
import type { ProcessingSession, AgentStatus } from "@/types"
import { addLog } from "@/utils/audit-store"

// Mock processing delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock PII detection patterns
const PII_PATTERNS = [
  /\b[A-Za-z]+ [A-Za-z]+\b/g, // Names
  /\b\d{1,5}\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard)\b/gi, // Addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
  /#?INV-\d+/gi, // Invoice numbers
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN pattern
]

// Helper function to create audit log entry
function createAuditLog(
  sessionId: string,
  userId: string,
  agentType: string,
  action: string,
  input: any,
  output: any,
  metadata: any = {},
) {
  console.log(`Creating audit log: ${agentType} - ${action}`)
  const log = addLog({
    sessionId,
    userId,
    agentType,
    action,
    input,
    output,
    metadata,
  })
  console.log(`Audit log created with ID: ${log.id}`)
  return log
}

// Mock risk assessment
function assessRisk(prompt: string): { score: number; level: string; reasons: string[] } {
  const reasons: string[] = []
  let score = 0

  // Check for high-risk patterns
  if (prompt.toLowerCase().includes("prod_db") || prompt.toLowerCase().includes("production")) {
    score += 3
    reasons.push("Production database access detected")
  }

  if (prompt.toLowerCase().includes("export") && prompt.toLowerCase().includes("s3")) {
    score += 4
    reasons.push("Data export to external storage detected")
  }

  if (prompt.toLowerCase().includes("pii") || prompt.toLowerCase().includes("personal")) {
    score += 2
    reasons.push("Personal data processing detected")
  }

  if (prompt.toLowerCase().includes("marketing") && prompt.toLowerCase().includes("campaign")) {
    score += 2
    reasons.push("Marketing use of personal data detected")
  }

  // Check for PII patterns
  PII_PATTERNS.forEach((pattern) => {
    if (pattern.test(prompt)) {
      score += 1
      reasons.push("PII patterns detected in prompt")
    }
  })

  const level =
    score >= 7
      ? RISK_LEVELS.CRITICAL
      : score >= 5
        ? RISK_LEVELS.HIGH
        : score >= 3
          ? RISK_LEVELS.MEDIUM
          : RISK_LEVELS.LOW

  return { score, level, reasons }
}

// Mock PII redaction
function redactPII(prompt: string): { redacted: string; redactions: string[] } {
  let redacted = prompt
  const redactions: string[] = []

  PII_PATTERNS.forEach((pattern) => {
    const matches = prompt.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        redacted = redacted.replace(match, "[REDACTED]")
        redactions.push(match)
      })
    }
  })

  return { redacted, redactions }
}

// Mock policy enforcement
function enforcePolicy(
  prompt: string,
  riskLevel: string,
): {
  compliant: boolean
  status: string
  violatedArticles: string[]
  reasoning: string
} {
  const violatedArticles: string[] = []
  let reasoning = ""

  // Check for GDPR violations
  if (prompt.toLowerCase().includes("marketing") && prompt.toLowerCase().includes("german")) {
    violatedArticles.push("GDPR Article 6")
    reasoning = "Processing personal data for marketing purposes requires explicit consent under GDPR Article 6."
  }

  if (prompt.toLowerCase().includes("export") && prompt.toLowerCase().includes("customer")) {
    violatedArticles.push("GDPR Article 5")
    reasoning = "Data minimization principle violated - bulk export of customer data not justified."
  }

  if (riskLevel === RISK_LEVELS.CRITICAL) {
    violatedArticles.push("GDPR Article 5")
    reasoning = reasoning || "Critical risk level detected - request blocked for security reasons."
  }

  const compliant = violatedArticles.length === 0 && riskLevel !== RISK_LEVELS.CRITICAL
  const status = compliant
    ? COMPLIANCE_STATUS.COMPLIANT
    : violatedArticles.length > 0
      ? COMPLIANCE_STATUS.NON_COMPLIANT
      : COMPLIANCE_STATUS.BLOCKED

  return { compliant, status, violatedArticles, reasoning }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json()

    if (!prompt || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log(`Processing prompt for user: ${userId}`)
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    console.log(`Session ID: ${sessionId}`)

    // Initialize session
    const session: ProcessingSession = {
      id: sessionId,
      userId,
      prompt,
      timestamp: new Date().toISOString(),
      status: "processing",
      agents: [],
      complianceStatus: COMPLIANCE_STATUS.COMPLIANT,
      riskLevel: RISK_LEVELS.LOW,
    }

    // Create agents in processing order
    const agents: AgentStatus[] = [
      {
        id: "supervisor-1",
        name: "Supervisor Agent",
        type: AGENT_TYPES.SUPERVISOR,
        status: "processing",
        timestamp: new Date().toISOString(),
      },
      {
        id: "risk-assessor-1",
        name: "Pre-emptive Risk Assessor",
        type: AGENT_TYPES.RISK_ASSESSOR,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
      {
        id: "prompt-guard-1",
        name: "Prompt Guard Agent",
        type: AGENT_TYPES.PROMPT_GUARD,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
      {
        id: "policy-enforcer-1",
        name: "Policy Enforcer Agent",
        type: AGENT_TYPES.POLICY_ENFORCER,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
      {
        id: "output-auditor-1",
        name: "Output Auditor Agent",
        type: AGENT_TYPES.OUTPUT_AUDITOR,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
      {
        id: "audit-logger-1",
        name: "Audit Logger Agent",
        type: AGENT_TYPES.AUDIT_LOGGER,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
      {
        id: "advisory-1",
        name: "Advisory Agent",
        type: AGENT_TYPES.ADVISORY,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
    ]

    session.agents = agents

    // Simulate processing with delays and create audit logs
    await delay(500)

    // 1. Supervisor Agent
    agents[0].status = "completed"
    agents[0].output = { decision: "proceed", orchestration: "Initiating multi-agent workflow" }
    agents[0].processingTime = 500

    // Create audit log for supervisor
    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.SUPERVISOR,
      "session_initiated",
      { prompt, userId },
      { decision: "proceed", orchestration: "Initiating multi-agent workflow", workflowId: `wf-aegis-${Date.now()}` },
      { processingTime: 500 },
    )

    // 2. Risk Assessor
    agents[1].status = "processing"
    await delay(800)
    const riskAssessment = assessRisk(prompt)
    agents[1].status = "completed"
    agents[1].input = { prompt }
    agents[1].output = riskAssessment
    agents[1].riskScore = riskAssessment.score
    agents[1].processingTime = 800
    session.riskLevel = riskAssessment.level

    // Create audit log for risk assessor
    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.RISK_ASSESSOR,
      riskAssessment.level === RISK_LEVELS.CRITICAL ? "critical_risk_detected" : "risk_assessment_completed",
      { prompt },
      riskAssessment,
      { riskScore: riskAssessment.score, processingTime: 800 },
    )

    // 3. Prompt Guard
    agents[2].status = "processing"
    await delay(600)
    const piiRedaction = redactPII(prompt)
    agents[2].status = "completed"
    agents[2].input = { prompt }
    agents[2].output = piiRedaction
    agents[2].processingTime = 600

    // Create audit log for prompt guard
    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.PROMPT_GUARD,
      piiRedaction.redactions.length > 0 ? "pii_redaction_completed" : "pii_scan_completed",
      { prompt },
      {
        ...piiRedaction,
        piiDetected: piiRedaction.redactions.length > 0,
      },
      { processingTime: 600 },
    )

    // 4. Policy Enforcer
    agents[3].status = "processing"
    await delay(1200)
    const policyCheck = enforcePolicy(prompt, riskAssessment.level)
    agents[3].status = "completed"
    agents[3].input = { prompt: piiRedaction.redacted, riskLevel: riskAssessment.level }
    agents[3].output = policyCheck
    agents[3].processingTime = 1200
    session.complianceStatus = policyCheck.status

    // Create audit log for policy enforcer
    let policyAction = "policy_check_completed"
    if (policyCheck.status === COMPLIANCE_STATUS.NON_COMPLIANT) {
      policyAction = "policy_violation_detected"
    } else if (policyCheck.status === COMPLIANCE_STATUS.BLOCKED) {
      policyAction = "request_blocked_critical_risk"
    }

    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.POLICY_ENFORCER,
      policyAction,
      { prompt: piiRedaction.redacted, riskLevel: riskAssessment.level },
      policyCheck,
      { complianceStatus: policyCheck.status, processingTime: 1200 },
    )

    // 5. Output Auditor
    agents[4].status = "processing"
    await delay(700)
    let auditResult
    let auditAction = "output_audit_completed"

    if (policyCheck.status === COMPLIANCE_STATUS.BLOCKED || policyCheck.status === COMPLIANCE_STATUS.NON_COMPLIANT) {
      auditResult = {
        skipped: true,
        reason: "Request blocked by policy enforcer",
      }
      auditAction = "output_audit_skipped"
    } else {
      auditResult = {
        biasCheck: "passed",
        toxicityCheck: "passed",
        fairnessScore: 0.92,
        requiredDisclosures: ["AI-generated content"],
        auditPassed: true,
      }
    }

    agents[4].status = "completed"
    agents[4].input = { response: policyCheck.compliant ? "Generated response content" : null }
    agents[4].output = auditResult
    agents[4].processingTime = 700

    // Create audit log for output auditor
    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.OUTPUT_AUDITOR,
      auditAction,
      { response: policyCheck.compliant ? "Generated response content" : null },
      auditResult,
      { processingTime: 700 },
    )

    // 6. Audit Logger
    agents[5].status = "processing"
    await delay(300)
    agents[5].status = "completed"
    agents[5].input = {
      sessionId,
      userId,
      agentCount: agents.length,
    }

    const auditLoggerOutput = {
      logged: true,
      qldbTransactionId: `tx-${Date.now()}`,
      blockAddress: `${Math.random().toString(36).substr(2, 9)}Qw8kzSo7QbhwK2nVtGU5mR7pL9xN4jF6vB8cA1dE2fG`,
      documentId: `doc-aegis-${Date.now()}-${userId.slice(-3)}`,
    }

    // Add alert flags for high-risk scenarios
    if (riskAssessment.level === RISK_LEVELS.CRITICAL) {
      auditLoggerOutput.alertTriggered = true
      auditLoggerOutput.securityTeamNotified = true
    } else if (policyCheck.status === COMPLIANCE_STATUS.NON_COMPLIANT) {
      auditLoggerOutput.alertTriggered = true
    }

    agents[5].output = auditLoggerOutput
    agents[5].processingTime = 300

    // Create audit log for audit logger
    let auditLoggerAction = "session_logged_to_qldb"
    if (riskAssessment.level === RISK_LEVELS.CRITICAL) {
      auditLoggerAction = "critical_risk_logged"
    } else if (policyCheck.status === COMPLIANCE_STATUS.NON_COMPLIANT) {
      auditLoggerAction = "policy_violation_logged"
    }

    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.AUDIT_LOGGER,
      auditLoggerAction,
      {
        sessionId,
        userId,
        agentCount: agents.length,
      },
      auditLoggerOutput,
      { processingTime: 300 },
    )

    // 7. Advisory Agent
    agents[6].status = "processing"
    await delay(500)
    let advisoryMessage = ""

    if (policyCheck.status === COMPLIANCE_STATUS.NON_COMPLIANT || policyCheck.status === COMPLIANCE_STATUS.BLOCKED) {
      advisoryMessage = `Your request has been blocked. Reason: ${policyCheck.reasoning} Suggestion: Please engage the appropriate team to ensure compliance with data protection regulations.`
    } else if (piiRedaction.redactions.length > 0) {
      advisoryMessage = `Your request has been partially fulfilled. PII has been redacted for privacy protection. Redacted items: ${piiRedaction.redactions.join(", ")}. Suggestion: Use approved systems for handling personal data.`
    } else {
      advisoryMessage = "Your request has been processed successfully and is compliant with all policies."
    }

    agents[6].status = "completed"
    agents[6].input = { policyResult: policyCheck, redactionResult: piiRedaction }
    agents[6].output = { message: advisoryMessage }
    agents[6].processingTime = 500

    // Create audit log for advisory agent
    createAuditLog(
      sessionId,
      userId,
      AGENT_TYPES.ADVISORY,
      "advisory_message_generated",
      {
        policyResult: { compliant: policyCheck.compliant, status: policyCheck.status },
        redactionResult: {
          redacted: piiRedaction.redactions.length > 0,
          redactionCount: piiRedaction.redactions.length,
        },
      },
      { message: advisoryMessage },
      { processingTime: 500 },
    )

    // Generate final response
    let finalResponse = ""
    if (policyCheck.status === COMPLIANCE_STATUS.BLOCKED || policyCheck.status === COMPLIANCE_STATUS.NON_COMPLIANT) {
      finalResponse = "Request blocked due to policy violations."
    } else {
      finalResponse = `Processed request: ${piiRedaction.redacted}. This response has been generated in compliance with enterprise AI governance policies.`
    }

    session.status = "completed"
    session.finalResponse = finalResponse
    session.advisoryMessage = advisoryMessage

    console.log(`Session completed: ${sessionId}`)
    return NextResponse.json(session)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
