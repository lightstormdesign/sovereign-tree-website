import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS, SOCIALS } from "@/data/site";

export const Footer = () => {
  const location = useLocation();
  return (
    <footer data-testid="site-footer" className="relative border-t border-black/10 bg-[var(--st-black-3)]/70 py-12 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-6 lg:px-8">
        <img src="/sovereigntree-logo.png" alt="SovereignTree" className="h-14 w-auto object-contain" />

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`font-accent text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                location.pathname === l.to
                  ? "text-[var(--st-gold)] hover:text-[var(--st-text)]"
                  : "text-[var(--st-text-soft)] hover:text-[var(--st-gold)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`footer-social-${s.label.toLowerCase()}`}
              className="font-accent text-[0.65rem] uppercase tracking-[0.2em] text-[var(--st-text-soft)] transition-colors hover:text-[var(--st-gold)]"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <p className="font-body text-xs font-light text-[var(--st-text-muted)]">
          © {new Date().getFullYear()} SovereignTree LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
