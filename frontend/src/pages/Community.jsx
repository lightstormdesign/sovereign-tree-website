import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Fireflies } from "@/components/site/Fireflies";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SOCIALS, SKOOL_COMMUNITY_URL } from "@/data/site";

// Reuses the same crowd-photo background as Sierra's Community page per
// Trev's direction. The Skool link below is the real one live on
// sovereigntree.org today — Trev flagged a different community link is
// coming soon (with its own image); swap SKOOL_COMMUNITY_URL in data/site.js
// when that lands.
export default function Community() {
  const isMobile = useIsMobile();
  return (
    <div className={`relative flex min-h-screen flex-col ${isMobile ? "bg-[var(--st-black)]" : ""}`}>
      <div
        className={isMobile ? "fixed inset-x-0 top-0 z-0 overflow-hidden" : "fixed inset-0 z-0 overflow-hidden"}
        style={isMobile ? { height: "58vh" } : undefined}
      >
        <img src="/sierra-community-daytime.jpg" alt="" aria-hidden className="animate-kenburns h-full w-full object-cover" />
        <div aria-hidden className="haze-drift" />
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <Fireflies />
      <Navbar />
      <main
        className={`relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 text-center ${isMobile ? "pb-16" : "pb-32"}`}
        style={{ paddingTop: isMobile ? "calc(4rem + 8vh)" : "calc(10rem + 7vh)" }}
      >
        <Reveal>
          <span className="overline" style={{ color: "#e8dfb8" }}>
            Community
          </span>
          <h1
            className={`font-display font-normal text-white whitespace-nowrap ${
              isMobile ? "text-3xl" : "text-5xl sm:text-6xl"
            }`}
            style={{ textShadow: "0 2px 28px rgba(0,0,0,0.75), 0 1px 6px rgba(0,0,0,0.65)" }}
          >
            Come Be Family.
          </h1>
        </Reveal>

        <div
          className={`animate-glow-pulse mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 rounded-xl border border-[var(--st-gold)]/30 bg-[var(--st-black)]/80 px-8 py-4 backdrop-blur-sm ${
            isMobile ? "mt-6" : "mt-10"
          }`}
        >
          <p className="font-body max-w-sm text-left text-sm font-light text-[var(--st-text-soft)]">
            Join our Skool community — New Earth Councils, gatherings, and building the vision together.
          </p>
          <a
            href={SKOOL_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="community-signup-skool-link"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--st-gold)] px-6 py-2.5 font-body text-sm font-medium text-[var(--st-black)] transition-colors hover:bg-[var(--st-gold-accent)]"
          >
            Join the Family <ArrowUpRight size={15} />
          </a>
        </div>

        <Reveal delay={0.3}>
          <div className={`flex items-center justify-center gap-7 ${isMobile ? "mt-10" : "mt-14"}`}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-accent text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-[#e8dfb8]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
