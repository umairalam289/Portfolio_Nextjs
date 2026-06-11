"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { profile } from "@/lib/cv";

const wordReveal = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: 0,
    transition: {
      delay: 0.12 + i * 0.07,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const nameWords = profile.name.split(" ");

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 pb-20 sm:px-10"
    >
      {/* diagnostic reticle framing the viewport */}
      <div aria-hidden className="pointer-events-none absolute inset-6 sm:inset-10">
        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-accent/30" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-accent/30" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-accent/30" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-accent/30" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-accent-soft"
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for AI / CV roles
          </motion.div>

          <h1 className="font-display text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl lg:text-[6.5rem]">
            {nameWords.map((word, i) => (
              <span key={i} className="mr-3 inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={wordReveal}
                  initial="hidden"
                  animate="show"
                  custom={i}
                  className="inline-block"
                >
                  {i === nameWords.length - 1 ? (
                    <span className="accent-text">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
          >
            <span className="font-medium text-white">AI Developer</span> turning
            research-grade computer vision and LLMs into production systems —
            currently shipping dental-diagnostic models from PyTorch to FastAPI at{" "}
            <span className="font-medium text-white">ZIGRON</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="#segmentation"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-black shadow-[0_0_40px_-8px_rgba(34,211,238,0.7)] transition-[background-color,box-shadow] hover:bg-accent-soft hover:shadow-[0_0_55px_-6px_rgba(34,211,238,0.9)]"
            >
              See the live models
              <svg
                className="transition-transform group-hover:translate-x-1"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="#contact"
              data-magnetic
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:border-accent/40 hover:bg-white/[0.08]"
            >
              Get in touch
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-xs uppercase tracking-[0.16em] text-white/50"
          >
            <span>{profile.location}</span>
            <span className="hidden h-1 w-1 rounded-full bg-accent/60 sm:inline-block" />
            <span>{profile.tagline}</span>
          </motion.div>
        </div>

        {/* Right: instrument readout — labelled honestly, not faux-stats */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div
            data-spot
            className="panel reticle flow-border relative overflow-hidden rounded-2xl p-6"
          >
            <span className="spot-glow" aria-hidden />
            <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              <span>At a glance</span>
              <span className="text-accent/80">● live</span>
            </div>

            {/* two genuine metrics */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { k: "95%", v: "best segmentation accuracy" },
                { k: "2+ yrs", v: "shipping AI in production" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="font-display text-3xl font-semibold tracking-tight accent-text">
                    {s.k}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-white/60">{s.v}</div>
                </div>
              ))}
            </div>

            {/* spec rows — correctly labelled, not pretending to be metrics */}
            <dl className="mt-4 space-y-px overflow-hidden rounded-xl border border-white/10">
              {[
                { k: "Role", v: "AI Developer · ZIGRON" },
                { k: "Domain", v: "Medical imaging" },
                { k: "CV stack", v: "YOLO v8 · PyTorch · OpenCV" },
                { k: "LLM stack", v: "LangGraph · RAG · LangChain" },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-baseline justify-between gap-3 bg-white/[0.02] px-3.5 py-2.5 font-mono text-[11px]"
                >
                  <dt className="uppercase tracking-[0.12em] text-white/45">{r.k}</dt>
                  <dd className="text-right text-white/85">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.aside>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll down"
      >
        <span className="block h-9 w-5 rounded-full border border-white/20 p-1">
          <span className="mx-auto block h-2 w-1 animate-float rounded-full bg-accent/80" />
        </span>
      </motion.a>
    </section>
  );
}
