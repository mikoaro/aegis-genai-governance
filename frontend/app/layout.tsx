import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AegisProvider } from "@/contexts/AegisContext"
import { UserProvider } from "@/contexts/user-context"
import { ConversationProvider } from "@/contexts/conversation-context"
import { AgentTraceProvider } from "@/contexts/agent-trace-context"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Aegis - AI Governance Co-Pilot",
  description:
    "Dynamic multi-agent AI governance system built on Amazon Bedrock for enterprise AI safety and compliance.",
  keywords: ["AI Governance", "Compliance", "GDPR", "Enterprise AI", "Amazon Bedrock"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AegisProvider>
          <UserProvider>
            <ConversationProvider>
              <AgentTraceProvider>
                {children}
                <Toaster />
              </AgentTraceProvider>
            </ConversationProvider>
          </UserProvider>
          </AegisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
