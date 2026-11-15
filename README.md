# TerraSpace AI – Intelligent Earth Analog Discovery for Permanent Moon Base and Mars Settlement Locations

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1-black?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.8-F7931E?style=flat&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**TerraSpace AI** is an innovative, hackathon-ready planetary intelligence platform engineered to identify, characterize, and rank unexplored terrestrial environments on Earth that share environmental, geological, topographical, and resource characteristics with potential permanent settlement locations on the **Moon** and **Mars**.

Rather than simply cataloging famous reference sites, TerraSpace AI uses real NASA and space agency datasets coupled with machine learning (**Random Forest**, **K-Means Clustering**, **Principal Component Analysis (PCA)**, and **Multi-Criteria Decision Analysis (MCDA)**) to discover and evaluate high-fidelity terrestrial analogs across the globe.

---

## 1. System Architecture & Data Flow

```
                                  +---------------------------------------+
                                  |   PUBLIC SCIENTIFIC SPACE DATASETS    |
                                  | - NASA LRO (Diviner / LOLA)           |
                                  | - NASA MRO (CRISM / HiRISE / SHARAD)  |
                                  | - NASA Earthdata (SRTM 30m, MODIS)    |
                                  | - USGS Spectroscopy / Copernicus S-2  |
                                  +---------------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |       TERRASPACE DATA PIPELINE        |
                                  |  - Planetary Baselines Vector Store   |
                                  |  - Earth Analog Geodatabase (24 Sites)|
                                  +---------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------+
|                                   AI / ML SIMILARITY & RANKING ENGINE                             |
|                                                                                                   |
|  [Random Forest Regressors]         [K-Means 5-Cluster Engine]       [Principal Component Analysis] |
|   - Feature Importance (Moon/Mars)   - Geo-Environmental Grouping     - 2D/3D Dimensional Projection  |
|                                                                                                   |
|                         [Multi-Criteria Decision Analysis (MCDA)]                                 |
|     Geological (25%) + Topo (20%) + Environment (20%) + Resources (20%) + Access (10%) + Sci (5%)    |
+---------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |       DUAL-LAYER STORAGE ENGINE       |
                                  | - Live MongoDB Connection             |
                                  | - Automatic JSON DocStore Fallback    |
                                  +---------------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |           FLASK REST API              |
                                  |   /api/locations  |  /api/analyze     |
                                  |   /api/rankings   |  /api/compare     |
                                  |   /api/recommend  |  /api/reports     |
                                  +---------------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |   REACT 19 + VITE + TAILWIND + LEAFLET|
                                  | - Interactive Global Basemap Explorer |
                                  | - Real-time MCDA Weight Tuning Sliders|
                                  | - Multi-Location Radar Comparisons    |
                                  | - Python ReportLab PDF Exporter       |
                                  +---------------------------------------+
```

---

## 2. Core Functional Modules

### Module 1: Multi-Planetary Data Integration
- **NASA Data Sources**: Shuttle Radar Topography Mission (SRTM GL1 30m), MODIS Land Surface Temperature (MOD11A2), CERES Surface Solar Irradiance, LRO LOLA & Diviner Lunar Radiometer, MRO CRISM Hyperspectral & SHARAD Subsurface Radar.
- **USGS & ESA**: USGS Mineral Spectral Library (splib07a), Copernicus Sentinel-2 MSI Multi-Spectral Indices.
- **Parameters Characterized**: Elevation, slope, surface roughness, ruggedness, basaltic content, regolith similarity, temperature extremes, diurnal swing, solar DNI, pressure, humidity, precipitation, water/ice indicators, and lava tubes.

### Module 2: Earth Analog Discovery
- **11 Reference Locations**: Atacama Desert (Chile), Death Valley (USA), Haughton Crater (Canada), McMurdo Dry Valleys (Antarctica), Ladakh (India), Rann of Kutch (India), Icelandic Highlands (Iceland), Sahara & Richat (Mauritania), Namib Erg (Namibia), Pilbara & Lake Eyre (Australia), Hawaii Shield Volcano (USA).
- **13+ AI-Discovered New Analogs**: Danakil Depression (Ethiopia), Qaidam Basin Yardangs (China), Salar de Uyuni & Altiplano (Bolivia), Craters of the Moon (Idaho, USA), Timanfaya (Canary Islands), Svalbard Permafrost (Norway), White Sands (New Mexico), Río Tinto Iron-Sulfates (Spain), Lonar Basalt Impact Crater (India), Lake Untersee (Antarctica), San Rafael Swell (Utah), Undara Lava Tubes (Australia), Axel Heiberg Island (Canada).

### Module 3: AI-Based Similarity Analysis
- **Random Forest**: Computes continuous feature importances for Lunar and Martian analog fidelity.
- **K-Means Clustering**: Partitions Earth environments into 5 planetary analog classes:
  1. *Polar Permafrost & Cryo-Regolith Analogs*
  2. *Pristine Basaltic Volcanics & Lava Tube Caves*
  3. *Hyper-Arid Salt Playas & Desert Yardangs*
  4. *High-Altitude Cold Deserts & Extreme UV Basins*
  5. *Acidic Sulfate & Iron Hydrothermal Systems*
- **PCA**: Reduces 19-dimensional environmental telemetry to 2D & 3D projection coordinates.
- **Scientific Caveat**: System strictly distinguishes between physical environmental similarities, mineralogy, terrain ruggedness, and operational simulation capability. Earth's atmosphere, 1g gravity, and geomagnetic shielding are identified as persistent reality deviations.

### Module 4: Suitability & Dynamic Ranking Engine
MCDA multi-attribute scoring model:
$$\text{Final Score} = \sum (\text{Parameter Similarity}_i \times \text{Weight}_i)$$
Default weights:
- **Geological Similarity**: 25%
- **Topographical Similarity**: 20%
- **Environmental Similarity**: 20%
- **Resource Potential**: 20%
- **Terrain Accessibility**: 10%
- **Scientific Research Value**: 5%

Classification Tiers:
- **90–100**: Extremely High Similarity
- **75–89**: High Similarity
- **60–74**: Moderate Similarity
- **40–59**: Low Similarity
- **< 40**: Very Low Similarity

### Module 5: Interactive Geospatial Visualization
- Integrated React Leaflet basemaps (Carto Dark Matter, Esri World Imagery Satellite, OpenStreetMap).
- Custom SVG circular markers color-coded by target body (Lunar cyan `#38bdf8` vs Mars rose `#f43f5e`).
- 120km influence radius circles illustrating environmental zoning.
- Detailed popup inspect drawers with verified coordinates, lithology, thermal range, and scores.

### Module 6: AI-Based Location Recommendation
Objective-driven dynamic recommendation for:
1. `Permanent Lunar Base`
2. `Mars Settlement Analog`
3. `Astronaut Training & EVA Simulation`
4. `Geological Field Research`
5. `Water Resource & Cryo-Ice Exploration`
6. `Rover & Equipment Testing`

### Module 7: Location Comparison Engine
- Head-to-head comparison of 2 or 3 locations simultaneously.
- 6-dimension Radar charts and grouped bar charts via Recharts.
- Automated AI verdict determining superior candidates for specific mission phases.

### Module 8: Explainable AI (XAI)
- Transparent breakdown of dominant parameters driving each site's score.
- Direct reporting of unmatched planetary characteristics (gravity delta, atmospheric gas ratios).
- Space agency dataset citations and recommended field research.

### Module 9: Automated PDF Research Dossiers
- Python ReportLab engine compiles publication-grade technical evaluation dossiers (`POST /api/reports/generate`).
- Includes executive scorecards, MCDA sub-domain tables, XAI rationales, and dataset citations.

---

## 3. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React, Recharts, React Leaflet, Leaflet.
- **Backend**: Python 3.11+, Flask 3.1, Flask-CORS.
- **Machine Learning**: Scikit-Learn 1.8 (Random Forest, K-Means, PCA, StandardScaler), NumPy, Pandas.
- **Database**: MongoDB (via `pymongo`) with built-in zero-downtime JSON Document Store fallback.
- **Reporting**: Python ReportLab.

---

## 4. Quick Start & Execution Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and pnpm (or npm)
- (Optional) MongoDB service running locally on `localhost:27017`

### 1. Clone & Set Up Backend

```bash
# Navigate to project directory
cd "terraspace-ai"

# Install Python requirements
pip install -r backend/requirements.txt

# Run initial dataset compile (already built in data/)
python backend/data_builder.py

# Run the 25-point integration test suite
python backend/test_api.py
```

### 2. Start the Application

#### Option A: Unified Full-Stack Server (Recommended for Hackathons)
Flask serves both the REST API on `/api/*` and the compiled React production frontend on `/`:
```bash
python backend/app.py
```
Open **http://localhost:5000** in your browser.

#### Option B: Independent Development Mode (Hot-Reloading)
In Terminal 1 (Backend):
```bash
python backend/app.py
```

In Terminal 2 (Frontend):
```bash
cd frontend
pnpm install
pnpm run dev
```
Open **http://localhost:5173** in your browser. (All `/api` requests automatically proxy to port 5000).

---

## 5. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | System health, MongoDB connectivity, and ML engine state |
| `GET` | `/api/locations` | All 24 analog locations with computed similarity scores and PCA coordinates |
| `GET` | `/api/locations/:id` | Full scientific telemetry for a specific site |
| `POST` | `/api/analyze` | Live MCDA recalculation with custom user weights, PCA, and RF importances |
| `GET` | `/api/rankings/lunar` | Top 10 ranked lunar base analog candidates |
| `GET` | `/api/rankings/mars` | Top 10 ranked Mars settlement analog candidates |
| `POST` | `/api/compare` | Head-to-head comparison of 2 or 3 locations |
| `POST` | `/api/recommend` | Dynamic recommendations for specific mission objectives |
| `GET` | `/api/datasets` | Metadata on all integrated NASA, ESA, USGS datasets |
| `POST` | `/api/reports/generate` | Generates a downloadable ReportLab PDF technical brief |
| `GET` | `/api/reports/download/:file`| Downloads the compiled PDF brief |

---

## 6. Scientific Limitations & Safety Disclaimer

TerraSpace AI is an academic and geospatial research platform. Analog similarity ratings describe environmental, mineralogical, and topographical resemblance to planetary mission scenarios. They do **not** represent human safety certification or formal authorization for extraterrestrial settlement.

