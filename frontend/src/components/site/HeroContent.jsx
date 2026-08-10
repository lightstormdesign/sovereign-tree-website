import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_CTA, HERO_TAGLINE, HERO_BIO_MOBILE, MISSION_PARAGRAPHS, WE_ARE_PILLARS, FOUNDERS_CAPTION } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1];
const fade = (delay) => ({
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, delay, ease: EASE } },
});
const wipeV = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  show: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 1.0, delay: 0.25, ease: EASE } },
};
const slideIn = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 1.1, delay: 0.15, ease: EASE } },
};

// Mobile-only entrance pacing — each element's fade-in lasts a full 2s
// (cinematic, not the snappier desktop timing above). Desktop's `fade`/
// `wipeV` above are untouched.
const fadeMobile = (delay) => ({
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 2, delay, ease: EASE } },
});
const wipeVMobile = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  show: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 2, delay: 0.25, ease: EASE } },
};

export const HeroContent = ({ active, mobile = false }) => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (active) setShown(true);
  }, [active]);

  const ctl = shown ? "show" : "hidden";

  if (mobile) {
    return (
      <motion.div
        initial="hidden"
        animate={ctl}
        className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.img
          variants={wipeVMobile}
          src="/sovereigntree-logo.png"
          alt="SovereignTree"
          data-testid="hero-logo"
          className="w-full object-contain"
          style={{ maxWidth: "16rem" }}
        />

        <motion.div variants={fadeMobile(0.55)} className="mt-8 flex flex-col items-center">
          <p data-testid="hero-tagline" className="font-display text-metallic-grad text-[1.6rem] leading-tight">
            {HERO_TAGLINE}
          </p>
          <p
            data-testid="hero-bio"
            className="font-body mt-6 text-[0.92rem] font-light leading-relaxed text-[var(--st-text-soft)]"
            style={{ maxWidth: "20.4rem" }}
          >
            {HERO_BIO_MOBILE}
          </p>
        </motion.div>

        <motion.div variants={fadeMobile(0.8)} className="mt-6 flex flex-col items-center">
          <img
            src="/sovereigntree-hero-founders.jpg"
            alt={FOUNDERS_CAPTION}
            data-testid="hero-founders-photo"
            className="rounded-xl border border-[var(--st-gold)]/40 object-cover shadow-[0_10px_35px_-10px_rgba(63,77,42,0.45)]"
            style={{ width: "11.5rem", height: "15rem" }}
          />
          <span className="font-accent mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--st-text-muted)]">
            {FOUNDERS_CAPTION}
          </span>
        </motion.div>

        <motion.div variants={fadeMobile(1.0)} className="mt-6">
          <Link
            to={HERO_CTA.to}
            data-testid="hero-cta-btn"
            className="animate-glow-pulse pointer-events-auto rounded-full border border-[var(--st-gold)]/40 bg-[var(--st-black)]/60 px-8 py-2.5 font-accent text-[0.7rem] uppercase tracking-[0.28em] text-[var(--st-gold)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--st-gold)] hover:text-[var(--st-text)]"
          >
            {HERO_CTA.label}
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Desktop: matches sovereigntree.org's actual homepage layout — verified
  // by inspecting the live site's DOM: the animated video is a full-bleed
  // background across the ENTIRE hero (not just behind a small portal
  // circle), and the founders photo sits on top as an inset panel — not
  // edge-to-edge — at roughly left:18%, top:6%, width:29%, height:71% of
  // the viewport. That inset (not a bleeding full-height panel) is exactly
  // what keeps the video's own owl/branch decoration and drifting birds
  // visible around the photo instead of being covered by it.
  return (
    <motion.div initial="hidden" animate={ctl} className="relative h-full w-full">
      <motion.div
        variants={slideIn}
        className="absolute"
        style={{ left: "18%", top: "6%", width: "29%", height: "71%" }}
      >
        <img
          src="/sovereigntree-hero-founders.jpg"
          alt={FOUNDERS_CAPTION}
          data-testid="hero-founders-photo"
          className="h-full w-full rounded-lg object-cover shadow-[0_20px_60px_-15px_rgba(43,39,23,0.45)]"
        />
        <span
          className="font-accent absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-[0.2em] text-white"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.7)" }}
        >
          {FOUNDERS_CAPTION}
        </span>
      </motion.div>

      {/* Right: wordmark, pillars, mission copy, CTA — starts clear of the
          photo panel above (which ends at ~47% width). */}
      <div
        className="relative flex h-full flex-col items-start justify-center pr-[6%] text-left"
        style={{ paddingLeft: "51%" }}
      >
        <motion.img
          variants={wipeV}
          src="/sovereigntree-logo.png"
          alt="SovereignTree"
          data-testid="hero-logo"
          className="w-full object-contain object-left"
          style={{ maxWidth: "24rem" }}
        />

        <motion.ul variants={fade(0.4)} className="font-accent mt-5 space-y-1 text-base italic text-[var(--st-gold)]">
          {WE_ARE_PILLARS.map((p) => (
            <li key={p}>• {p}</li>
          ))}
        </motion.ul>

        <motion.div variants={fade(0.55)} className="mt-6 max-w-lg space-y-3">
          <p data-testid="hero-tagline" className="font-display text-metallic-grad text-2xl leading-tight xl:text-3xl">
            {HERO_TAGLINE}
          </p>
          {MISSION_PARAGRAPHS.slice(0, 2).map((para, i) => (
            <p key={i} className="font-body text-sm font-light leading-relaxed text-[var(--st-text-soft)]">
              {para}
            </p>
          ))}
        </motion.div>

        <motion.div variants={fade(0.85)} className="mt-7">
          <Link
            to={HERO_CTA.to}
            data-testid="hero-cta-btn"
            className="animate-glow-pulse pointer-events-auto inline-block rounded-full border border-[var(--st-gold)]/40 bg-[var(--st-black)]/60 px-8 py-2.5 font-accent text-[0.7rem] uppercase tracking-[0.28em] text-[var(--st-gold)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--st-gold)] hover:text-[var(--st-text)]"
          >
            {HERO_CTA.label}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
