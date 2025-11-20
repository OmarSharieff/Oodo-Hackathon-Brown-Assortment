import React from 'react';
import { Code, Menu, X } from 'lucide-react';
import { config } from '../../config'; // Note the relative path

export const Navbar = ({ setView, isScrolled, mobileMenuOpen, setMobileMenuOpen, currentView }) => {
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || mobileMenuOpen ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-indigo-200 shadow-lg">
              <Code className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">{config.appName}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#team" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Team</a>
            <button 
              onClick={() => setView('app')}
              className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200"
            >
              {currentView === 'landing' ? 'Launch App' : 'Back to Home'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 absolute w-full px-4 py-4 flex flex-col space-y-4 shadow-xl">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium">Features</a>
          <a href="#team" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium">Team</a>
          <button 
            onClick={() => { setView('app'); setMobileMenuOpen(false); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Launch App
          </button>
        </div>
      )}
    </nav>
  );
};