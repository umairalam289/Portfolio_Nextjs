"use client";

import { motion } from "framer-motion";
import { profile, education } from "@/lib/cv";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="sticky top-32"
          >
            <div className="eyebrow">Profile</div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Engineer of <span className="accent-text">vision</span> & language.
            </h2>
            <p className="mt-5 leading-relaxed text-white/70">
              I take models out of notebooks and put them in front of doctors —
              annotation, training, post-processing, deployment, the whole loop.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-pretty text-lg leading-relaxed text-white/80 sm:text-xl"
          >
            {profile.summary}
          </motion.p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {education.map((e, i) => (
              <motion.article
                key={e.degree}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                data-spot
                className="panel reticle group relative overflow-hidden rounded-2xl p-5 transition-colors hover:border-accent/40"
              >
                <span className="spot-glow" aria-hidden />
                <div className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">
                  Education
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-white">
                  {e.degree}
                </h3>
                <p className="text-sm text-white/65">{e.school}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/45">
                  <span>{e.period}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-white/70">
                    {e.detail}
                  </span>
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(34,211,238,0.7), transparent)",
                  }}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
