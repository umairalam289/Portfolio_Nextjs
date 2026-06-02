"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorBlob() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hovered = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive =
        !!target?.closest("a, button, [data-magnetic], [data-cursor='hover']");
      hovered = interactive;
    };

    const tick = () => {
      // dot follows tightly
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      // ring follows softly
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      const scale = hovered ? 1.8 : 1;
      const ringScale = hovered ? 0.35 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.opacity = hovered ? "0.0" : "0.9";
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-10 w-10 rounded-full border border-white/30 mix-blend-difference transition-[transform,opacity] duration-150 ease-out"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-2 w-2 rounded-full mix-blend-difference"
        style={{
          background: "white",
          boxShadow: "0 0 16px rgba(167,139,250,0.7), 0 0 32px rgba(34,211,238,0.5)",
          willChange: "transform",
        }}
      />
    </>
  );
}
