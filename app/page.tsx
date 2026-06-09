import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import SegmentationDemo from "@/components/SegmentationDemo";
import RetinaDemo from "@/components/RetinaDemo";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { PERIAPICAL_DEMO, OPG_DEMO } from "@/lib/segmentation";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <SegmentationDemo config={PERIAPICAL_DEMO} />
      <SegmentationDemo config={OPG_DEMO} />
      <RetinaDemo />
      <Projects />
      <Contact />
    </>
  );
}
