"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  RefreshCw,
  FileText,
  Shield,
  Leaf,
  ArrowLeft,
} from "lucide-react";
import { useAegis } from "@/contexts/AegisContext";
import type { LogEntry } from "@/types";
import { toast } from "sonner";
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import Link from "next/link";

export default function AuditLogsPage() {
  const { state } = useAegis();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(true); // Default to true since sample data doesn't have userId

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = "/api/qldb/audit-logs";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }
      const data = await response.json();
      setLogs(data.logs);
      setFilteredLogs(data.logs);

      if (data.logs.length === 0) {
        toast.info("No audit logs found. Submit a prompt to generate logs.");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [state.user, showAllUsers]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = logs.filter(
        (log) =>
          log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.details.userPrompt &&
            log.details.userPrompt
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  }, [searchTerm, logs]);

  return (
    <div>
      {/* Header */}
      <header className="border-b border-aegis-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">Project Aegis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <div className="relative mr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="bg-gradient-to-br from-aegis-500 to-aegis-700 dark:from-aegis-500 dark:to-aegis-400 bg-clip-text text-transparent">
                Audit Logs
              </span>
            </h1>
            <p className="text-muted-foreground">
              Immutable audit trail of all AI interactions powered by Amazon
              QLDB
            </p>
          </div>
          <Button
            onClick={fetchLogs}
            disabled={loading}
            className="bg-aegis-600 hover:bg-aegis-700 text-white"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Card className="border-3 border-emerald-500 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-aegis-600 dark:text-aegis-500" />
              Cryptographically Verifiable Transaction Logs
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Logs</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by event type, event ID, or prompt content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-aegis-200 dark:border-aegis-800 focus:ring-aegis-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-all" className="text-sm">
                  Show All Transactions
                </Label>
                <Switch
                  id="show-all"
                  checked={showAllUsers}
                  onCheckedChange={setShowAllUsers}
                  className="data-[state=checked]:bg-aegis-600"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2 text-aegis-600 dark:text-aegis-500" />
                <span className="text-aegis-600 dark:text-aegis-500">
                  Loading audit logs...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Showing transaction logs
                  {filteredLogs.length > 0 &&
                    ` (${filteredLogs.length} events across multiple transactions)`}
                </div>

                <AuditLogTable logs={filteredLogs} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
