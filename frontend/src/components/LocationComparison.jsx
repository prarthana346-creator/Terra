import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Activity, 
  Orbit, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  Sparkles
} from 'lucide-react';
import { compareLocations } from '../api';

const SITE_COLORS = ['#38bdf8', '#f43f5e', '#a855f7'];

export default function LocationComparison({ 
  locations = [], 
  preselectedId = null 
}) {
  const [selectedIds, setSelectedIds] = useState([
    preselectedId || (locations[0]?.id || 'atacama-chile'),
    locations[3]?.id || 'mcmurdo-dry-valleys-antarctica',
    locations[6]?.id || 'iceland-volcanic-highlands'
  ]);

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      loadComparison();
    }
  }, [selectedIds]);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const res = await compareLocations(selectedIds);
      if (res.status === 'success') {
        setComparisonData(res.comparison);
      }
    } catch (err) {
      console.error('Failed to compare locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSite = (index, newId) => {
    setSelectedIds((prev) => {
      const updated = [...prev];
      updated[index] = newId;
      return updated;
    });
  };

  const selectedLocations = comparisonData?.selected_locations || locations.filter(l => selectedIds.includes(l.id));

  // Prepare data for bar chart comparison
  const barChartData = [
    {
      metric: 'Lunar Score',
      ...selectedLocations.reduce((acc, loc) => ({ ...acc, [loc.name]: loc.lunar_similarity_score }), {})
    },
    {
      metric: 'Mars Score',
      ...selectedLocations.reduce((acc, loc) => ({ ...acc, [loc.name]: loc.mars_similarity_score }), {})
    },
    {
      metric: 'Geology',
      ...selectedLocations.reduce((acc, loc) => ({ ...acc, [loc.name]: loc.subdomain_scores?.geological_similarity || 0 }), {})
    },
    {
      metric: 'Environment',
      ...selectedLocations.reduce((acc, loc) => ({ ...acc, [loc.name]: loc.subdomain_scores?.environmental_similarity || 0 }), {})
    },
    {
      metric: 'Resources',
      ...selectedLocations.reduce((acc, loc) => ({ ...acc, [loc.name]: loc.subdomain_scores?.resource_potential || 0 }), {})
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>Multi-Location Comparative Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Terrestrial Analog Head-to-Head Comparison
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Evaluate 2 or 3 terrestrial analog locations simultaneously across environmental parameters, 
          radar dimensions, and dynamic mission trade-offs.
        </p>
      </div>

      {/* Site Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((slotIdx) => (
          <div key={slotIdx} className="p-4 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">ANALOG SITE #{slotIdx + 1}</span>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: SITE_COLORS[slotIdx] }} 
              />
            </div>
            <select
              value={selectedIds[slotIdx] || ''}
              onChange={(e) => handleSelectSite(slotIdx, e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.country})
                </option>
              ))}
            </select>
            {selectedLocations[slotIdx] && (
              <div className="text-[11px] text-slate-400 truncate">
                L: {selectedLocations[slotIdx].lunar_similarity_score}% | M: {selectedLocations[slotIdx].mars_similarity_score}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Comparative Verdict Banner */}
      {comparisonData?.verdict && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI Comparative Mission Recommendation</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Optimal Mission Allocation Verdict
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {comparisonData.verdict.summary_rationale}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-center">
              <span className="text-[10px] font-mono text-cyan-300 block">BEST FOR MOON</span>
              <span className="text-xs font-bold text-white">{comparisonData.verdict.best_for_lunar}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-center">
              <span className="text-[10px] font-mono text-rose-300 block">BEST FOR MARS</span>
              <span className="text-xs font-bold text-white">{comparisonData.verdict.best_for_mars}</span>
            </div>
          </div>
        </div>
      )}

      {/* Radar Comparison & Bar Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Multi-Radar Chart */}
        <div className="p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Multi-Site Radar Overlay</h3>
              <p className="text-xs text-slate-400">Comparing 6 Core Environmental Dimensions</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={comparisonData?.radar_data || []}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                {selectedLocations.map((loc, idx) => (
                  <Radar
                    key={loc.id}
                    name={loc.name}
                    dataKey={loc.name}
                    stroke={SITE_COLORS[idx]}
                    fill={SITE_COLORS[idx]}
                    fillOpacity={0.25}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Direct Parameter Comparison</h3>
              <p className="text-xs text-slate-400">Side-by-side suitability and sub-domain scores</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedLocations.map((loc, idx) => (
                  <Bar
                    key={loc.id}
                    dataKey={loc.name}
                    fill={SITE_COLORS[idx]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Full Side-by-Side Environmental Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Telemetry Parameter</th>
                {selectedLocations.map((loc, idx) => (
                  <th key={loc.id} className="py-3 px-4" style={{ color: SITE_COLORS[idx] }}>
                    {loc.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Country & Region</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4">{l.country} ({l.region})</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Lunar Similarity Score</td>
                {selectedLocations.map(l => (
                  <td key={l.id} className="py-2.5 px-4 font-mono font-bold text-cyan-400">
                    {l.lunar_similarity_score}% ({l.lunar_classification})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Mars Similarity Score</td>
                {selectedLocations.map(l => (
                  <td key={l.id} className="py-2.5 px-4 font-mono font-bold text-rose-400">
                    {l.mars_similarity_score}% ({l.mars_classification})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Elevation / Slope</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4 font-mono">{l.elevation_m}m / {l.slope_deg}°</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Basaltic Content</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4 font-mono">{l.geology.basaltic_percentage}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Regolith Similarity</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4 font-mono">{l.geology.regolith_similarity_score}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Mean Temp / Diurnal Δ</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4 font-mono">{l.environmental.surface_temp_mean_c}°C / Δ {l.environmental.diurnal_temp_swing_c}°C</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Annual Precipitation</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4 font-mono">{l.environmental.annual_precipitation_mm} mm</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Water / Ice Availability</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4 font-mono">{l.resources.water_ice_availability_score}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-400">Lava Tubes / Caves</td>
                {selectedLocations.map(l => <td key={l.id} className="py-2.5 px-4">{l.special_features.lava_tubes ? 'Present' : 'None'}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

