import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Fireflies } from "@/components/site/Fireflies";
import { ORIGIN_STORY } from "@/data/site";

// The Origin Story. Sierra's build used a pinned photo/video scroll-scrub —
// this page doesn't have that much SovereignTree footage yet, so it's a
// clean, quietly-revealed article instead: same Reveal/Fireflies components,
// same light/green brand system, simpler mechanism.
export default function About() {
  return (
    <div data-testid="about-page" className="relative min-h-screen bg-[var(--st-black)]">
      <Fireflies />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-40 text-center">
        <Reveal>
          <span className="overline">About</span>
          <h1 className="font-display mt-5 text-4xl font-normal text-[var(--st-text)] sm:text-5xl">
            The Origin Story
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <img
            src="/sovereigntree-about-founders.jpg"
            alt="Trev and Sierra, SovereignTree co-founders"
            data-testid="about-founders-photo"
            className="mx-auto mt-10 max-w-xs rounded-2xl border border-[var(--st-gold)]/25 object-cover shadow-[0_20px_60px_-20px_rgba(63,77,42,0.35)] sm:max-w-sm"
          />
        </Reveal>

        <div className="mt-14 space-y-7 text-left">
          {ORIGIN_STORY.map((para, i) => (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
              <p className="font-accent text-lg font-normal leading-relaxed text-[var(--st-text-soft)] sm:text-xl">
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col items-center gap-6">
            <p className="font-display text-lg text-[var(--st-text)]">— Trev &amp; Sierra</p>
            <Link
              to="/community"
              data-testid="about-cta"
              className="inline-flex rounded-full bg-[var(--st-gold)] px-8 py-3.5 font-body text-sm font-medium text-[var(--st-black)] transition-colors hover:bg-[var(--st-gold-accent)]"
            >
              Come Be Family
            </Link>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
