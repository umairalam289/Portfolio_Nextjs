"use client";

// Diagnostic-viewer backdrop, now alive: a panning measurement grid, a slow
// rotating cyan wash, and drifting aurora light — single-hue, never busy.
export default function LiquidBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* blueprint grid, gently panning, faded toward the edges */}
      <div
        className="grid-lines animate-grid-pan absolute inset-[-56px] opacity-[0.5]"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 28%, black 35%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 28%, black 35%, transparent 92%)",
        }}
      />

      {/* slow rotating conic wash — the fluid undercurrent */}
      <div
        className="animate-spin-slow absolute left-1/2 top-[-10%] h-[140vmax] w-[140vmax] -translate-x-1/2 opacity-[0.5]"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(34,211,238,0.10) 60deg, transparent 140deg, rgba(56,189,248,0.08) 240deg, transparent 320deg)",
          filter: "blur(40px)",
        }}
      />

      {/* drifting aurora light sources */}
      <div
        className="animate-aurora-a absolute -top-40 left-[6%] h-[560px] w-[560px] rounded-full opacity-45 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.5), transparent 62%)" }}
      />
      <div
        className="animate-aurora-b absolute top-[40%] right-[4%] h-[480px] w-[480px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.42), transparent 62%)" }}
      />
      <div
        className="animate-aurora-a absolute bottom-[-10%] left-[34%] h-[420px] w-[420px] rounded-full opacity-25 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(45,212,191,0.32), transparent 62%)",
          animationDelay: "-12s",
        }}
      />

      {/* vignette to seat everything */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 48%, rgba(6,8,12,0.9) 100%)",
        }}
      />
    </div>
  );
}
