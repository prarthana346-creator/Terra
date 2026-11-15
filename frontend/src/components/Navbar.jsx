import React from 'react';
import { 
  Globe2, 
  Orbit, 
  Compass, 
  Cpu, 
  Layers, 
  FileText, 
  Database, 
  Sparkles,
  Server,
  Activity
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  systemStatus, 
  onOpenRecommend, 
  onOpenDatasets 
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Globe2 },
    { id: 'dashboard', label: 'Dashboard', icon: Orbit },
    { id: 'explorer', label: 'Analog Explorer', icon: Compass },
    { id: 'ai-analysis', label: 'AI Analysis & MCDA', icon: Cpu },
    { id: 'details', label: 'Location Details', icon: Layers },
    { id: 'compare', label: 'Comparison', icon: Activity },
    { id: 'reports', label: 'Research Reports', icon: FileText },
  ];

  const dbConnected = systemStatus?.database?.mongodb_connected;

  return (
    <header className="sticky top-0 z-50 bg-[#070b16]/95 backdrop-blur border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
            <div className="w-full h-full bg-[#090e1d] rounded-xl flex items-center justify-center">
              <Orbit className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-400">
                TERRASPACE<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                Planetary Analogs
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight">
              Moon & Mars Terrestrial Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & System Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Recommender Action */}
          <button
            onClick={onOpenRecommend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 hover:from-cyan-500 hover:to-indigo-500 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Recommender</span>
          </button>

          {/* Datasets Catalog Modal Trigger */}
          <button
            onClick={onOpenDatasets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">NASA Data</span>
          </button>

          {/* Live Backend / Mongo Status */}
          <div 
            title={`Database: ${systemStatus?.database?.mode || 'Checking...'}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${dbConnected ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            <span className="hidden lg:inline">{dbConnected ? 'MongoDB Live' : 'DocStore Live'}</span>
          </div>

        </div>
      </div>

      {/* Mobile / Compact Navigation Bar */}
      <div className="xl:hidden flex items-center justify-start gap-1 overflow-x-auto py-2 mt-2 border-t border-slate-800/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] whitespace-nowrap font-medium transition ${
                active 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

