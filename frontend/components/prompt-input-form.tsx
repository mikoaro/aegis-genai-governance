"use client";

import type React from "react";

import { useState } from "react";
import { useConversation } from "@/contexts/conversation-context";
import { useAgentTrace } from "@/contexts/agent-trace-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/user-context";
import { PROMPT_API_URL } from "@/utils/constants";

export function PromptInputForm() {
  const [prompt, setPrompt] = useState("");
  const { addMessage, isLoading, setIsLoading, clearMessages } =
    useConversation();
  const { startTrace, updateAgentStep, clearTrace } = useAgentTrace();
  const { userId, resetProfile } = useUser();

  const simulateAgentProcessing = async (agentsInvolved: string[]) => {
    startTrace(agentsInvolved);

    for (let i = 0; i < agentsInvolved.length; i++) {
      const agentId = agentsInvolved[i];
      const delay = Math.random() * 1000 + 500; // Random delay between 500-1500ms

      // Start processing
      updateAgentStep(agentId, {
        status: "processing",
        input: i === 0 ? prompt : `Output from ${agentsInvolved[i - 1]}`,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      // Complete processing
      updateAgentStep(agentId, {
        status: "completed",
        output: `Processed by ${agentId}`,
        duration: Math.round(delay),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!userId) {
      toast.error("User session not initialized");
      return;
    }

    setIsLoading(true);

    // Add user message
    addMessage({
      type: "user",
      content: prompt,
    });

    try {
      // Call the API
      // const response = await fetch("/api/aegis", {  
      const response = await fetch(
        PROMPT_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      // {
      //    "transactionId":"NqOeOg2IIAMES_g=",
      //    "timestamp":"2025-07-11T18:14:38.261Z",
      //    "status":"Completed",
      //    "finalOutput":"Your request has been partially fulfilled. The PII was redacted, and the following prompt was processed: \"Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with invoice #[REDACTED_INVOICE].\"",
      //    "originalPrompt":"Analyze the following customer feedback and draft a personalized apology email to a user named John Doe who lives at 123 Main St and mentioned a billing issue with invoice #INV-456.",
      //    "processedPrompt":"Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with invoice #[REDACTED_INVOICE].",
      //    "aiMessage":"Your request has been partially fulfilled. The PII was redacted, and the following prompt was processed: \"Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with invoice #[REDACTED_INVOICE].\"",
      //    "advisoryMessage":"Reason: To protect customer privacy, direct inclusion of PII (NAME_JOHN_DOE, ADDRESS_MAIN_ST, INVOICE_NUMBER) in prompts is restricted. Reason: Error during policy check. This action may conflict with data usage policies based on GDPR. Suggestion: Please review your request to ensure it aligns with the original purpose for which the data was collected.",
      //    "advisory":{
      //       "type":"MODIFY",
      //       "message":"Your request has been partially fulfilled. The customer feedback has been analyzed and summarized. However, drafting a personalized email containing PII (name, address, invoice number) has been blocked. Reason: To protect customer privacy, direct inclusion of PII in prompts is restricted. Suggestion: Please use the approved CRM system to contact the user, which manages user consent and communication templates.",
      //       "details":"Redacted items: NAME_JOHN_DOE, ADDRESS_MAIN_ST, INVOICE_NUMBER"
      //    },
      //    "agentTrace":[
      //       {
      //          "agentName":"PromptGuard",
      //          "input":"Analyze the following customer feedback and draft a personalized apology email to a user named John Doe who lives at 123 Main St and mentioned a billing issue with invoice #INV-456.",
      //          "output":"Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with invoice #[REDACTED_INVOICE].",
      //          "decision":"Redacted PII"
      //       },
      //       {
      //          "agentName":"PolicyEnforcer",
      //          "input":"Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with invoice #[REDACTED_INVOICE].",
      //          "decision":"Blocked"
      //       },
      //       {
      //          "agentName":"AdvisoryAgent",
      //          "input":{
      //             "guardResult":{
      //                "sanitizedPrompt":"Analyze the following customer feedback and draft a personalized apology email to a user named [REDACTED_NAME] who lives at [REDACTED_ADDRESS] and mentioned a billing issue with invoice #[REDACTED_INVOICE].",
      //                "wasRedacted":true,
      //                "redactions":[
      //                   "NAME_JOHN_DOE",
      //                   "ADDRESS_MAIN_ST",
      //                   "INVOICE_NUMBER"
      //                ]
      //             },
      //             "policyResult":{
      //                "isCompliant":false,
      //                "reason":"Error during policy check.",
      //                "context":"Invalid input or configuration provided. Check the input and Knowledge Base configuration and try your request again. (Service: BedrockAgentRuntime, Status Code: 400, Request ID: 576e9fdb-d128-46d7-a14a-4daf9d9f4cc7) (SDK Attempt Count: 1)"
      //             }
      //          },
      //          "output":"Your request has been partially fulfilled. The customer feedback has been analyzed and summarized. However, drafting a personalized email containing PII (name, address, invoice number) has been blocked. Reason: To protect customer privacy, direct inclusion of PII in prompts is restricted. Suggestion: Please use the approved CRM system to contact the user, which manages user consent and communication templates.",
      //          "decision":"Generated user explanation"
      //       }
      //    ]
      // }

      // {
      //   "transactionId":"NoO4lhiIoAMEbEA=",
      //   "timestamp":"2025-07-13T03:43:39.936Z",
      //   "originalPrompt":"We have a dataset of customer feedback from our German user base. Use this to generate a new marketing campaign targeting these users with our latest product.\n\n",
      //   "processedPrompt":"We have a dataset of customer feedback from our German user base. Use this to generate a new marketing campaign targeting these users with our latest product.\n\n",
      //   "aiMessage":"Your request has been blocked.",
      //   "advisoryMessage":"Reason: Error during policy check. This action may conflict with data usage policies based on GDPR. Suggestion: Please review your request to ensure it aligns with the original purpose for which the data was collected.",
      //   "advisory":{
      //     "type":"PASS",
      //     "message":"Your request was processed successfully.",
      //     "details":null
      //   },
      //   "trace":[
      //     "PromptGuard",
      //     "PolicyEnforcer"
      //   ]
      // }

      // {
      //   "transactionId":"NoMBJh_KIAMEV5A=",
      //   "timestamp":"2025-07-13T03:24:05.746Z",
      //   "originalPrompt":"We have a dataset of customer feedback from our German user base. Use this to generate a new marketing campaign targeting these users with our latest product.\n\n",
      //   "processedPrompt":"We have a dataset of customer feedback from our German user base. Use this to generate a new marketing campaign targeting these users with our latest product.\n\n",
      //   "aiMessage":"Your request has been blocked.",
      //   "advisoryMessage":"Reason: Error during policy check. This action may conflict with data usage policies based on GDPR. Suggestion: Please review your request to ensure it aligns with the original purpose for which the data was collected.",
      //   "trace":[
      //     "PromptGuard",
      //     "PolicyEnforcer"
      //   ]
      // }

      const result = await response.json();
      console.log("Result --- Miko");
      console.log(result);
      const data = result;

      console.log("Data --- Miko");
      console.log(data);

      // Simulate agent processing
      await simulateAgentProcessing(data.agentsInvolved);
      // await simulateAgentProcessing(data.agentsInvolved)

      // Add assistant response
      addMessage({
        type: "assistant",
        content: data.advisoryMessage,
        advisoryMessage: data.advisory.message,
        agentsInvolved: data.agenTrace,
        riskScore: data.riskScore,
        complianceStatus: data.complianceStatus,
        originalPrompt: data.originalPrompt,
        processedPrompt: data.originalPrompt,
      });

      // addMessage({
      //   type: "assistant",
      //   content: data.advisoryMessage,
      //   advisoryMessage: data.advisoryMessage,
      //   agentsInvolved: data.trace,
      //   riskScore: 0,
      //   complianceStatus: data.aiMessage,
      //   originalPrompt: prompt,
      //   processedPrompt: prompt,
      // })

      // Show success toast
      toast.success("Request processed successfully");

      // Clear the input
      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process request. Please try again.");

      addMessage({
        type: "assistant",
        content:
          "I apologize, but I encountered an error while processing your request. Please try again.",
        advisoryMessage:
          "System error occurred during processing. This has been logged for review.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    clearMessages();
    clearTrace();
    toast.success("Conversation cleared");
  };

  const handleResetProfile = () => {
    clearMessages();
    clearTrace();
    resetProfile();
    toast.success("Profile reset! New user session created.");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            Submit Prompt for Governance Review
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearConversation}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetProfile}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Your Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your AI prompt here. It will be analyzed by our governance agents for compliance and safety..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {prompt.length}/2000 characters
            </div>
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
