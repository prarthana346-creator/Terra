import React, { useState, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Compass, 
  Orbit, 
  Flame, 
  Filter, 
  Layers, 
  Search, 
  Crosshair, 
  ArrowUpRight, 
  Thermometer, 
  Mountain, 
  Droplet, 
  Sparkles,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

// Tile provider options
const TILE_LAYERS = {
  carto_dark: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Esri World Imagery (Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }
};

// Component to fly to coordinates when location is selected
function FlyToLocation({ targetCoord }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCoord) {
      map.flyTo([targetCoord.lat, targetCoord.lng], 6, { duration: 1.5 });
    }
  }, [targetCoord, map]);
  return null;
}

// Custom DivIcon generator for crisp, color-coded markers
function createCustomMarkerIcon(score, targetType, isDiscovered) {
  const isLunar = targetType === 'lunar';
  const color = isLunar ? '#38bdf8' : '#f43f5e';
  const glow = isLunar ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 63, 94, 0.4)';
  
  return L.divIcon({
    className: 'custom-analog-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        background: #090e1d;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 14px ${glow};
        cursor: pointer;
        transform: translate(-50%, -50%);
        transition: transform 0.2s;
      ">
        <span style="
          color: #ffffff;
          font-family: monospace;
          font-weight: 800;
          font-size: 11px;
        ">${Math.round(score)}</span>
        ${isDiscovered ? `
          <div style="
            position: absolute;
            top: -3px;
            right: -3px;
            width: 10px;
            height: 10px;
            background: #a855f7;
            border: 1.5px solid #090e1d;
            border-radius: 50%;
          "></div>
        ` : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
}

export default function AnalogExplorer({ 
  locations = [], 
  onSelectLocation, 
  initialTarget = 'all' 
}) {
  const [selectedLayer, setSelectedLayer] = useState('carto_dark');
  const [targetFilter, setTargetFilter] = useState(initialTarget); // 'all', 'lunar', 'mars'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'reference', 'discovered'
  const [featureFilter, setFeatureFilter] = useState('all'); // 'all', 'lava_tubes', 'polar', 'crater', 'high_altitude'
  const [minScore, setMinScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocationId, setActiveLocationId] = useState(null);
  const [flyCoord, setFlyCoord] = useState(null);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = loc.name.toLowerCase().includes(query);
        const matchCountry = loc.country.toLowerCase().includes(query);
        const matchTerrain = loc.terrain_type.toLowerCase().includes(query);
        if (!matchName && !matchCountry && !matchTerrain) return false;
      }

      // Target filter
      const activeScore = targetFilter === 'lunar' ? loc.lunar_similarity_score : loc.mars_similarity_score;
      if (activeScore < minScore) return false;

      // Category filter
      if (categoryFilter === 'reference' && loc.category !== 'Reference Location') return false;
      if (categoryFilter === 'discovered' && loc.category !== 'Discovered Analog') return false;

      // Special features
      if (featureFilter === 'lava_tubes' && !loc.special_features?.lava_tubes) return false;
      if (featureFilter === 'polar' && !loc.special_features?.polar_region) return false;
      if (featureFilter === 'crater' && !loc.crater_formations) return false;
      if (featureFilter === 'high_altitude' && !loc.special_features?.high_altitude_desert) return false;

      return true;
    });
  }, [locations, searchQuery, targetFilter, categoryFilter, featureFilter, minScore]);

  const handleFocusLocation = (loc) => {
    setActiveLocationId(loc.id);
    setFlyCoord(loc.coordinates);
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex flex-col lg:flex-row overflow-hidden bg-[#070b16]">
      
      {/* Left Filter & Ranked Sidebar */}
      <div className="w-full lg:w-96 h-1/3 lg:h-full bg-[#090e1d]/95 backdrop-blur border-r border-slate-800 flex flex-col z-20 overflow-y-auto">
        
        {/* Sidebar Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3 sticky top-0 bg-[#090e1d] z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Analog Filter Matrix
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {filteredLocations.length} / {locations.length} Sites
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, country, terrain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Target toggle: Lunar vs Mars */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTargetFilter('all')}
              className={`py-1.5 rounded-lg font-medium transition ${
                targetFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Analogs
            </button>
            <button
              onClick={() => setTargetFilter('lunar')}
              className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition ${
                targetFilter === 'lunar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3 h-3 text-cyan-400" />
              Lunar Focus
            </button>
            <button
              onClick={() => setTargetFilter('mars')}
              className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition ${
                targetFilter === 'mars' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-400" />
              Mars Focus
            </button>
          </div>
        </div>

        {/* Detailed Filter Options */}
        <div className="p-4 border-b border-slate-800 space-y-4">
          
          {/* Minimum Similarity Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Min Similarity Score</span>
              <span className="font-mono text-cyan-400 font-bold">{minScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Discovery Category */}
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                categoryFilter === 'all' ? 'bg-slate-800 text-white border-slate-600' : 'text-slate-400 border-slate-800'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setCategoryFilter('reference')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                categoryFilter === 'reference' ? 'bg-slate-800 text-cyan-300 border-cyan-500/40' : 'text-slate-400 border-slate-800'
              }`}
            >
              11 Reference Sites
            </button>
            <button
              onClick={() => setCategoryFilter('discovered')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                categoryFilter === 'discovered' ? 'bg-purple-950/60 text-purple-300 border-purple-500/50' : 'text-slate-400 border-slate-800'
              }`}
            >
              AI Discovered
            </button>
          </div>

          {/* Special Geological Features */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
              Terrain & Environmental Filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Terrains' },
                { id: 'lava_tubes', label: 'Lava Tubes' },
                { id: 'polar', label: 'Polar Cryo-Regolith' },
                { id: 'crater', label: 'Impact / Caldera' },
                { id: 'high_altitude', label: 'High Altitude' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFeatureFilter(f.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition ${
                    featureFilter === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Layer Switcher */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
              Map Basemap Tile
            </span>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(TILE_LAYERS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLayer(key)}
                  className={`p-1.5 rounded-lg text-[10px] text-center truncate border ${
                    selectedLayer === key 
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/50' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {item.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Filtered Location List */}
        <div className="flex-1 p-3 space-y-2">
          {filteredLocations.map((loc) => {
            const isLunarLead = loc.lunar_similarity_score >= loc.mars_similarity_score;
            const active = activeLocationId === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => handleFocusLocation(loc)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  active 
                    ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-500/10' 
                    : 'bg-slate-900/40 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white leading-tight">
                        {loc.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {loc.country} • {loc.elevation_m}m
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-right shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        L: {loc.lunar_similarity_score}%
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-400">
                        M: {loc.mars_similarity_score}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="truncate max-w-[190px]">
                    {loc.terrain_type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocation(loc.id);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    Details <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Main Leaflet Interactive Map View */}
      <div className="flex-1 h-2/3 lg:h-full relative z-10">
        
        <MapContainer
          center={[20.0, 0.0]}
          zoom={2.5}
          minZoom={2}
          maxZoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution={TILE_LAYERS[selectedLayer].attribution}
            url={TILE_LAYERS[selectedLayer].url}
          />

          <FlyToLocation targetCoord={flyCoord} />

          {/* Render Analog Markers & Influence Radius Circles */}
          {filteredLocations.map((loc) => {
            const isLunarLead = loc.lunar_similarity_score >= loc.mars_similarity_score;
            const primaryScore = targetFilter === 'mars' 
              ? loc.mars_similarity_score 
              : targetFilter === 'lunar' 
                ? loc.lunar_similarity_score 
                : Math.max(loc.lunar_similarity_score, loc.mars_similarity_score);
            
            const markerType = targetFilter === 'mars' 
              ? 'mars' 
              : targetFilter === 'lunar' 
                ? 'lunar' 
                : (isLunarLead ? 'lunar' : 'mars');

            const isDiscovered = loc.category === "Discovered Analog";

            return (
              <React.Fragment key={loc.id}>
                
                {/* Influence area radius circle */}
                <Circle
                  center={[loc.coordinates.lat, loc.coordinates.lng]}
                  radius={120000} // 120km radius circle
                  pathOptions={{
                    color: markerType === 'lunar' ? '#38bdf8' : '#f43f5e',
                    fillColor: markerType === 'lunar' ? '#0284c7' : '#e11d48',
                    fillOpacity: 0.12,
                    weight: 1,
                    dashArray: '4, 4'
                  }}
                />

                {/* Main Interactive Marker */}
                <Marker
                  position={[loc.coordinates.lat, loc.coordinates.lng]}
                  icon={createCustomMarkerIcon(primaryScore, markerType, isDiscovered)}
                  eventHandlers={{
                    click: () => setActiveLocationId(loc.id)
                  }}
                >
                  <Popup className="custom-popup" maxWidth={360}>
                    <div className="p-1 space-y-3 font-sans">
                      
                      {/* Popup Header */}
                      <div className="border-b border-slate-700 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {loc.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {loc.coordinates.lat}°N, {loc.coordinates.lng}°E
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">
                          {loc.name}
                        </h3>
                        <p className="text-xs text-slate-300">
                          {loc.country} • {loc.region} ({loc.elevation_m}m)
                        </p>
                      </div>

                      {/* Similarity Score Badges */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/60">
                          <span className="text-[10px] font-mono text-cyan-300 block">LUNAR SIMILARITY</span>
                          <span className="text-lg font-black text-cyan-400">{loc.lunar_similarity_score}%</span>
                          <span className="text-[9px] text-slate-300 block truncate">{loc.lunar_classification}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/60">
                          <span className="text-[10px] font-mono text-rose-300 block">MARS SIMILARITY</span>
                          <span className="text-lg font-black text-rose-400">{loc.mars_similarity_score}%</span>
                          <span className="text-[9px] text-slate-300 block truncate">{loc.mars_classification}</span>
                        </div>
                      </div>

                      {/* Geological & Environmental Snapshot */}
                      <div className="text-xs space-y-1 text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <p><strong>Geology:</strong> {loc.geology.rock_composition}</p>
                        <p><strong>Basalt Content:</strong> {loc.geology.basaltic_percentage}% | <strong>Regolith Match:</strong> {loc.geology.regolith_similarity_score}%</p>
                        <p><strong>Temp:</strong> {loc.environmental.surface_temp_mean_c}°C (range: {loc.environmental.temp_min_c}° to {loc.environmental.temp_max_c}°C)</p>
                        <p><strong>Precipitation:</strong> {loc.environmental.annual_precipitation_mm} mm/year</p>
                      </div>

                      {/* Action Button to Open Full Analysis */}
                      <button
                        onClick={() => onSelectLocation(loc.id)}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        <span>Open Complete Scientific Analysis</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </Popup>
                </Marker>

              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-slate-900/90 backdrop-blur p-3 rounded-2xl border border-slate-800 shadow-2xl text-xs space-y-2 pointer-events-auto">
          <div className="font-mono text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Legend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-cyan-400 bg-[#090e1d]" />
            <span className="text-slate-300">Lunar Primary Fit (Cyan)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-rose-500 bg-[#090e1d]" />
            <span className="text-slate-300">Mars Primary Fit (Rose)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-300">AI Discovered Marker Badge</span>
          </div>
        </div>

      </div>

    </div>
  );
}

