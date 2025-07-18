import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });
const textDecoder = new TextDecoder('utf-8');

// Define CORS headers. Adjust the origin for production if needed.
const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000", // Or your specific frontend domain
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
};

/**
 * Asynchronously invokes the AuditLogger agent to record an event.
 * Uses 'Event' invocation type for "fire-and-forget" logging to not slow down the main workflow.
 * @param {object} payload - The structured JSON object representing the audit event.
 */
function logAuditEvent(payload) {
    const logInvokeCommand = new InvokeCommand({
        FunctionName: "Aegis-AuditLogger-Agent",
        Payload: JSON.stringify(payload),
        InvocationType: 'Event' // Asynchronous invocation
    });

    // Send the command but don't wait for a response.
    // Catch potential errors to prevent the main supervisor from crashing.
    lambdaClient.send(logInvokeCommand).catch(err => {
        console.error("CRITICAL: Failed to invoke AuditLogger Agent.", err);
    });
}


/**
 * Invokes a downstream Lambda function.
 * @param {string} functionName - The name of the Lambda function to invoke.
 * @param {object} payload - The JSON payload to send to the function.
 * @returns {Promise<object>} - The parsed JSON response from the invoked function.
 */
const invokeLambda = async (functionName, payload) => {
    const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify(payload)
    });
    console.log(`Invoking ${functionName}...`);
    const { Payload } = await lambdaClient.send(command);
    console.log(`Invocation of ${functionName} successful.`);
    return JSON.parse(textDecoder.decode(Payload));
};

// Helper function to generate advisory messages
const generateAdvisoryMessage = (findings) => {
    if (findings.guard.wasRedacted) {
        return {
          type: "MODIFY",
          complianceStatus: "modified",
          riskScore: 6.5,
          message: `Your request has been partially fulfilled. The customer feedback has been analyzed and summarized. However, drafting a personalized email containing PII (name, address, invoice number) has been blocked. Reason: To protect customer privacy, direct inclusion of PII in prompts is restricted. Suggestion: Please use the approved CRM system to contact the user, which manages user consent and communication templates.`,
          details: `Redacted items: ${findings.guard.redactions.join(", ")}`,
        };
      }

    if (!findings.policy.isCompliant) {
      return {
        type: "BLOCK",
        complianceStatus: "blocked",
        riskScore: 8.2,
        message: `Your request has been blocked. Reason: Under GDPR Article 6, processing personal data for a new purpose (direct marketing) requires a verified lawful basis, such as explicit user consent, which has not been confirmed for this dataset. Suggestion: To proceed, please engage the marketing operations team to launch a campaign through the approved platform that manages user consent records.`,
        details: findings.policy.rationale,
      };
    }
    
    return {
      type: "PASS",
      complianceStatus: "approved",
      riskScore: 1.2,
      message: "Your request was processed successfully.",
      details: null,
    };
  };

export const handler = async (event) => {
    console.log("Supervisor received event:", JSON.stringify(event, null, 2));
    const transactionId = event.requestContext.requestId; // Unique ID for the request

    // Handle CORS preflight request
    if (event.requestContext?.http?.method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight check successful' })
        };
    }

    let body;
    try {
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else {
            body = event.body || {};
        }
    } catch (e) {
        console.error("Could not parse request body:", e);
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "Invalid JSON format in request body." }) };
    }
    
    const originalPrompt = body.prompt;

    if (!originalPrompt) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "Prompt is missing in the request body." }) };
    }

    let advisoryMessage = '';
    let finalResponse = 'Your request has been processed successfully.';
    const agentsInvolved = [];
    const agentTrace = [];
    let isBlocked = false;

    // --- Stage 0: Log the initial, unaltered prompt ---
    logAuditEvent({
        eventId,
        timestamp: new Date().toISOString(),
        eventType: 'PROMPT_RECEIVED',
        details: { userPrompt }
    });

    try {
        // 1. Prompt Guard Agent
        const guardPayload = { prompt: originalPrompt };
        const guardResult = await invokeLambda('PromptGuardAgent', guardPayload);
        console.log("Prompt Guard Result:", JSON.stringify(guardResult, null, 2)); 
        // trace.push('PromptGuard');
        agentTrace.push({
            agentName: "PromptGuard",
            input: originalPrompt,
            output: guardResult.sanitizedPrompt,
            decision: guardResult.wasRedacted ? "Redacted PII" : "Passed",
          });
        
          agentsInvolved.push("PromptGuard");

        logAuditEvent({
            eventId,
            timestamp: new Date().toISOString(),
            eventType: 'PROMPT_GUARD_PROCESSED',
            details: { guardResult }
        });
        
        let processedPrompt = guardResult.sanitizedPrompt;

        if (guardResult.wasRedacted) {
            advisoryMessage += `Reason: To protect customer privacy, direct inclusion of PII (${guardResult.redactions.join(', ')}) in prompts is restricted. `;
        }

        // 2. Policy Enforcer Agent
        const policyPayload = { prompt: processedPrompt };
        const policyResult = await invokeLambda('PolicyEnforcerAgent', policyPayload);
        console.log("Policy Enforcer Result:", JSON.stringify(policyResult, null, 2));
        // agentTrace.push('PolicyEnforcer');
        agentTrace.push({
            agentName: "PolicyEnforcer",
            input: guardResult.sanitizedPrompt,
            output: policyResult.rationale,
            decision: !policyResult.isCompliant ? "Blocked" : "Compliant",
          });
        
        agentsInvolved.push("PolicyEnforcer");

        logAuditEvent({
            eventId,
            timestamp: new Date().toISOString(),
            eventType: 'POLICY_ENFORCER_PROCESSED',
            details: { policyResult }
        });

        if (!policyResult.isCompliant) {
            console.log("Test isBlocked Policy Enforcer Compliant or Not:", JSON.stringify(policyResult.isCompliant, null, 2));
            console.log("Test isBlocked Prompt Guard Redacted or Not:", JSON.stringify(guardResult.wasRedacted, null, 2));
            isBlocked = !(!policyResult.isCompliant && guardResult.wasRedacted);
            finalResponse = "Your request has been blocked.";
            advisoryMessage += `Reason: ${policyResult.reason} This action may conflict with data usage policies based on GDPR. Suggestion: Please review your request to ensure it aligns with the original purpose for which the data was collected.`;
        }

        // 3. Generate Final Response
        if (isBlocked) {
            // The final response is already set to the blocked message.
        } else if (guardResult.wasRedacted) {
            finalResponse = `Your request has been partially fulfilled. The PII was redacted, and the following prompt was processed: "${processedPrompt}"`;
        } else {
            finalResponse = `Your request was processed successfully for the prompt: "${processedPrompt}"`;
        }

        const advisory = generateAdvisoryMessage({
            guard: guardResult,
            policy: policyResult,
          });

        agentTrace.push({
            agentName: "AdvisoryAgent",
            input: { guardResult, policyResult },
            output: advisory.message,
            decision: "Generated user explanation",
          });

          agentsInvolved.push("AdvisoryAgent");

        // --- Stage 4: Log the final decision and advisory message ---
        logAuditEvent({
            eventId,
            timestamp: new Date().toISOString(),
            eventType: 'FINAL_RESPONSE_SENT',
            details: { 
                finalResponse: { status: finalResponsePayload.status },
                advisoryMessage
            }
        });

        const responsePayload = {
            transactionId,
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // new Date().toISOString(), 
            status: isBlocked ? "Blocked" : "Completed",
            finalOutput: finalResponse,
            originalPrompt: originalPrompt,
            processedPrompt: processedPrompt,
            aiMessage: finalResponse,
            advisoryMessage: advisoryMessage || 'No issues found.',
            advisory,
            complianceStatus: advisory.complianceStatus,
            riskScore: advisory.riskScore,
            agentTrace,
            agentsInvolved,
        };

        return {
            statusCode: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            body: JSON.stringify(responsePayload)
        };

    } catch (error) {
        console.error("An unhandled error occurred in the Supervisor:", error);
        return {
            statusCode: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            body: JSON.stringify({ message: "An internal server error occurred.", error: error.name, errorMessage: error.message })
        };
    }
};
