"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/cv";

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="eyebrow">Toolkit</div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              The <span className="accent-text">stack</span> I reach for.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Grouped by what I actually do with them — from raw radiographs through
            training to a containerised endpoint a clinician can call.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: gi * 0.08 }}
              data-spot
              className="panel reticle group relative rounded-2xl p-6 transition-colors hover:border-accent/40"
            >
              <span className="spot-glow" aria-hidden />
              <div className="relative flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                  {group.title}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/70">
                  {String(gi + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/45">{group.note}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] text-white/80 transition-colors hover:border-accent/40 hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
