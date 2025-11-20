import './index.css';
import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Zap, 
  Shield, 
  Menu, 
  X, 
  ChevronRight, 
  Github, 
  Twitter, 
  Layout,
  Settings,
  User,
  LogOut,
  Code
} from 'lucide-react';

/* =============================================================
  🚀 HACKATHON CONFIGURATION
  Change these values to instantly customize the text/theme
  =============================================================
*/
const config = {
  appName: "Nexus",
  tagline: "Build the future, one hack at a time.",
  description: "An elegant, high-performance template designed to help you ship your hackathon project faster. Focus on the logic, we handled the UI.",
  primaryAction: "Launch Demo",
  secondaryAction: "View Source",
  features: [
    {
      title: "Instant Deploy",
      desc: "Push your code and see it live instantly with our pipeline.",
      icon: <Rocket className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Real-time Data",
      desc: "Built-in websocket support for live updates and interaction.",
      icon: <Zap className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Secure Core",
      desc: "Enterprise-grade encryption standard out of the box.",
      icon: <Shield className="w-6 h-6 text-indigo-500" />
    }
  ],
  team: [
    { name: "Alex Dev", role: "Full Stack" },
    { name: "Sam Design", role: "UI/UX" },
    { name: "Jordan Ops", role: "Backend" }
  ]
};

/* =============================================================
   MAIN APP COMPONENT
   ============================================================= */
export default function App() {
  // State to toggle between the Landing Page and the Actual App Dashboard
  const [view, setView] = useState('landing'); // 'landing' or 'app'
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effects for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Navigation Bar ---
  const Navbar = () => (
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
              {view === 'landing' ? 'Launch App' : 'Back to Home'}
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

  /* =============================================================
     VIEW 1: LANDING PAGE
     ============================================================= */
  const LandingPage = () => (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />

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
          {/* Faux browser header */}
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

  /* =============================================================
     VIEW 2: APP DASHBOARD (The Hackathon Project Shell)
     ============================================================= */
  const AppDashboard = () => (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <nav>This is a giberrish navbar dude</nav>
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="font-bold text-white text-lg">{config.appName}</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-3 cursor-pointer">
            <Layout size={18} /> Dashboard
          </div>
          <div className="px-4 py-2 hover:bg-slate-800 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
            <Zap size={18} /> Analysis
          </div>
          <div className="px-4 py-2 hover:bg-slate-800 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
            <Settings size={18} /> Settings
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setView('landing')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} /> Back to Landing
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* App Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <div className="md:hidden font-bold text-slate-900">{config.appName}</div>
          <div className="flex-1 px-4">
            {/* Search bar or breadcrumbs could go here */}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <span className="sr-only">Notifications</span>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute ml-3 mb-3"></div>
              <Zap size={20} />
            </button>
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Dashboard Content - THIS IS WHERE YOUR HACK GOES */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500">Welcome back, here's what's happening.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-1">Total Users</div>
                <div className="text-3xl font-bold text-slate-900">1,234</div>
                <div className="text-emerald-500 text-sm mt-2 flex items-center gap-1">
                  +12% <span className="text-slate-400">from last week</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-1">API Latency</div>
                <div className="text-3xl font-bold text-slate-900">42ms</div>
                <div className="text-emerald-500 text-sm mt-2 flex items-center gap-1">
                  -8ms <span className="text-slate-400">improvement</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-1">System Status</div>
                <div className="text-3xl font-bold text-slate-900">Online</div>
                <div className="text-indigo-500 text-sm mt-2 flex items-center gap-1">
                  All systems operational
                </div>
              </div>
            </div>

            {/* Main Interactive Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Your App Logic Goes Here</h3>
                <p className="text-slate-500 mb-6">
                  Edit the <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 text-sm">AppDashboard</code> component 
                  to insert your form, map, or data visualization.
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Run Action
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );

  // Main Render Logic
  return (
    <>
      {view === 'landing' ? <LandingPage /> : <AppDashboard />}
    </>
  );
}