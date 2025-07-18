"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { ProcessingSession, UserProfile, AuditLogEntry } from "@/types"
import { getUserId, resetUserId } from "@/utils/uuid"
import { USER_ROLES } from "@/utils/constants"

interface AegisState {
  user: UserProfile | null
  currentSession: ProcessingSession | null
  auditLogs: AuditLogEntry[]
  isProcessing: boolean
  theme: "light" | "dark"
}

type AegisAction =
  | { type: "SET_USER"; payload: UserProfile }
  | { type: "RESET_USER" }
  | { type: "SET_CURRENT_SESSION"; payload: ProcessingSession }
  | { type: "UPDATE_SESSION"; payload: Partial<ProcessingSession> }
  | { type: "CLEAR_SESSION" }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "ADD_AUDIT_LOG"; payload: AuditLogEntry }
  | { type: "SET_AUDIT_LOGS"; payload: AuditLogEntry[] }
  | { type: "TOGGLE_THEME" }

const initialState: AegisState = {
  user: null,
  currentSession: null,
  auditLogs: [],
  isProcessing: false,
  theme: "light",
}

function aegisReducer(state: AegisState, action: AegisAction): AegisState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }
    case "RESET_USER":
      return { ...state, user: null }
    case "SET_CURRENT_SESSION":
      return { ...state, currentSession: action.payload }
    case "UPDATE_SESSION":
      return {
        ...state,
        currentSession: state.currentSession ? { ...state.currentSession, ...action.payload } : null,
      }
    case "CLEAR_SESSION":
      return { ...state, currentSession: null }
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload }
    case "ADD_AUDIT_LOG":
      return { ...state, auditLogs: [action.payload, ...state.auditLogs] }
    case "SET_AUDIT_LOGS":
      return { ...state, auditLogs: action.payload }
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "light" : "light" }
    default:
      return state
  }
}

const AegisContext = createContext<{
  state: AegisState
  dispatch: React.Dispatch<AegisAction>
  resetUserProfile: () => void
} | null>(null)

export function AegisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aegisReducer, initialState)

  useEffect(() => {
    // Initialize user profile
    const userId = getUserId()
    const savedProfile = localStorage.getItem("aegis-user-profile")

    if (savedProfile) {
      dispatch({ type: "SET_USER", payload: JSON.parse(savedProfile) })
    } else {
      const newProfile: UserProfile = {
        id: userId,
        role: USER_ROLES.DEVELOPER,
        permissions: ["read", "write", "submit_prompts"],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      }
      localStorage.setItem("aegis-user-profile", JSON.stringify(newProfile))
      dispatch({ type: "SET_USER", payload: newProfile })
    }

    // Initialize theme
    const savedTheme = localStorage.getItem("aegis-theme") as "light" | "dark"
    if (savedTheme) {
      dispatch({ type: "TOGGLE_THEME" })
    }
  }, [])

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("aegis-theme", state.theme)
    document.documentElement.classList.toggle("dark", state.theme === "dark")
  }, [state.theme])

  const resetUserProfile = () => {
    const newUserId = resetUserId()
    const newProfile: UserProfile = {
      id: newUserId,
      role: USER_ROLES.DEVELOPER,
      permissions: ["read", "write", "submit_prompts"],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }
    localStorage.setItem("aegis-user-profile", JSON.stringify(newProfile))
    dispatch({ type: "SET_USER", payload: newProfile })
    dispatch({ type: "CLEAR_SESSION" })
  }

  return <AegisContext.Provider value={{ state, dispatch, resetUserProfile }}>{children}</AegisContext.Provider>
}

export function useAegis() {
  const context = useContext(AegisContext)
  if (!context) {
    throw new Error("useAegis must be used within an AegisProvider")
  }
  return context
}
