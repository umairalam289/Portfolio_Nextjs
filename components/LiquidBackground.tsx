"use client";

export default function LiquidBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 50%, transparent 100%)",
        }}
      />

      {/* Gooey blobs */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
            <feColorMatrix
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 22 -10"
            />
          </filter>
        </defs>
      </svg>

      <div className="goo absolute inset-0">
        <div
          className="absolute -top-32 left-[10%] h-[520px] w-[520px] rounded-full opacity-50 mix-blend-screen blur-3xl animate-blob-slow"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent 60%)" }}
        />
        <div
          className="absolute top-[35%] right-[5%] h-[460px] w-[460px] rounded-full opacity-50 mix-blend-screen blur-3xl animate-blob-medium"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent 60%)" }}
        />
        <div
          className="absolute bottom-0 left-[30%] h-[600px] w-[600px] rounded-full opacity-40 mix-blend-screen blur-3xl animate-blob-fast"
          style={{ background: "radial-gradient(circle, #e879f9, transparent 60%)" }}
        />
        <div
          className="absolute top-[60%] left-[5%] h-[300px] w-[300px] rounded-full opacity-40 mix-blend-screen blur-3xl animate-blob-slow"
          style={{ background: "radial-gradient(circle, #5eead4, transparent 60%)" }}
        />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(5,6,10,0.85) 100%)",
        }}
      />
    </div>
  );
}
