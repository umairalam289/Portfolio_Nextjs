"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/cv";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "/umair-alam-3ba50b217", href: profile.linkedin },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "Location", value: profile.location, href: undefined },
];

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 pb-20 pt-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="panel reticle relative overflow-hidden rounded-[32px] p-8 sm:p-14">
          <div
            aria-hidden
            className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              maskImage: "radial-gradient(ellipse 70% 80% at 20% 30%, black, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 20% 30%, black, transparent 80%)",
            }}
          />
          <div
            className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(34,211,238,0.55), transparent 60%)" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative grid gap-12 lg:grid-cols-2"
          >
            <div>
              <div className="eyebrow">Contact</div>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Got a vision <br />
                problem worth <br />
                <span className="accent-text">solving?</span>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-white/75">
                I&apos;m open to AI/CV roles, collaborations, and consulting on
                medical-imaging or LLM-agent systems. The fastest way to reach me
                is by email — I usually reply within a day.
              </p>
              <a
                href={`mailto:${profile.email}`}
                data-magnetic
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-black shadow-[0_0_40px_-8px_rgba(34,211,238,0.7)] transition-[background-color,box-shadow] hover:bg-accent-soft hover:shadow-[0_0_55px_-6px_rgba(34,211,238,0.9)]"
              >
                Say hi
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {channels.map((c) => {
                const Tag: React.ElementType = c.href ? "a" : "div";
                return (
                  <Tag
                    key={c.label}
                    href={c.href}
                    target={c.href?.startsWith("http") ? "_blank" : undefined}
                    rel={c.href?.startsWith("http") ? "noreferrer" : undefined}
                    data-spot={c.href ? "" : undefined}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all ${
                      c.href ? "hover:border-accent/40 hover:bg-white/[0.05]" : ""
                    }`}
                  >
                    {c.href && <span className="spot-glow" aria-hidden />}
                    <div className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">
                      {c.label}
                    </div>
                    <div className="relative mt-2 truncate text-sm font-medium text-white">
                      {c.value}
                    </div>
                    {c.href && (
                      <span className="absolute right-4 top-4 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px] group-hover:text-accent">
                        ↗
                      </span>
                    )}
                  </Tag>
                );
              })}
            </div>
          </motion.div>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 text-xs text-white/40 sm:flex-row">
          <span className="font-mono">
            © {new Date().getFullYear()} Muhammad Umair Alam · Built with Next.js + Framer Motion
          </span>
          <span className="font-mono">
            crafted late at night in Islamabad
          </span>
        </footer>
      </div>
    </section>
  );
}
