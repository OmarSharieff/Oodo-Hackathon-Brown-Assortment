import React from 'react';
import { Layout, Zap, Settings, LogOut, User, Code } from 'lucide-react';
import { config } from '../config';

export default function Dashboard({ setView }) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
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
                  Edit the <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 text-sm">Dashboard.jsx</code> file 
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
}
