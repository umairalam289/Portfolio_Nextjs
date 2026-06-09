"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactEventHandler } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const FUNDUS_SRC = "/retina-fundus.jpg"; // drop the original photograph here
const MASK_SRC = "/retina-vessels.png"; // binary vessel map (white on black)
const OVERLAY_SRC = "/retina-vessels-overlay.png"; // colourised RGBA vessels

type Mode = "overlay" | "mask";

const STATS: { k: string; v: string }[] = [
  { k: "architecture", v: "U-Net" },
  { k: "backbone", v: "ResNet-34" },
  { k: "output", v: "Binary vessel map" },
  { k: "domain", v: "Ophthalmology screening" },
];

export default function RetinaDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0); // 0 → 100, divider x position
  const [dragging, setDragging] = useState(false);
  const [userTouched, setUserTouched] = useState(false);
  const [mode, setMode] = useState<Mode>("overlay");
  const [fundusOk, setFundusOk] = useState(true);

  // Scroll-driven wipe: the segmentation sweeps in from the left as the demo
  // rises into view — until the visitor grabs the handle to compare manually.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.3"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (userTouched) return;
    setPos(Math.round(Math.min(1, Math.max(0, v)) * 1000) / 10);
  });
  useEffect(() => {
    if (userTouched) return;
    const raf = requestAnimationFrame(() =>
      setPos(Math.round(Math.min(1, Math.max(0, scrollYProgress.get())) * 1000) / 10)
    );
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress, userTouched]);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (clientX - rect.left) / rect.width;
    setPos(Math.min(100, Math.max(0, x * 100)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setUserTouched(true);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) setFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // A 404 can fire `error` before React attaches its handler, so also probe the
  // element once it mounts: a finished load with zero natural width = broken.
  const onFundusMount = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) setFundusOk(false);
  }, []);
  const onFundusError: ReactEventHandler<HTMLImageElement> = () => setFundusOk(false);

  const onHandleKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setUserTouched(true);
      setPos((p) => Math.min(100, Math.max(0, p + (e.key === "ArrowLeft" ? -step : step))));
    }
  };

  return (
    <section id="retina" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              06 / Live demo
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Retinal vessels, <span className="gradient-text">traced</span>.
            </h2>
            <p className="mt-4 max-w-2xl text-white/65">
              Semantic segmentation of retinal blood vessels from fundus photographs — a
              U-Net with a ResNet-34 backbone producing precise binary vessel maps for
              ophthalmology screening. Drag the handle to compare the input photograph
              against the model&apos;s prediction, or scroll to let it sweep in.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* comparison viewer */}
          <div className="lg:col-span-8">
            <div className="glass relative overflow-hidden rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-black/20 px-4 py-3 font-mono text-[11px] text-white/55">
                <div className="flex items-center gap-2">
                  <span className="inline-flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  </span>
                  <span className="text-white/45">fundus · 512×512px · U-Net · ResNet-34</span>
                </div>
                <span className="hidden sm:inline text-white/35">
                  {Math.round(pos)}% segmented
                </span>
              </div>

              <div className="p-4 sm:p-6">
                <div
                  ref={containerRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className="relative mx-auto aspect-square w-full max-w-[600px] cursor-ew-resize select-none overflow-hidden rounded-2xl bg-black"
                  style={{ touchAction: "pan-y" }}
                >
                  {/* base layer: fundus photograph */}
                  {fundusOk ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      ref={onFundusMount}
                      src={FUNDUS_SRC}
                      alt="Retinal fundus photograph"
                      draggable={false}
                      onError={onFundusError}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#1a1208,#05060a_75%)]">
                      <div className="text-center font-mono text-[11px] leading-relaxed text-white/40">
                        fundus photograph
                        <br />
                        <span className="text-white/25">add /public/retina-fundus.jpg</span>
                      </div>
                    </div>
                  )}

                  {/* revealed layer: segmentation fills from the left up to the divider */}
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                  >
                    {mode === "mask" ? (
                      <>
                        <div className="absolute inset-0 bg-black" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={MASK_SRC}
                          alt="Predicted binary vessel map"
                          draggable={false}
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        />
                      </>
                    ) : (
                      <>
                        {fundusOk ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={FUNDUS_SRC}
                            alt=""
                            aria-hidden
                            draggable={false}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                            style={{ filter: "brightness(0.7) saturate(0.9)" }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#161616,#05060a_75%)]" />
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={OVERLAY_SRC}
                          alt="Predicted vessel overlay"
                          draggable={false}
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                          style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.45))" }}
                        />
                      </>
                    )}
                  </div>

                  {/* divider + handle */}
                  <div
                    className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/80"
                    style={{ left: `${pos}%`, boxShadow: "0 0 18px rgba(34,211,238,0.7)" }}
                  />
                  <button
                    type="button"
                    role="slider"
                    aria-label="Reveal segmentation"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pos)}
                    onKeyDown={onHandleKey}
                    data-cursor="hover"
                    className="absolute top-1/2 z-20 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/60 backdrop-blur transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
                    style={{ left: `${pos}%` }}
                  >
                    <span className="font-mono text-[13px] leading-none text-white/90">⇆</span>
                  </button>

                  {/* corner labels — segmentation grows from the left, fundus on the right */}
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">
                    {mode === "mask" ? "binary mask" : "vessels"}
                  </span>
                  <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                    fundus
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-black/20 px-4 py-3 font-mono text-[11px] text-white/45">
                <span>Drag the handle to compare · scroll to auto-reveal.</span>
                <span className="hidden sm:inline">Binary vessel segmentation · 512×512</span>
              </div>
            </div>
          </div>

          {/* controls / details */}
          <aside className="lg:col-span-4">
            <div className="glass space-y-5 rounded-3xl p-5">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">Output mode</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["overlay", "mask"] as Mode[]).map((m) => {
                    const on = mode === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        data-cursor="hover"
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          on
                            ? "border-white/15 bg-white/[0.06]"
                            : "border-white/5 bg-white/[0.015] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="font-display text-sm font-medium text-white">
                          {m === "overlay" ? "Overlay" : "Binary mask"}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-white/55">
                          {m === "overlay" ? "Vessels on photo" : "Raw prediction"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                  model
                </div>
                <dl className="space-y-1.5 font-mono text-[11px]">
                  {STATS.map(({ k, v }) => (
                    <div key={k} className="flex items-baseline justify-between gap-3">
                      <dt className="text-white/45">{k}</dt>
                      <dd className="text-right text-white/85">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-[11px] leading-relaxed text-white/60">
                The encoder–decoder learns vessel morphology from the fundus photograph,
                with the ResNet-34 backbone supplying pretrained features and skip
                connections preserving the fine capillaries. The output is a per-pixel
                binary map clinicians can use to screen for vascular disease.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {["PyTorch", "U-Net", "ResNet-34", "Segmentation", "Ophthalmology"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
