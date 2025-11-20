import React, { useState, useEffect } from "react";
import { CONFIG } from "./config/site";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { InteractiveDemo } from "./components/InteractiveDemo";
import { TeamSection } from "./sections/TeamSection";
import { Footer } from "./components/Footer";

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`min-h-screen ${CONFIG.theme.bg} ${CONFIG.theme.text}`}>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.07), transparent 80%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Features />
        <InteractiveDemo />
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
