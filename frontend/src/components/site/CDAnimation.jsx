import { useRef, useState } from "react";
import { Pointer } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

// Fixed panel size (rem, before `scale`) — the container's HEIGHT never
// changes, only its WIDTH (1x closed -> 2x open). Real state machine
// (phase: closed -> opening -> sliding -> settled), no unmounting/
// remounting anywhere. Kept deliberately simple (one linear chain of
// setTimeouts, one CSS transition per property) after this sequence
// glitched repeatedly across earlier rounds when it had more moving parts.
const PANEL = 20; // rem, per square panel at scale=1
const OPEN_MS = 1600; // hinge-opens + widens from 1x to 2x panels
const SLIDE_MS = 2000; // disc slide, starts only once OPEN_MS has elapsed —
// also the exact duration of the background blur build below, so both
// finish together the instant the disc lands.

// CD case-open animation — pure CSS 3D transforms + layered images + HTML5
// audio, no generated video. `scale` lets this same component render at a
// smaller size (e.g. inside a promo card on the Music page) without
// touching any of the geometry math. Stays perfectly centered wherever its
// parent centers it (via flex/mx-auto) — its own box only ever grows
// symmetrically in width, never repositions itself.
//
// Sequence:
//   1. Tap: cover opens like a hinge/door, NO vertical size change at any
//      point — widens from one square panel to two equal square panels.
//   2. Once that finishes, the disc slides out — masked by a dedicated
//      clipping box whose right edge IS the slit line (slightly
//      right-of-center), so it's invisible until it physically crosses
//      that line. Settles centered within the LEFT panel.
//   3. The center-fold crease and the slot marker fade in together, timed
//      to the slide itself (not before, not after). The background blur
//      also starts building the instant the slide begins — not after it
//      lands — reaching its target intensity in the same SLIDE_MS window,
//      so it finishes exactly as the disc settles.
//   4. Once settled, `onSettled` fires immediately — the blur is already
//      done by then, so the parent page can start its own fade right away.
export const CDAnimation = ({ onSettled, scale = 1, playAudio = true }) => {
  const [phase, setPhase] = useState("closed"); // closed | opening | sliding | settled
  const audioRef = useRef(null);
  const panel = PANEL * scale;
  const isMobile = useIsMobile();
  // Mobile gets its own tap-track (distinct source file from the desktop
  // clip), with fade in/out baked directly into the file's waveform (not
  // JS-driven) — this component is shared by both the New Album page and
  // the Music page's mini card, so this one swap covers both audio triggers.
  const audioSrc = isMobile ? "/sierra-this-is-me-CDAnimation-clip.mp3" : "/sierra-audio-this-is-me.mp3";

  const handleClick = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    // Synchronous, in-click .play() call — matters for autoplay-with-sound
    // browser policies (same pattern as the Portal->Hero audio trigger).
    // `playAudio` is false for the Music page's compact promo card (mobile
    // only) — that card is visual-only, no sound; the Album page itself
    // always plays. Desktop keeps its original plain play() regardless of
    // `playAudio` (this restriction is mobile-only, scoped per the
    // instruction it came from).
    if (!isMobile || playAudio) {
      const audio = audioRef.current;
      if (audio && audio.src) audio.play().catch(() => {});
    }
    setTimeout(() => {
      setPhase("sliding");
      setTimeout(() => {
        setPhase("settled");
        onSettled?.();
      }, SLIDE_MS);
    }, OPEN_MS);
  };

  const opened = phase !== "closed";
  const sliding = phase === "sliding" || phase === "settled";

  // Disc geometry: width is 62% of one panel; resting position centers it
  // within the LEFT panel specifically (0..panel), not across the spread.
  const discWidth = panel * 0.62;
  const discRestLeft = (panel - discWidth) / 2;
  const discHiddenLeft = panel * 2.05; // past the mask's right edge entirely

  // Mask boundary: slightly right-of-center of the two-panel spread (the
  // spread's true center is at `panel`; this sits a bit past it, near the
  // crease). Everything to the right of this line is clipped — the disc is
  // invisible until it slides left across it.
  const slitX = panel * 1.06;

  return (
    <div
      className="relative"
      style={{
        perspective: `${90 * scale}rem`,
        height: `${panel}rem`,
        width: opened ? `${panel * 2}rem` : `${panel}rem`,
        transition: `width ${OPEN_MS}ms cubic-bezier(0.65,0,0.35,1)`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl">
        {/* Inside-spread artwork — spans the full open width (both panels).
            Blur starts building the instant the disc begins sliding (not
            after it lands), reaching its target — a deliberately subtle
            ~75% of a full depth-of-field blur, not the maximum — in the
            same SLIDE_MS window so it finishes right as the disc settles. */}
        <img
          src="/sierra-cd-inside-spread.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: sliding ? "blur(2.25px) brightness(0.82)" : "brightness(0.82)",
            transition: `filter ${SLIDE_MS}ms ease`,
          }}
        />

        {/* Slot the disc emerges from — fades in timed to the slide itself
            (not before opening finishes, not after the disc has already
            settled). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-[16%] z-[1] rounded-full bg-black/70"
          style={{
            left: `${slitX}rem`,
            width: `${0.15 * scale}rem`,
            opacity: sliding ? 1 : 0,
            transition: `opacity ${SLIDE_MS}ms ease`,
          }}
        />

        {/* Center-fold — reads as an actual physical crease (a highlight
            catching one side of the fold, a shadow falling on the other),
            not a flat drop-shadow bar. Fades in centered, timed to the
            slide, same as the slot marker above. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-[2] -translate-x-1/2"
          style={{
            left: `${panel}rem`,
            width: `${2.4 * scale}rem`,
            background:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(255,255,255,0.14) 44%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.18) 56%, rgba(0,0,0,0) 100%)",
            opacity: sliding ? 1 : 0,
            transition: `opacity ${SLIDE_MS}ms ease`,
          }}
        />

        {/* Wordmark logo — bigger and more dominant than before, with a
            genuine shadow behind it, centered at the seam across the
            whole two-panel spread. */}
        <img
          src="/sierra-logo.png"
          alt="Sierra Marin"
          aria-hidden
          className="pointer-events-none absolute top-[5%] z-[5] object-contain"
          style={{
            left: `${panel}rem`,
            width: `${panel * 0.68}rem`,
            transform: "translateX(-50%)",
            opacity: opened ? 1 : 0,
            transition: `opacity 500ms ease ${Math.round(OPEN_MS * 0.5)}ms`,
            filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.9))",
          }}
        />

        {/* Disc mask — a dedicated clipping box whose right edge IS the
            slit line. The disc is entirely clipped out while positioned
            past it, only becoming visible as it slides left across it. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 overflow-hidden" style={{ width: `${slitX}rem` }}>
          <img
            src="/sierra-cd-disc-face.webp"
            alt=""
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 object-contain"
            style={{
              width: `${discWidth}rem`,
              left: `${sliding ? discRestLeft : discHiddenLeft}rem`,
              transition: `left ${SLIDE_MS}ms cubic-bezier(0.22,1,0.36,1)`,
              // Mobile: softened into a more diffuse shadow (larger blur
              // radius, lower opacity on both layers) — the tighter-radius
              // layer especially was tracing the disc's hard alpha edge too
              // closely. Desktop keeps its original values, untouched.
              filter: isMobile
                ? "drop-shadow(0 24px 50px rgba(0,0,0,0.5)) drop-shadow(0 6px 24px rgba(0,0,0,0.32))"
                : "drop-shadow(0 30px 46px rgba(0,0,0,0.7)) drop-shadow(0 8px 16px rgba(0,0,0,0.55))",
            }}
          />
        </div>

        {/* Front cover — hinged on the left edge, opens like a physical
            case/door. The container only ever grows in WIDTH (above);
            height is fixed for the component's entire lifetime, so there is
            no vertical size change at any point. */}
        <button
          type="button"
          onClick={handleClick}
          data-testid="cd-front-cover"
          aria-label="Open the album"
          className="absolute left-0 top-0 z-20 cursor-pointer focus:outline-none"
          style={{
            height: `${panel}rem`,
            width: `${panel}rem`,
            transformStyle: "preserve-3d",
            transformOrigin: "left center",
            transform: opened ? "rotateY(-115deg)" : "rotateY(0deg)",
            transition: `transform ${OPEN_MS}ms cubic-bezier(0.65,0,0.35,1)`,
            pointerEvents: opened ? "none" : "auto",
          }}
        >
          <img
            src="/sierra-cd-front-cover.webp"
            alt="Sierra Marin — This Is Me (album cover)"
            className="h-full w-full object-cover"
            style={{ backfaceVisibility: "hidden" }}
          />
        </button>
      </div>

      {/* Tap indicator — plain pointing-hand icon (no circle), starts
          slightly right of the cover and animates left toward it with a
          zoom-in plus a repeated tapping motion, landing on the cover. */}
      {phase === "closed" && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 z-20 -translate-y-1/2"
          style={{ right: `${-0.4 * scale}rem`, animation: "tap-approach 2.6s ease-in-out infinite" }}
        >
          <Pointer
            size={38 * scale}
            className="text-[var(--st-gold-light)]"
            style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.7))" }}
          />
        </div>
      )}

      {/* Desktop: "This Is Me" trimmed 3:03-3:28, fade-out baked into the
          file, sourced via YouTube-to-MP3 for this first draft — flag as
          pending, needs an official/studio source before public launch.
          Mobile: separate tap-track with its own fade baked into the file.
          Plays once on the case-opening click, does not loop. */}
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
};
