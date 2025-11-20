import React from "react";

export const SectionHeading = ({ children, align = "center" }) => (
  <h2
    className={`text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 text-${align}`}
  >
    {children}
  </h2>
);
