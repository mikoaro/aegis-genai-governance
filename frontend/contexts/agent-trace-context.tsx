"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { type VisualizerMode, VISUALIZER_MODES } from "@/utils/constants"

export interface AgentStep {
  agentId: string
  status: "pending" | "processing" | "completed" | "error"
  input?: string
  output?: string
  timestamp?: Date
  duration?: number
}

interface AgentTraceContextType {
  currentTrace: AgentStep[]
  visualizerMode: VisualizerMode
  setVisualizerMode: (mode: VisualizerMode) => void
  startTrace: (agentIds: string[]) => void
  updateAgentStep: (agentId: string, updates: Partial<AgentStep>) => void
  clearTrace: () => void
  isTracing: boolean
}

const AgentTraceContext = createContext<AgentTraceContextType | undefined>(undefined)

export function AgentTraceProvider({ children }: { children: React.ReactNode }) {
  const [currentTrace, setCurrentTrace] = useState<AgentStep[]>([])
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(VISUALIZER_MODES.SIMPLIFIED)
  const [isTracing, setIsTracing] = useState(false)

  const startTrace = (agentIds: string[]) => {
    const initialTrace = agentIds.map((agentId) => ({
      agentId,
      status: "pending" as const,
      timestamp: new Date(),
    }))
    setCurrentTrace(initialTrace)
    setIsTracing(true)
  }

  const updateAgentStep = (agentId: string, updates: Partial<AgentStep>) => {
    setCurrentTrace((prev) =>
      prev.map((step) =>
        step.agentId === agentId ? { ...step, ...updates, timestamp: updates.timestamp || step.timestamp } : step,
      ),
    )
  }

  const clearTrace = () => {
    setCurrentTrace([])
    setIsTracing(false)
  }

  // Load visualizer mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aegis_visualizer_mode")
      if (stored && Object.values(VISUALIZER_MODES).includes(stored as VisualizerMode)) {
        setVisualizerMode(stored as VisualizerMode)
      }
    }
  }, [])

  // Save visualizer mode to localStorage
  const handleSetVisualizerMode = (mode: VisualizerMode) => {
    setVisualizerMode(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("aegis_visualizer_mode", mode)
    }
  }

  return (
    <AgentTraceContext.Provider
      value={{
        currentTrace,
        visualizerMode,
        setVisualizerMode: handleSetVisualizerMode,
        startTrace,
        updateAgentStep,
        clearTrace,
        isTracing,
      }}
    >
      {children}
    </AgentTraceContext.Provider>
  )
}

export function useAgentTrace() {
  const context = useContext(AgentTraceContext)
  if (context === undefined) {
    throw new Error("useAgentTrace must be used within an AgentTraceProvider")
  }
  return context
}
