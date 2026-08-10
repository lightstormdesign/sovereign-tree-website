import { useEffect, useRef, useState } from "react";
import { HeroContent } from "./HeroContent";
import { markPortalComplete } from "@/utils/portalComplete";

// Known duration of sovereigntree-mobile-portal-loop.mp4 (~5.04s) — used
// only as a failsafe if 'ended' never fires (autoplay blocked, decode
// error, etc.), so a tap can never leave the user stuck on a frozen frame.
const TRANSITION_FALLBACK_MS = 6200;

// Portal fade-out timing on tap — glow/dissolve, not a plain opacity fade.
const PORTAL_FADE_OUT_MS = 1300;

// Seam (transition -> hero): the portal video's own opacity starts fading
// out 1s before it ends, revealing the hero loop underneath (already
// playing beneath it since the moment of tap, not started fresh at
// reveal). Its brightness also dims 100%->85%, starting 2s before the end.
const SEAM_FADE_WINDOW_S = 1;
const SEAM_DIM_WINDOW_S = 2;
const SEAM_DIM_TARGET = 85;

// Mobile-only Portal -> Hero sequence — same tap-driven mechanism as
// Sierra's original build: a fixed 100svh viewport, phases driven by a
// single tap, no scroll involved at all. Unlike desktop, nothing plays
// before the tap: the landing state is a plain JPEG (the portal video's own
// first frame), and the portal video only starts once tapped (a direct
// user-gesture callback, also the most reliable pattern for
// autoplay-with-sound browser policies).
export const MobilePortal = () => {
  const [phase, setPhase] = useState("portal"); // portal | transitioning | hero
  const [heroLoopBlocked, setHeroLoopBlocked] = useState(false);

  const enteringRef = useRef(false);
  const transitionRef = useRef(null);
  const heroLoopRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const seamRafRef = useRef(null);

  const handleTap = () => {
    if (enteringRef.current || phase !== "portal") return;
    enteringRef.current = true;
    setPhase("transitioning");

    const v = transitionRef.current;
    if (v) {
      try {
        v.currentTime = 0;
      } catch {
        // ignore
      }
      v.style.opacity = 1;
      v.style.filter = "brightness(100%)";
      v.play().catch(() => {});
    }

    heroLoopRef.current?.play().catch(() => setHeroLoopBlocked(true));

    fallbackTimerRef.current = setTimeout(() => setPhase("hero"), TRANSITION_FALLBACK_MS);
  };

  const handleTransitionEnded = () => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setPhase("hero");
  };

  useEffect(() => {
    if (phase === "hero") markPortalComplete();
  }, [phase]);

  useEffect(
    () => () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    },
    []
  );

  // Seam: drive the portal video's opacity/brightness directly off its own
  // playback position during the final 1-2s, via rAF (not 'timeupdate',
  // which fires too coarsely for a smooth fade). Imperative DOM writes, not
  // React state, since this updates every frame.
  useEffect(() => {
    if (phase !== "transitioning") return;
    const v = transitionRef.current;
    if (!v) return;

    const tick = () => {
      const dur = v.duration;
      if (dur && isFinite(dur)) {
        const remaining = dur - v.currentTime;
        const opacity = Math.max(0, Math.min(1, remaining / SEAM_FADE_WINDOW_S));
        const dimProgress = Math.max(0, Math.min(1, remaining / SEAM_DIM_WINDOW_S));
        const brightness = SEAM_DIM_TARGET + dimProgress * (100 - SEAM_DIM_TARGET);
        v.style.opacity = opacity;
        v.style.filter = `brightness(${brightness}%)`;
      }
      seamRafRef.current = requestAnimationFrame(tick);
    };
    seamRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(seamRafRef.current);
  }, [phase]);

  const portalOn = phase === "portal";
  const heroLoopOn = phase !== "portal";
  const pe = (on) => (on ? "auto" : "none");

  return (
    <section data-testid="mobile-portal" className="relative w-full overflow-hidden bg-[var(--st-black)]" style={{ height: "100svh" }}>
      {/* Layer 0: Hero loop background — starts playing the moment the
          user taps, full opacity the whole time it's revealed (see the
          seam effect above, which handles the fade/dim on the layer above
          this one instead). */}
      <div className="absolute inset-0 bg-[var(--st-black)]" style={{ opacity: heroLoopOn ? 1 : 0 }}>
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

      {/* Layer 1: Portal video — appears/starts instantly on tap (no fade-in
          of its own; the JPEG layer above dissolves away over it instead).
          Opacity/brightness during the final 1-2s are driven imperatively
          by the seam rAF loop above. */}
      <video
        ref={transitionRef}
        data-testid="mobile-portal-loop-video"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: phase === "portal" ? 0 : undefined }}
        src="/sovereigntree-mobile-portal-loop.mp4"
        poster="/sovereigntree-mobile-portal-loop_poster.jpg"
        muted
        playsInline
        preload="auto"
        onEnded={handleTransitionEnded}
        tabIndex={-1}
      />

      {/* Layer 2: Landing state — a plain JPEG (the portal video's own
          first frame), tap target. Fades OUT on tap via a glow/dissolve —
          brightness + blur ramp alongside the opacity fade. */}
      <button
        type="button"
        onClick={handleTap}
        data-testid="mobile-portal-tap-target"
        aria-label="Tap to enter"
        className="absolute inset-0 z-10 h-full w-full cursor-pointer"
        style={{
          opacity: portalOn ? 1 : 0,
          filter: portalOn ? "brightness(1) blur(0px)" : "brightness(1.9) blur(20px)",
          pointerEvents: pe(portalOn),
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
            against it. Animated tap-ripple icon instead of a scroll cue. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[10vh] flex flex-col items-center">
          <span className="font-accent text-sm uppercase tracking-[0.32em] text-[var(--st-gold)]">
            Tap to Enter
          </span>
          <div className="relative mt-5 flex h-10 w-10 items-center justify-center">
            <span
              className="absolute h-8 w-8 rounded-full border-2 border-[var(--st-gold)]"
              style={{ animation: "tap-ripple 1.8s ease-out infinite" }}
            />
            <span
              className="absolute h-8 w-8 rounded-full border-2 border-[var(--st-gold)]"
              style={{ animation: "tap-ripple 1.8s ease-out 0.6s infinite" }}
            />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--st-gold)]" />
          </div>
        </div>
      </button>

      {/* Hero content — logo/tagline/bio/CTA, mobile variant */}
      <div className="absolute inset-0 z-20" style={{ opacity: phase === "hero" ? 1 : 0, pointerEvents: pe(phase === "hero") }}>
        <HeroContent active={phase === "hero"} mobile />
      </div>
    </section>
  );
};
