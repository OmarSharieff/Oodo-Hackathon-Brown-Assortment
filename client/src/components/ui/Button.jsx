import React from "react";
import { CONFIG } from "../../config/site";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseStyle =
    "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95";

  const variants = {
    primary: `bg-gradient-to-r ${CONFIG.theme.primary} text-white shadow-lg hover:shadow-violet-500/25`,
    outline:
      "border border-slate-700 hover:border-violet-500 text-slate-300 hover:text-white bg-transparent",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
};
