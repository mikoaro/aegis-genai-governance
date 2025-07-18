// index.mjs for Aegis-AuditLog-Reader
import {
  QLDBSessionClient,
  SendCommandCommand,
} from "@aws-sdk/client-qldb-session";

const qldbClient = new QLDBSessionClient({ region: "us-east-1" });
const LEDGER_NAME = "aegis-audit-log";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  try {
    const command = new SendCommandCommand({
      SessionToken: undefined,
      ExecuteStatement: {
        Statement: "SELECT * FROM Interactions",
      },
    });

    const result = await qldbClient.send(command);
    // The result from QLDB is in Ion format, needs to be parsed.
    const parsedResult = result.Execute.IonText.map((ionText) =>
      JSON.parse(ionText)
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(parsedResult),
    };
  } catch (error) {
    console.error("Error reading from QLDB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to read logs." }),
    };
  }
};
