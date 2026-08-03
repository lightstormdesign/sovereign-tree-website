import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { MISSION_PARAGRAPHS, WE_ARE_PILLARS, SKOOL_COMMUNITY_URL } from "@/data/site";

// New page — on the live sovereigntree.org site the mission copy and pitch
// deck link live inline on the homepage; here they get their own dedicated
// route (Trev's direction) so Home can stay a clean Portal -> Hero moment.
export default function OurVision() {
  return (
    <div className="relative min-h-screen bg-[var(--st-black)]">
      <div
        className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, var(--st-brown-deep), var(--st-black) 70%)" }}
      >
        <div className="grain absolute inset-0" />
      </div>
      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-40 text-center">
        <Reveal>
          <span className="overline">Our Vision</span>
          <h1 className="font-display mt-5 text-4xl font-normal text-[var(--st-text)] sm:text-5xl">
            We Are..
          </h1>
          <ul className="font-accent mt-5 space-y-1 text-lg italic text-[var(--st-gold)]">
            {WE_ARE_PILLARS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 space-y-6 text-left">
          {MISSION_PARAGRAPHS.map((para, i) => (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.2)}>
              <p className="font-accent text-lg font-normal leading-relaxed text-[var(--st-text-soft)] sm:text-xl">
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <Link
              to="/new-earth-council"
              data-testid="our-vision-join-link"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--st-gold)] px-7 py-3 font-body text-sm font-medium text-[var(--st-black)] transition-colors hover:bg-[var(--st-gold-accent)]"
            >
              Join the Council <ArrowUpRight size={15} />
            </Link>
            <a
              href={SKOOL_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="our-vision-skool-link"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--st-gold)]/50 px-7 py-3 font-body text-sm font-medium text-[var(--st-gold)] transition-colors hover:border-[var(--st-gold)] hover:bg-[var(--st-gold)]/10"
            >
              Support and Build With Us <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
