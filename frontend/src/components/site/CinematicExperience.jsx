import { useEffect, useRef, useState } from "react";
import { HeroContent } from "./HeroContent";
import { MobilePortal } from "./MobilePortal";
import { useIsMobile } from "@/hooks/useIsMobile";

// Fallback in case the portal video's 'ended' event never fires (autoplay
// blocked, decode error, etc.) — known duration of sovereigntree-portal-loop.mp4
// (~5.04s) plus a buffer, so the page can never get stuck showing the portal
// forever.
const PORTAL_FALLBACK_MS = 6500;

// Thin switcher — mobile gets its own tap-to-enter component (MobilePortal),
// desktop autoplays the portal animation once and auto-crossfades into the
// hero on its own, no scroll or tap required.
export const CinematicExperience = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobilePortal /> : <DesktopExperience />;
};

// Portal -> Hero, desktop only. The SovereignTree portal animation plays
// once (not looped); when it ends (or the fallback timer fires), it
// dissolves into the hero background loop underneath, which has been
// playing the whole time. Fixed 100vh — no scroll-scrub, no "scroll to
// enter": the animation itself is the whole interaction.
const DesktopExperience = () => {
  const portalRef = useRef(null);
  const heroLoopRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const [entered, setEntered] = useState(false);
  const [heroLoopBlocked, setHeroLoopBlocked] = useState(false);

  useEffect(() => {
    const v = heroLoopRef.current;
    if (!v) return;
    v.play().catch(() => setHeroLoopBlocked(true));
  }, []);

  useEffect(() => {
    fallbackTimerRef.current = setTimeout(() => setEntered(true), PORTAL_FALLBACK_MS);
    return () => clearTimeout(fallbackTimerRef.current);
  }, []);

  const handlePortalEnded = () => {
    clearTimeout(fallbackTimerRef.current);
    setEntered(true);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[var(--st-black)]" style={{ height: "100svh" }}>
      {/* Layer 0: Hero loop background — bottom-most, already playing underneath */}
      <div className="absolute inset-0 bg-[var(--st-black)]" style={{ opacity: entered ? 1 : 0, transition: "opacity 1.2s ease" }}>
        {heroLoopBlocked ? (
          <img
            data-testid="hero-loop-poster"
            className="absolute inset-0 h-full w-full object-cover"
            src="/sovereigntree-hero-loop_poster.jpg"
            alt=""
          />
        ) : (
          <video
            ref={heroLoopRef}
            data-testid="hero-loop-video"
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

      {/* Layer 1: Portal animation — plays once, dissolves out on 'ended' */}
      <div
        className="absolute inset-0 z-10 bg-[var(--st-black)]"
        style={{ opacity: entered ? 0 : 1, transition: "opacity 1s ease", pointerEvents: entered ? "none" : "auto" }}
      >
        <video
          ref={portalRef}
          data-testid="portal-loop-video"
          className="absolute inset-0 h-full w-full object-cover"
          src="/sovereigntree-portal-loop.mp4"
          poster="/sovereigntree-portal-loop_poster.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handlePortalEnded}
          tabIndex={-1}
        />
      </div>

      {/* Hero content */}
      <div
        className="absolute inset-0 z-20"
        style={{ opacity: entered ? 1 : 0, transition: "opacity 1s ease 0.4s", pointerEvents: entered ? "auto" : "none" }}
      >
        <HeroContent active={entered} />
      </div>
    </section>
  );
};
