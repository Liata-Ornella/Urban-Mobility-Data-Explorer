# scripts/load_data.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
from app import create_app
from app.extensions import db
from app.models import Zone, Trip


def load_zones():
    """Load zones from CSV to database"""
    if Zone.query.first():
        print("⏭️  Zones already loaded, skipping.")
        return

    print("📦 Loading zones...")
    df = pd.read_csv('data/raw/taxi_zone_lookup.csv')
    df = df.replace({np.nan: None})

    zones = [
        Zone(
            location_id=row['LocationID'],
            borough=row['Borough'] if pd.notna(row['Borough']) else 'Unknown',
            zone=row['Zone'] if pd.notna(row['Zone']) else 'Unknown',
            service_zone=row['service_zone'] if pd.notna(row['service_zone']) else 'Unknown'
        )
        for _, row in df.iterrows()
    ]

    db.session.add_all(zones)
    db.session.commit()
    print(f"✅ Loaded {len(zones)} zones")


def load_trips():
    """Load cleaned trips to database"""
    if Trip.query.first():
        print("⏭️  Trips already loaded, skipping.")
        return

    print("📦 Loading trips...")

    cleaned_path = 'data/processed/cleaned_trips.csv'
    if not os.path.exists(cleaned_path):
        print("❌ Cleaned trips file not found! Run clean_data.py first.")
        return

    df = pd.read_csv(cleaned_path, nrows=10000)
    df = df.replace({np.nan: None})

    count = 0
    skipped = 0
    batch_size = 1000
    trips_batch = []

    for _, row in df.iterrows():
        try:
            trip = Trip(
                vendor_id=row['VendorID'],
                pickup_datetime=row['pickup_datetime'],
                dropoff_datetime=row['dropoff_datetime'],
                passenger_count=row['passenger_count'],
                trip_distance=row['trip_distance'],
                pulocation_id=row['PULocationID'],
                dolocation_id=row['DOLocationID'],
                fare_amount=row['fare_amount'],
                total_amount=row['total_amount'],
                trip_duration_minutes=row['trip_duration_minutes'],
                trip_speed_mph=row['trip_speed_mph'],
                fare_per_mile=row['fare_per_mile'],
                is_weekend=row['is_weekend'],
                time_of_day_category=row['time_of_day_category']
            )
            trips_batch.append(trip)
            count += 1

            if len(trips_batch) >= batch_size:
                db.session.add_all(trips_batch)
                db.session.commit()
                print(f"   Loaded {count} trips...")
                trips_batch = []

        except Exception as e:
            db.session.rollback()
            skipped += 1
            print(f"   ⚠️  Skipping row {count + skipped}: {e}")
            continue

    # Commit remaining batch
    if trips_batch:
        db.session.add_all(trips_batch)
        db.session.commit()

    print(f"✅ Loaded {count} trips ({skipped} skipped)")


def main():
    print("🚀 Starting database load...")

    app = create_app()
    with app.app_context():
        inspector = db.inspect(db.engine)
        existing_tables = inspector.get_table_names()
        print(f"📊 Existing tables: {existing_tables}")

        if 'zones' not in existing_tables or 'trips' not in existing_tables:
            print("❌ Tables not found. Run: flask db upgrade")
            return

        load_zones()
        load_trips()

    print("🎉 Done!")


if __name__ == '__main__':
    main()