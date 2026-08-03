import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CinematicExperience } from "@/components/site/CinematicExperience";
import { Reveal } from "@/components/site/Reveal";
import { SignupForm } from "@/components/site/SignupForm";

// Portal -> Hero fills the first screen (see CinematicExperience). Below
// that, the phone/email capture form is embedded directly on the page
// instead of an interruptive popup — same copy as the modal that's live on
// sovereigntree.org today, see SignupForm.jsx.
export default function Home() {
  return (
    <div data-testid="home-page" className="relative bg-[var(--st-black)]">
      <Navbar />
      <CinematicExperience />
      <section className="relative z-10 px-6 py-24">
        <Reveal>
          <SignupForm />
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
