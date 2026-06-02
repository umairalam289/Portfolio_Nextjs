"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/lib/cv";

function ProjectCard({
  project,
  i,
}: {
  project: (typeof projects)[number];
  i: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    ref.current!.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current!.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const Wrapper: React.ElementType = project.href ? Link : "div";
  const wrapperProps: { href?: string } = project.href ? { href: project.href } : {};

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: i * 0.08 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      className="group relative h-full"
    >
      <Wrapper
        {...wrapperProps}
        data-cursor="hover"
        className="relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 transition-all hover:border-white/25"
      >
        {/* gradient hover halo */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgba(167,139,250,0.18), transparent 50%)",
          }}
        />
        {/* corner gradient blob */}
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${project.accent} opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50`}
        />

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
            {project.role}
          </span>
          {project.href && (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/65 transition-colors group-hover:bg-white/[0.1]">
              {project.cta ?? "Open"}
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-white">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65">{project.blurb}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className="mt-6 flex items-center gap-2 text-sm text-white/70 transition-colors group-hover:text-white"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
            {project.href ? "explore" : "case study"}
          </span>
          <span
            aria-hidden
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </Wrapper>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              05 / Selected work
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Things I&apos;ve <span className="gradient-text">built</span>.
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
