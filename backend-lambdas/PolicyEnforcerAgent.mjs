import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID;

// A simple check to see if the response indicates a potential violation.
// For the MVP, we assume any retrieved citation implies a policy concern.
const isViolation = (citations) => {
  return citations && citations.length > 0;
};

export const handler = async (event) => {
  const prompt = event.prompt || "";
  console.log(
    `Checking prompt against Knowledge Base ID: ${KNOWLEDGE_BASE_ID}`
  );

  const command = new RetrieveAndGenerateCommand({
    input: {
      text: `Based on the provided GDPR articles, does the following user request raise any compliance concerns, particularly regarding purpose limitation or lawful basis? User Request: "${prompt}"`,
    },
    retrieveAndGenerateConfiguration: {
      type: "KNOWLEDGE_BASE",
      knowledgeBaseConfiguration: {
        knowledgeBaseId: KNOWLEDGE_BASE_ID,
        modelArn:
          "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0",
      },
    },
  });

  try {
    const response = await client.send(command);
    const citations = response.citations || [];
    const violation = isViolation(citations);

    let retrievedText = "";
    if (violation) {
      // Consolidate the context from the retrieved text snippets for the advisory message
      retrievedText = citations
        .flatMap((citation) => citation.retrievedReferences)
        .map((ref) => ref.content.text)
        .join("\n\n");
    }

    console.log("Bedrock Response:", response);

    return {
      isCompliant: !violation,
      reason: violation
        ? "Request may violate GDPR policies regarding data usage and purpose."
        : "Request appears compliant.",
      context: retrievedText,
    };
  } catch (error) {
    console.error("Error calling Bedrock RetrieveAndGenerate:", error);
    return {
      isCompliant: false,
      reason: "Error during policy check.",
      context: error.message,
    };
  }
};
