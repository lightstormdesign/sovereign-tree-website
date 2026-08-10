import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, ArrowUpRight } from "lucide-react";
import { PITCH_DECK_URL, PITCH_DECK_BUBBLE_LABEL, PITCH_DECK_BUBBLE_SUBLABEL } from "@/data/site";
import { PORTAL_COMPLETE_EVENT, isPortalComplete } from "@/utils/portalComplete";

const APPEAR_DELAY_MS = 3000;
const DISMISS_KEY = "st-pitch-deck-bubble-dismissed";

// Non-intrusive bottom-right bubble linking to the pitch deck — replaces the
// old inline "Take Action Now" button. Never appears on first paint, and on
// the Home page specifically it waits for the Portal -> Hero animation to
// actually finish (not just a flat timer from page load) before starting
// its own appear delay — otherwise it'd pop up mid-portal, competing with
// the thing the visitor is supposed to be watching. On every other page
// (where there's no portal to wait for) it just uses the flat delay.
export const PitchDeckBubble = () => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed) return;

    const waitingOnPortal = location.pathname === "/" && !isPortalComplete();
    if (!waitingOnPortal) {
      const t = setTimeout(() => setShow(true), APPEAR_DELAY_MS);
      return () => clearTimeout(t);
    }

    let t;
    const onPortalComplete = () => {
      t = setTimeout(() => setShow(true), APPEAR_DELAY_MS);
    };
    window.addEventListener(PORTAL_COMPLETE_EVENT, onPortalComplete);
    return () => {
      window.removeEventListener(PORTAL_COMPLETE_EVENT, onPortalComplete);
      clearTimeout(t);
    };
  }, [dismissed, location.pathname]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  return (
    <div
      data-testid="pitch-deck-bubble"
      className="fixed bottom-5 right-5 z-40 max-w-[15rem]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div className="relative rounded-2xl border border-[var(--st-gold)]/30 bg-[var(--st-black)] p-4 shadow-[0_10px_40px_-10px_rgba(63,77,42,0.35)]">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          data-testid="pitch-deck-bubble-dismiss"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-[var(--st-black)] text-[var(--st-text-muted)] transition-colors hover:text-[var(--st-text)]"
        >
          <X size={12} />
        </button>
        <a
          href={PITCH_DECK_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="pitch-deck-bubble-link"
          className="flex items-center gap-3"
        >
          <img src="/sovereigntree-emblem.jpg" alt="" aria-hidden className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <span className="text-left">
            <span className="font-body block text-xs leading-snug text-[var(--st-text)]">
              {PITCH_DECK_BUBBLE_LABEL}
            </span>
            <span className="font-accent mt-0.5 flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--st-gold)]">
              {PITCH_DECK_BUBBLE_SUBLABEL} <ArrowUpRight size={11} />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
};
