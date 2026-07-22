import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_CTA, HERO_TAGLINE, HERO_BIO, HERO_BIO_MOBILE } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1];
const fade = (delay) => ({
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, delay, ease: EASE } },
});
const wipeV = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  show: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 1.0, delay: 0.25, ease: EASE } },
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
  const taglineRef = useRef(null);
  const [bioWidth, setBioWidth] = useState(null);

  useEffect(() => {
    if (active) setShown(true);
  }, [active]);

  // Bio paragraph must be ~5% narrower than the tagline's own rendered
  // width (which is font-driven, not fixed) — measure the tagline directly
  // rather than guessing a fixed rem value.
  useEffect(() => {
    const measure = () => {
      if (taglineRef.current) setBioWidth(taglineRef.current.offsetWidth);
    };
    measure();
    const t = setTimeout(measure, 950);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const ctl = shown ? "show" : "hidden";

  return (
    <motion.div
      initial="hidden"
      animate={ctl}
      className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center"
      style={{ transform: mobile ? "none" : "translateY(-5%)" }}
    >
      <motion.img
        variants={mobile ? wipeVMobile : wipeV}
        src="/sovereigntree-logo.png"
        alt="SovereignTree"
        data-testid="hero-logo"
        className="w-full object-contain"
        style={{ maxWidth: mobile ? "16rem" : "22rem" }}
      />

      <motion.div variants={mobile ? fadeMobile(0.55) : fade(0.55)} className="mt-8 flex flex-col items-center">
        <p
          ref={taglineRef}
          data-testid="hero-tagline"
          className={
            mobile
              ? "font-display text-metallic-grad text-[1.6rem] leading-tight"
              : "font-display text-metallic-grad whitespace-nowrap text-4xl leading-tight sm:text-5xl"
          }
        >
          {HERO_TAGLINE}
        </p>
        <p
          data-testid="hero-bio"
          className={
            mobile
              ? "font-body mt-6 text-[0.92rem] font-light leading-relaxed text-[var(--st-text-soft)]"
              : "font-body mt-6 text-sm font-light leading-relaxed text-[var(--st-text-soft)] sm:text-base"
          }
          style={mobile ? { maxWidth: "20.4rem" } : bioWidth ? { maxWidth: bioWidth * 0.95 } : undefined}
        >
          {mobile ? HERO_BIO_MOBILE : HERO_BIO}
        </p>
      </motion.div>

      <motion.div
        variants={mobile ? fadeMobile(0.8) : fade(0.8)}
        className={`flex flex-col items-center ${mobile ? "mt-6" : "mt-8"}`}
      >
        <img
          src="/sovereigntree-hero-founders.jpg"
          alt="Trev & Sierra, Co-Founders"
          data-testid="hero-founders-photo"
          className="rounded-full border-2 border-[var(--st-gold)]/50 object-cover shadow-[0_8px_30px_-8px_rgba(63,77,42,0.4)]"
          style={{ width: mobile ? "4.5rem" : "5.5rem", height: mobile ? "4.5rem" : "5.5rem" }}
        />
        <span className="font-accent mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--st-text-muted)]">
          Trev &amp; Sierra · Co-Founders
        </span>
      </motion.div>

      <motion.div variants={mobile ? fadeMobile(1.0) : fade(1.0)} className={mobile ? "mt-6" : "mt-7"}>
        <Link
          to={HERO_CTA.to}
          data-testid="hero-my-story-btn"
          className="animate-glow-pulse pointer-events-auto rounded-full border border-[var(--st-gold)]/40 bg-[var(--st-black)]/60 px-8 py-2.5 font-accent text-[0.7rem] uppercase tracking-[0.28em] text-[var(--st-gold)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--st-gold)] hover:text-[var(--st-text)]"
        >
          {HERO_CTA.label}
        </Link>
      </motion.div>
    </motion.div>
  );
};
