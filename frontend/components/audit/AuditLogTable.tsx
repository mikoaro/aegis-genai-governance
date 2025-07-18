"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, AlertCircle, ShieldCheck, FileText, Send } from "lucide-react"

// Define types if not imported
type LogEntry = {
  timestamp: string
  eventType: "PROMPT_RECEIVED" | "PROMPT_GUARD_PROCESSED" | "POLICY_ENFORCER_PROCESSED" | "FINAL_RESPONSE_SENT"
  eventId: string
  details: any
}

type Transaction = {
  eventId: string
  events: LogEntry[]
  initialPrompt: string
  finalStatus: string
  startTime: string
}

const eventIcons = {
  PROMPT_RECEIVED: <FileText className="h-5 w-5 text-emerald-600" />,
  PROMPT_GUARD_PROCESSED: <ShieldCheck className="h-5 w-5 text-green-600" />,
  POLICY_ENFORCER_PROCESSED: <AlertCircle className="h-5 w-5 text-amber-600" />,
  FINAL_RESPONSE_SENT: <Send className="h-5 w-5 text-emerald-700" />,
}

function TransactionDetailView({ events }: { events: LogEntry[] }) {
  return (
    <div className="p-6 space-y-6 bg-emerald-50 border-t border-emerald-600">
      {events.map((event, index) => (
        <div key={event.timestamp} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-emerald-700 shadow-sm">
              {eventIcons[event.eventType]}
            </div>
            {index < events.length - 1 && <div className="h-full w-px bg-emerald-300 mt-2" />}
          </div>
          <div className="w-full">
            <div className="font-bold text-md text-emerald-900">
              {event.eventType.replace(/_/g, " ")}
            </div>
            <div className="text-xs text-muted-foreground mb-3">{new Date(event.timestamp).toLocaleTimeString()}</div>
            <div className="text-sm p-4 rounded-md bg-background border border-emerald-700">
              {event.eventType === "PROMPT_RECEIVED" && (
                <div>
                  <p className="font-semibold text-emerald-800 mb-2">Original Prompt:</p>
                  <p className="font-mono text-sm p-3 rounded border bg-emerald-50 border-emerald-600 whitespace-pre-wrap break-words overflow-hidden">
                    {event.details.userPrompt}
                  </p>
                </div>
              )}
              {event.eventType === "PROMPT_GUARD_PROCESSED" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Redactions Made:</span>
                    <Badge
                      variant={event.details.guardResult.redactionsMade ? "destructive" : "default"}
                      className={
                        !event.details.guardResult.redactionsMade
                          ? "bg-emerald-100 text-emerald-800"
                          : ""
                      }
                    >
                      {event.details.guardResult.redactionsMade.toString()}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Sanitized Prompt:</p>
                    <p className="font-mono text-sm p-3 rounded border border-emerald-200 bg-emerald-50 whitespace-pre-wrap break-words overflow-hidden">
                      {event.details.guardResult.sanitizedPrompt}
                    </p>
                  </div>
                </div>
              )}
              {event.eventType === "POLICY_ENFORCER_PROCESSED" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Compliance Status:</span>
                    <Badge
                      variant={!event.details.policyResult.isCompliant ? "destructive" : "default"}
                      className={
                        event.details.policyResult.isCompliant
                          ? "bg-emerald-100 text-emerald-800"
                          : ""
                      }
                    >
                      {event.details.policyResult.isCompliant ? "COMPLIANT" : "NON-COMPLIANT"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Rationale:</p>
                    <p className="italic bg-emerald-50  p-3 rounded border border-emerald-200 whitespace-pre-wrap break-words overflow-hidden">
                      "{event.details.policyResult.rationale}"
                    </p>
                  </div>
                  {event.details.policyResult.citations && event.details.policyResult.citations.length > 0 && (
                    <div>
                      <p className="font-semibold text-emerald-800 mb-2">Citations:</p>
                      <div className="flex flex-wrap gap-2">
                        {event.details.policyResult.citations.map((citation: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="border-emerald-300">
                            {citation.reference}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {event.eventType === "FINAL_RESPONSE_SENT" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Final Status:</span>
                    <Badge
                      variant={event.details.finalResponse.status === "BLOCKED" ? "destructive" : "default"}
                      className={
                        event.details.finalResponse.status === "PROCESSED"
                          ? "bg-emerald-100 text-emerald-800"
                          : ""
                      }
                    >
                      {event.details.finalResponse.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Advisory Message:</p>
                    <p className="bg-emerald-50 p-3 rounded border border-emerald-200 whitespace-pre-wrap break-words overflow-hidden">
                      "{event.details.advisoryMessage}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AuditLogTable({ logs }: { logs: LogEntry[] }) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  const transactions = React.useMemo(() => {
    const grouped = new Map<string, LogEntry[]>()
    logs.forEach((log) => {
      if (!grouped.has(log.eventId)) grouped.set(log.eventId, [])
      grouped.get(log.eventId)!.push(log)
    })

    const processed: Transaction[] = []
    grouped.forEach((events, eventId) => {
      events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      const lastEvent = events[events.length - 1]
      processed.push({
        eventId,
        events,
        initialPrompt: events[0]?.details.userPrompt || "N/A",
        finalStatus: lastEvent?.details.finalResponse?.status || "UNKNOWN",
        startTime: events[0]?.timestamp,
      })
    })

    return processed.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  }, [logs])

  const toggleRowExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="w-full border border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="hover:bg-aegis-100 dark:hover:bg-aegis-200/100">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-40">Timestamp</TableHead>
              <TableHead className="w-80">Prompt Snippet</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32 text-right">Event ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <div className="space-y-2">
                    <p>No audit logs found</p>
                    <p className="text-xs">Submit a prompt on the dashboard to generate audit logs</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const isExpanded = expandedRows.has(transaction.eventId)
                return (
                  <React.Fragment key={transaction.eventId}>
                    <TableRow className="hover:bg-aegis-100 dark:hover:bg-aegis-200/100">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(transaction.eventId)}
                          className="w-9 p-0 hover:bg-emerald-200"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {new Date(transaction.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm max-w-xs">
                        <div className="truncate" title={transaction.initialPrompt}>
                          {transaction.initialPrompt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.finalStatus === "BLOCKED" ? "destructive" : "default"}
                          className={
                            transaction.finalStatus === "PROCESSED"
                              ? "bg-emerald-100 text-emerald-800"
                              : ""
                          }
                        >
                          {transaction.finalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {transaction.eventId.substring(0, 8)}...
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <TransactionDetailView events={transaction.events} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      {transactions.length > 0 && (
        <div className="p-4 border-t border-emerald-500 bg-emerald-50 dark:from-emerald-950/50 dark:to-green-950/50">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>Click the arrow icons to expand rows and view detailed transaction flow</div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedRows(new Set(transactions.map((t) => t.eventId)))}
                disabled={expandedRows.size === transactions.length}
                className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedRows(new Set())}
                disabled={expandedRows.size === 0}
                className="border-aegis-300 hover:bg-aegis-500"
              >
                Collapse All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
