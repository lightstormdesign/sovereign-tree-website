import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { TourFlyer } from "@/components/site/TourFlyer";
import { HeartIcon } from "@/components/site/HeartIcon";
import { TOUR_DATES, TOUR_INTRO_LINE_1, TOUR_INTRO_LINE_2, TOUR_TICKETS_URL, TOUR_UMBRELLA } from "@/data/site";

export default function Tour() {
  return (
    <div className="starfield relative min-h-screen">
      <div
        className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(63,77,42,0.1) 0%, transparent 65%)" }}
      />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-32 pt-40 text-center">
        <Reveal>
          <span className="overline">Tour</span>
          <h1 className="font-display mt-5 text-5xl font-normal text-[var(--st-text)] sm:text-6xl">Trev &amp; Sierra on the Road</h1>
          <h2 className="font-accent mt-3 text-sm uppercase tracking-[0.2em] text-[var(--st-gold)]">{TOUR_UMBRELLA}</h2>
          <p className="font-body mx-auto mt-6 max-w-lg text-sm font-light leading-relaxed text-[var(--st-text-soft)]">
            {TOUR_INTRO_LINE_1}
            <br />
            {TOUR_INTRO_LINE_2} <HeartIcon size={14} className="inline-block align-middle" />
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-14">
            <TourFlyer title="2026 Tour Dates" dates={TOUR_DATES} />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <a
            href={TOUR_TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="tour-get-tickets-link"
            className="animate-text-glow-pulse font-accent mt-12 inline-block text-sm uppercase tracking-[0.2em] text-[var(--st-gold)] underline decoration-[var(--st-gold)]/50 underline-offset-4 transition-colors hover:text-[var(--st-text)]"
          >
            Get Tickets
          </a>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
