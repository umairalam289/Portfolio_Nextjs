import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import SegmentationDemo from "@/components/SegmentationDemo";
import RetinaDemo from "@/components/RetinaDemo";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { PERIAPICAL_DEMO, OPG_DEMO } from "@/lib/segmentation";

function LiveModelsIntro() {
  return (
    <section className="relative px-6 pt-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flow-border relative overflow-hidden rounded-3xl border border-accent/20 bg-accent/[0.04] px-7 py-10 sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid-lines opacity-[0.4]"
            style={{
              maskImage: "linear-gradient(90deg, black, transparent 80%)",
              WebkitMaskImage: "linear-gradient(90deg, black, transparent 80%)",
            }}
          />
          <div className="relative">
            <div className="eyebrow">The centerpiece</div>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Not screenshots. <span className="accent-text">Live models</span>,
              running in your browser.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              Three models I trained and shipped — dental segmentation, panoramic
              OPG diagnostics, and retinal vessel tracing — rendering their real
              output on real medical images. Toggle layers, hover findings, drag to
              compare. This is the work; everything else is context.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <LiveModelsIntro />
      <SegmentationDemo config={PERIAPICAL_DEMO} />
      <SegmentationDemo config={OPG_DEMO} />
      <RetinaDemo />
      <Projects />
      <Contact />
    </>
  );
}
