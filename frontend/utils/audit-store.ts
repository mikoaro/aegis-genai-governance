import type { LogEntry } from "@/types";

// Sample audit logs with two complete transactions
const logs: LogEntry[] = [
  {
    eventId: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    timestamp: "2025-07-10T16:45:10.110Z",
    eventType: "PROMPT_RECEIVED",
    details: {
      userPrompt:
        "Analyze the following customer feedback and draft a personalized apology email to a user named John Doe who lives at 103 Main St and mentioned a billing issue with invoice #INV-456.",
    },
  },
  {
    eventId: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    timestamp: "2025-07-10T16:45:11.345Z",
    eventType: "PROMPT_GUARD_PROCESSED",
    details: {
      guardResult: {
        sanitizedPrompt:
          "Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with [REDACTED_INVOICE_ID].",
        redactionsMade: true,
      },
    },
  },
  {
    eventId: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    timestamp: "2025-07-10T16:45:13.880Z",
    eventType: "POLICY_ENFORCER_PROCESSED",
    details: {
      policyResult: {
        isCompliant: true,
        rationale:
          "The redacted query is compliant and focuses on general customer service analysis.",
        citations: [],
      },
    },
  },
  {
    eventId: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    timestamp: "2025-07-10T16:45:14.050Z",
    eventType: "FINAL_RESPONSE_SENT",
    details: {
      finalResponse: {
        status: "PROCESSED",
      },
      advisoryMessage:
        "Your request has been partially fulfilled. To protect customer privacy, direct inclusion of PII in prompts is restricted. Please use the approved CRM system to contact the user.",
    },
  },
  {
    eventId: "z9y8x7w6-v5u4-3210-t1s2-r3q4p5o6n7m8",
    timestamp: "2025-07-10T16:52:41.520Z",
    eventType: "PROMPT_RECEIVED",
    details: {
      userPrompt:
        "We have a dataset of customer feedback from our German user base. Use this to generate a new marketing campaign targeting these users with our latest product.",
    },
  },
  {
    eventId: "z9y8x7w6-v5u4-3210-t1s2-r3q4p5o6n7m8",
    timestamp: "2025-07-10T16:52:42.105Z",
    eventType: "PROMPT_GUARD_PROCESSED",
    details: {
      guardResult: {
        sanitizedPrompt:
          "We have a dataset of customer feedback from our German user base. Use this to generate a new marketing campaign targeting these users with our latest product.",
        redactionsMade: false,
      },
    },
  },
  {
    eventId: "z9y8x7w6-v5u4-3210-t1s2-r3q4p5o6n7m8",
    timestamp: "2025-07-10T16:52:44.913Z",
    eventType: "POLICY_ENFORCER_PROCESSED",
    details: {
      policyResult: {
        isCompliant: false,
        rationale:
          "Under GDPR Article 6, processing personal data for a new purpose (direct marketing) requires a verified lawful basis, such as explicit user consent, which has not been confirmed for this dataset.",
        citations: [{ reference: "GDPR Article 6" }],
      },
    },
  },
  {
    eventId: "z9y8x7w6-v5u4-3210-t1s2-r3q4p5o6n7m8",
    timestamp: "2025-07-10T16:52:45.150Z",
    eventType: "FINAL_RESPONSE_SENT",
    details: {
      finalResponse: {
        status: "BLOCKED",
      },
      advisoryMessage:
        "Your request has been blocked. Reason: Under GDPR Article 6, processing personal data for a new purpose (direct marketing) requires a verified lawful basis.",
    },
  },
];

export function addLog(entry: Omit<LogEntry, "timestamp">) {
  const newLog: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  return newLog;
}

export function getLogs() {
  return [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
