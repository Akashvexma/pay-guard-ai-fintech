"use client"

export function BlockchainBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated grid */}
      <div className="absolute inset-0 blockchain-grid animate-grid-move opacity-50" />

      {/* Hex pattern overlay */}
      <div className="absolute inset-0 hex-pattern" />

      {/* Gradient orbs */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
      <div
        className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-accent/15 blur-[120px] animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-primary/15 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      {/* Scan line effect */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--background)_70%)]" />
    </div>
  )
}
