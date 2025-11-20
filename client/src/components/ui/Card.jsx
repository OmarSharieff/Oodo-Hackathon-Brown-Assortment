import React from "react";

export const Card = ({ children, className = "" }) => (
  <div
    className={`p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-violet-500/50 transition-colors duration-300 ${className}`}
  >
    {children}
  </div>
);
