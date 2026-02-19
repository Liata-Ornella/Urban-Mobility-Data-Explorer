import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.data_processor import DataProcessor

def main():
    print("Starting data cleaning...")

    processor = DataProcessor()

    trips_path = 'data/raw/yellow_tripdata_2019-01.parquet'
    if not os.path.exists(trips_path):
        trips_path = 'data/raw/yellow_tripdata_2019-01.csv'

    processor.load_data(
        trips_path,
        'data/raw/taxi_zone_lookup.csv'
    )

    processor.clean_data()
    processor.engineer_features()

    os.makedirs('data/processed', exist_ok=True)
    processor.trips_df.to_csv('data/processed/cleaned_trips.csv', index=False)

    summary = processor.get_cleaning_summary()
    print(f"\nCleaning complete!")
    print(f"   Original: {summary['original_rows']} trips")
    print(f"   Cleaned:  {summary['cleaned_rows']} trips")
    print(f"   Removed:  {summary['removed_rows']} trips")

    for step in summary['cleaning_steps']:
        print(f"   - {step}")

if __name__ == '__main__':
    main()