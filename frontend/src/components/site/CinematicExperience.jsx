import { useEffect, useRef, useState } from "react";
import { HeroContent } from "./HeroContent";
import { MobilePortal } from "./MobilePortal";
import { useIsMobile } from "@/hooks/useIsMobile";

// Thin switcher — mobile gets an entirely separate tap-to-enter component
// (MobilePortal), desktop keeps its scroll-scrub. Kept as two fully separate
// component trees (not an isMobile branch inside one component) so the
// desktop implementation's hooks are never conditionally skipped across a
// breakpoint-crossing re-render.
export const CinematicExperience = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobilePortal /> : <DesktopExperience />;
};

// Pinned Portal -> Hero scroll-scrub, desktop only. A tall section (220vh)
// holds a sticky 100svh viewport; scroll progress `p` (0..1) drives two
// video layers via crossfade envelopes — the SovereignTree portal animation
// (the "animated logo") on top, fading out into the hero background loop
// underneath, which is already playing beneath it the whole time. Unlike
// Sierra's build there's no separate transition clip — the portal animation
// itself is the transition, so this is a straight two-layer cross-dissolve
// rather than a three-layer scrub.
const DesktopExperience = () => {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const portalLoopRef = useRef(null);
  const heroLoopRef = useRef(null);

  const [p, setP] = useState(0);
  const [portalLoopBlocked, setPortalLoopBlocked] = useState(false);
  const [heroLoopBlocked, setHeroLoopBlocked] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = stickyRef.current ? stickyRef.current.clientHeight : window.innerHeight;
      const total = rect.height - vh;
      const prog = Math.min(1, Math.max(0, -rect.top / total));
      setP(prog);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Portal/hero loop backgrounds: always-mounted, muted+loop+autoPlay, just
  // revealed via opacity. Autoplay-blocked fallback (e.g. Low Power Mode)
  // swaps to the poster image, permanently for this page load.
  useEffect(() => {
    const v = portalLoopRef.current;
    if (!v) return;
    v.play().catch(() => setPortalLoopBlocked(true));
  }, []);
  useEffect(() => {
    const v = heroLoopRef.current;
    if (!v) return;
    v.play().catch(() => setHeroLoopBlocked(true));
  }, []);

  const seg = (a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));

  // Portal text/loop fade out over the first ~60% of scroll; hero loop fades
  // in starting ~35%, overlapping the portal's fade-out through the middle
  // so the two videos genuinely cross-dissolve rather than cutting.
  const portalTextOp = 1 - seg(0, 0.08);
  const portalLoopOp = 1 - seg(0.05, 0.6);
  const heroLoopOp = seg(0.35, 0.75);
  const heroContentOp = seg(0.7, 0.92);
  const pe = (o) => (o > 0.5 ? "auto" : "none");

  return (
    <section id="experience" ref={sectionRef} className="relative" style={{ height: "220vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--st-black)]" style={{ height: "100svh" }}>
        {/* Layer 0: Hero loop background — bottom-most, always playing underneath */}
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
              preload="auto"
              tabIndex={-1}
            />
          )}
        </div>

        {/* Layer 1: Portal loop background — topmost initially, fades out
            into the hero loop below as the user scrolls. */}
        <div className="absolute inset-0 bg-[var(--st-black)]" style={{ opacity: portalLoopOp }}>
          {portalLoopBlocked ? (
            <img
              data-testid="portal-loop-poster"
              className="absolute inset-0 h-full w-full object-cover"
              src="/sovereigntree-portal-loop_poster.jpg"
              alt=""
            />
          ) : (
            <video
              ref={portalLoopRef}
              data-testid="portal-loop-video"
              className="absolute inset-0 h-full w-full object-cover"
              src="/sovereigntree-portal-loop.mp4"
              poster="/sovereigntree-portal-loop_poster.jpg"
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
            />
          )}
        </div>

        {/* "Scroll to Enter" — green, not white: the portal footage's own
            background is white/cream, so a white indicator would disappear
            against it. Positioned lower-center, clear of the emblem baked
            into the video. */}
        <div
          className="absolute inset-0 z-20"
          style={{ opacity: portalTextOp, pointerEvents: pe(portalTextOp) }}
        >
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
