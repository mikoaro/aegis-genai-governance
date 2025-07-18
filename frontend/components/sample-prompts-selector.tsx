"use client"

import { useState } from "react"
import { SAMPLE_PROMPTS } from "@/utils/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface SamplePromptsProps {
  onSelectPrompt: (prompt: string) => void
  disabled?: boolean
}

export function SamplePromptsSelector({ onSelectPrompt, disabled }: SamplePromptsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "PII Handling":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Policy Compliance":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Security Risk":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Safe Request":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "redaction":
        return "✂️"
      case "block":
        return "🚫"
      case "allow":
        return "✅"
      default:
        return "❓"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Sample Prompts
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_PROMPTS.map((sample) => (
              <div
                key={sample.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md",
                  selectedPrompt === sample.id && "ring-2 ring-primary",
                )}
                onClick={() => setSelectedPrompt(sample.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{sample.title}</h4>
                  <span className="text-lg">{getActionIcon(sample.expectedAction)}</span>
                </div>

                <Badge className={cn("mb-3", getCategoryColor(sample.category))}>{sample.category}</Badge>

                <Textarea value={sample.prompt} readOnly className="text-xs resize-none mb-3" rows={3} />

                <Button
                  size="sm"
                  className="w-full"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectPrompt(sample.prompt)
                  }}
                >
                  Use This Prompt
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
