import React from "react";
import { ArrowRight, Github, Terminal } from "lucide-react";
import { CONFIG } from "../config/site";
import { Button } from "./ui/Button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm mb-8">
          Hackathon Submission 2024
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          {CONFIG.tagline}
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          {CONFIG.description}
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button icon={ArrowRight}>View Demo</Button>
          <Button variant="outline" icon={Github}>
            Source Code
          </Button>
        </div>
      </div>
    </section>
  );
};
