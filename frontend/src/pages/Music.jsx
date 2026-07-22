import { useEffect, useRef, useState } from "react";
import { Apple, PlayCircle, Youtube, Music2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { AlbumExperience } from "@/components/site/AlbumExperience";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MUSIC_SOCIALS, MUSIC_SUBTITLE, SPOTIFY_ARTIST_URL, MUSIC_PLATFORM_LINKS, MUSIC_LIVE_SESSION_YOUTUBE_ID } from "@/data/site";

// Spotify's official embed (iframe) pulls discography directly from her
// artist profile at full quality and stays current automatically as she
// releases new music — no separate cover-art sourcing needed for this page.
const spotifyEmbedSrc = (artistUrl) => {
  const match = artistUrl?.match(/artist\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/embed/artist/${match[1]}?theme=0` : null;
};

const PLATFORM_ICONS = {
  Spotify: Music2,
  "Apple Music": Apple,
  "YouTube Music": PlayCircle,
  YouTube: Youtube,
};

// Kept — this is where Trev and Sierra's music lives behind the org, per
// Trev's direction. Reskinned to SovereignTree's light/green brand only;
// the music content itself (tracks, videos) is untouched.
export default function Music() {
  const embedSrc = spotifyEmbedSrc(SPOTIFY_ARTIST_URL);
  const [vlogFailed, setVlogFailed] = useState(false);
  const isMobile = useIsMobile();

  // Spotify embed sizing: top edge lines up with the "Music Videos" title
  // on the right, bottom edge lines up with the bottom of the Live Sessions
  // video — measured directly rather than guessed, since both depend on
  // rendered widths/heights that shift across breakpoints. Desktop only.
  const topTracksLabelRef = useRef(null);
  const musicVideosTitleRef = useRef(null);
  const liveSessionWrapperRef = useRef(null);
  const [embedBox, setEmbedBox] = useState(null);

  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      if (!topTracksLabelRef.current || !musicVideosTitleRef.current || !liveSessionWrapperRef.current) return;
      const labelBottom = topTracksLabelRef.current.getBoundingClientRect().bottom;
      const titleTop = musicVideosTitleRef.current.getBoundingClientRect().top;
      const liveBottom = liveSessionWrapperRef.current.getBoundingClientRect().bottom;
      setEmbedBox({ marginTop: titleTop - labelBottom, height: liveBottom - titleTop });
    };
    measure();
    const timers = [setTimeout(measure, 500), setTimeout(measure, 1500)];
    window.addEventListener("resize", measure);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  return (
    <div className="starfield relative min-h-screen">
      {/* Ambient tint cycles slowly through the site's muted palette. */}
      <div className="ambient-tint-cycle fixed inset-0 z-0" style={{ animationDelay: "-4s" }} />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-40 text-center">
        <Reveal>
          <span className="overline">Music</span>
          <h1 className="font-display mt-5 text-5xl font-normal text-[var(--st-text)] sm:text-6xl">Music Medicine</h1>
          <p className="font-body mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-[var(--st-text-soft)]">
            {MUSIC_SUBTITLE}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {MUSIC_PLATFORM_LINKS.map((l) => {
              const Icon = PLATFORM_ICONS[l.label] || Music2;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`music-platform-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 font-accent text-xs uppercase tracking-[0.15em] text-[var(--st-text)]/80 transition-all duration-300 hover:border-[var(--st-gold)]/60 hover:text-[var(--st-gold)]"
                >
                  <Icon size={14} /> {l.label}
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 grid grid-cols-1 gap-12 text-left lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-black/10">
            <div className="flex h-full flex-col lg:pr-10">
              <span ref={topTracksLabelRef} className="overline">
                Top Tracks
              </span>
              {embedSrc ? (
                <iframe
                  data-testid="spotify-embed"
                  title="Music on Spotify"
                  src={embedSrc}
                  width="100%"
                  height={isMobile ? 380 : embedBox ? embedBox.height : 330}
                  style={{ borderRadius: "12px", marginTop: isMobile ? "1.5rem" : embedBox ? embedBox.marginTop : "4.5rem" }}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              ) : (
                <div
                  data-testid="spotify-embed-placeholder"
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--st-gold)]/30 px-6 py-16"
                  style={{
                    height: isMobile ? 380 : embedBox ? embedBox.height : 330,
                    marginTop: isMobile ? "1.5rem" : embedBox ? embedBox.marginTop : "4.5rem",
                  }}
                >
                  <span className="font-body text-sm text-[var(--st-text-muted)]">
                    Spotify artist profile pending — connect it here once confirmed.
                  </span>
                </div>
              )}

              <div className="mt-8 flex flex-1 flex-col items-center justify-center rounded-xl border border-[var(--st-gold)]/25 px-4 py-6 text-center">
                <AlbumExperience scale={0.4} compact mobile={isMobile} />
              </div>
            </div>

            <div className="lg:pl-10">
              <span className="overline" style={{ color: "var(--st-turquoise)" }}>
                Music Videos
              </span>

              <div className="mt-5">
                <h3 ref={musicVideosTitleRef} className="font-display text-lg text-[var(--st-text)]">
                  Music Videos
                </h3>
                <div className="relative mt-3 overflow-hidden rounded-xl border border-black/10">
                  <video
                    data-testid="music-video-teaser"
                    className="aspect-video w-full bg-black object-cover"
                    src="/sierra-music-video-teaser.mp4"
                    poster="/sierra-music-video-teaser_poster.jpg"
                    controls
                    playsInline
                    preload="metadata"
                  />
                  <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm">
                    <span className="font-accent text-xs italic text-white/90">"Only Thing"</span>
                  </div>
                </div>
              </div>

              {/* Live Sessions — real performance, not gated, embedded
                  directly via YouTube. */}
              <div className="mt-12">
                <h3 className="font-display text-lg text-[var(--st-text)]">Live Sessions</h3>
                <p className="font-body mt-1 text-xs font-light italic text-[var(--st-text-muted)]">"Divine Feminine Rise" - Live</p>
                <div ref={liveSessionWrapperRef} className="mt-3 overflow-hidden rounded-xl border border-black/10">
                  <iframe
                    data-testid="music-live-session-embed"
                    className="aspect-video w-full"
                    src={`https://www.youtube.com/embed/${MUSIC_LIVE_SESSION_YOUTUBE_ID}`}
                    title="Divine Feminine Rise (Live)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Moments from the Road — self-hosted vlog. */}
              <div className="mt-12">
                <h3 className="font-display text-lg text-[var(--st-text)]">Moments from the Road</h3>
                <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
                  {vlogFailed ? (
                    <div
                      data-testid="music-vlog-placeholder"
                      className="flex aspect-video flex-col items-center justify-center gap-2 bg-[var(--st-black-2)]"
                    >
                      <span className="font-accent text-[0.6rem] uppercase tracking-[0.15em] text-[var(--st-text-muted)]">
                        Moments from the Road
                      </span>
                      <span className="font-body text-xs text-[var(--st-text-muted)]">Vlog video pending upload</span>
                    </div>
                  ) : (
                    <video
                      data-testid="music-vlog-video"
                      className="aspect-video w-full bg-black object-cover"
                      src="/sierra-music-moments-vlog.mp4"
                      poster="/sierra-music-moments-vlog_poster.jpg"
                      controls
                      playsInline
                      preload="metadata"
                      onError={() => setVlogFailed(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-20 flex items-center justify-center gap-7">
            {MUSIC_SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-accent text-xs uppercase tracking-[0.2em] text-[var(--st-text-soft)] transition-colors hover:text-[var(--st-gold)]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
