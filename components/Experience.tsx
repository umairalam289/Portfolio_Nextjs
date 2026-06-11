"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/cv";

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="eyebrow">Experience</div>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Where I&apos;ve been <span className="accent-text">shipping</span>.
          </h2>
        </motion.div>

        <ol className="relative pl-8 sm:pl-10">
          {/* single left rail */}
          <span
            aria-hidden
            className="absolute left-[6px] top-2 h-[calc(100%-1rem)] w-px sm:left-[10px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(34,211,238,0.7), rgba(34,211,238,0.25), transparent)",
            }}
          />

          {experience.map((job, i) => (
            <motion.li
              key={job.role + job.company}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative mb-8 last:mb-0"
            >
              {/* node */}
              <span
                aria-hidden
                className="absolute -left-8 top-7 z-10 h-3 w-3 rounded-full bg-accent sm:-left-10"
                style={{ boxShadow: "0 0 0 4px rgba(6,8,12,1), 0 0 16px rgba(34,211,238,0.8)" }}
              />

              <article
                data-spot
                className="panel reticle relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-accent/40"
              >
                <span className="spot-glow" aria-hidden />
                <div className="relative flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
                    {job.period}
                  </span>
                  {job.location && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                      {job.location}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-white">
                  {job.role}
                </h3>
                <p className="text-sm text-white/65">{job.company}</p>

                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/75">
                  {job.highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
