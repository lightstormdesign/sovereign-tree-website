import { useRef, useState } from "react";
import { HeroContent } from "./HeroContent";

// Portal fade-out timing on tap — glow/dissolve, not a plain opacity fade.
const PORTAL_FADE_OUT_MS = 1300;

// Mobile-only Portal -> Hero sequence. Tap-to-enter, unlike desktop's
// autoplay-and-crossfade — mobile never autoplays anything before the user
// engages: the portal shows a static poster frame (no video, no data usage)
// until tapped, and the hero video only starts playing inside the tap
// handler itself (also the more reliable pattern for autoplay-with-sound
// browser policies, since it's a direct user-gesture callback).
export const MobilePortal = () => {
  const [tapped, setTapped] = useState(false);
  const [heroLoopBlocked, setHeroLoopBlocked] = useState(false);
  const enteringRef = useRef(false);
  const heroLoopRef = useRef(null);

  const handleTap = () => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    setTapped(true);
    heroLoopRef.current?.play().catch(() => setHeroLoopBlocked(true));
  };

  const pe = (on) => (on ? "auto" : "none");

  return (
    <section data-testid="mobile-portal" className="relative w-full overflow-hidden bg-[var(--st-black)]" style={{ height: "100svh" }}>
      {/* Layer 0: Hero loop background — only starts playing once tapped. */}
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
            preload="none"
            tabIndex={-1}
          />
        )}
      </div>

      {/* Layer 1: Portal — a static poster frame, tap target. No video
          autoplay on mobile at all; fades OUT on tap via a glow/dissolve. */}
      <button
        type="button"
        onClick={handleTap}
        data-testid="mobile-portal-tap-target"
        aria-label="Tap to enter"
        className="absolute inset-0 z-10 h-full w-full cursor-pointer"
        style={{
          opacity: tapped ? 0 : 1,
          filter: tapped ? "brightness(1.15) blur(20px)" : "brightness(1) blur(0px)",
          pointerEvents: pe(!tapped),
          transition: `opacity ${PORTAL_FADE_OUT_MS}ms ease-out, filter ${PORTAL_FADE_OUT_MS}ms ease-out`,
        }}
      >
        <img
          data-testid="mobile-portal-loop-poster"
          className="absolute inset-0 h-full w-full object-cover"
          src="/sovereigntree-mobile-portal-loop_poster.jpg"
          alt=""
        />

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
