"use client"

import { useConversation } from "@/contexts/conversation-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Bot, AlertTriangle, CheckCircle, XCircle, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

export function ConversationDisplay() {
  const { messages } = useConversation()

  const getComplianceIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "modified":
        return <Edit className="h-4 w-4 text-yellow-500" />
      case "blocked":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getComplianceColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      case "modified":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
      case "blocked":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      default:
        return "bg-muted"
    }
  }

  if (messages.length === 0) {
    return (
      <Card className="w-full h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Project Aegis</h3>
            <p>Your AI Governance Co-Pilot is ready to ensure safe and compliant AI interactions.</p>
            <p className="text-sm mt-2">Submit a prompt to begin the governance workflow.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* User Message */}
                {message.type === "user" && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                )}

                {/* Assistant Message */}
                {message.type === "assistant" && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-aegis-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      {/* Compliance Status */}
                      {message.complianceStatus && (
                        <div className="flex items-center gap-2">
                          {getComplianceIcon(message.complianceStatus)}
                          <Badge
                            variant="secondary"
                            className={cn("capitalize", getComplianceColor(message.complianceStatus))}
                          >
                            {message.complianceStatus}
                          </Badge>
                          {message.riskScore && <Badge variant="outline">Risk Score: {message.riskScore}/10</Badge>}
                        </div>
                      )}

                      {/* Main Response */}
                      {message.content && (
                        <div className="bg-muted p-3 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap font-sans">{message.content}</pre>
                        </div>
                      )}

                      {/* Advisory Message */}
                      {message.advisoryMessage && (
                        <Alert className="border-l-4 border-l-primary">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <strong>Advisory:</strong> {message.advisoryMessage}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Agents Involved */}
                      {message.agentsInvolved && message.agentsInvolved.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground mr-2">Agents involved:</span>
                          {message.agentsInvolved.map((agentId) => (
                            <Badge key={agentId} variant="outline" className="text-xs">
                              {agentId.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
