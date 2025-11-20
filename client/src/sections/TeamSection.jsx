import React from "react";
import { CONFIG } from "../config/site";

export const TeamSection = () => {
  return (
    <section id="team" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-sm font-bold text-violet-400 uppercase mb-8">The Builders</h3>

        <div className="flex flex-wrap justify-center gap-8">
          {CONFIG.team.map((member, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-violet-500/50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">{member.name}</div>
                <div className="text-xs text-slate-400">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
