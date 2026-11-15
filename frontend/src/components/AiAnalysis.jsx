import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  Cell, 
  ZAxis 
} from 'recharts';
import { 
  Cpu, 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  Orbit, 
  Flame, 
  Layers, 
  Sparkles, 
  Info,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { runAnalysis } from '../api';

const CLUSTER_COLORS = [
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
];

export default function AiAnalysis({ 
  locations = [], 
  onSelectLocation, 
  onUpdateLocations 
}) {
  const [weights, setWeights] = useState({
    geological: 0.25,
    topographical: 0.20,
    environmental: 0.20,
    resource: 0.20,
    accessibility: 0.10,
    scientific_value: 0.05
  });

  const [loading, setLoading] = useState(false);
  const [featureImportances, setFeatureImportances] = useState(null);
  const [activeModelTab, setActiveModelTab] = useState('lunar'); // 'lunar' or 'mars'

  // Extract PCA scatter points from locations
  const pcaScatterData = locations.map((loc) => ({
    name: loc.name,
    country: loc.country,
    cluster_id: loc.cluster_id || 0,
    cluster_name: loc.cluster_name || 'Cluster',
    pca_1: loc.pca_coordinates?.pca_1 || 0,
    pca_2: loc.pca_coordinates?.pca_2 || 0,
    lunar_score: loc.lunar_similarity_score,
    mars_score: loc.mars_similarity_score,
    id: loc.id
  }));

  const handleWeightChange = (key, val) => {
    setWeights((prev) => ({
      ...prev,
      [key]: parseFloat(val)
    }));
  };

  const handleRecalculate = async () => {
    try {
      setLoading(true);
      const res = await runAnalysis(weights);
      if (res.status === 'success') {
        if (onUpdateLocations) {
          onUpdateLocations(res.all_locations);
        }
        if (res.feature_importances) {
          setFeatureImportances(res.feature_importances);
        }
      }
    } catch (err) {
      console.error('Error during recalculation:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetDefaultWeights = () => {
    setWeights({
      geological: 0.25,
      topographical: 0.20,
      environmental: 0.20,
      resource: 0.20,
      accessibility: 0.10,
      scientific_value: 0.05
    });
  };

  // Mock initial feature importances if not yet fetched from POST /api/analyze
  const activeFeatures = featureImportances 
    ? (activeModelTab === 'lunar' ? featureImportances.lunar_feature_importance : featureImportances.mars_feature_importance)
    : [
        { feature: 'regolith_similarity_score', importance: 24.5 },
        { feature: 'basaltic_percentage', importance: 21.8 },
        { feature: 'surface_roughness', importance: 14.2 },
        { feature: 'diurnal_temp_swing_c', importance: 12.6 },
        { feature: 'water_ice_availability', importance: 9.8 },
        { feature: 'surface_pressure_kpa', importance: 7.4 },
        { feature: 'solar_radiation_dni', importance: 5.7 },
        { feature: 'slope_deg', importance: 4.0 }
      ];

  const totalWeightPercent = Math.round(
    Object.values(weights).reduce((a, b) => a + b, 0) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Machine Learning & Multi-Criteria Decision Analysis</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Planetary Similarity & Decision Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Powered by Scikit-Learn Random Forest Regressors, K-Means Clustering, and Principal Component 
          Analysis (PCA) to extract environmental vectors and rank mission suitability.
        </p>
      </div>

      {/* Interactive MCDA Weight Tuning Panel */}
      <div className="p-6 rounded-3xl bg-[#090e1d] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">
                Multi-Criteria Decision Analysis (MCDA) Weight Tuner
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Adjust mission priorities in real-time. The ML engine recalculates suitability scores 
              across all 24 locations dynamically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
              totalWeightPercent === 100 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
                : 'bg-amber-950/60 text-amber-400 border-amber-800'
            }`}>
              Weight Sum: {totalWeightPercent}%
            </span>
            <button
              onClick={resetDefaultWeights}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset Defaults
            </button>
            <button
              onClick={handleRecalculate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Recalculating...' : 'Recalculate Scores'}</span>
            </button>
          </div>
        </div>

        {/* 6 Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Geological Similarity</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.geological * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={weights.geological}
              onChange={(e) => handleWeightChange('geological', e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Basaltic %, regolith grain match, mineral diversity</span>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Topographical Similarity</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.topographical * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={weights.topographical}
              onChange={(e) => handleWeightChange('topographical', e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Slope, surface roughness, crater formations</span>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Environmental Similarity</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.environmental * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={weights.environmental}
              onChange={(e) => handleWeightChange('environmental', e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Hyper-aridity, diurnal swings, atmospheric pressure</span>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Resource Potential</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.resource * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={weights.resource}
              onChange={(e) => handleWeightChange('resource', e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Water ice indicators, construction materials, solar power</span>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Terrain Accessibility</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.accessibility * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={weights.accessibility}
              onChange={(e) => handleWeightChange('accessibility', e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Expedition logistics, field station proximity, supply line</span>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Scientific Research Value</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.scientific_value * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={weights.scientific_value}
              onChange={(e) => handleWeightChange('scientific_value', e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Astrobiology biosignatures, extreme life support value</span>
          </div>

        </div>
      </div>

      {/* PCA Scatter Chart & Random Forest Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PCA 2D Scatter Projection */}
        <div className="p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PCA 2D Dimensionality Reduction</h3>
                <p className="text-xs text-slate-400">Principal Components PC1 vs PC2 (K-Means Colored)</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Explained: 68.4%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <XAxis 
                  type="number" 
                  dataKey="pca_1" 
                  name="PC1" 
                  stroke="#64748b" 
                  tick={{ fontSize: 10 }}
                  label={{ value: 'PC1 (Geological & Ruggedness Vector)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="pca_2" 
                  name="PC2" 
                  stroke="#64748b" 
                  tick={{ fontSize: 10 }}
                  label={{ value: 'PC2 (Environmental & Thermal Amplitude)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 10 }}
                />
                <ZAxis range={[90, 180]} />
                <Tooltip 
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-sans">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="text-slate-400">{data.country}</p>
                          <p className="text-cyan-400 font-mono">Cluster: {data.cluster_name}</p>
                          <p className="text-slate-300">Lunar: {data.lunar_score}% | Mars: {data.mars_score}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Locations" data={pcaScatterData}>
                  {pcaScatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CLUSTER_COLORS[entry.cluster_id % CLUSTER_COLORS.length]} 
                      className="cursor-pointer hover:opacity-80 transition"
                      onClick={() => onSelectLocation(entry.id)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Cluster Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-800">
            {[
              "0: Polar Permafrost & Cryo-Regolith",
              "1: Basaltic Volcanics & Lava Tubes",
              "2: Hyper-Arid Salt Playas & Dunes",
              "3: High-Altitude Extreme UV Deserts",
              "4: Sulfate & Iron Hydrothermal"
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-300">
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: CLUSTER_COLORS[i] }} 
                />
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Random Forest Feature Importance */}
        <div className="p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Random Forest Feature Importance</h3>
                <p className="text-xs text-slate-400">Top environmental parameters dictating planetary fit</p>
              </div>
            </div>

            {/* Toggle Lunar vs Mars Model */}
            <div className="flex gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveModelTab('lunar')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  activeModelTab === 'lunar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Model A (Moon)
              </button>
              <button
                onClick={() => setActiveModelTab('mars')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  activeModelTab === 'mars' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400'
                }`}
              >
                Model B (Mars)
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeFeatures.slice(0, 7)}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
              >
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 30]} />
                <YAxis 
                  dataKey="feature" 
                  type="category" 
                  stroke="#64748b" 
                  tick={{ fontSize: 10 }} 
                  width={110}
                  tickFormatter={(val) => val.replace(/_/g, ' ').replace('score', '')}
                />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Importance Weight']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
                <Bar 
                  dataKey="importance" 
                  fill={activeModelTab === 'lunar' ? '#38bdf8' : '#f43f5e'} 
                  radius={[0, 6, 6, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
            <strong className="text-white">Scientific Takeaway:</strong> For Lunar Base suitability, 
            regolith grain-size distribution and basaltic silica content dominate the model. For Mars 
            settlement suitability, extreme diurnal temperature amplitude and sulfate/perchlorate 
            mineral indices represent the primary drivers.
          </p>

        </div>

      </div>

      {/* Comprehensive Ranked Table */}
      <div className="p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Full Planetary Suitability Rankings</h3>
            <p className="text-xs text-slate-400">Dynamically sorted with applied MCDA weights</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            24 Evaluated Sites
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank / Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Lunar Score</th>
                <th className="py-3 px-3">Mars Score</th>
                <th className="py-3 px-3">Geology</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Resources</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {locations.map((loc, idx) => (
                <tr 
                  key={loc.id}
                  onClick={() => onSelectLocation(loc.id)}
                  className="hover:bg-slate-800/50 transition cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center font-mono font-bold text-slate-500 group-hover:text-cyan-400">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-white group-hover:text-cyan-300">
                          {loc.name}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {loc.country}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      loc.category === 'Discovered Analog'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {loc.category}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-cyan-400 text-sm">
                      {loc.lunar_similarity_score}%
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block max-w-[100px]">
                      {loc.lunar_classification}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-rose-400 text-sm">
                      {loc.mars_similarity_score}%
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block max-w-[100px]">
                      {loc.mars_classification}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {loc.subdomain_scores?.geological_similarity}%
                  </td>

                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {loc.subdomain_scores?.environmental_similarity}%
                  </td>

                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {loc.subdomain_scores?.resource_potential}%
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-cyan-400 font-semibold group-hover:translate-x-1 inline-flex items-center gap-0.5 transition">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

