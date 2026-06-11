"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#segmentation", label: "Live models" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      {/* Solid backing: headings scroll cleanly behind it instead of bleeding through. */}
      <nav className="flex items-center gap-1 rounded-full border border-white/12 bg-[#0a0e15]/95 px-2.5 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <Link
          href="#top"
          className="flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium tracking-wide"
        >
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-black">
            UA
          </span>
          <span className="hidden font-display sm:inline">Umair Alam</span>
        </Link>
        <div className="mx-1 hidden h-5 w-px bg-white/12 md:block" />
        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-accent/40 bg-accent/12"
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
          className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-accent-soft"
        >
          <span>Resume</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </nav>
    </motion.header>
  );
}
