"""
TerraSpace AI - Database Layer with Dual Mode (MongoDB + JSON Document Store Fallback)
Ensures zero-downtime reliability whether a MongoDB server is locally available or not.
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False


class MongoStorageManager:
    def __init__(self, mongo_uri: Optional[str] = None, db_name: str = "terraspace_ai"):
        self.mongo_uri = mongo_uri or os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = db_name
        self.is_connected = False
        self.client = None
        self.db = None
        
        # Path to local JSON fallback store
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.fallback_file = os.path.join(base_dir, "data", "db_store.json")
        self.earth_analogs_file = os.path.join(base_dir, "data", "earth_analogs.json")
        self.dataset_catalog_file = os.path.join(base_dir, "data", "dataset_catalog.json")
        
        self._init_connection()
        self._seed_initial_data_if_needed()

    def _init_connection(self):
        """Attempts to connect to MongoDB with a short timeout."""
        if not PYMONGO_AVAILABLE:
            print("[Database] pymongo not installed, using fallback JSON document store.")
            self.is_connected = False
            return

        try:
            # 1.5 second timeout to avoid startup delays if mongod is not running
            self.client = MongoClient(self.mongo_uri, serverSelectionTimeoutMS=1500)
            # Trigger server selection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            self.is_connected = True
            print(f"[Database] Successfully connected to live MongoDB at {self.mongo_uri}")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            self.is_connected = False
            self.client = None
            self.db = None
            print(f"[Database] MongoDB not reachable ({type(e).__name__}). Seamlessly using JSON document store.")

    def _load_fallback(self) -> Dict[str, Any]:
        """Loads data from the JSON fallback store."""
        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"locations": [], "datasets": [], "analysis_logs": []}

    def _save_fallback(self, data: Dict[str, Any]):
        """Persists data to the JSON fallback store."""
        os.makedirs(os.path.dirname(self.fallback_file), exist_ok=True)
        with open(self.fallback_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    def _seed_initial_data_if_needed(self):
        """Seeds locations and datasets if database is empty."""
        initial_locations = []
        if os.path.exists(self.earth_analogs_file):
            with open(self.earth_analogs_file, "r", encoding="utf-8") as f:
                initial_locations = json.load(f)

        initial_datasets = []
        if os.path.exists(self.dataset_catalog_file):
            with open(self.dataset_catalog_file, "r", encoding="utf-8") as f:
                initial_datasets = json.load(f)

        if self.is_connected:
            try:
                loc_col = self.db["locations"]
                if loc_col.count_documents({}) == 0 and initial_locations:
                    loc_col.insert_many(initial_locations)
                    print(f"[Database] Seeded {len(initial_locations)} locations into MongoDB.")

                ds_col = self.db["datasets"]
                if ds_col.count_documents({}) == 0 and initial_datasets:
                    ds_col.insert_many(initial_datasets)
                    print(f"[Database] Seeded {len(initial_datasets)} datasets into MongoDB.")
            except Exception as e:
                print(f"[Database] Warning seeding MongoDB: {e}")
        else:
            fallback = self._load_fallback()
            if not fallback.get("locations") and initial_locations:
                fallback["locations"] = initial_locations
            if not fallback.get("datasets") and initial_datasets:
                fallback["datasets"] = initial_datasets
            self._save_fallback(fallback)

    def get_locations(self) -> List[Dict[str, Any]]:
        """Retrieves all terrestrial analog locations."""
        if self.is_connected:
            try:
                cursor = self.db["locations"].find({}, {"_id": 0})
                return list(cursor)
            except Exception as e:
                print(f"[Database] Error reading from MongoDB: {e}")
        
        fallback = self._load_fallback()
        return fallback.get("locations", [])

    def get_location_by_id(self, loc_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a specific location by unique ID."""
        if self.is_connected:
            try:
                doc = self.db["locations"].find_one({"id": loc_id}, {"_id": 0})
                if doc:
                    return doc
            except Exception as e:
                print(f"[Database] Error querying MongoDB for location {loc_id}: {e}")

        for loc in self.get_locations():
            if loc.get("id") == loc_id:
                return loc
        return None

    def save_location(self, location_data: Dict[str, Any]) -> bool:
        """Upserts a location record."""
        loc_id = location_data.get("id")
        if not loc_id:
            return False

        if self.is_connected:
            try:
                self.db["locations"].update_one(
                    {"id": loc_id},
                    {"$set": location_data},
                    upsert=True
                )
                return True
            except Exception as e:
                print(f"[Database] Error upserting to MongoDB: {e}")

        fallback = self._load_fallback()
        locations = fallback.get("locations", [])
        updated = False
        for i, loc in enumerate(locations):
            if loc.get("id") == loc_id:
                locations[i] = location_data
                updated = True
                break
        if not updated:
            locations.append(location_data)
        fallback["locations"] = locations
        self._save_fallback(fallback)
        return True

    def get_datasets(self) -> List[Dict[str, Any]]:
        """Returns metadata about all planetary and Earth scientific datasets."""
        if self.is_connected:
            try:
                cursor = self.db["datasets"].find({}, {"_id": 0})
                return list(cursor)
            except Exception as e:
                print(f"[Database] Error fetching datasets from MongoDB: {e}")

        fallback = self._load_fallback()
        return fallback.get("datasets", [])

    def log_analysis(self, payload: Dict[str, Any]):
        """Logs an analysis execution for audit and tracking."""
        record = {
            "timestamp": datetime.utcnow().isoformat(),
            **payload
        }
        if self.is_connected:
            try:
                self.db["analysis_logs"].insert_one(record)
                return
            except Exception as e:
                print(f"[Database] Error logging to MongoDB: {e}")

        fallback = self._load_fallback()
        logs = fallback.get("analysis_logs", [])
        logs.append(record)
        fallback["analysis_logs"] = logs[-100:]  # Keep last 100 entries
        self._save_fallback(fallback)

    def get_status(self) -> Dict[str, Any]:
        """Returns database connectivity and statistics."""
        return {
            "mode": "Live MongoDB" if self.is_connected else "Document Store (Fallback Active)",
            "mongodb_connected": self.is_connected,
            "mongo_uri": self.mongo_uri if self.is_connected else None,
            "total_locations": len(self.get_locations()),
            "total_datasets": len(self.get_datasets()),
            "status": "Healthy"
        }


# Singleton instance
db_manager = MongoStorageManager()

