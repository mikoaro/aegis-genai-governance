"use client"

import { useAgentTrace } from "@/contexts/agent-trace-context"
import { AGENT_DEFINITIONS, VISUALIZER_MODES } from "@/utils/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, AlertCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function AgentTraceVisualizer() {
  const { currentTrace, visualizerMode, setVisualizerMode, isTracing } = useAgentTrace()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getAgentInfo = (agentId: string) => {
    return (
      AGENT_DEFINITIONS.find((agent) => agent.id === agentId) || {
        id: agentId,
        name: agentId,
        description: "Unknown agent",
        icon: "❓",
        color: "bg-gray-500",
      }
    )
  }

  if (!isTracing && currentTrace.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Agent Trace Visualizer
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="visualizer-mode">Real-time Mode</Label>
              <Switch
                id="visualizer-mode"
                checked={visualizerMode === VISUALIZER_MODES.REALTIME}
                onCheckedChange={(checked) =>
                  setVisualizerMode(checked ? VISUALIZER_MODES.REALTIME : VISUALIZER_MODES.SIMPLIFIED)
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-4">🛡️</div>
            <p>Submit a prompt to see the agent workflow in action</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Agent Trace Visualizer
            {isTracing && (
              <Badge variant="secondary" className="animate-pulse">
                Processing...
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visualizer-mode">Real-time Mode</Label>
            <Switch
              id="visualizer-mode"
              checked={visualizerMode === VISUALIZER_MODES.REALTIME}
              onCheckedChange={(checked) =>
                setVisualizerMode(checked ? VISUALIZER_MODES.REALTIME : VISUALIZER_MODES.SIMPLIFIED)
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {visualizerMode === VISUALIZER_MODES.SIMPLIFIED ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTrace.map((step) => {
              const agentInfo = getAgentInfo(step.agentId)
              return (
                <div
                  key={step.agentId}
                  className={cn(
                    "agent-panel p-4 rounded-lg border-2 transition-all duration-300",
                    step.status === "processing" && "processing animate-pulse",
                    step.status === "completed" && "completed",
                    step.status === "error" && "border-red-500",
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{agentInfo.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{agentInfo.name}</h4>
                      <p className="text-xs text-muted-foreground">{agentInfo.description}</p>
                    </div>
                    {getStatusIcon(step.status)}
                  </div>
                  {step.duration && <div className="text-xs text-muted-foreground">Completed in {step.duration}ms</div>}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {currentTrace.map((step, index) => {
              const agentInfo = getAgentInfo(step.agentId)
              return (
                <div
                  key={step.agentId}
                  className={cn(
                    "agent-panel p-6 rounded-lg border transition-all duration-500",
                    step.status === "processing" && "active",
                    step.status === "completed" && "completed",
                    step.status === "error" && "border-red-500",
                  )}
                  style={{
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl",
                          agentInfo.color,
                        )}
                      >
                        {agentInfo.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{agentInfo.name}</h4>
                        {getStatusIcon(step.status)}
                        {step.status === "processing" && (
                          <div className="typing-indicator ml-2">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{agentInfo.description}</p>

                      {step.input && (
                        <div className="mb-2">
                          <Label className="text-xs font-medium">Input:</Label>
                          <div className="bg-muted p-2 rounded text-xs mt-1">{step.input}</div>
                        </div>
                      )}

                      {step.output && (
                        <div className="mb-2">
                          <Label className="text-xs font-medium">Output:</Label>
                          <div className="bg-muted p-2 rounded text-xs mt-1">{step.output}</div>
                        </div>
                      )}

                      {step.duration && (
                        <div className="text-xs text-muted-foreground">Processing time: {step.duration}ms</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
