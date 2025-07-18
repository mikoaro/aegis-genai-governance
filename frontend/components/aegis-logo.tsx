"use client"

import { Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { AEGIS_STYLES } from "@/utils/colors"

interface AegisLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function AegisLogo({ size = "md", showText = true }: AegisLogoProps) {
  const { theme } = useTheme()

  const sizeMap = {
    sm: { container: "w-8 h-8", icon: "h-4 w-4", text: "text-sm" },
    md: { container: "w-10 h-10", icon: "h-6 w-6", text: "text-xl" },
    lg: { container: "w-16 h-16", icon: "h-8 w-8", text: "text-3xl" },
  }

  const currentSize = sizeMap[size]

  // Inline styles as backup - these will ALWAYS work
  const logoContainerStyle = {
    ...AEGIS_STYLES.shieldGradient,
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const textStyle = {
    ...AEGIS_STYLES.textGradient,
    fontWeight: "bold",
  }

  return (
    <div className="flex items-center gap-3">
      {/* Logo with CSS classes AND inline styles */}
      <div
        className={`${currentSize.container} bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-lg flex items-center justify-center`}
        style={logoContainerStyle} // Fallback inline style
      >
        <Shield className={`${currentSize.icon} text-white`} />
      </div>

      {showText && (
        <div>
          <h1
            className={`${currentSize.text} font-bold bg-gradient-to-r from-aegis-600 to-aegis-800 bg-clip-text text-transparent`}
            style={textStyle} // Fallback inline style
          >
            Project Aegis
          </h1>
          {size !== "sm" && <p className="text-xs text-muted-foreground">AI Governance Co-Pilot</p>}
        </div>
      )}
    </div>
  )
}
