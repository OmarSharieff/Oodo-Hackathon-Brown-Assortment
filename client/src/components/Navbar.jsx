import React, { useState, useEffect } from "react";
import { Rocket, Menu, X } from "lucide-react";
import { CONFIG } from "../config/site";
import { Button } from "./ui/Button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${CONFIG.theme.primary}`}>
            <Rocket size={20} className="text-white" />
          </div>
          {CONFIG.appName}
        </div>

        <div className="hidden md:flex items-center gap-8">
          {CONFIG.navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-slate-400 hover:text-white">
              {item.name}
            </a>
          ))}
          <Button className="!px-5 !py-2 text-sm">Get Started</Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-4">
          {CONFIG.navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white py-2"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
