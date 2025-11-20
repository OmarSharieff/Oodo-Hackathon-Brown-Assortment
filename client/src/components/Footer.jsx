import React from "react";
import { Rocket, Github, Twitter } from "lucide-react";
import { CONFIG } from "../config/site";

export const Footer = () => (
  <footer className="py-12 border-t border-slate-800 bg-slate-950">
    <div className="container mx-auto px-6 text-center">
      <div className="flex justify-center items-center gap-2 font-bold text-xl mb-6 text-white">
        <Rocket size={20} className="text-violet-500" />
        {CONFIG.appName}
      </div>

      <p className="text-slate-500 text-sm mb-6">
        Built with ❤️ by {CONFIG.team.map((t) => t.name).join(", ")}
      </p>

      <div className="flex justify-center gap-6 text-slate-400">
        <Github size={20} className="hover:text-white cursor-pointer" />
        <Twitter size={20} className="hover:text-white cursor-pointer" />
      </div>
    </div>
  </footer>
);
