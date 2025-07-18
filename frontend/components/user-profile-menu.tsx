"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { useConversation } from "@/contexts/conversation-context"
import { useAgentTrace } from "@/contexts/agent-trace-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, RotateCcw, Trash2, Copy, Check } from "lucide-react"
import { toast } from "sonner"

export function UserProfileMenu() {
  const { userId, resetProfile } = useUser()
  const { clearMessages, messages } = useConversation()
  const { clearTrace } = useAgentTrace()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setCopied(true)
      toast.success("User ID copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy User ID")
    }
  }

  const handleResetProfile = () => {
    // Clear all application state
    clearMessages()
    clearTrace()

    // Reset user profile (this will generate new UUID and clear localStorage)
    resetProfile()

    setShowResetDialog(false)
    toast.success("Profile reset successfully! New user session created.")
  }

  const handleClearConversation = () => {
    clearMessages()
    clearTrace()
    toast.success("Conversation history cleared")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-primary-foreground" />
            </div>
            <Badge variant="outline" className="text-xs font-mono text-gray">
              {userId.slice(0, 8)}...
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>User Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User ID:</span>
              <Button variant="ghost" size="sm" onClick={handleCopyUserId} className="h-6 px-2">
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded block mt-1 break-all">{userId}</code>
          </div>

          <div className="px-2 py-2">
            <div className="text-sm text-muted-foreground">
              Messages: <span className="font-medium">{messages.length}</span>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleClearConversation}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Conversation
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="text-red-600 focus:text-red-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Profile</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This action will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Generate a new User ID (UUID)</li>
                <li>Clear all conversation history</li>
                <li>Reset all application preferences</li>
                <li>Clear agent trace data</li>
              </ul>
              <p className="font-medium text-foreground mt-3">
                This action cannot be undone. Are you sure you want to continue?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetProfile} className="bg-red-600 hover:bg-red-700">
              Reset Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
