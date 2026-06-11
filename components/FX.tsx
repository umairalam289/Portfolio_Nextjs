"use client";

import { useEffect } from "react";

// One global pointer loop that drives two effects without per-component listeners:
//  • cursor glow  — sets --mx/--my on the hovered [data-spot] card
//  • magnetic     — nudges [data-magnetic] elements toward a nearby cursor
export default function FX() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let mx = 0;
    let my = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const apply = () => {
      raf = 0;

      // cursor glow on the hovered card
      const spot = (document.elementFromPoint(mx, my) as HTMLElement | null)?.closest(
        "[data-spot]"
      ) as HTMLElement | null;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${mx - r.left}px`);
        spot.style.setProperty("--my", `${my - r.top}px`);
      }

      // magnetic pull for nearby interactive elements
      const mags = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      mags.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(r.width, r.height) * 0.9 + 48;
        if (dist < radius) {
          const pull = (1 - dist / radius) * 0.32;
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        } else if (el.style.transform) {
          el.style.transform = "";
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
