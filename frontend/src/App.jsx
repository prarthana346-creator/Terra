import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AnalogExplorer from './components/AnalogExplorer';
import AiAnalysis from './components/AiAnalysis';
import LocationDetails from './components/LocationDetails';
import LocationComparison from './components/LocationComparison';
import ResearchReports from './components/ResearchReports';
import DatasetCatalogModal from './components/DatasetCatalogModal';
import RecommendationModal from './components/RecommendationModal';

import { fetchLocations, fetchStatus } from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [compareSiteId, setCompareSiteId] = useState(null);
  const [explorerTarget, setExplorerTarget] = useState('all');
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isDatasetsOpen, setIsDatasetsOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [locRes, statRes] = await Promise.all([
        fetchLocations(),
        fetchStatus().catch(() => null)
      ]);
      setLocations(locRes.locations || []);
      setSystemStatus(statRes);
      if (locRes.locations?.length > 0) {
        setSelectedLocationId(locRes.locations[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Unable to reach TerraSpace AI backend. Please verify that the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (id) => {
    setSelectedLocationId(id);
    setCurrentTab('details');
  };

  const handleCompareWith = (id) => {
    setCompareSiteId(id);
    setCurrentTab('compare');
  };

  const handleSelectExplorerTarget = (target) => {
    setExplorerTarget(target);
    setCurrentTab('explorer');
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  // Highest similarity scores
  const highestLunar = locations.length > 0 
    ? Math.max(...locations.map(l => l.lunar_similarity_score || 0)) 
    : 0;
  const highestMars = locations.length > 0 
    ? Math.max(...locations.map(l => l.mars_similarity_score || 0)) 
    : 0;

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Mission Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        systemStatus={systemStatus}
        onOpenRecommend={() => setIsRecommendOpen(true)}
        onOpenDatasets={() => setIsDatasetsOpen(true)}
      />

      {/* Backend connection alert if error */}
      {error && (
        <div className="bg-rose-950/80 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2">
          <span>{error}</span>
          <button 
            onClick={loadInitialData}
            className="underline font-bold hover:text-white ml-2 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            <p className="text-sm font-mono text-cyan-400">
              Initializing TerraSpace AI Planetary Intelligence Platform...
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <LandingPage
                onNavigate={setCurrentTab}
                totalLocations={locations.length}
                highestLunar={highestLunar}
                highestMars={highestMars}
                onSelectTarget={handleSelectExplorerTarget}
              />
            )}

            {currentTab === 'dashboard' && (
              <Dashboard
                locations={locations}
                onSelectLocation={handleSelectLocation}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'explorer' && (
              <AnalogExplorer
                locations={locations}
                onSelectLocation={handleSelectLocation}
                initialTarget={explorerTarget}
              />
            )}

            {currentTab === 'ai-analysis' && (
              <AiAnalysis
                locations={locations}
                onSelectLocation={handleSelectLocation}
                onUpdateLocations={(newLocs) => setLocations(newLocs)}
              />
            )}

            {currentTab === 'details' && (
              <LocationDetails
                location={selectedLocation}
                onBack={() => setCurrentTab('explorer')}
                onCompareWith={handleCompareWith}
              />
            )}

            {currentTab === 'compare' && (
              <LocationComparison
                locations={locations}
                preselectedId={compareSiteId || selectedLocationId}
              />
            )}

            {currentTab === 'reports' && (
              <ResearchReports
                locations={locations}
                initialLocationId={selectedLocationId}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b16] py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">TerraSpace AI</span>
            <span>— Intelligent Earth Analog Discovery for Moon Base & Mars Settlements</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>NASA Planetary Data System (PDS)</span>
            <span>•</span>
            <span>USGS Spectroscopy</span>
            <span>•</span>
            <span>Copernicus Sentinel</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <DatasetCatalogModal
        isOpen={isDatasetsOpen}
        onClose={() => setIsDatasetsOpen(false)}
      />

      <RecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        onSelectLocation={handleSelectLocation}
      />

    </div>
  );
}
