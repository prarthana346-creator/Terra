import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Orbit, 
  Flame, 
  Rocket, 
  Mountain, 
  Droplet, 
  Crosshair, 
  ArrowRight,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { recommendLocations } from '../api';

const OBJECTIVES = [
  { id: 'Moon Base Analog', label: 'Permanent Lunar Base', icon: Orbit, color: 'text-cyan-400', desc: 'Focus on high basaltic regolith, lava tubes, and cratered topography' },
  { id: 'Mars Base Analog', label: 'Mars Settlement Analog', icon: Flame, color: 'text-rose-400', desc: 'Prioritizes hyper-aridity, sulfate/iron mineralogy, and ground ice indicators' },
  { id: 'Astronaut Training Location', label: 'Astronaut Training & EVA', icon: Rocket, color: 'text-purple-400', desc: 'Optimizes for rugged terrain, mobility, and field station infrastructure' },
  { id: 'Geological Research', label: 'Geological Field Research', icon: Mountain, color: 'text-amber-400', desc: 'Emphasizes pristine rock formations, impact breccias, and mineral diversity' },
  { id: 'Water Resource Research', label: 'Water Resource & Cryo-Ice', icon: Droplet, color: 'text-blue-400', desc: 'Finds locations with sub-zero permafrost, subsurface ice, and brine hydrology' },
  { id: 'Equipment Testing', label: 'Rover & Equipment Testing', icon: Crosshair, color: 'text-emerald-400', desc: 'Tests autonomous rovers and robotics against abrasive regolith and slopes' }
];

export default function RecommendationModal({ 
  isOpen, 
  onClose, 
  onSelectLocation 
}) {
  const [selectedObjective, setSelectedObjective] = useState(OBJECTIVES[0].id);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRunRecommendation = async (objId) => {
    setSelectedObjective(objId);
    try {
      setLoading(true);
      const res = await recommendLocations(objId, 5);
      if (res.status === 'success') {
        setRecommendations(res.recommendations || []);
      }
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#090e1d] border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                AI Planetary Mission Recommender
              </h2>
              <p className="text-xs text-slate-400">
                Select your mission objective. The ML engine calculates multi-criteria rankings dynamically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Objective Selection Cards */}
          <div>
            <label className="text-xs font-mono text-cyan-400 uppercase block mb-3 font-bold">
              1. Choose Mission Objective
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OBJECTIVES.map((obj) => {
                const Icon = obj.icon;
                const active = selectedObjective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => handleRunRecommendation(obj.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      active 
                        ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-500/10' 
                        : 'bg-slate-900/60 hover:bg-slate-800/40 border-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-slate-950 ${obj.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {obj.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {obj.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono text-cyan-400 uppercase font-bold">
                2. AI Recommended Analog Sites for "{selectedObjective}"
              </label>
              <button
                onClick={() => handleRunRecommendation(selectedObjective)}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Refresh Rankings
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Computing similarity vectors & ranking candidates...
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Click an objective above to trigger the machine learning recommendation engine.
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((loc, idx) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      onSelectLocation(loc.id);
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-xs font-mono font-bold flex items-center justify-center text-cyan-400 shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-cyan-300">
                            {loc.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {loc.country}
                          </span>
                          {loc.category === "Discovered Analog" && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                              AI Discovered
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                          <strong className="text-slate-300">Scientific Rationale:</strong> {loc.explainability?.key_contributing_factors?.[0] || loc.terrain_type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <div className="text-base font-extrabold text-cyan-400 font-mono">
                          {selectedObjective.includes('Moon') ? `${loc.lunar_similarity_score}%` : `${loc.mars_similarity_score}%`}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {selectedObjective.includes('Moon') ? loc.lunar_classification : loc.mars_classification}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Results derived from objective-weighted MCDA matrices, not hardcoded presets.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

