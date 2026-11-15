import React from 'react';
import { 
  Rocket, 
  Orbit, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Flame, 
  Snowflake, 
  Layers, 
  ArrowRight, 
  Sparkles,
  Database,
  Crosshair,
  BarChart3
} from 'lucide-react';

export default function LandingPage({ 
  onNavigate, 
  totalLocations = 24, 
  highestLunar = 84.5, 
  highestMars = 86.2,
  onSelectTarget
}) {
  return (
    <div className="relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-16 text-center relative z-10">
        
        {/* Top Mission Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-6 shadow-sm shadow-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Planetary Discovery & Settlement Analogs</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-tight">
          Discover Earth's Hidden <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400">
            Planetary Analog Worlds
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          Using AI and planetary intelligence to identify Earth's most suitable environments 
          for future Moon and Mars missions — analyzing NASA orbital telemetry, USGS geology, 
          and environmental extremes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => onNavigate('explorer')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Explore Earth Analogs
          </button>

          <button
            onClick={() => {
              onSelectTarget('lunar');
              onNavigate('explorer');
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-md transition cursor-pointer"
          >
            <Orbit className="w-4 h-4 text-cyan-400" />
            Discover Lunar Analogs
          </button>

          <button
            onClick={() => {
              onSelectTarget('mars');
              onNavigate('explorer');
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 hover:border-rose-400 shadow-md transition cursor-pointer"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            Discover Mars Analogs
          </button>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase">Analyzed Locations</span>
            <div className="text-3xl font-extrabold text-white mt-1">{totalLocations}</div>
            <span className="text-[11px] text-cyan-400 font-medium mt-1 inline-block">11 Reference + 13 AI Discovered</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase">Highest Lunar Score</span>
            <div className="text-3xl font-extrabold text-cyan-400 mt-1">{highestLunar}%</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">Basalt & Lava Tube fidelity</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase">Highest Mars Score</span>
            <div className="text-3xl font-extrabold text-rose-400 mt-1">{highestMars}%</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">Hyper-arid & Permafrost ice</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase">Scientific Datasets</span>
            <div className="text-3xl font-extrabold text-purple-400 mt-1">9+</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">NASA, ESA, USGS, Copernicus</span>
          </div>
        </div>

      </section>

      {/* 5 Core Mission Pillars */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 border-t border-slate-800/70">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            Mission Readiness Applications
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold text-white">
            Engineered for Space Settlement Programs
          </h3>
          <p className="text-slate-400 text-sm mt-3">
            TerraSpace AI bridges planetary orbital datasets (LRO, MRO, Curiosity) with Earth's 
            harshest and most geologically unique environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 hover:border-cyan-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4">
              <Orbit className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">1. Permanent Lunar Base</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluating basaltic maria analogues, permanently shadowed crater rims, and volcanic lava tube shelters.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 hover:border-rose-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">2. Mars Settlements</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Characterizing hyper-arid regolith, iron-oxide dunes, sulfate evaporites, and sub-surface glacial permafrost.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mb-4">
              <Rocket className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">3. Astronaut Training</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulating long-duration extravehicular activities (EVA) across rugged crater walls and remote volcanic terrain.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 hover:border-amber-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center mb-4">
              <Crosshair className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">4. Equipment & Rover Tests</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stress-testing autonomous mobility rovers, robotic drill rigs, and abrasive regolith seal durability.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 hover:border-emerald-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">5. Life Support & ISRU</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Testing closed-loop life support systems, in-situ water extraction from hydrated minerals, and regolith sintering.
            </p>
          </div>

        </div>
      </section>

      {/* AI Discovery Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-2">
              <Cpu className="w-4 h-4" />
              <span>Data-Driven Machine Learning Discovery</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Going Beyond Famous Reference Analogs
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              While traditional mission studies rely on a small handful of well-known deserts, 
              TerraSpace AI's Random Forest, K-Means, and PCA models dynamically discovered 13 additional 
              under-researched environments like Lonar Basalt Crater, Undara Lava Tubes, and Axel Heiberg Saline Diapirs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ai-analysis')}
            className="whitespace-nowrap px-6 py-3 rounded-xl font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>View AI Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}

