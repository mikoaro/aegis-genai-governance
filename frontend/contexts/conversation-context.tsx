"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "./user-context"

export interface Message {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  advisoryMessage?: string
  agentsInvolved?: string[]
  riskScore?: number
  complianceStatus?: "approved" | "modified" | "blocked"
  originalPrompt?: string
  processedPrompt?: string
}

interface ConversationContextType {
  messages: Message[]
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useUser()

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([])
    if (userId && typeof window !== "undefined") {
      localStorage.removeItem(`aegis_messages_${userId}`)
    }
  }

  // Load messages from localStorage when userId changes
  useEffect(() => {
    if (userId && typeof window !== "undefined") {
      const storedMessages = localStorage.getItem(`aegis_messages_${userId}`)
      if (storedMessages) {
        try {
          const parsed = JSON.parse(storedMessages)
          setMessages(
            parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          )
        } catch (error) {
          console.error("Failed to parse stored messages:", error)
        }
      }
    }
  }, [userId])

  // Save messages to localStorage when messages change
  useEffect(() => {
    if (userId && messages.length > 0 && typeof window !== "undefined") {
      localStorage.setItem(`aegis_messages_${userId}`, JSON.stringify(messages))
    }
  }, [messages, userId])

  return (
    <ConversationContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}
