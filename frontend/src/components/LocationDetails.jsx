import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Compass, 
  Orbit, 
  Flame, 
  Layers, 
  FileText, 
  Thermometer, 
  Droplet, 
  Wind, 
  Sun, 
  Mountain, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  Download,
  Share2,
  Database,
  ArrowLeft
} from 'lucide-react';
import { generateReport } from '../api';

export default function LocationDetails({ 
  location, 
  onBack, 
  onCompareWith 
}) {
  const [downloading, setDownloading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(null);

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <p>No location selected. Please select a site from the Explorer or Dashboard.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs hover:bg-slate-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const sub = location.subdomain_scores || {};
  const radarData = [
    { subject: 'Geology', score: sub.geological_similarity || 70 },
    { subject: 'Topography', score: sub.topographical_similarity || 65 },
    { subject: 'Environment', score: sub.environmental_similarity || 60 },
    { subject: 'Resources', score: sub.resource_potential || 75 },
    { subject: 'Accessibility', score: sub.terrain_accessibility || 80 },
    { subject: 'Science Value', score: sub.scientific_research_value || 85 }
  ];

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const res = await generateReport(location.id, 'Comprehensive Technical Brief');
      if (res.status === 'success' && res.download_url) {
        setReportSuccess(res.download_url);
        // Trigger browser download
        const link = document.createElement('a');
        link.href = res.download_url;
        link.download = res.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setDownloading(false);
    }
  };

  const isLunarLead = location.lunar_similarity_score >= location.mars_similarity_score;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {location.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {location.coordinates.lat}°N, {location.coordinates.lng}°E
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              {location.name}
            </h1>
            <p className="text-xs text-slate-400">
              {location.country} • {location.region} • Elevation {location.elevation_m}m
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onCompareWith(location.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <span>Compare Site</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Compiling PDF...' : 'Download NASA PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Primary Scores & Radar Chart Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Score Cards */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Lunar Card */}
          <div className="p-6 rounded-3xl bg-[#090e1d] border border-cyan-500/40 shadow-xl shadow-cyan-500/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400">
                  <Orbit className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  LUNAR BASE ANALOG
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Model A</span>
            </div>

            <div className="text-4xl font-black text-cyan-400 mb-1">
              {location.lunar_similarity_score}%
            </div>
            <span className="text-xs font-semibold text-slate-300 block mb-3">
              {location.lunar_classification}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comparison against Lunar South Pole & Mare basaltic highlands. Measures regolith grain-size, 
              crater slope profiles, and vacuum thermal simulation potential.
            </p>
          </div>

          {/* Mars Card */}
          <div className="p-6 rounded-3xl bg-[#090e1d] border border-rose-500/40 shadow-xl shadow-rose-500/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-950 flex items-center justify-center text-rose-400">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-rose-300">
                  MARS SETTLEMENT ANALOG
                </span>
              </div>
              <span className="text-[10px] font-mono text-rose-400">Model B</span>
            </div>

            <div className="text-4xl font-black text-rose-400 mb-1">
              {location.mars_similarity_score}%
            </div>
            <span className="text-xs font-semibold text-slate-300 block mb-3">
              {location.mars_classification}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comparison against Jezero, Gale, and Arcadia Planitia baselines. Evaluates hyper-aridity, 
              permafrost ice indicators, and iron-oxide mineralogy.
            </p>
          </div>

        </div>

        {/* Right Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white">Multi-Dimensional Suitability Radar</h3>
              <p className="text-xs text-slate-400">6 Core Evaluation Vectors (Normalized 0–100)</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Cluster: {location.cluster_name}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                <Radar 
                  name={location.name} 
                  dataKey="score" 
                  stroke={isLunarLead ? '#38bdf8' : '#f43f5e'} 
                  fill={isLunarLead ? '#0284c7' : '#e11d48'} 
                  fillOpacity={0.4} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Geology</span>
              <span className="font-mono font-bold text-white">{sub.geological_similarity}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Topography</span>
              <span className="font-mono font-bold text-white">{sub.topographical_similarity}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Environment</span>
              <span className="font-mono font-bold text-white">{sub.environmental_similarity}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Resources</span>
              <span className="font-mono font-bold text-white">{sub.resource_potential}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Logistics</span>
              <span className="font-mono font-bold text-white">{sub.terrain_accessibility}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Research</span>
              <span className="font-mono font-bold text-white">{sub.scientific_research_value}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4 Deep Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. Geological */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Mountain className="w-4 h-4" />
            <span>GEOLOGICAL MATRIX</span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Rock Composition</span>
              <span className="font-semibold">{location.geology.rock_composition}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
              <span className="text-slate-400">Basaltic Content</span>
              <span className="font-mono font-bold text-cyan-400">{location.geology.basaltic_percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Regolith Similarity</span>
              <span className="font-mono font-bold text-cyan-400">{location.geology.regolith_similarity_score}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mineral Diversity</span>
              <span className="font-mono font-bold text-cyan-400">{location.geology.mineral_diversity_score}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Geological Stability</span>
              <span className="font-mono font-bold text-cyan-400">{location.geology.geological_stability_score}%</span>
            </div>
          </div>
        </div>

        {/* 2. Topographical */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>TOPOGRAPHICAL RELIEF</span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Terrain Morphology</span>
              <span className="font-semibold">{location.terrain_type}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
              <span className="text-slate-400">Mean Slope</span>
              <span className="font-mono font-bold text-purple-400">{location.slope_deg}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Surface Roughness</span>
              <span className="font-mono font-bold text-purple-400">{location.surface_roughness}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ruggedness Index</span>
              <span className="font-mono font-bold text-purple-400">{location.ruggedness_index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Crater Formations</span>
              <span className="font-mono font-bold text-purple-400">{location.crater_formations ? 'Present' : 'None'}</span>
            </div>
          </div>
        </div>

        {/* 3. Environmental */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
            <Thermometer className="w-4 h-4" />
            <span>ENVIRONMENT EXTREMES</span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Mean Temp</span>
              <span className="font-mono font-bold text-rose-400">{location.environmental.surface_temp_mean_c}°C</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
              <span className="text-slate-400">Min / Max Temp</span>
              <span className="font-mono text-rose-300">{location.environmental.temp_min_c}° / {location.environmental.temp_max_c}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Diurnal Swing</span>
              <span className="font-mono font-bold text-rose-400">Δ {location.environmental.diurnal_temp_swing_c}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Annual Precip</span>
              <span className="font-mono font-bold text-rose-400">{location.environmental.annual_precipitation_mm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pressure / Humidity</span>
              <span className="font-mono text-rose-300">{location.environmental.surface_pressure_kpa} kPa / {location.environmental.relative_humidity_pct}%</span>
            </div>
          </div>
        </div>

        {/* 4. Resources & ISRU */}
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
            <Droplet className="w-4 h-4" />
            <span>RESOURCE & ISRU POTENTIAL</span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Water / Ice Availability</span>
              <span className="font-mono font-bold text-emerald-400">{location.resources.water_ice_availability_score}%</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
              <span className="text-slate-400">Subsurface Water Flag</span>
              <span className="font-mono font-bold text-emerald-400">{location.resources.subsurface_water_indicator}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mineral Richness</span>
              <span className="font-mono font-bold text-emerald-400">{location.resources.mineral_resource_richness}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Construction Suitability</span>
              <span className="font-mono font-bold text-emerald-400">{location.resources.construction_material_score}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Solar Energy Potential</span>
              <span className="font-mono font-bold text-emerald-400">{location.resources.solar_energy_potential}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Explainability Section (MODULE 8) */}
      <div className="p-6 rounded-3xl bg-[#090e1d] border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">AI Explainability & Parameter Contribution Matrix</h3>
            <p className="text-xs text-slate-400">
              Transparent ML derivation from Random Forest feature weights and NASA ground truth datasets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Key Contributing Factors */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
              1. Key Contributing Score Drivers
            </h4>
            <div className="space-y-2">
              {location.explainability?.key_contributing_factors?.map((factor, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold pt-2">
              2. Supporting Space Agency Datasets
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              {location.explainability?.supporting_datasets?.map((ds, i) => (
                <p key={i} className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{ds}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Unmatched Differences & Research Gaps */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-amber-400 font-bold">
              3. Unmatched Characteristics vs Real Moon/Mars
            </h4>
            <div className="space-y-2">
              {location.explainability?.unmatched_planetary_characteristics?.map((diff, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-mono uppercase text-purple-400 font-bold pt-2">
              4. Recommended Next-Stage Field Studies
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              {location.explainability?.recommended_further_research?.map((res, i) => (
                <p key={i} className="text-slate-300">
                  • {res}
                </p>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

