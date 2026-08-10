import { useState } from "react";
import { SIGNUP_HEADLINE, SIGNUP_SUBHEAD, SIGNUP_NOTE, SIGNUP_CONSENT, SIGNUP_BUTTON_LABEL } from "@/data/site";

// Phone/email capture — same copy as the modal popup live on sovereigntree.org
// today (Promolayer widget), rebuilt here as an embeddable inline form
// instead of an interruptive modal, per Trev's direction.
//
// Reusable with different copy per context via props (defaults are the
// Home page's "guide" lead magnet) — e.g. the New Earth Council page passes
// its own headline/subhead/button label, since Council invites are a
// distinct thing from the guide, not the same form relabeled.
//
// NOT wired to a real backend yet — submitting just flips local state to a
// thank-you message. Needs a real SMS/CRM integration (e.g. the same
// Promolayer/Skool-adjacent tool the live site uses, or a service like
// Laylo/Klaviyo) before launch. Search this file for "TODO" when that's
// ready.
export const SignupForm = ({
  compact = false,
  headline = SIGNUP_HEADLINE,
  subhead = SIGNUP_SUBHEAD,
  note = SIGNUP_NOTE,
  buttonLabel = SIGNUP_BUTTON_LABEL,
  successMessage = "The guide is on its way — welcome to the family.",
}) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = phone.trim() && email.trim() && consent;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: wire to a real SMS/CRM backend before launch.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        data-testid="signup-form-success"
        className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-2xl border border-[var(--st-gold)]/25 bg-[var(--st-black-2)] px-8 py-10 text-center"
      >
        <span className="text-2xl">🌿</span>
        <p className="font-display text-xl text-[var(--st-text)]">You're in.</p>
        <p className="font-body text-sm font-light text-[var(--st-text-soft)]">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="signup-form"
      className={`mx-auto flex w-full flex-col items-center rounded-2xl border border-[var(--st-gold)]/25 bg-[var(--st-black-2)] text-center ${
        compact ? "max-w-md px-6 py-8" : "max-w-lg px-8 py-10"
      }`}
    >
      <p className="font-display text-2xl text-[var(--st-text)] sm:text-3xl">{headline}</p>
      <p className="font-body mt-3 max-w-sm text-sm font-light leading-relaxed text-[var(--st-text-soft)]">
        {subhead}
      </p>
      {note && <p className="font-body mt-2 text-xs font-light text-[var(--st-text-muted)]">{note}</p>}

      <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
        <input
          type="tel"
          inputMode="tel"
          required
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          data-testid="signup-phone-input"
          className="w-full rounded-full border border-black/15 bg-[var(--st-black)] px-5 py-2.5 font-body text-sm text-[var(--st-text)] placeholder:text-[var(--st-text-muted)] focus:border-[var(--st-gold)] focus:outline-none"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="signup-email-input"
          className="w-full rounded-full border border-black/15 bg-[var(--st-black)] px-5 py-2.5 font-body text-sm text-[var(--st-text)] placeholder:text-[var(--st-text-muted)] focus:border-[var(--st-gold)] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        data-testid="signup-submit-btn"
        className="mt-4 w-full max-w-sm rounded-full bg-[var(--st-gold)] px-6 py-2.5 font-body text-sm font-medium text-[var(--st-black)] transition-colors hover:bg-[var(--st-gold-accent)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {buttonLabel}
      </button>

      <label className="mt-4 flex max-w-sm items-start gap-2 text-left">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          data-testid="signup-consent-checkbox"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--st-gold)]"
        />
        <span className="font-body text-[0.65rem] leading-relaxed text-[var(--st-text-muted)]">
          {SIGNUP_CONSENT}
        </span>
      </label>
    </form>
  );
};
