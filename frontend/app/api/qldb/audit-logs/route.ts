import { type NextRequest, NextResponse } from "next/server";
import type { LogEntry } from "@/types";
import { addLog, getLogs } from "@/utils/audit-store";
import { READ_AUDIT_LOGS_API_URL } from "@/utils/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = Number.parseInt(searchParams.get("limit") || "50");
  const offset = Number.parseInt(searchParams.get("offset") || "0");

  const externalApiResponse = await fetch(READ_AUDIT_LOGS_API_URL);
  if (!externalApiResponse.ok) {
    throw new Error("Failed to fetch data from external API");
  }
  const rawData = await externalApiResponse.json();

  const data = getLogs2(rawData);

  // Note: In the new structure, we don't filter by userId since the sample data doesn't include it
  // You can add userId filtering logic here if needed

  return NextResponse.json({
    logs: data.slice(offset, offset + limit),
    total: data.length,
    hasMore: offset + limit < data.length,
  });
}

function getLogs2(rawData: any) {
  return [...rawData].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function POST(req: NextRequest) {
  const payload: Omit<LogEntry, "timestamp"> = await req.json();
  const created = addLog(payload);
  return NextResponse.json(created);
}
