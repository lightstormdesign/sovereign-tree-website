// Shared signal between the Home page's Portal -> Hero experience and
// PitchDeckBubble (mounted at the App level, all pages) — the bubble must
// not appear until the portal animation has actually finished, not just
// after a flat timer from page load.
export const PORTAL_COMPLETE_EVENT = "st:portal-complete";
const PORTAL_COMPLETE_KEY = "st-portal-complete";

export const markPortalComplete = () => {
  try {
    sessionStorage.setItem(PORTAL_COMPLETE_KEY, "1");
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(PORTAL_COMPLETE_EVENT));
};

export const isPortalComplete = () => {
  try {
    return sessionStorage.getItem(PORTAL_COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
};
