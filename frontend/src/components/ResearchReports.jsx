import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Orbit, 
  Flame, 
  Layers, 
  Sparkles, 
  AlertTriangle,
  Database,
  ArrowRight
} from 'lucide-react';
import { generateReport } from '../api';

export default function ResearchReports({ 
  locations = [], 
  initialLocationId = null 
}) {
  const [selectedLocId, setSelectedLocId] = useState(initialLocationId || locations[0]?.id || 'atacama-chile');
  const [missionType, setMissionType] = useState('Comprehensive Technical Brief');
  const [downloading, setDownloading] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState(null);

  const selectedLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  const handleGenerate = async () => {
    if (!selectedLoc) return;
    try {
      setDownloading(true);
      const res = await generateReport(selectedLoc.id, missionType);
      if (res.status === 'success') {
        setGeneratedPdf(res);
        // Automatically trigger download
        const link = document.createElement('a');
        link.href = res.download_url;
        link.download = res.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
          <FileText className="w-3.5 h-3.5" />
          <span>Automated Technical Dossier Generator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          NASA-Styled Research Report Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Instantly generate and download publication-ready scientific evaluation briefs compiled 
          by Python ReportLab, complete with MCDA sub-domain scores, reality caveats, and dataset citations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#090e1d] border border-slate-800 space-y-6 shadow-xl">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-2">
              Select Terrestrial Analog Location
            </label>
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-2">
              Mission Focus Profile
            </label>
            <select
              value={missionType}
              onChange={(e) => setMissionType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Comprehensive Technical Brief">Comprehensive Technical Brief</option>
              <option value="Permanent Lunar Base Candidate Report">Permanent Lunar Base Candidate Report</option>
              <option value="Mars Settlement Candidate Report">Mars Settlement Candidate Report</option>
              <option value="Astronaut Training & Mission Simulation">Astronaut Training & Mission Simulation</option>
              <option value="Life-Support & ISRU Technology Feasibility">Life-Support & ISRU Technology Feasibility</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={downloading}
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Generating ReportLab PDF...' : 'Compile & Download PDF Report'}</span>
            </button>
          </div>

          {generatedPdf && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>PDF Successfully Generated!</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                File: {generatedPdf.filename}
              </p>
              <a 
                href={generatedPdf.download_url} 
                download={generatedPdf.filename}
                className="text-cyan-400 hover:underline font-semibold block pt-1"
              >
                Click to re-download file
              </a>
            </div>
          )}

          <div className="text-[11px] text-slate-400 space-y-2 pt-2 border-t border-slate-800">
            <p className="font-semibold text-slate-300">Report Contents Included:</p>
            <p>• Verified GPS Coordinates & Geomorphology</p>
            <p>• Lunar & Martian Similarity Score Cards</p>
            <p>• 6-Vector MCDA Sub-Domain Analysis Table</p>
            <p>• AI Explainability & Dominant Parameter Drivers</p>
            <p>• Physical Reality Deviations (Gravity, Vacuum, Radiation)</p>
            <p>• NASA Earthdata & Planetary PDS Data Citations</p>
          </div>
        </div>

        {/* Live Dossier Preview Column */}
        {selectedLoc && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase block">
                  Report Preview Summary
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {selectedLoc.name}
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedLoc.country} • {selectedLoc.region} ({selectedLoc.coordinates.lat}°N, {selectedLoc.coordinates.lng}°E)
                </p>
              </div>

              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-center">
                  <span className="text-[9px] font-mono text-cyan-300 block">LUNAR</span>
                  <span className="text-sm font-bold text-cyan-400">{selectedLoc.lunar_similarity_score}%</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800 text-center">
                  <span className="text-[9px] font-mono text-rose-300 block">MARS</span>
                  <span className="text-sm font-bold text-rose-400">{selectedLoc.mars_similarity_score}%</span>
                </div>
              </div>
            </div>

            {/* Key Preview Sections */}
            <div className="space-y-4 text-xs text-slate-300">
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-mono text-cyan-400 font-bold uppercase text-[10px] block">
                  Section 1: Geological & Topographical Baseline
                </span>
                <p><strong>Lithology:</strong> {selectedLoc.geology.rock_composition}</p>
                <p><strong>Basalt Fraction:</strong> {selectedLoc.geology.basaltic_percentage}% | <strong>Regolith Match:</strong> {selectedLoc.geology.regolith_similarity_score}% | <strong>Slope:</strong> {selectedLoc.slope_deg}°</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-mono text-rose-400 font-bold uppercase text-[10px] block">
                  Section 2: Environmental Extremes & Volatiles
                </span>
                <p><strong>Thermal Range:</strong> {selectedLoc.environmental.surface_temp_mean_c}°C (min: {selectedLoc.environmental.temp_min_c}°, max: {selectedLoc.environmental.temp_max_c}°C, diurnal Δ {selectedLoc.environmental.diurnal_temp_swing_c}°C)</p>
                <p><strong>Atmospheric Pressure:</strong> {selectedLoc.environmental.surface_pressure_kpa} kPa | <strong>Precipitation:</strong> {selectedLoc.environmental.annual_precipitation_mm} mm/year</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-mono text-purple-400 font-bold uppercase text-[10px] block">
                  Section 3: AI Machine Learning Explainability
                </span>
                <p><strong>Dominant Factor:</strong> {selectedLoc.explainability?.key_contributing_factors?.[0]}</p>
                <p><strong>Secondary Factor:</strong> {selectedLoc.explainability?.key_contributing_factors?.[1]}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 space-y-1">
                <span className="font-mono font-bold uppercase text-[10px] block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Section 4: Planetary Reality Caveats & Deviations
                </span>
                <p className="text-[11px] text-slate-300">
                  Earth cannot replicate lunar vacuum (&lt;10^-14 bar), 1/6th g gravity, or Mars 95% CO2 thin atmosphere. Analog suitability is designated for operational and hardware simulation.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

