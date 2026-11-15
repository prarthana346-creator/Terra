"""
TerraSpace AI - Backend API Integration Test Suite
Validates all required REST API endpoints, AI models, and ReportLab PDF outputs.
"""

import os
import sys
os.environ["LOKY_MAX_CPU_COUNT"] = "4"
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json
from backend.app import app


def run_tests():
    client = app.test_client()
    passed = 0
    total = 0

    def assert_eq(condition, name):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {name}")
        else:
            print(f"  [FAIL] {name}")

    print("\n================== TERRASPACE AI ENDPOINT VALIDATION ==================")

    # Test 1: GET /api/status
    res = client.get("/api/status")
    assert_eq(res.status_code == 200, "GET /api/status returns HTTP 200")
    data = res.get_json()
    assert_eq(data.get("service") == "TerraSpace AI Backend", "Status returns correct service identity")

    # Test 2: GET /api/locations
    res = client.get("/api/locations")
    assert_eq(res.status_code == 200, "GET /api/locations returns HTTP 200")
    data = res.get_json()
    assert_eq(data.get("count") >= 24, f"Locations count ({data.get('count')}) contains all reference + discovered sites")

    # Test 3: GET /api/locations/:id
    res = client.get("/api/locations/atacama-chile")
    assert_eq(res.status_code == 200, "GET /api/locations/atacama-chile returns HTTP 200")
    data = res.get_json()
    assert_eq(data.get("location", {}).get("name") is not None, "Location details contain name and telemetry")

    # Test 4: POST /api/analyze (Custom MCDA Weights)
    payload = {
        "weights": {
            "geological": 0.30,
            "topographical": 0.20,
            "environmental": 0.20,
            "resource": 0.15,
            "accessibility": 0.10,
            "scientific_value": 0.05
        }
    }
    res = client.post("/api/analyze", json=payload)
    assert_eq(res.status_code == 200, "POST /api/analyze returns HTTP 200")
    data = res.get_json()
    assert_eq(len(data.get("top_lunar_analogs", [])) == 10, "Top 10 Lunar analogs calculated dynamically")
    assert_eq(len(data.get("top_mars_analogs", [])) == 10, "Top 10 Mars analogs calculated dynamically")
    assert_eq("lunar_feature_importance" in data.get("feature_importances", {}), "Random Forest feature importance returned")

    # Test 5: GET /api/rankings/lunar
    res = client.get("/api/rankings/lunar?limit=10")
    assert_eq(res.status_code == 200, "GET /api/rankings/lunar returns HTTP 200")
    data = res.get_json()
    assert_eq(len(data.get("rankings", [])) == 10, "Ranked list of Top 10 lunar analog locations")

    # Test 6: GET /api/rankings/mars
    res = client.get("/api/rankings/mars?limit=10")
    assert_eq(res.status_code == 200, "GET /api/rankings/mars returns HTTP 200")
    data = res.get_json()
    assert_eq(len(data.get("rankings", [])) == 10, "Ranked list of Top 10 Mars analog locations")

    # Test 7: POST /api/compare
    compare_payload = {
        "location_ids": ["atacama-chile", "mcmurdo-dry-valleys-antarctica", "iceland-volcanic-highlands"]
    }
    res = client.post("/api/compare", json=compare_payload)
    assert_eq(res.status_code == 200, "POST /api/compare returns HTTP 200")
    data = res.get_json()
    assert_eq("verdict" in data.get("comparison", {}), "Comparative analysis returns AI verdict")
    assert_eq(len(data.get("comparison", {}).get("radar_data", [])) > 0, "Comparative radar chart data returned")

    # Test 8: POST /api/recommend
    rec_payload = {"objective": "Moon Base Analog", "limit": 5}
    res = client.post("/api/recommend", json=rec_payload)
    assert_eq(res.status_code == 200, "POST /api/recommend returns HTTP 200")
    data = res.get_json()
    assert_eq(len(data.get("recommendations", [])) == 5, "Dynamic recommendations returned for Moon Base Analog")

    # Test 9: GET /api/datasets
    res = client.get("/api/datasets")
    assert_eq(res.status_code == 200, "GET /api/datasets returns HTTP 200")
    data = res.get_json()
    assert_eq(len(data.get("earth_and_planetary_datasets", [])) >= 9, "NASA, ESA, USGS datasets catalog metadata returned")

    # Test 10: POST /api/reports/generate
    report_payload = {
        "location_id": "atacama-chile",
        "mission_type": "Permanent Lunar Base Candidate Report"
    }
    res = client.post("/api/reports/generate", json=report_payload)
    assert_eq(res.status_code == 200, "POST /api/reports/generate returns HTTP 200")
    data = res.get_json()
    filename = data.get("filename")
    assert_eq(filename is not None and filename.endswith(".pdf"), f"ReportLab generated valid PDF ({filename})")

    # Test 11: GET /api/reports/download/<filename>
    res = client.get(f"/api/reports/download/{filename}")
    assert_eq(res.status_code == 200 and res.content_type == "application/pdf", "GET /api/reports/download serves binary PDF")

    # Test 12: GET / (Frontend Serving)
    res = client.get("/")
    assert_eq(res.status_code == 200, "GET / serves built frontend React HTML")

    print("\n=======================================================================")
    print(f"TEST RESULTS: {passed} / {total} Passed ({round(passed / total * 100, 1)}%)")
    print("=======================================================================\n")
    return passed == total


if __name__ == "__main__":
    success = run_tests()
    if not success:
        exit(1)
