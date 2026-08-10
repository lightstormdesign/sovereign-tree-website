import { useEffect, useRef, useState } from "react";
import { HeroContent } from "./HeroContent";
import { MobilePortal } from "./MobilePortal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { markPortalComplete } from "@/utils/portalComplete";

// Thin switcher — mobile gets its own tap-to-enter component (MobilePortal),
// desktop uses the scroll-scrub below.
export const CinematicExperience = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobilePortal /> : <DesktopExperience />;
};

// Pinned Portal -> Hero scroll-scrub, desktop only — same mechanism as
// Sierra's original build: a tall section (280vh) holds a sticky 100svh
// viewport; scroll progress `p` (0..1) drives crossfade envelopes, and a
// requestAnimationFrame loop eases the portal video's currentTime toward a
// target derived from `p`. That's also what makes it reversible for free —
// scrolling back up just decreases p and the RAF loop eases back.
//
// Differences from Sierra's build (both deliberate): (1) there's no
// separate "portal loop" ambient video underneath the static portal
// graphic — the landing state is a plain JPEG (the portal video's own first
// frame) so nothing plays before the user actually scrolls; (2) the portal
// video itself doubles as Sierra's "transition" clip, since there's no
// separate transition asset — it gets scrubbed directly.
const DesktopExperience = () => {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const transitionRef = useRef(null);
  const heroLoopRef = useRef(null);

  const targetTime = useRef(0);
  const durationRef = useRef(5);
  const rafRef = useRef(null);
  const heroLoopStartedRef = useRef(false);
  const completeFiredRef = useRef(false);

  const [p, setP] = useState(0);
  const [heroLoopBlocked, setHeroLoopBlocked] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const transition = transitionRef.current;

    const onMeta = () => {
      if (transition && transition.duration) durationRef.current = transition.duration;
    };
    if (transition) {
      transition.addEventListener("loadedmetadata", onMeta);
      if (transition.readyState >= 1) onMeta();
    }

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = stickyRef.current ? stickyRef.current.clientHeight : window.innerHeight;
      const total = rect.height - vh;
      const prog = Math.min(1, Math.max(0, -rect.top / total));
      setP(prog);

      const transitionEnd = 0.85;
      const tProg = Math.min(1, Math.max(0, prog / transitionEnd));
      targetTime.current = tProg * durationRef.current;

      // Hero loop starts playing once it's about to become visible — not on
      // mount — so nothing autoplays before the user actually scrolls.
      if (!heroLoopStartedRef.current && prog > 0.7) {
        heroLoopStartedRef.current = true;
        heroLoopRef.current?.play().catch(() => setHeroLoopBlocked(true));
      }

      if (!completeFiredRef.current && prog > 0.95) {
        completeFiredRef.current = true;
        markPortalComplete();
      }
    };

    const tick = () => {
      const v = transitionRef.current;
      if (v && durationRef.current) {
        const cur = v.currentTime || 0;
        const diff = targetTime.current - cur;
        if (Math.abs(diff) > 0.0015) {
          try {
            v.currentTime = cur + diff * 0.2;
          } catch {
            // ignore — can throw if metadata isn't loaded yet
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (transition) transition.removeEventListener("loadedmetadata", onMeta);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const seg = (a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));

  const portalTextOp = 1 - seg(0, 0.06);
  const transitionOp = seg(0, 0.04) * (1 - seg(0.85, 0.95));
  const heroLoopOp = seg(0.78, 0.92);
  const heroContentOp = seg(0.85, 0.97);
  const pe = (o) => (o > 0.5 ? "auto" : "none");

  return (
    <section id="experience" ref={sectionRef} className="relative" style={{ height: "280vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--st-black)]" style={{ height: "100svh" }}>
        {/* Layer 0: Hero loop background — bottom-most, starts playing once nearly revealed */}
        <div className="absolute inset-0 bg-[var(--st-black)]" style={{ opacity: heroLoopOp }}>
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
              preload="none"
              tabIndex={-1}
            />
          )}
        </div>

        {/* Layer 1: Portal video — scrubbed via currentTime, never autoplays
            (stays paused; the RAF loop above only seeks it). Fades out into
            the hero loop as the scrub nears its end. */}
        <video
          ref={transitionRef}
          data-testid="portal-loop-video"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: transitionOp }}
          src="/sovereigntree-portal-loop.mp4"
          poster="/sovereigntree-portal-loop_poster.jpg"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
        />

        {/* Landing state: a plain JPEG (the portal video's own first frame)
            — nothing plays until the user scrolls. */}
        <div
          className="absolute inset-0 z-20"
          style={{ opacity: portalTextOp, pointerEvents: pe(portalTextOp) }}
        >
          <img
            src="/sovereigntree-portal-loop_poster.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-[8vh] left-1/2 flex -translate-x-1/2 flex-col items-center">
            <span className="font-accent text-sm uppercase tracking-[0.32em] text-[var(--st-gold)]">
              Scroll to Enter
            </span>
            <div className="mt-4 flex h-9 w-5 items-end justify-center rounded-full border border-[var(--st-gold)]/50 p-1">
              <span
                className="block h-2 w-1 rounded-full bg-[var(--st-gold)]"
                style={{ animation: "scroll-cue 1.8s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>

        {/* Hero content: logo, tagline, mission excerpt, CTA */}
        <div className="absolute inset-0 z-30" style={{ opacity: heroContentOp, pointerEvents: pe(heroContentOp) }}>
          <HeroContent active={heroContentOp > 0.3} />
        </div>

        {/* Progress hairline */}
        <div
          className="absolute bottom-0 left-0 z-40 h-[2px] bg-gradient-to-r from-[var(--st-gold-accent)] to-[var(--st-gold)]"
          style={{ width: `${p * 100}%`, opacity: 0.7 }}
        />
      </div>
    </section>
  );
};
