/**
 * TerraSpace AI - Frontend API Service
 * Connects to the Flask REST API backend endpoints.
 */

const API_BASE = '/api';

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function fetchLocations(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.min_lunar) query.append('min_lunar', params.min_lunar);
  if (params.min_mars) query.append('min_mars', params.min_mars);
  if (params.lava_tubes) query.append('lava_tubes', params.lava_tubes);
  if (params.polar) query.append('polar', params.polar);

  const res = await fetch(`${API_BASE}/locations?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch analog locations');
  return res.json();
}

export async function fetchLocationDetails(id) {
  const res = await fetch(`${API_BASE}/locations/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch location ${id}`);
  return res.json();
}

export async function runAnalysis(weights = null) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weights })
  });
  if (!res.ok) throw new Error('Analysis calculation failed');
  return res.json();
}

export async function fetchRankings(target = 'lunar', limit = 10) {
  const endpoint = target === 'mars' ? 'mars' : 'lunar';
  const res = await fetch(`${API_BASE}/rankings/${endpoint}?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch ${target} rankings`);
  return res.json();
}

export async function compareLocations(locationIds) {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location_ids: locationIds })
  });
  if (!res.ok) throw new Error('Failed to compare locations');
  return res.json();
}

export async function recommendLocations(objective, limit = 5) {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objective, limit })
  });
  if (!res.ok) throw new Error('Recommendation failed');
  return res.json();
}

export async function fetchDatasets() {
  const res = await fetch(`${API_BASE}/datasets`);
  if (!res.ok) throw new Error('Failed to fetch scientific datasets');
  return res.json();
}

export async function generateReport(locationId, missionType = 'Comprehensive') {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location_id: locationId, mission_type: missionType })
  });
  if (!res.ok) throw new Error('Report generation failed');
  return res.json();
}

