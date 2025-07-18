"use client";

import { useState } from "react";
import { ConversationDisplay } from "@/components/conversation-display";
import { PromptInputForm } from "@/components/prompt-input-form";
import { AgentTraceVisualizer } from "@/components/agent-trace-visualizer";
import { SamplePromptsSelector } from "@/components/sample-prompts-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Shield,
  Zap,
  Eye,
  BookOpen,
  BugOff,
  FileSpreadsheet,
} from "lucide-react";
import { useConversation } from "@/contexts/conversation-context";
import { UserProfileMenu } from "@/components/user-profile-menu";
import Link from "next/link";

export default function HomePage() {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const { isLoading } = useConversation();

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    document
      .getElementById("prompt-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-aegis-600 to-aegis-800 bg-clip-text text-transparent">
                  Project Aegis
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI Governance Co-Pilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserProfileMenu />
              <Link href="/debug">
                <Button variant="ghost" size="sm">
                  <BugOff className="h-4 w-4 mr-2" />
                  Debug
                </Button>
              </Link>
              <Link href="/audit-logs">
                <Button variant="ghost" size="sm">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Audit Logs
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  About
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-aegis-50 to-green-50 dark:from-aegis-950 dark:to-green-950 border-aegis-200 dark:border-aegis-800">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Dynamic AI Governance at Scale
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Transform governance from a bottleneck into an enabler. Aegis
                  provides real-time policy enforcement, auditable compliance
                  logs, and educational feedback for safe enterprise AI
                  adoption.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-aegis-600" />
                    <span>Real-time Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-aegis-600" />
                    <span>Full Transparency</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-aegis-600" />
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <SamplePromptsSelector
            onSelectPrompt={handleSelectPrompt}
            disabled={isLoading}
          />
          <AgentTraceVisualizer />
          <ConversationDisplay />

          <div id="prompt-form">
            <PromptInputForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Project Aegis - Built for the Impetus & AWS GenAI Hackathon</p>
            <p className="mt-2">
              Powered by Amazon Bedrock • Next.js 15 • React 19 • Tailwind v4
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
