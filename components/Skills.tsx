"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { skills } from "@/lib/cv";

function Pill({ label, weight, idx }: { label: string; weight: number; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-30, 30], [10, -10]), { stiffness: 220, damping: 18 });
  const ry = useSpring(useTransform(x, [-30, 30], [-10, 10]), { stiffness: 220, damping: 18 });
  const px = useSpring(x, { stiffness: 260, damping: 22 });
  const py = useSpring(y, { stiffness: 260, damping: 22 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, x: px, y: py, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.04, duration: 0.55 }}
      data-cursor="hover"
      className="group relative rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/25"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[15px] font-medium tracking-tight text-white">
          {label}
        </span>
        <span className="font-mono text-[10px] text-white/40">
          {Math.round(weight * 100)}
        </span>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${weight * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 + idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #22d3ee, #a78bfa, #e879f9)",
            boxShadow: "0 0 18px rgba(167,139,250,0.45)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(160px 100px at var(--mx,50%) var(--my,50%), rgba(167,139,250,0.18), transparent 70%)",
        }}
      />
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between gap-6"
        >
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              02 / Toolkit
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              The <span className="gradient-text">stack</span> I reach for.
            </h2>
          </div>
          <p className="hidden max-w-md text-sm text-white/55 sm:block">
            From data prep to deployment — these are the tools that make up most
            days in my repo.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((s, i) => (
            <Pill key={s.label} label={s.label} weight={s.weight} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
