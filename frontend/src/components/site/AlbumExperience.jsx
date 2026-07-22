import { useEffect, useRef, useState } from "react";
import { Apple, PlayCircle, Music2 } from "lucide-react";
import { CDAnimation } from "@/components/site/CDAnimation";
import { STREAMING_LINKS, DIRECT_PURCHASE_URL, GOFUNDME_URL } from "@/data/site";

const PLATFORM_ICONS = {
  Spotify: Music2,
  "Apple Music": Apple,
  "YouTube Music": PlayCircle,
};

// CDAnimation's own blur now finishes exactly as the disc lands (synced to
// its SLIDE_MS internally), so `onSettled` firing means it's genuinely safe
// to start fading right away — no extra wait here. The jacket+CD fade OUT
// slowly (2s); Stream Everywhere/Get the Song Directly fade IN quickly,
// noticeably faster, largely overlapping the tail of that fade-out rather
// than waiting for it to finish.
const FADE_OUT_MS = 2000;
const FADE_IN_MS = 600;
// Title/subtitle fade out fast (a "split second") the moment the CD
// settles — faster than Stream Everywhere's own 600ms fade-in, so the
// title has already mostly cleared the stage by the time Stream appears,
// rather than the two overlapping for a couple of visible seconds.
const TITLE_FADE_OUT_MS = 400;

// The complete "This Is Me" album experience — title, the full CD-opening
// animation, and the Stream Everywhere / Get the Song Directly reveal that
// crossfades in over the same spot once it settles. Used both at full size
// on the New Album page and scaled down inside a promo card on the Music
// page — same component, same behavior, just a smaller `scale`, so the two
// never drift out of sync with each other.
export const AlbumExperience = ({ scale = 1, compact = false, mobile = false }) => {
  const [revealed, setRevealed] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [titleFontSizePx, setTitleFontSizePx] = useState(null);

  const handleCDSettled = () => setRevealed(true);

  // Mobile, full page only (compact has no subtitle to match): size the
  // title so its rendered width matches the subtitle's — since the title
  // has fewer characters, this means a larger font-size than the subtitle,
  // not the same one. One-shot proportional estimate (font width scales
  // ~linearly with size for the same string) rather than an iterative
  // search — close enough for a visual-balance match, not pixel-exact.
  useEffect(() => {
    if (compact || !mobile) return;
    const measure = () => {
      if (!titleRef.current || !subtitleRef.current) return;
      const titleWidth = titleRef.current.offsetWidth;
      const subtitleWidth = subtitleRef.current.offsetWidth;
      if (titleWidth > 0 && subtitleWidth > 0) {
        const currentSize = parseFloat(getComputedStyle(titleRef.current).fontSize);
        setTitleFontSizePx(currentSize * (subtitleWidth / titleWidth));
      }
    };
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [compact, mobile]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      // Mobile, full Album page only: whole layout (title + CD) shifted up
      // ~30% of its own height, as one unit.
      style={mobile && !compact ? { transform: "translateY(-30%)" } : undefined}
    >
      {/* Title/subtitle fade reversal is mobile-only (this specific
          instruction wasn't marked as applying to desktop too, unlike the
          subtitle copy change above it) — the Music page's compact card
          already faded before this round; now the full Album page does
          too, but only on mobile. Desktop's full page keeps its original
          "persists through the whole transition" behavior, unchanged. See
          TITLE_FADE_OUT_MS above for why the fade-out uses a faster
          duration than the CD's own FADE_OUT_MS. */}
      <div
        className="text-center"
        style={{
          marginBottom: compact ? "0.75rem" : "2rem",
          opacity: (compact || mobile) && revealed ? 0 : 1,
          transition: compact || mobile ? `opacity ${TITLE_FADE_OUT_MS}ms ease` : "none",
        }}
      >
        {/* Mobile (non-compact, full Album page only): this title used to
            render as two lines pre-animation then reflow to one line once
            the CD's opened width changed its flex sibling's layout — a
            smaller, guaranteed-one-line size sidesteps that shift entirely
            rather than depending on animation phase. Its font-size is then
            bumped up further (see titleFontSizePx above) to match the
            subtitle's rendered width. */}
        <h1
          ref={titleRef}
          className={`font-display font-normal text-[var(--st-text)] whitespace-nowrap ${
            compact ? "text-sm" : mobile ? "text-lg" : "text-3xl sm:text-4xl"
          }`}
          style={titleFontSizePx ? { fontSize: `${titleFontSizePx}px` } : undefined}
        >
          This Is Me — Debut Album
        </h1>
        {!compact && (
          <p ref={subtitleRef} className="font-body mt-2 text-sm font-light italic text-white/50">
            Sixteen songs to empower and open your heart.
          </p>
        )}
      </div>

      {/* Mobile, compact (Music page card) only: the revealed "Stream
          Everywhere" panel is absolutely-positioned over this box, so it
          doesn't contribute to this wrapper's own height — in compact mode
          its content (label + streaming pills + support box) is taller
          than the CD's own fixed panel height, so without a floor here it
          overflowed downward with the support button sitting flush against
          the outer card's bottom edge, no breathing room. A generous
          min-height keeps the revealed content fully contained so the
          outer card's `justify-center` can actually center the whole
          group, before and after the CD animation plays. */}
      <div
        className="relative flex items-center justify-center"
        style={mobile && compact ? { minHeight: "15rem" } : undefined}
      >
        {/* CD layer — fades out in place once settled + blurred, slowly. */}
        <div
          style={{
            opacity: revealed ? 0 : 1,
            transition: `opacity ${FADE_OUT_MS}ms ease`,
            pointerEvents: revealed ? "none" : "auto",
          }}
        >
          {/* Audio is exclusive to the full Album page — the Music page's
              compact promo card is visual-only, no sound on tap. */}
          <CDAnimation onSettled={handleCDSettled} scale={scale} playAudio={!compact} />
        </div>

        {/* Stream Everywhere / Get the Song Directly — absolutely centered
            over the exact same spot the CD occupied, fading in quickly as
            the CD fades away (not waiting for it to finish). */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{
            opacity: revealed ? 1 : 0,
            transition: `opacity ${FADE_IN_MS}ms ease`,
            pointerEvents: revealed ? "auto" : "none",
          }}
        >
          <h2
            className={`font-accent uppercase tracking-[0.28em] text-[var(--st-gold)] ${compact ? "text-[0.55rem]" : "text-xs"}`}
          >
            Stream Everywhere
          </h2>
          <div className={`flex w-full max-w-xs flex-col items-center ${compact ? "mt-3 gap-2" : "mt-7 gap-4"}`}>
            {STREAMING_LINKS.map((s) => {
              const Icon = PLATFORM_ICONS[s.label] || Music2;
              return (
                <a
                  key={s.label}
                  href={s.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!s.href}
                  data-testid={`stream-link-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-full border font-accent uppercase tracking-[0.18em] transition-all duration-300 ${
                    compact ? "px-3 py-1.5 text-[0.55rem]" : "px-6 py-2.5 text-xs"
                  } ${
                    s.href
                      ? "border-black/15 text-[var(--st-text)]/85 hover:border-[var(--st-gold)]/60 hover:text-[var(--st-gold)]"
                      : "pointer-events-none border-black/10 text-[var(--st-text-muted)]"
                  }`}
                >
                  <Icon size={compact ? 11 : 14} /> {s.label}
                </a>
              );
            })}
          </div>
          {STREAMING_LINKS.every((s) => !s.href) && (
            <p className="font-body mt-3 text-[0.65rem] text-[var(--st-text-muted)]">Platform links pending — not yet live.</p>
          )}

          <div
            className={`flex w-full max-w-xs flex-col items-center justify-center rounded-xl border border-[var(--st-gold)]/30 bg-[var(--st-black-2)] text-center ${
              compact ? "mt-5 px-3 py-2.5" : "mt-9 px-5 py-3.5"
            }`}
          >
            {!compact && (
              <p className="font-body text-xs font-light leading-relaxed text-[var(--st-text-soft)]">
                Support Sierra directly by buying{" "}
                <a
                  href={DIRECT_PURCHASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="direct-purchase-link"
                  className="text-[var(--st-gold)] underline decoration-[var(--st-gold)]/40 underline-offset-2 transition-colors hover:text-[var(--st-text)]"
                >
                  the download
                </a>
                .
              </p>
            )}
            <a
              href={GOFUNDME_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="support-album-directly-link"
              className={`font-accent block uppercase tracking-[0.15em] text-[var(--st-text-muted)] underline decoration-black/15 underline-offset-4 transition-colors hover:text-[var(--st-gold)] ${
                compact ? "text-[0.5rem]" : "mt-3 text-[0.65rem]"
              }`}
            >
              support the album directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
