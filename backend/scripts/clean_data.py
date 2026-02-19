# scripts/clean_data.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.data_processor import DataProcessor

def main():
    print("🚀 Starting data cleaning...")
    
    # Create processor
    processor = DataProcessor()
    
    # Load raw data
    processor.load_data(
        'data/raw/yellow_tripdata_2019-01.csv',
        'data/raw/taxi_zone_lookup.csv'
    )
    
    # Clean it
    processor.clean_data()
    
    # Add features
    processor.engineer_features()
    
    # Save cleaned data
    processor.trips_df.to_csv('data/processed/cleaned_trips.csv', index=False)
    
    # Show summary
    summary = processor.get_cleaning_summary()
    print(f"\n✅ Cleaning complete!")
    print(f"   Original: {summary['original_rows']} trips")
    print(f"   Cleaned:  {summary['cleaned_rows']} trips")
    print(f"   Removed:  {summary['removed_rows']} trips")
    
    for step in summary['cleaning_steps']:
        print(f"   - {step}")

if __name__ == '__main__':
    main()