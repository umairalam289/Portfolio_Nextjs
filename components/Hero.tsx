"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { profile } from "@/lib/cv";

const wordReveal = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.15 + i * 0.06,
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const nameWords = profile.name.split(" ");

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-32 sm:px-10"
    >
      {/* big background type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="select-none whitespace-nowrap font-display text-[22vw] font-black leading-none tracking-tighter text-white/[0.025] sm:text-[18vw]"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
        >
          AI · CV · LLM
        </span>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70"
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for AI / CV roles
          </motion.div>

          <h1 className="font-display text-[14vw] font-bold leading-[0.9] tracking-tighter sm:text-7xl md:text-[7.5rem] lg:text-[8.25rem]">
            {nameWords.map((word, i) => (
              <span
                key={i}
                className="mr-3 inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  variants={wordReveal}
                  initial="hidden"
                  animate="show"
                  custom={i}
                  className="inline-block"
                >
                  {i === nameWords.length - 1 ? (
                    <span className="gradient-text animate-shimmer">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
          >
            <span className="text-white">AI Developer</span> turning research-grade
            computer vision and LLMs into production systems — currently shipping
            dental-diagnostic models from PyTorch to FastAPI at{" "}
            <span className="text-white">ZIGRON</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="#segmentation"
              data-magnetic
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_0_40px_rgba(167,139,250,0.35)] transition-shadow hover:shadow-[0_0_60px_rgba(232,121,249,0.5)]"
            >
              <span className="relative z-10">See the live segmentation demo</span>
              <svg
                className="relative z-10 transition-transform group-hover:translate-x-1"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="#contact"
              data-magnetic
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.09]"
            >
              Get in touch
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-white/50"
          >
            <span>{profile.location}</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" />
            <span>{profile.tagline}</span>
          </motion.div>
        </div>

        {/* Right side stat card */}
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="relative lg:col-span-4"
        >
          <div className="glass relative overflow-hidden rounded-3xl p-6">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, #22d3ee, transparent 60%)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, #e879f9, transparent 60%)" }}
            />

            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
              Snapshot
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-4">
              {[
                { k: "95%", v: "best segmentation accuracy" },
                { k: "2+ yrs", v: "shipping AI in production" },
                { k: "YOLO v8", v: "core CV stack" },
                { k: "RAG · LangGraph", v: "agentic LLM pipelines" },
              ].map((s) => (
                <li key={s.v} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="font-display text-2xl font-semibold tracking-tight text-white">
                    {s.k}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-white/55">{s.v}</div>
                </li>
              ))}
            </ul>

          </div>
        </motion.aside>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll down"
      >
        <span className="block h-10 w-6 rounded-full border border-white/20 p-1">
          <span className="block h-2 w-1 animate-float rounded-full bg-white/70 mx-auto" />
        </span>
      </motion.a>
    </section>
  );
}
