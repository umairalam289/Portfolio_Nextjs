"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/cv";

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
            03 / Experience
          </div>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Where I&apos;ve been <span className="gradient-text">shipping</span>.
          </h2>
        </motion.div>

        <ol className="relative">
          {/* timeline rail */}
          <span
            aria-hidden
            className="absolute left-5 top-0 h-full w-px sm:left-1/2"
            style={{
              background:
                "linear-gradient(180deg, rgba(34,211,238,0.4), rgba(167,139,250,0.4), rgba(232,121,249,0.4), transparent)",
            }}
          />

          {experience.map((job, i) => {
            const left = i % 2 === 0;
            return (
              <motion.li
                key={job.role + job.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative mb-12 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 ${
                  left ? "" : "sm:[&>*:first-child]:order-2"
                }`}
              >
                {/* spacer for alternating layout on desktop */}
                <div className={`hidden sm:block ${left ? "sm:pr-12" : "sm:pl-12"}`} />

                {/* node */}
                <span
                  aria-hidden
                  className="absolute left-5 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full sm:left-1/2"
                  style={{
                    background:
                      "linear-gradient(135deg, #22d3ee, #a78bfa, #e879f9)",
                    boxShadow:
                      "0 0 0 4px rgba(255,255,255,0.04), 0 0 30px rgba(167,139,250,0.7)",
                  }}
                />

                <div
                  className={`pl-12 sm:pl-0 ${
                    left ? "sm:pr-12 sm:text-right" : "sm:pl-12"
                  }`}
                >
                  <article className="glass relative overflow-hidden rounded-2xl p-6">
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-30 blur-3xl"
                      style={{
                        background:
                          "radial-gradient(circle, #a78bfa, transparent 60%)",
                      }}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                        {job.period}
                      </span>
                      {job.location && (
                        <span className="text-xs text-white/45">{job.location}</span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-white">
                      {job.role}
                    </h3>
                    <p className="text-sm text-white/65">{job.company}</p>

                    <ul className={`mt-4 space-y-2 text-sm leading-relaxed text-white/75 ${left ? "sm:text-right" : ""}`}>
                      {job.highlights.map((h, idx) => (
                        <li key={idx} className={`flex gap-2 ${left ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                          <span
                            className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #22d3ee, #e879f9)",
                            }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`mt-5 flex flex-wrap gap-1.5 ${left ? "sm:justify-end" : ""}`}>
                      {job.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
