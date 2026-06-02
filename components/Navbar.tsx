"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#segmentation", label: "Demo" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(`#${e.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-2xl shadow-black/40" : "glass"
        }`}
      >
        <Link
          href="#top"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium tracking-wide"
          data-magnetic
        >
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-violet-400 to-fuchsia-400 text-[11px] font-bold text-black">
            UA
            <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/40 via-violet-400/40 to-fuchsia-400/40 blur-md -z-10" />
          </span>
          <span className="hidden sm:inline">Umair Alam</span>
        </Link>
        <div className="mx-1 h-5 w-px bg-white/10" />
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  data-magnetic
                  className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(167,139,250,0.18), rgba(232,121,249,0.18))",
                        boxShadow:
                          "inset 0 0 0 1px rgba(255,255,255,0.10)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <a
          href="/umair-alam-resume.pdf"
          target="_blank"
          rel="noreferrer"
          data-magnetic
          className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/[0.12]"
        >
          <span className="hidden sm:inline">Resume</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </nav>
    </motion.header>
  );
}
