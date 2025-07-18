// index.mjs for Aegis-AuditLogger-Agent
import { QLDBSessionClient, SendCommandCommand } from "@aws-sdk/client-qldb-session";
import { unmarshall } from "@aws-sdk/util-dynamodb"; // QLDB uses a similar structure

const qldbClient = new QLDBSessionClient({ region: "us-east-1" });
const LEDGER_NAME = 'aegis-audit-log';

/**
 * @param {object} event - The audit event payload.
 */
export const handler = async (event) => {
  console.log("AuditLogger Agent invoked with event:", event);

  try {
    const command = new SendCommandCommand({
      SessionToken: undefined, // Will be acquired on first call
      StartTransaction: {},
      ExecuteStatement: {
        Statement: "INSERT INTO Interactions ?",
        Parameters: [{ IonText: JSON.stringify(event) }],
      },
      CommitTransaction: {}
    });

    await qldbClient.send(command);
    console.log("Successfully wrote audit event to QLDB.");
    return { statusCode: 200, body: "Log written." };

  } catch (error) {
    console.error("Error writing to QLDB:", error);
    // Do not re-throw, to avoid breaking the main supervisor flow.
    return { statusCode: 500, body: "Failed to write log." };
  }
};
