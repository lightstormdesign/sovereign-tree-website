import { useEffect, useRef, useState } from "react";
import { HeroContent } from "./HeroContent";

// Portal fade-out timing on tap — glow/dissolve, not a plain opacity fade.
const PORTAL_FADE_IN_MS = 1500;
const PORTAL_FADE_OUT_MS = 1300;

// Mobile-only Portal -> Hero sequence. Tap-to-enter replaces the desktop's
// scroll-scrub entirely — a fixed 100svh viewport, two phases driven by a
// single tap. Unlike Sierra's build there's no separate transition clip (the
// portal animation itself is the transition) and no portrait/logo/tap-label
// PNG overlays — the SovereignTree portal video already has the emblem
// baked in, so this only needs to lay the "Tap to Enter" label directly on
// top of it.
export const MobilePortal = () => {
  const [entered, setEntered] = useState(false); // on-load fade-in
  const [tapped, setTapped] = useState(false); // portal -> hero
  const [portalLoopBlocked, setPortalLoopBlocked] = useState(false);
  const [heroLoopBlocked, setHeroLoopBlocked] = useState(false);

  const enteringRef = useRef(false);
  const heroLoopRef = useRef(null);
  const portalLoopRef = useRef(null);

  // Fade-in starts immediately on mount (no delay) — the rAF hop just
  // ensures the initial opacity:0 actually paints on its own frame first.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleTap = () => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    setTapped(true);
  };

  useEffect(() => {
    heroLoopRef.current?.play().catch(() => setHeroLoopBlocked(true));
  }, []);
  useEffect(() => {
    portalLoopRef.current?.play().catch(() => setPortalLoopBlocked(true));
  }, []);

  const pe = (on) => (on ? "auto" : "none");

  return (
    <section data-testid="mobile-portal" className="relative w-full overflow-hidden bg-[var(--st-black)]" style={{ height: "100svh" }}>
      {/* Layer 0: Hero loop background — always playing beneath, revealed
          the moment the portal is tapped. */}
      <div className="absolute inset-0 bg-[var(--st-black)]" style={{ opacity: tapped ? 1 : 0, transition: `opacity ${PORTAL_FADE_OUT_MS}ms ease-out` }}>
        {heroLoopBlocked ? (
          <img
            data-testid="mobile-hero-loop-poster"
            className="absolute inset-0 h-full w-full object-cover"
            src="/sovereigntree-hero-loop_poster.jpg"
            alt=""
          />
        ) : (
          <video
            ref={heroLoopRef}
            data-testid="mobile-hero-loop-video"
            className="absolute inset-0 h-full w-full object-cover"
            src="/sovereigntree-hero-loop.mp4"
            poster="/sovereigntree-hero-loop_poster.jpg"
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
          />
        )}
      </div>

      {/* Layer 1: Portal — the SovereignTree animation, tap target. Fades
          IN on mount (1.5s), fades OUT on tap via a glow/dissolve over
          1.3s. The poster/fallback image covers any loading delay. */}
      <button
        type="button"
        onClick={handleTap}
        data-testid="mobile-portal-tap-target"
        aria-label="Tap to enter"
        className="absolute inset-0 z-10 h-full w-full cursor-pointer"
        style={{
          opacity: !entered ? 0 : tapped ? 0 : 1,
          filter: tapped ? "brightness(1.15) blur(20px)" : "brightness(1) blur(0px)",
          pointerEvents: pe(!tapped && entered),
          transition: tapped
            ? `opacity ${PORTAL_FADE_OUT_MS}ms ease-out, filter ${PORTAL_FADE_OUT_MS}ms ease-out`
            : `opacity ${PORTAL_FADE_IN_MS}ms ease-out`,
        }}
      >
        {portalLoopBlocked ? (
          <img
            data-testid="mobile-portal-loop-poster"
            className="absolute inset-0 h-full w-full object-cover"
            src="/sovereigntree-mobile-portal-loop_poster.jpg"
            alt=""
          />
        ) : (
          <video
            ref={portalLoopRef}
            data-testid="mobile-portal-loop-video"
            className="absolute inset-0 h-full w-full object-cover"
            src="/sovereigntree-mobile-portal-loop.mp4"
            poster="/sovereigntree-mobile-portal-loop_poster.jpg"
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
          />
        )}

        {/* "Tap to Enter" — green, not white: the portal footage's own
            background is white/cream, so white text would disappear
            against it. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[10vh] flex flex-col items-center">
          <span className="font-accent text-sm uppercase tracking-[0.32em] text-[var(--st-gold)]">
            Tap to Enter
          </span>
          <div className="mt-4 flex h-9 w-5 items-end justify-center rounded-full border border-[var(--st-gold)]/50 p-1">
            <span
              className="block h-2 w-1 rounded-full bg-[var(--st-gold)]"
              style={{ animation: "breathe 2.4s ease-in-out infinite" }}
            />
          </div>
        </div>
      </button>

      {/* Hero content — logo/tagline/bio/CTA, mobile variant */}
      <div className="absolute inset-0 z-20" style={{ opacity: tapped ? 1 : 0, pointerEvents: pe(tapped) }}>
        <HeroContent active={tapped} mobile />
      </div>
    </section>
  );
};
