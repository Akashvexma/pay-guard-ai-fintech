"use client"

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated grid */}
      <div className="absolute inset-0 cyber-grid animate-grid-flow opacity-60" />

      {/* Hex pattern */}
      <div className="absolute inset-0 cyber-hex opacity-40" />

      {/* Neon orbs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[oklch(0.7_0.25_330_/_0.15)] blur-[120px] animate-neon-pulse" />
      <div
        className="absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[oklch(0.75_0.2_195_/_0.12)] blur-[150px] animate-neon-pulse"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[oklch(0.75_0.25_145_/_0.1)] blur-[120px] animate-neon-pulse"
        style={{ animationDelay: "3s" }}
      />

      {/* Scan line */}
      <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[oklch(0.7_0.25_330_/_0.1)] to-transparent animate-scan" />

      {/* Corner accents */}
      <div className="absolute left-0 top-0 h-64 w-64 bg-gradient-to-br from-[oklch(0.7_0.25_330_/_0.2)] to-transparent" />
      <div className="absolute right-0 bottom-0 h-64 w-64 bg-gradient-to-tl from-[oklch(0.75_0.2_195_/_0.2)] to-transparent" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_oklch(0.06_0.02_280)_70%)]" />
    </div>
  )
}
