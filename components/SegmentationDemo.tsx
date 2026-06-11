"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  LAYER_META,
  type DemoConfig,
  type LayerKey,
  type MaskItem,
  type Prediction,
  type SegmentationResponse,
  centroid,
  colorForItem,
  pointsToPath,
  prettyClass,
  withAlpha,
} from "@/lib/segmentation";

type HoverInfo =
  | {
      kind: "mask";
      layer: LayerKey;
      item: MaskItem;
      color: string;
      cx: number;
      cy: number;
    }
  | { kind: "bone"; idx: number; cx: number; cy: number; loss: boolean; distance: number }
  | null;

// A mask is revealed once the scroll-driven scan-line has swept past its
// centroid. A small lead lets the region light up just as the line crosses it.
const REVEAL_LEAD = 0.02;

export default function SegmentationDemo({ config }: { config: DemoConfig }) {
  const [data, setData] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(() => {
    const base: Record<LayerKey, boolean> = {
      tooth_numbering: false,
      tooth_structure: false,
      diagnostic: false,
      bone_loss: false,
    };
    for (const l of config.layers) base[l.key] = l.defaultOn;
    return base;
  });
  const [hover, setHover] = useState<HoverInfo>(null);
  const [scan, setScan] = useState(0); // 0 → 1 scroll-driven reveal position
  const [showLabels, setShowLabels] = useState(true);
  const [opacity, setOpacity] = useState(0.55);
  // Once the visitor touches a control, masks stop waiting on the scan-line and
  // simply appear — so a toggle never produces a dead, invisible no-op.
  const [controlled, setControlled] = useState(false);
  // Touch devices have no hover; we switch to tap-to-select and adapt the copy.
  const [coarse, setCoarse] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCoarse(window.matchMedia("(hover: none)").matches);
  }, []);

  // Which layers this demo actually renders, in configured order.
  const renderLayers = useMemo(
    () => config.layers.filter((l) => l.key !== "bone_loss").map((l) => l.key),
    [config]
  );
  const hasBoneLoss = useMemo(
    () => config.layers.some((l) => l.key === "bone_loss"),
    [config]
  );
  const multiLayer = config.layers.length > 1;

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    fetch(config.dataUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j: SegmentationResponse) => {
        const p = j?.response?.predictions?.[0];
        if (!p) throw new Error("No predictions in response");
        if (!cancelled) setData(p);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [config.dataUrl]);

  // Scroll-scrubbed reveal: progress runs 0→1 as the image rises through the
  // viewport, driving both the scan-line and which masks are visible.
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start 0.85", "start 0.32"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Quantise to ~200 steps so we re-render at most that often per sweep.
    setScan(Math.round(Math.min(1, Math.max(0, v)) * 200) / 200);
  });
  // Pick up the initial position in case the section is already in view.
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setScan(Math.round(Math.min(1, Math.max(0, scrollYProgress.get())) * 200) / 200)
    );
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  const counts = useMemo(() => {
    if (!data) return null;
    return {
      tooth_numbering: data.tooth_numbering.length,
      tooth_structure: data.tooth_structure.length,
      diagnostic: data.diagnostic.length,
      bone_loss: data.bone_loss.length,
    };
  }, [data]);

  const w = data?.imageWidth ?? config.fallbackWidth;
  const h = data?.imageHeight ?? config.fallbackHeight;

  const activeLayers = config.layers.filter((l) => layers[l.key]).length;
  const scanVisible = scan > 0.015 && scan < 0.99;

  function toggleLayer(k: LayerKey) {
    setControlled(true);
    setLayers((s) => ({ ...s, [k]: !s[k] }));
  }
  function setAll(on: boolean) {
    setControlled(true);
    setLayers((s) => {
      const next = { ...s };
      for (const l of config.layers) next[l.key] = on;
      return next;
    });
  }

  return (
    <section id={config.id} className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="eyebrow">{config.eyebrow}</div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {config.titlePre}
              <span className="accent-text">{config.titleAccent}</span>
              {config.titlePost}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{config.description}</p>
          </div>

          {counts && (
            <div className="flex flex-wrap gap-2 font-mono text-[11px] text-white/70">
              {config.layers.map(({ key: k }) => (
                <span
                  key={k}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1"
                  style={{ borderColor: `${LAYER_META[k].color}33` }}
                >
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full"
                    style={{ background: LAYER_META[k].color }}
                  />
                  {counts[k]} {LAYER_META[k].label.toLowerCase()}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Image + overlays */}
          <div className="lg:col-span-8">
            <div className="panel-solid relative overflow-hidden rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 bg-black/30 px-4 py-3 font-mono text-[11px] text-white/55">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-accent">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    LIVE
                  </span>
                  <span className="text-white/30">/</span>
                  <span className="text-white/55">
                    {config.imageTypeLabel} · {w}×{h}px · {config.modelLabel}
                  </span>
                </div>
                <span className="hidden sm:inline text-white/40">
                  {activeLayers} / {config.layers.length} layer
                  {config.layers.length === 1 ? "" : "s"} active
                </span>
              </div>

              <div
                ref={imageRef}
                className="relative w-full select-none"
                style={{ aspectRatio: `${w} / ${h}` }}
                onMouseLeave={() => setHover(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.imageSrc}
                  alt={config.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    filter: "contrast(1.08) brightness(1.04) saturate(0.9)",
                  }}
                />

                {/* scroll-driven scan line */}
                <div
                  className="pointer-events-none absolute inset-x-0 z-10 h-24 -translate-y-1/2 transition-opacity duration-300"
                  style={{
                    top: `${scan * 100}%`,
                    opacity: scanVisible ? 1 : 0,
                    background: `linear-gradient(180deg, transparent, ${withAlpha(
                      config.scanColor,
                      0.45
                    )}, transparent)`,
                    boxShadow: `0 0 60px ${withAlpha(config.scanColor, 0.5)}`,
                  }}
                />

                <svg
                  viewBox={`0 0 ${w} ${h}`}
                  preserveAspectRatio="xMidYMid slice"
                  className="absolute inset-0 h-full w-full"
                  aria-label="Segmentation overlay"
                >
                  <defs>
                    <filter id="softglow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {data &&
                    renderLayers
                      .filter((l) => layers[l])
                      .map((layer) => {
                        const items = data[layer] as MaskItem[];
                        return (
                          <g key={layer} pointerEvents="auto">
                            {items.map((item, idx) => {
                              const path = pointsToPath(item.mask_points, w, h);
                              const c = centroid(item.mask_points);
                              const revealed = controlled || scan >= c.y - REVEAL_LEAD;
                              const isHovered =
                                hover?.kind === "mask" &&
                                hover.layer === layer &&
                                hover.item === item;
                              const color = colorForItem(layer, item, idx);
                              return (
                                <g key={`${layer}-${idx}`}>
                                  <motion.path
                                    d={path}
                                    initial={false}
                                    animate={{
                                      opacity: revealed ? (isHovered ? 0.95 : opacity) : 0,
                                    }}
                                    transition={{
                                      duration: 0.5,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                    fill={color}
                                    fillOpacity={isHovered ? 0.5 : 0.28}
                                    stroke={color}
                                    strokeWidth={isHovered ? 3 : 1.6}
                                    strokeLinejoin="round"
                                    style={{
                                      filter: isHovered ? "url(#softglow)" : "none",
                                      cursor: "pointer",
                                      pointerEvents: revealed ? "auto" : "none",
                                      transition: "fill-opacity 200ms, stroke-width 200ms",
                                    }}
                                    onMouseEnter={() =>
                                      setHover({
                                        kind: "mask",
                                        layer,
                                        item,
                                        color,
                                        cx: c.x * w,
                                        cy: c.y * h,
                                      })
                                    }
                                    onClick={() =>
                                      setHover((prev) =>
                                        prev?.kind === "mask" && prev.item === item
                                          ? null
                                          : {
                                              kind: "mask",
                                              layer,
                                              item,
                                              color,
                                              cx: c.x * w,
                                              cy: c.y * h,
                                            }
                                      )
                                    }
                                  />
                                  {showLabels && layer === "tooth_numbering" && (
                                    <motion.g
                                      initial={false}
                                      animate={{ opacity: revealed ? 1 : 0 }}
                                      transition={{ duration: 0.4 }}
                                      pointerEvents="none"
                                    >
                                      <circle
                                        cx={c.x * w}
                                        cy={c.y * h}
                                        r={22}
                                        fill="rgba(5,6,10,0.78)"
                                        stroke={color}
                                        strokeWidth={2}
                                      />
                                      <text
                                        x={c.x * w}
                                        y={c.y * h + 5}
                                        textAnchor="middle"
                                        fontSize="20"
                                        fontWeight="700"
                                        fontFamily="var(--font-mono), ui-monospace, monospace"
                                        fill={color}
                                      >
                                        {item.concerned_area.toString().replace("tooth_", "T")}
                                      </text>
                                    </motion.g>
                                  )}
                                  {showLabels && layer === "diagnostic" && (
                                    <motion.g
                                      initial={false}
                                      animate={{ opacity: revealed ? 1 : 0 }}
                                      transition={{ duration: 0.4 }}
                                      pointerEvents="none"
                                    >
                                      <rect
                                        x={c.x * w - 64}
                                        y={c.y * h - 38}
                                        width={128}
                                        height={28}
                                        rx={14}
                                        fill="rgba(5,6,10,0.82)"
                                        stroke={color}
                                        strokeWidth={1.2}
                                      />
                                      <text
                                        x={c.x * w}
                                        y={c.y * h - 19}
                                        textAnchor="middle"
                                        fontSize="14"
                                        fontWeight="600"
                                        fontFamily="var(--font-mono), ui-monospace, monospace"
                                        fill={color}
                                      >
                                        {prettyClass(item.class_name)}
                                      </text>
                                    </motion.g>
                                  )}
                                </g>
                              );
                            })}
                          </g>
                        );
                      })}

                  {/* bone-loss landmarks */}
                  {data && hasBoneLoss && layers.bone_loss && (
                    <g>
                      {data.bone_loss.map((b, i) => {
                        const ex = b.cej_bone_pair.enamel_point.x * w;
                        const ey = b.cej_bone_pair.enamel_point.y * h;
                        const bx = b.cej_bone_pair.bone_point.x * w;
                        const by = b.cej_bone_pair.bone_point.y * h;
                        const c = LAYER_META.bone_loss.color;
                        const lossColor = b.boneloss ? "#fb7185" : c;
                        const cx = (ex + bx) / 2;
                        const cy = (ey + by) / 2;
                        const midY = (b.cej_bone_pair.enamel_point.y + b.cej_bone_pair.bone_point.y) / 2;
                        const revealed = controlled || scan >= midY - REVEAL_LEAD;
                        return (
                          <motion.g
                            key={i}
                            initial={false}
                            animate={{ opacity: revealed ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                              cursor: "pointer",
                              pointerEvents: revealed ? "auto" : "none",
                            }}
                            onMouseEnter={() =>
                              setHover({
                                kind: "bone",
                                idx: i,
                                cx,
                                cy,
                                loss: b.boneloss,
                                distance: b.distance,
                              })
                            }
                            onClick={() =>
                              setHover((prev) =>
                                prev?.kind === "bone" && prev.idx === i
                                  ? null
                                  : {
                                      kind: "bone",
                                      idx: i,
                                      cx,
                                      cy,
                                      loss: b.boneloss,
                                      distance: b.distance,
                                    }
                              )
                            }
                          >
                            <line
                              x1={ex}
                              y1={ey}
                              x2={bx}
                              y2={by}
                              stroke={lossColor}
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              filter="url(#softglow)"
                            />
                            <circle cx={ex} cy={ey} r={5} fill={lossColor} />
                            <circle cx={bx} cy={by} r={5} fill={lossColor} />
                          </motion.g>
                        );
                      })}
                    </g>
                  )}
                </svg>

                {/* tooltip */}
                <AnimatePresence>
                  {hover && (
                    <motion.div
                      key={`${hover.kind}-${hover.cx}-${hover.cy}`}
                      initial={{ opacity: 0, scale: 0.96, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="pointer-events-none absolute z-30"
                      style={{
                        left: `${(hover.cx / w) * 100}%`,
                        top: `${(hover.cy / h) * 100}%`,
                        transform: "translate(-50%, calc(-100% - 14px))",
                      }}
                    >
                      {hover.kind === "mask" ? (
                        <div
                          className="glass min-w-[210px] rounded-xl px-3.5 py-2.5 text-xs shadow-2xl"
                          style={{ borderColor: withAlpha(hover.color, 0.45) }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{
                                background: hover.color,
                                boxShadow: `0 0 12px ${withAlpha(hover.color, 0.6)}`,
                              }}
                            />
                            <span className="font-display text-sm font-semibold text-white">
                              {prettyClass(hover.item.class_name)}
                            </span>
                            <span
                              className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-mono"
                              style={{
                                background: withAlpha(hover.color, 0.18),
                                color: hover.color,
                              }}
                            >
                              {(hover.item.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                            {LAYER_META[hover.layer].label}
                          </div>
                          {hover.item.description && (
                            <p className="mt-2 max-w-[260px] text-[11px] leading-relaxed text-white/65">
                              {hover.item.description.length > 140
                                ? hover.item.description.slice(0, 140).trim() + "…"
                                : hover.item.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="glass min-w-[180px] rounded-xl px-3.5 py-2.5 text-xs shadow-2xl">
                          <div className="font-display text-sm font-semibold text-white">
                            CEJ → Bone
                          </div>
                          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                            Periodontal landmark
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-white/65">distance</span>
                            <span className="font-mono text-white">
                              {(hover.distance * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-white/65">bone loss</span>
                            <span
                              className={`font-mono ${
                                hover.loss ? "text-rose-300" : "text-emerald-300"
                              }`}
                            >
                              {hover.loss ? "yes" : "no"}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!data && !error && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="font-mono text-xs text-white/55 animate-pulse-soft">
                      loading model output…
                    </div>
                  </div>
                )}
              </div>

              {/* footer hint */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-black/20 px-4 py-3 font-mono text-[11px] text-white/45">
                <span>
                  Scroll to reveal · {coarse ? "tap" : "hover"} any region for class &amp;
                  confidence.
                </span>
                <span className="hidden sm:inline">
                  Mask points are normalized — scaled to {w}×{h}.
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <aside className="lg:col-span-4">
            <div className="panel space-y-5 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold tracking-tight">Layers</h3>
                {multiLayer && (
                  <div className="flex gap-1.5 font-mono text-[10px]">
                    <button
                      onClick={() => setAll(true)}
                      data-cursor="hover"
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/70 hover:bg-white/[0.1]"
                    >
                      all
                    </button>
                    <button
                      onClick={() => setAll(false)}
                      data-cursor="hover"
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/70 hover:bg-white/[0.1]"
                    >
                      none
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {config.layers.map(({ key: k }) => {
                  const meta = LAYER_META[k];
                  const on = layers[k];
                  const count = counts ? counts[k] : 0;
                  return (
                    <button
                      key={k}
                      onClick={() => toggleLayer(k)}
                      data-cursor="hover"
                      className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        on
                          ? "border-white/15 bg-white/[0.05]"
                          : "border-white/5 bg-white/[0.015] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform ${
                          on ? "scale-100" : "scale-95 opacity-60"
                        }`}
                        style={{
                          background: `${meta.color}15`,
                          boxShadow: on
                            ? `0 0 0 1px ${meta.color}55, 0 0 20px ${meta.color}40`
                            : `inset 0 0 0 1px rgba(255,255,255,0.06)`,
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: meta.color }}
                        />
                        {on && (
                          <span
                            className="absolute inset-0 rounded-xl animate-pulse-soft"
                            style={{
                              background: `radial-gradient(circle, ${meta.color}30, transparent 70%)`,
                            }}
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between">
                          <span className="font-display text-sm font-medium text-white">
                            {meta.label}
                          </span>
                          <span className="font-mono text-[10px] text-white/45">
                            {count}
                          </span>
                        </span>
                        <span className="block text-[11px] text-white/55">{meta.sub}</span>
                      </span>
                      <span
                        className={`ml-1 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                          on ? "" : "bg-white/10"
                        }`}
                        style={{ background: on ? meta.color : undefined }}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            on ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <label className="flex items-center justify-between text-xs text-white/65">
                  <span>Mask opacity</span>
                  <span className="font-mono text-white/85">
                    {Math.round(opacity * 100)}%
                  </span>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => {
                    setControlled(true);
                    setOpacity(parseFloat(e.target.value));
                  }}
                  className="w-full accent-accent"
                />
                <label className="flex items-center justify-between gap-3 pt-1 text-xs text-white/65">
                  <span>Inline labels</span>
                  <button
                    onClick={() => {
                      setControlled(true);
                      setShowLabels((v) => !v);
                    }}
                    data-cursor="hover"
                    className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                      showLabels ? "bg-accent" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        showLabels ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              </div>

              {data && (
                <div className="space-y-3">
                  {/* per-class color legend */}
                  {(["diagnostic", "tooth_structure"] as LayerKey[])
                    .filter((lk) => renderLayers.includes(lk))
                    .map((lk) => {
                      if (!layers[lk]) return null;
                      const seen = new Map<string, string>();
                      (data[lk] as MaskItem[]).forEach((it, idx) => {
                        if (!seen.has(it.class_name))
                          seen.set(it.class_name, colorForItem(lk, it, idx));
                      });
                      if (!seen.size) return null;
                      return (
                        <div
                          key={lk}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"
                        >
                          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                            {LAYER_META[lk].label} legend
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from(seen.entries()).map(([name, color]) => (
                              <span
                                key={name}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/80"
                                style={{ borderColor: withAlpha(color, 0.45) }}
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    background: color,
                                    boxShadow: `0 0 8px ${withAlpha(color, 0.7)}`,
                                  }}
                                />
                                {prettyClass(name)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                    <div className="mb-1 text-[9px] uppercase tracking-[0.22em] text-white/40">
                      metadata
                    </div>
                    <div>
                      image_type: <span className="text-white">{data.ImageType}</span>
                    </div>
                    <div>
                      resolution:{" "}
                      <span className="text-white">
                        {w}×{h}
                      </span>
                    </div>
                    {data.key_findings?.[0] && (
                      <div className="mt-2">
                        procedures:{" "}
                        <span className="text-white">
                          {data.key_findings[0].existing_procedures.join(", ") || "—"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            Failed to load segmentation data: {error}
          </div>
        )}
      </div>
    </section>
  );
}
