import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SignupForm } from "@/components/site/SignupForm";
import { NEC_HEADLINE, NEC_SUBHEAD, NEC_PARAGRAPHS } from "@/data/site";

// Dedicated join page — the site's primary conversion goal. Same phone/email
// capture as the Home page's embedded form, with more context up top about
// what a New Earth Council actually is.
export default function NewEarthCouncil() {
  return (
    <div className="relative min-h-screen bg-[var(--st-black)]">
      <div
        className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, var(--st-brown-deep), var(--st-black) 70%)" }}
      >
        <div className="grain absolute inset-0" />
      </div>
      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-40 text-center">
        <Reveal>
          <span className="overline">Join Us</span>
          <h1 className="font-display mt-5 text-4xl font-normal text-[var(--st-text)] sm:text-5xl">
            {NEC_HEADLINE}
          </h1>
          <p className="font-body mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-[var(--st-text-soft)]">
            {NEC_SUBHEAD}
          </p>
        </Reveal>

        <div className="mt-10 space-y-5 text-left">
          {NEC_PARAGRAPHS.map((para, i) => (
            <Reveal key={i} delay={Math.min(i * 0.1, 0.2)}>
              <p className="font-accent text-lg font-normal leading-relaxed text-[var(--st-text-soft)] sm:text-xl">
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <div className="mt-14">
            <SignupForm />
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
