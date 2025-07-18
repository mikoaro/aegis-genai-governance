"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ColorTest() {
  const [supportsOKLCH, setSupportsOKLCH] = useState(false)

  useEffect(() => {
    // Check if browser supports OKLCH
    const testElement = document.createElement("div")
    testElement.style.color = "oklch(50% 0.1 180)"
    setSupportsOKLCH(testElement.style.color !== "")
  }, [])

  const aegisColors = [
    { name: "aegis-50", class: "bg-aegis-50", oklch: "oklch(98.04% 0.013 154.72)" },
    { name: "aegis-100", class: "bg-aegis-100", oklch: "oklch(95.12% 0.026 154.72)" },
    { name: "aegis-200", class: "bg-aegis-200", oklch: "oklch(89.39% 0.052 154.72)" },
    { name: "aegis-300", class: "bg-aegis-300", oklch: "oklch(80.98% 0.104 154.72)" },
    { name: "aegis-400", class: "bg-aegis-400", oklch: "oklch(72.58% 0.156 154.72)" },
    { name: "aegis-500", class: "bg-aegis-500", oklch: "oklch(64.17% 0.208 154.72)" },
    { name: "aegis-600", class: "bg-aegis-600", oklch: "oklch(55.76% 0.156 142.36)" },
    { name: "aegis-700", class: "bg-aegis-700", oklch: "oklch(47.35% 0.130 142.36)" },
    { name: "aegis-800", class: "bg-aegis-800", oklch: "oklch(38.94% 0.104 142.36)" },
    { name: "aegis-900", class: "bg-aegis-900", oklch: "oklch(30.53% 0.078 142.36)" },
    { name: "aegis-950", class: "bg-aegis-950", oklch: "oklch(15.29% 0.039 142.36)" },
  ]

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎨 Tailwind v4 + OKLCH Color System Test
          <Badge variant={supportsOKLCH ? "default" : "secondary"}>
            {supportsOKLCH ? "OKLCH Supported" : "Hex Fallback"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Browser Support Info */}
        <div className="p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">🔍 Browser Support Detection</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>OKLCH Support:</strong> {supportsOKLCH ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Fallback Mode:</strong> {supportsOKLCH ? "v4 Enhanced" : "v3 Compatible"}
            </div>
          </div>
        </div>

        {/* Aegis Color Palette */}
        <div>
          <h3 className="font-semibold mb-4">🛡️ Aegis Color Palette (Dual System)</h3>
          <div className="grid grid-cols-6 md:grid-cols-11 gap-3">
            {aegisColors.map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className={`w-16 h-16 ${color.class} rounded-lg border shadow-sm`}
                  title={supportsOKLCH ? color.oklch : `var(--aegis-${color.name.split("-")[1]})`}
                />
                <span className="text-xs mt-2 block font-mono">{color.name.split("-")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Tests */}
        <div>
          <h3 className="font-semibold mb-4">🌈 Enhanced Gradients</h3>
          <div className="space-y-3">
            <div className="h-16 bg-aegis-gradient rounded-lg flex items-center justify-center text-white font-semibold shadow-lg">
              Aegis Brand Gradient
            </div>
            <div className="h-12 bg-gradient-to-r from-aegis-50 to-green-50 dark:from-aegis-950 dark:to-green-950 rounded-lg flex items-center justify-center border">
              Light Theme Gradient
            </div>
          </div>
        </div>

        {/* Text Gradients */}
        <div>
          <h3 className="font-semibold mb-4">📝 Text Gradients</h3>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-aegis-gradient">Project Aegis</h2>
            <p className="text-lg text-aegis-gradient">AI Governance Co-Pilot</p>
          </div>
        </div>

        {/* Component Tests */}
        <div>
          <h3 className="font-semibold mb-4">🧩 Component Color Tests</h3>
          <div className="flex gap-4 flex-wrap">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </div>

        {/* Switch Component Test */}
        <div>
          <h3 className="font-semibold mb-4">🔄 Switch Component Test</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center space-x-2">
              <Switch id="test-switch-1" />
              <Label htmlFor="test-switch-1">Default Switch</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="test-switch-2" defaultChecked />
              <Label htmlFor="test-switch-2">Checked Switch</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="test-switch-3" disabled />
              <Label htmlFor="test-switch-3">Disabled Switch</Label>
            </div>
          </div>
        </div>

        {/* Animation Tests */}
        <div>
          <h3 className="font-semibold mb-4">✨ Animation Tests</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="agent-panel active p-4 rounded-lg border text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm">Glow Animation</div>
            </div>
            <div className="p-4 rounded-lg border text-center animate-pulse-green">
              <div className="text-2xl mb-2">💚</div>
              <div className="text-sm">Pulse Green</div>
            </div>
            <div className="p-4 rounded-lg border text-center animate-slide-in">
              <div className="text-2xl mb-2">➡️</div>
              <div className="text-sm">Slide In</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="typing-indicator mb-2">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="text-sm">Typing</div>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="p-4 rounded-lg bg-muted">
          <h3 className="font-semibold mb-2">⚙️ Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>CSS System:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>@import "tailwindcss"</li>
                <li>@theme inline directive</li>
                <li>OKLCH color space</li>
                <li>CSS custom properties</li>
              </ul>
            </div>
            <div>
              <strong>Fallback Support:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Hex color fallbacks</li>
                <li>v0 compatibility mode</li>
                <li>@supports detection</li>
                <li>Environment-based config</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-aegis-50 dark:from-green-950/20 dark:to-aegis-950/20 rounded-lg border">
          <div className="text-2xl mb-2">🚀</div>
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            Tailwind v4 + shadcn/ui Successfully Implemented!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {supportsOKLCH
              ? "Enhanced OKLCH colors active with P3 color space support"
              : "Hex fallback mode active - fully compatible with v0 preview"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
