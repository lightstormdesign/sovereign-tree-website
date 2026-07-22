import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { NAV_LINKS } from "@/data/site";
import { useIsMobile } from "@/hooks/useIsMobile";

const NavLink = ({ to, label, active, testId, mobile }) => (
  <Link
    to={to}
    data-testid={testId}
    onClick={mobile ? mobile.onClick : undefined}
    className={
      mobile
        ? `border-b border-black/5 py-3 text-left font-accent text-sm uppercase tracking-[0.16em] ${
            active ? "text-[var(--st-gold)]" : "text-[var(--st-text)]/80"
          }`
        : `font-accent text-[0.65rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
            active ? "text-[var(--st-gold)]" : "text-[var(--st-text)]/70 hover:text-[var(--st-gold)]"
          }`
    }
  >
    {label}
  </Link>
);

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMobile = useIsMobile();
  // Portal/Hero (the Home page, mobile only) gets a transparent header with
  // no wordmark, same as Sierra's build — the animation's own emblem reads
  // as the "logo" during the portal phase.
  const isPortalHero = isMobile && isHome;

  return (
    // Fixed headers don't reserve document-flow space, so anything that
    // scrolls upward eventually passes underneath it. This header always
    // carries a solid backdrop (not just after a scroll threshold) so page
    // content is cleanly occluded rather than visually colliding with the
    // nav links as it scrolls past — a site-wide fix, not a per-page one.
    <header
      data-testid="site-navbar"
      className={
        isPortalHero
          ? "fixed inset-x-0 top-0 z-50"
          : isMobile
            ? "fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[var(--st-black)]"
            : "fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[var(--st-black)]/80 backdrop-blur-xl"
      }
    >
      <nav
        className={`relative mx-auto flex max-w-7xl items-center px-6 py-3 lg:px-8 ${
          isPortalHero ? "justify-end" : "justify-between"
        }`}
      >
        {!isPortalHero && (
          <Link to="/" data-testid="nav-link-wordmark" className="flex items-center gap-2">
            <img src="/sovereigntree-emblem.jpg" alt="" aria-hidden className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg uppercase tracking-[0.15em] text-[var(--st-gold)]">
              SovereignTree
            </span>
          </Link>
        )}
        {!isPortalHero && (
          <div className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.label} to={l.to} label={l.label} active={location.pathname === l.to} testId={`nav-link-${l.label.toLowerCase()}`} />
            ))}
          </div>
        )}
        <div className="md:hidden">
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className="text-[var(--st-gold)]"
            aria-label="Menu"
          >
            {open ? <X size={isPortalHero ? 25 : 22} /> : <Menu size={isPortalHero ? 25 : 22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div data-testid="nav-mobile-menu" className="border-t border-black/10 bg-[var(--st-black)]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-6 pb-4 pt-2">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                label={l.label}
                active={location.pathname === l.to}
                mobile={{ onClick: () => setOpen(false) }}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
