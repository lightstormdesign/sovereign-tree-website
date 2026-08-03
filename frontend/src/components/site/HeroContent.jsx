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
            className="rounded-full border-2 border-[var(--st-gold)]/50 object-cover shadow-[0_8px_30px_-8px_rgba(63,77,42,0.4)]"
            style={{ width: "4.5rem", height: "4.5rem" }}
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

  // Desktop: image-left / content-right split, matching sovereigntree.org's
  // actual homepage layout (huge portrait bleeding off the left edge, "We
  // Are.." wordmark + pillars + mission copy in the right column) — the
  // Sierra template's centered-stack layout is desktop-only replaced here.
  return (
    <motion.div initial="hidden" animate={ctl} className="relative flex h-full w-full items-stretch">
      {/* Left: huge portrait, bleeds off the left edge and fades into the
          hero video on its right edge instead of a hard rectangle line. */}
      <motion.div variants={slideIn} className="relative h-full w-[42%] shrink-0">
        <img
          src="/sovereigntree-hero-founders.jpg"
          alt={FOUNDERS_CAPTION}
          data-testid="hero-founders-photo"
          className="h-full w-full object-cover"
          style={{
            WebkitMaskImage: "linear-gradient(to right, #000 78%, transparent 100%)",
            maskImage: "linear-gradient(to right, #000 78%, transparent 100%)",
          }}
        />
        <span
          className="font-accent absolute bottom-10 left-8 text-[0.65rem] uppercase tracking-[0.2em] text-white"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.7)" }}
        >
          {FOUNDERS_CAPTION}
        </span>
      </motion.div>

      {/* Right: wordmark, pillars, mission copy, CTA */}
      <div className="relative flex flex-1 flex-col items-start justify-center px-8 pr-[8%] text-left lg:px-12">
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
