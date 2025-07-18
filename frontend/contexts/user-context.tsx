"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface UserContextType {
  userId: string
  generateNewUserId: () => void
  resetProfile: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  const generateNewUserId = () => {
    const newId = crypto.randomUUID()
    setUserId(newId)
    if (typeof window !== "undefined") {
      localStorage.setItem("aegis_user_id", newId)
    }
  }

  const resetProfile = () => {
    if (typeof window !== "undefined") {
      // Clear all user-related data from localStorage
      localStorage.removeItem("aegis_user_id")
      localStorage.removeItem(`aegis_messages_${userId}`)
      localStorage.removeItem("aegis_visualizer_mode")
    }

    // Generate new UUID
    generateNewUserId()
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("aegis_user_id")
      if (storedUserId) {
        setUserId(storedUserId)
      } else {
        generateNewUserId()
      }
    }
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <UserContext.Provider value={{ userId: "", generateNewUserId: () => {}, resetProfile: () => {} }}>
        {children}
      </UserContext.Provider>
    )
  }

  return <UserContext.Provider value={{ userId, generateNewUserId, resetProfile }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
