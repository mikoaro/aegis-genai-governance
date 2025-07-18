// Project Aegis Color System - No Config File Required
// Use these for inline styles if CSS classes fail

export const AEGIS_COLORS = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a", // Primary brand color
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
  950: "#052e16",
} as const

export const AEGIS_STYLES = {
  // Primary brand styles
  primaryButton: {
    backgroundColor: AEGIS_COLORS[600],
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },

  primaryButtonHover: {
    backgroundColor: AEGIS_COLORS[700],
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${AEGIS_COLORS[600]}40`,
  },

  // Shield logo gradient
  shieldGradient: {
    background: `linear-gradient(135deg, ${AEGIS_COLORS[500]} 0%, ${AEGIS_COLORS[700]} 100%)`,
  },

  // Text gradient
  textGradient: {
    background: `linear-gradient(to right, ${AEGIS_COLORS[600]}, ${AEGIS_COLORS[800]})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  // Card backgrounds
  lightCard: {
    backgroundColor: AEGIS_COLORS[50],
    border: `1px solid ${AEGIS_COLORS[200]}`,
  },

  darkCard: {
    backgroundColor: AEGIS_COLORS[950],
    border: `1px solid ${AEGIS_COLORS[800]}`,
  },

  // Agent panel states
  agentPanelActive: {
    boxShadow: `0 0 0 2px ${AEGIS_COLORS[600]}, 0 10px 15px -3px rgba(0, 0, 0, 0.1)`,
    backgroundColor: `${AEGIS_COLORS[600]}08`,
  },

  agentPanelCompleted: {
    backgroundColor: AEGIS_COLORS[50],
    border: `1px solid ${AEGIS_COLORS[200]}`,
  },
} as const

// Utility functions
export const getAegisColor = (shade: keyof typeof AEGIS_COLORS) => AEGIS_COLORS[shade]

export const getAegisStyle = (styleName: keyof typeof AEGIS_STYLES) => AEGIS_STYLES[styleName]

// Theme-aware color getter
export const getThemeAwareAegisColor = (shade: keyof typeof AEGIS_COLORS, isDark: boolean) => {
  if (isDark) {
    // Invert colors for dark mode
    const invertedShades: Record<keyof typeof AEGIS_COLORS, keyof typeof AEGIS_COLORS> = {
      50: "950",
      100: "900",
      200: "800",
      300: "700",
      400: "600",
      500: "500", // Keep middle shade
      600: "400",
      700: "300",
      800: "200",
      900: "100",
      950: "50",
    }
    return AEGIS_COLORS[invertedShades[shade]]
  }
  return AEGIS_COLORS[shade]
}
