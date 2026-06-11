"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/cv";

function ProjectCard({
  project,
  i,
}: {
  project: (typeof projects)[number];
  i: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      data-spot
      className="panel reticle group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-colors hover:border-accent/40"
    >
      <span className="spot-glow" aria-hidden />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
          {project.role}
        </span>
        <span className="font-mono text-[10px] text-white/30">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-white">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
        {project.blurb}
      </p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="eyebrow">More work</div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Beyond the <span className="accent-text">live demos</span>.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            The two segmentation models and the retina tracer are interactive above.
            These are the other pieces of the toolkit.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
