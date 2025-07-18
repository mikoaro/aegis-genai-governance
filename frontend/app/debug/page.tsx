import { ColorTest } from "@/components/color-test";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function DebugPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🔧 Debug & Color Test</h1>
            <p className="text-muted-foreground">
              Use this page to verify all colors are working correctly after
              local installation
            </p>
          </div>

          <ColorTest />

          <div className="text-center text-sm text-muted-foreground">
            <p>
              If any colors appear broken, check the setup guide in SETUP.md
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
