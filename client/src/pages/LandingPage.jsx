import React, { useState, useEffect } from 'react';
import { ChevronRight, Github, Twitter } from 'lucide-react';
import { config } from '../config/site.js';
import { Navbar } from '../components/layout/Navbar';

export default function LandingPage({ setView }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar 
        setView={setView} 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
        currentView="landing"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
          Live Demo Available
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-tight">
          Build something <span className="text-indigo-600">extraordinary</span> this weekend.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          {config.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setView('app')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {config.primaryAction} <ChevronRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
            <Github className="w-5 h-5" /> {config.secondaryAction}
          </button>
        </div>

        {/* Hero Visual / Image Placeholder */}
        <div className="mt-20 w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden aspect-video relative group">
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <p className="text-slate-400 font-medium">App Screenshot / Demo Video Placeholder</p>
          </div>
          <div className="absolute top-0 w-full h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why it works</h2>
            <p className="text-slate-500 mt-2">Engineered for speed and scalability.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.features.map((feature, idx) => (
              <div key={idx} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">Built by</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {config.team.map((member, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-white py-3 px-6 rounded-full shadow-sm border border-slate-100">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {member.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-100 text-center">
        <div className="flex justify-center space-x-6 mb-4 text-slate-400">
          <Github className="w-5 h-5 hover:text-slate-900 cursor-pointer" />
          <Twitter className="w-5 h-5 hover:text-indigo-500 cursor-pointer" />
        </div>
        <p className="text-slate-400 text-sm">© 2023 {config.appName}. Built for the Hackathon.</p>
      </footer>
    </div>
  );
}