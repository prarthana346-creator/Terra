import React from 'react';
import { 
  Orbit, 
  Flame, 
  Compass, 
  Cpu, 
  Sparkles, 
  ChevronRight, 
  Globe2, 
  Mountain, 
  Layers, 
  BarChart2, 
  ShieldAlert,
  MapPin
} from 'lucide-react';

export default function Dashboard({ 
  locations = [], 
  onSelectLocation, 
  onNavigate 
}) {
  const totalAnalyzed = locations.length;
  
  // Sort for top rankings
  const topLunar = [...locations].sort((a, b) => b.lunar_similarity_score - a.lunar_similarity_score);
  const topMars = [...locations].sort((a, b) => b.mars_similarity_score - a.mars_similarity_score);

  const highestLunar = topLunar[0]?.lunar_similarity_score || 0;
  const highestMars = topMars[0]?.mars_similarity_score || 0;

  // Discovered count
  const discoveredCount = locations.filter(l => l.category === "Discovered Analog").length;
  const referenceCount = locations.filter(l => l.category === "Reference Location").length;

  // Category counts
  const lavaTubeCount = locations.filter(l => l.special_features?.lava_tubes).length;
  const polarCount = locations.filter(l => l.special_features?.polar_region).length;
  const highAltCount = locations.filter(l => l.special_features?.high_altitude_desert).length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Orbit className="w-3.5 h-3.5" />
            <span>Mission Control Telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Planetary Analog Discovery Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time geospatial analytics across NASA orbital baseline targets and Earth environmental twins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('explorer')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Open Interactive Map
          </button>
          <button
            onClick={() => onNavigate('ai-analysis')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            Tune MCDA Weights
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800/80 shadow-md">
          <span className="text-xs font-mono text-slate-400 uppercase">Total Analyzed</span>
          <div className="text-3xl font-extrabold text-white mt-1">{totalAnalyzed}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Ref: {referenceCount}</span>
            <span className="text-cyan-400 font-medium">Discovered: {discoveredCount}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-cyan-500/30 shadow-md shadow-cyan-500/5">
          <span className="text-xs font-mono text-cyan-400 uppercase">Highest Lunar Score</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">{highestLunar}%</div>
          <div className="text-[11px] text-slate-300 truncate mt-1">
            {topLunar[0]?.name || 'N/A'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-rose-500/30 shadow-md shadow-rose-500/5">
          <span className="text-xs font-mono text-rose-400 uppercase">Highest Mars Score</span>
          <div className="text-3xl font-extrabold text-rose-400 mt-1">{highestMars}%</div>
          <div className="text-[11px] text-slate-300 truncate mt-1">
            {topMars[0]?.name || 'N/A'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800/80 shadow-md">
          <span className="text-xs font-mono text-purple-400 uppercase">Lava Tube Shelters</span>
          <div className="text-3xl font-extrabold text-white mt-1">{lavaTubeCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hawaii, Craters, Undara, Askja
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800/80 shadow-md">
          <span className="text-xs font-mono text-emerald-400 uppercase">Polar Cryo-Regolith</span>
          <div className="text-3xl font-extrabold text-white mt-1">{polarCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Antarctica, Haughton, Svalbard
          </div>
        </div>

      </div>

      {/* Top 5 Lunar vs Top 5 Mars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Lunar Analogs */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400">
                <Orbit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Top 5 Permanent Lunar Base Analogs</h3>
                <p className="text-xs text-slate-400">Ranked by regolith, crater terrain & basaltic flow fidelity</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              NASA LRO LOLA Target
            </span>
          </div>

          <div className="space-y-3">
            {topLunar.slice(0, 5).map((loc, idx) => (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc.id)}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-xs font-mono font-bold flex items-center justify-center text-cyan-400">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                        {loc.name}
                      </span>
                      {loc.category === "Discovered Analog" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          AI Discovered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {loc.country} • {loc.terrain_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-cyan-400">
                      {loc.lunar_similarity_score}%
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {loc.lunar_classification}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mars Analogs */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-950 flex items-center justify-center text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Top 5 Mars Settlement Analogs</h3>
                <p className="text-xs text-slate-400">Ranked by hyper-aridity, sulfate/iron mineralogy & ground ice</p>
              </div>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
              NASA MRO CRISM Target
            </span>
          </div>

          <div className="space-y-3">
            {topMars.slice(0, 5).map((loc, idx) => (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc.id)}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-rose-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-xs font-mono font-bold flex items-center justify-center text-rose-400">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-rose-300 transition">
                        {loc.name}
                      </span>
                      {loc.category === "Discovered Analog" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          AI Discovered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {loc.country} • {loc.terrain_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-rose-400">
                      {loc.mars_similarity_score}%
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {loc.mars_classification}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scientific Distinction Notice */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300">Scientific Distinction Notice:</strong> Earth environments cannot replicate 
          the Moon's hard vacuum exosphere, lunar 0.166g / Martian 0.38g gravity, or Mars's 95.3% CO2 low-pressure atmosphere. 
          TerraSpace AI models rigorously separate direct environmental similarities, mineralogical chemistry, terrain ruggedness, 
          and mission operational testing analogies. Scores signify scientific analog fidelity, not safety certification.
        </p>
      </div>

    </div>
  );
}

