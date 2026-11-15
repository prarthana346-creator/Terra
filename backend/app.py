"""
TerraSpace AI - Flask REST API Backend
Intelligent Earth Analog Discovery for Permanent Moon Base and Mars Settlement Locations.
"""

import os
import sys
os.environ["LOKY_MAX_CPU_COUNT"] = "4"
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS

from backend.database.mongo_client import db_manager
from backend.ml_engine.planetary_models import ml_engine, DEFAULT_WEIGHTS
from backend.reports.pdf_generator import report_generator

app = Flask(__name__)
# Enable CORS for React frontend running on port 5173 or other origins
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/api/status", methods=["GET"])
def get_status():
    """Returns application health, database connectivity, and ML engine status."""
    db_status = db_manager.get_status()
    return jsonify({
        "status": "operational",
        "service": "TerraSpace AI Backend",
        "version": "1.0.0",
        "database": db_status,
        "ml_engine": {
            "status": "trained",
            "total_locations": len(ml_engine.locations),
            "clusters": len(ml_engine.cluster_names),
            "explained_variance_pca": ml_engine.explained_variance_ratio
        }
    })


@app.route("/api/locations", methods=["GET"])
def get_locations():
    """
    Returns all discovered Earth analog locations with their dynamic similarity scores,
    PCA coordinates, and classifications.
    Supports query param filters: category, terrain_type, min_lunar, min_mars.
    """
    analyzed_locations = ml_engine.analyze_all_locations()

    # Query parameters
    category = request.args.get("category")
    min_lunar = request.args.get("min_lunar", type=float)
    min_mars = request.args.get("min_mars", type=float)
    has_lava_tubes = request.args.get("lava_tubes")
    is_polar = request.args.get("polar")

    filtered = analyzed_locations
    if category:
        filtered = [l for l in filtered if l.get("category", "").lower() == category.lower()]
    if min_lunar is not None:
        filtered = [l for l in filtered if l.get("lunar_similarity_score", 0) >= min_lunar]
    if min_mars is not None:
        filtered = [l for l in filtered if l.get("mars_similarity_score", 0) >= min_mars]
    if has_lava_tubes is not None and has_lava_tubes.lower() == "true":
        filtered = [l for l in filtered if l.get("special_features", {}).get("lava_tubes", False)]
    if is_polar is not None and is_polar.lower() == "true":
        filtered = [l for l in filtered if l.get("special_features", {}).get("polar_region", False)]

    return jsonify({
        "count": len(filtered),
        "total_analyzed": len(analyzed_locations),
        "locations": filtered
    })


@app.route("/api/locations/<location_id>", methods=["GET"])
def get_location_details(location_id):
    """Returns complete scientific analysis of the selected location."""
    all_locations = ml_engine.analyze_all_locations()
    for loc in all_locations:
        if loc.get("id") == location_id:
            return jsonify({"status": "success", "location": loc})
    return jsonify({"status": "error", "message": f"Location '{location_id}' not found"}), 404


@app.route("/api/analyze", methods=["POST"])
def perform_analysis():
    """
    Performs dynamic planetary similarity analysis with user-configured weights.
    Returns:
    - Updated similarity scores & rankings
    - PCA 2D/3D projections
    - K-Means cluster distributions
    - Random Forest feature importances
    """
    data = request.get_json() or {}
    custom_weights = data.get("weights", DEFAULT_WEIGHTS)

    # Validate weights
    cleaned_weights = {
        k: float(custom_weights.get(k, DEFAULT_WEIGHTS.get(k, 0.2)))
        for k in DEFAULT_WEIGHTS.keys()
    }

    analyzed = ml_engine.analyze_all_locations(custom_weights=cleaned_weights)
    feature_importances = ml_engine.get_feature_importances()

    # Top Lunar and Mars
    lunar_ranked = sorted(analyzed, key=lambda x: x["lunar_similarity_score"], reverse=True)
    mars_ranked = sorted(analyzed, key=lambda x: x["mars_similarity_score"], reverse=True)

    # Log to MongoDB / document store
    db_manager.log_analysis({
        "weights": cleaned_weights,
        "top_lunar": lunar_ranked[0]["name"] if lunar_ranked else None,
        "top_mars": mars_ranked[0]["name"] if mars_ranked else None
    })

    return jsonify({
        "status": "success",
        "applied_weights": cleaned_weights,
        "pca_variance_ratio": ml_engine.explained_variance_ratio,
        "feature_importances": feature_importances,
        "clusters": ml_engine.cluster_names,
        "top_lunar_analogs": lunar_ranked[:10],
        "top_mars_analogs": mars_ranked[:10],
        "all_locations": analyzed
    })


@app.route("/api/rankings/lunar", methods=["GET"])
def get_lunar_rankings():
    """Returns top 10 ranked lunar analog locations with sub-domain scores."""
    limit = request.args.get("limit", default=10, type=int)
    analyzed = ml_engine.analyze_all_locations()
    ranked = sorted(analyzed, key=lambda x: x["lunar_similarity_score"], reverse=True)
    return jsonify({
        "target": "Moon (Lunar Base Analog)",
        "total": len(ranked),
        "rankings": ranked[:limit]
    })


@app.route("/api/rankings/mars", methods=["GET"])
def get_mars_rankings():
    """Returns top 10 ranked Martian analog locations with sub-domain scores."""
    limit = request.args.get("limit", default=10, type=int)
    analyzed = ml_engine.analyze_all_locations()
    ranked = sorted(analyzed, key=lambda x: x["mars_similarity_score"], reverse=True)
    return jsonify({
        "target": "Mars (Martian Settlement Analog)",
        "total": len(ranked),
        "rankings": ranked[:limit]
    })


@app.route("/api/compare", methods=["POST"])
def compare_locations():
    """
    Compares 2 or 3 terrestrial locations side-by-side.
    Returns radar chart metrics, sub-domain comparisons, and clear superiority rationale.
    """
    data = request.get_json() or {}
    location_ids = data.get("location_ids", [])
    if not location_ids or len(location_ids) < 2:
        return jsonify({
            "status": "error",
            "message": "Please provide 2 or 3 location_ids for comparison"
        }), 400

    result = ml_engine.compare_locations(location_ids[:3])
    return jsonify({"status": "success", "comparison": result})


@app.route("/api/recommend", methods=["POST"])
def recommend_locations():
    """
    Recommends terrestrial locations based on selected mission objective:
    - Moon Base Analog
    - Mars Base Analog
    - Astronaut Training Location
    - Geological Research
    - Water Resource Research
    - Equipment Testing
    """
    data = request.get_json() or {}
    objective = data.get("objective", "Moon Base Analog")
    limit = data.get("limit", 5)

    recommendations = ml_engine.recommend_locations(objective, limit=limit)
    return jsonify({
        "status": "success",
        "objective": objective,
        "count": len(recommendations),
        "recommendations": recommendations
    })


@app.route("/api/datasets", methods=["GET"])
def get_datasets():
    """Returns dataset sources, sensors, parameters, and metadata."""
    datasets = db_manager.get_datasets()
    baselines = ml_engine.baselines
    return jsonify({
        "status": "success",
        "earth_and_planetary_datasets": datasets,
        "planetary_ground_truth_baselines": baselines
    })


@app.route("/api/reports/generate", methods=["POST"])
def generate_report():
    """
    Generates downloadable PDF research report using Python ReportLab.
    Returns download URL and report metadata.
    """
    data = request.get_json() or {}
    loc_id = data.get("location_id")
    mission_type = data.get("mission_type", "Comprehensive")

    if not loc_id:
        return jsonify({"status": "error", "message": "location_id is required"}), 400

    all_locs = ml_engine.analyze_all_locations()
    loc = next((l for l in all_locs if l.get("id") == loc_id), None)
    if not loc:
        return jsonify({"status": "error", "message": f"Location '{loc_id}' not found"}), 404

    try:
        pdf_path = report_generator.generate_location_report(loc, mission_type)
        filename = os.path.basename(pdf_path)
        return jsonify({
            "status": "success",
            "message": f"Report generated for {loc['name']}",
            "filename": filename,
            "download_url": f"/api/reports/download/{filename}"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Report generation error: {str(e)}"}), 500


@app.route("/api/reports/download/<filename>", methods=["GET"])
def download_report(filename):
    """Serves the generated PDF report."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, "exports", filename)
    if not os.path.exists(file_path):
        return jsonify({"status": "error", "message": "Report file not found"}), 404

    return send_file(
        file_path,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename
    )


# Serve React Frontend Build if available
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path.startswith("api/"):
        return jsonify({"error": "Endpoint not found"}), 404
    target = os.path.join(FRONTEND_DIST, path)
    if path != "" and os.path.exists(target) and os.path.isfile(target):
        return send_from_directory(FRONTEND_DIST, path)
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_file):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return jsonify({
        "service": "TerraSpace AI Backend",
        "status": "Online",
        "api_documentation": "/api/status",
        "message": "Frontend build not detected in frontend/dist. Run 'pnpm run dev' in frontend/ for development."
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5055))
    print(f"[TerraSpace AI] Starting Flask REST API Backend on http://127.0.0.1:{port} ...")
    app.run(host="0.0.0.0", port=port, debug=False)
