// SovereignTree.org — site content. Copy pulled from the live sovereigntree.org
// site (home + contact-us pages) per the rebrand brief, plus origin-story and
// tour context provided directly by Trev. A few fields are explicitly flagged
// below where a value is a placeholder pending real content.

// Top-level site navigation — multi-page routes, NOT scroll-anchor targets.
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Our Vision", to: "/our-vision" },
  { label: "About", to: "/about" },
  { label: "Music", to: "/music" },
  { label: "Tour", to: "/tour" },
  { label: "Community", to: "/community" },
  { label: "Contact", to: "/contact" },
];

export const SITE_TAGLINE = "We Are the Ones We've Been Waiting For";

// The "We Are.." pillars from the live site's hero — used on Home and Our Vision.
export const WE_ARE_PILLARS = ["Regenerative Community", "Luxury Retreat Center", "School of Sovereignty"];

// Mission/vision copy, lightly cleaned (stray non-breaking spaces removed)
// but otherwise verbatim from sovereigntree.org's homepage.
export const MISSION_PARAGRAPHS = [
  "We are building a sanctuary for the visionaries & bridge builders of THE NEW EARTH — the ones who are crazy enough to think they can change the world, & devoted enough to actually do it.",
  "Our mission is to be living examples of stewardship, sacred reciprocity & sovereign living. The New Earth is rooted in abundance… and abundance begins with sovereignty. Unlearning the systems that taught us to outsource our power — & remembering the truth that WE are the Ones We've Been Waiting For.",
  "In a time of so much noise & division, we hold 'DA VISION' of unity. We're not here to burn down Babylon — we're here to chant up Zion!",
  "Thank YOU for helping birth this New Earth, friend. The time is Now. What are you waiting for?",
];

// Shorter Hero-section excerpt (Home page overlay) — first mission paragraph only.
export const HERO_BIO = MISSION_PARAGRAPHS[0];
export const HERO_BIO_MOBILE =
  "We are building a sanctuary for the visionaries & bridge builders of THE NEW EARTH — the ones crazy enough to think they can change the world, & devoted enough to do it.";

// Origin story — About page. Verbatim from sovereigntree.org/about, lightly
// cleaned of stray characters, told from Trev's voice as it reads on the
// live site.
export const ORIGIN_STORY = [
  "The way we met basically explains everything.",
  "We were both on the road, living our purpose and touring with our music medicine.",
  "We happened to cross paths at Fairy Falls in Mt. Shasta (duh), introduced by our mutual mushroom-hat-wearing rapper friend and his girl who goes by Fae and wears fairy wings. Yes, that part is 100% true.",
  "I went to her show in Ashland the next night, and the first synchronicity hit: we both had a song called “The Ones.” Same title, same message — “We are the ones we've been waiting for.”",
  "Later, when we reconnected in Sedona, things got even weirder (in a good way). We both realized we had the same exact vision of a retreat center/community for artists + awakening humans.",
  "She dreamed of SovereignTree, and I was literally building pitch decks for Artist Tree. At that point the universe wasn't even being low key. Really early on we both knew that we were meant to do and build amazing things together.",
  "What I love most about my partnership with Sierra is that from day one, our foundation has been Spirit, mission, friendship, and sovereignty — not chaos, confusion, or codependency. We knew the only real way forward was to stay rooted in the mission.",
  "Now we're here, sharing our music, message and New Earth vision with you.",
  "If you've read this far, you're probably part of the story too.",
  "Come hang with us at a New Earth Council or a show soon! Or if you want to build with us or show your support, our Skool community is the best place to do that. Let's build, fam. We love you!!",
];

export const HERO_TAGLINE = SITE_TAGLINE;
export const HERO_CTA = { label: "Our Vision", to: "/our-vision" };

// SovereignTree's own social presence — used site-wide (Footer, Contact,
// Community, Tour).
export const SOCIALS = [{ label: "Instagram", href: "https://www.instagram.com/thesovereigntree/" }];

// Sierra & Trev's personal music socials — Music page only, since that page
// is about their music careers specifically, not the SovereignTree org.
export const MUSIC_SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/sierramarinmusic/" },
  { label: "Facebook", href: "https://www.facebook.com/sierra.rigney" },
  { label: "TikTok", href: "https://www.tiktok.com/@sierra_marin" },
];

// Real pitch deck (Google Drive) — the live site's "Take Action Now" CTA.
// Featured on the new Our Vision page instead of embedded mid-scroll on Home.
export const PITCH_DECK_URL = "https://drive.google.com/file/d/1U_T1Nu940ZaUYr6ZF1Tv8pCIoaBHrnCI/view?usp=drivesdk";

// Skool community — real link live on sovereigntree.org today. Trev flagged
// this will be swapped for a different community link soon (image + new URL
// to follow) — treat as pending, easy one-line swap when it lands.
export const SKOOL_COMMUNITY_URL = "https://www.skool.com/sovereigntree-3553/about?ref=acdecc8ef7914566b468b440cbd0592b";

export const SITE_CONTACT = {
  email: "sovereigntreemovement@gmail.com",
};

// Umbrella framing for the Tour page — SovereignTree's offerings at
// festivals go beyond music sets.
export const TOUR_UMBRELLA = "Prayerformances · New Earth Councils · Men's & Women's Groups";
export const TOUR_INTRO_LINE_1 = "Bringing the music and the medicine to festivals and communities";
export const TOUR_INTRO_LINE_2 = "across the country — together.";

// Joint Trev & Sierra tour dates (was Sierra-only) — same schedule, now
// framed as both of them per Trev's direction.
export const TOUR_DATES = [
  { date: "7/16", event: "Earth Vibe Fest", location: "Viroqua, Wisconsin" },
  { date: "7/24", event: "Day Retreat/Ceremony w/ Trev & Sierra", location: "Fernville, Michigan" },
  { date: "7/25", event: "Concert w/ Trev & Sierra", location: "Fernville, Michigan" },
  { date: "7/30", event: "OM Fest", location: "Arlington, Vermont" },
  { date: "8/7", event: "Frequency Flow Fest", location: "Mazeppa, Minnesota" },
  { date: "8/15", event: "Celebrate Life Together", location: "Springfield, Iowa" },
  { date: "8/28", event: "Gardenfest", location: "New Hampshire" },
  { date: "9/6", event: "Shangri-la Festival", location: "Geneva, Minnesota" },
  { date: "9/11", event: "Vibe High Festival", location: "Broadhead, Wisconsin" },
  { date: "9/18", event: "Convergence Wellness", location: "French Village, Missouri" },
];

export const TOUR_TICKETS_URL = "https://www.bandsintown.com/a/15553914-sierra-marin";

// --- Music page (kept — Sierra & Trev's actual music, reskinned only) ---

export const MUSIC_SUBTITLE =
  "Music is one of the ways we carry the medicine — ceremonies, prayerformances, and songs that call in ecstatic states of joy and sovereignty, weaving a sonic blueprint for the New Earth community now emerging.";

export const SPOTIFY_ARTIST_URL = "https://open.spotify.com/artist/62gdD5Q6ICJZjjnhjqKq55";

export const MUSIC_PLATFORM_LINKS = [
  { label: "Spotify", href: "https://open.spotify.com/artist/62gdD5Q6ICJZjjnhjqKq55" },
  { label: "Apple Music", href: "https://music.apple.com/us/artist/sierra-marin/1419712945" },
  { label: "YouTube Music", href: "https://music.youtube.com/channel/UCi-jgfigV-3O2RWjDicwgNA" },
  { label: "YouTube", href: "https://www.youtube.com/@sierramarin" },
];

export const MUSIC_LIVE_SESSION_YOUTUBE_ID = "FB7BC-PS3BI";

export const STREAMING_LINKS = [
  { label: "Spotify", href: "https://open.spotify.com/album/49B6Q5OtvWY6qi4d0zM40g" },
  { label: "Apple Music", href: "https://music.apple.com/us/album/this-is-me/6778661527" },
  {
    label: "YouTube Music",
    href: "https://music.youtube.com/playlist?list=OLAK5uy_myAMXs4T-gobMLWo73dm22UGbdRZJYr3M",
  },
];

export const DIRECT_PURCHASE_URL = "https://music.apple.com/us/album/this-is-me/6778661527";

export const GOFUNDME_URL = "https://www.gofundme.com/f/help-bring-my-debut-album-this-is-me-to-life";

// Tracking pixel (Meta Pixel / Google Analytics) — credentials pending.
export const TRACKING_PIXEL_IDS = {
  metaPixelId: null,
  googleAnalyticsId: null,
};
