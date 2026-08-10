import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import OurVision from "@/pages/OurVision";
import NewEarthCouncil from "@/pages/NewEarthCouncil";
import Contact from "@/pages/Contact";
import Music from "@/pages/Music";
import Tour from "@/pages/Tour";
import Community from "@/pages/Community";
import { TrackingPixel } from "@/components/site/TrackingPixel";
import { PitchDeckBubble } from "@/components/site/PitchDeckBubble";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App">
      {/* PUBLIC_URL is "" in dev and the repo subpath ("/sovereign-tree-website")
          in production builds (from package.json's "homepage") — GitHub
          Pages serves this as a project site, not from the domain root. */}
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <TrackingPixel />
        <PitchDeckBubble />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-vision" element={<OurVision />} />
          <Route path="/new-earth-council" element={<NewEarthCouncil />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/music" element={<Music />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
