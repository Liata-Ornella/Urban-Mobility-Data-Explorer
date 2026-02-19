# Urban Pulse — NYC Taxi Mobility Explorer

A fullstack data analytics platform for exploring urban movement patterns across 7.6 million NYC Yellow Taxi trips (January 2019).

**Video Walkthrough:** [(https://youtu.be/syko6gKPAVI)]

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js (optional, for Live Server)
- Git

### 1. Clone and Setup Backend

```bash
git clone https://github.com/YOUR_REPO/Urban-Mobility-Data-Explorer.git
cd Urban-Mobility-Data-Explorer/backend
pip install -r requirements.txt
```

### 2. Download Data Files

Download these files into `backend/data/raw/`:

| File | Source | Size |
|------|--------|------|
| `yellow_tripdata_2019-01.csv` | [NYC TLC Trip Data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) | ~687 MB |
| `taxi_zone_lookup.csv` | [TLC Lookup Table](https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv) | 12 KB |
| `taxi_zones.zip` | [TLC Spatial Metadata](https://d37ci6vzurychx.cloudfront.net/misc/taxi_zones.zip) | ~850 KB |

### 3. Run Data Pipeline

```bash
cd backend

# Step 1: Clean raw data (outputs 7.5M cleaned rows)
python scripts/clean_data.py

# Step 2: Load random sample into database
python -c "
import pandas as pd
from app import create_app
from app.extensions import db
app = create_app()
with app.app_context():
    db.create_all()
    df = pd.read_csv('data/processed/cleaned_trips.csv')
    sample = df.sample(n=10000, random_state=42)
    sample = sample.rename(columns={'VendorID':'vendor_id','RatecodeID':'ratecode_id','PULocationID':'pulocation_id','DOLocationID':'dolocation_id'})
    sample.to_sql('trips', db.engine, if_exists='append', index=False)
    print('Loaded', len(sample), 'trips')
"
```

### 4. Start Backend

```bash
python run.py
```

Flask runs on `http://127.0.0.1:5000`

### 5. Start Frontend

Open `frontend/index.html` with Live Server (VS Code extension) or any HTTP server:

```bash
cd ../frontend
# Option A: VS Code Live Server (right-click index.html → Open with Live Server)
# Option B: Python HTTP server
python -m http.server 5500
```

Dashboard loads at `http://127.0.0.1:5500/frontend/index.html`

---

## Project Structure

```
Urban-Mobility-Data-Explorer/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── models.py            # Trip and Zone SQLAlchemy models
│   │   ├── extensions.py        # DB and migration setup
│   │   ├── config.py            # Dual SQLite/PostgreSQL config
│   │   ├── routes/
│   │   │   ├── trips.py         # /api/trips/ endpoints
│   │   │   ├── zones.py         # /api/zones/ endpoints
│   │   │   └── analytics.py     # /api/analytics/ endpoints
│   │   └── services/
│   │       ├── data_processor.py # Cleaning and feature engineering
│   │       └── top_routes.py     # Custom QuickSort algorithm
│   ├── scripts/
│   │   ├── clean_data.py        # Data cleaning pipeline
│   │   └── load_data.py         # Database loader
│   ├── data/
│   │   ├── raw/                 # Original CSV/Parquet files
│   │   └── processed/           # Cleaned output
│   ├── run.py                   # Entry point
│   └── requirements.txt
├── frontend/
│   ├── index.html               # Dashboard page
│   ├── css/style.css            # Warm theme styling
│   └── js/
│       ├── charts.js            # 8 Chart.js visualizations
│       └── main.js              # API integration, filters, search
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips/?per_page=N` | Paginated trip records |
| GET | `/api/trips/<id>` | Single trip by ID |
| GET | `/api/zones/` | All taxi zones with borough info |
| GET | `/api/analytics/top-routes` | Top routes via custom QuickSort |
| GET | `/api/analytics/summary` | Aggregate statistics |

---

## Database

Dual-database support via environment variable:

```bash
# SQLite (default — zero config)
python run.py

# PostgreSQL
export DB_TYPE=postgres
export DATABASE_URL=postgresql://user:pass@localhost:5432/nyc_db
python run.py
```

**Schema:** Normalized with `trips` (fact) and `zones` (dimension) tables. Foreign keys on `pulocation_id` and `dolocation_id` reference `zones.location_id`.

---

## Data Pipeline

| Step | Input | Output | Records |
|------|-------|--------|---------|
| Raw data | yellow_tripdata_2019-01.csv | — | 7,667,792 |
| Cleaning | Raw CSV | cleaned_trips.csv | 7,535,237 (98.3%) |
| Loading | Cleaned CSV (random sample) | SQLite DB | 10,000 |

**Cleaning removes:** zero passengers (117K), invalid fares (9.5K), time violations (5.7K), distance outliers (>200mi), fare outliers (>$500)

**Features engineered:** trip_duration_minutes, trip_speed_mph, fare_per_mile, is_weekend, time_of_day_category

---

## Custom Algorithm

**ManualTopRoutesAnalyzer** (`backend/app/services/top_routes.py`)

Identifies the most popular pickup-dropoff zone pairs using:
1. Manual hash map for frequency counting (no Counter)
2. Custom QuickSort for ranking (no built-in sort)

Complexity: O(n + k log k) average, where n = trips, k = unique routes

---

## Dashboard Features

- 8 interactive charts (speed histogram, duration distribution, scatter plots, borough bars, payment donut, hourly volume with fare overlay, fare-distance correlation, day×hour heatmap)
- Animated KPI counter cards
- Functional search bar with section navigation
- Vendor/passenger/date filters with real-time chart updates
- CSV export of filtered data
- Toast notifications
- Scroll-spy sidebar navigation
- Responsive design (mobile breakpoints)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+, Chart.js |
| Backend | Python, Flask, SQLAlchemy, Alembic |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Data Processing | Pandas, NumPy |
| Version Control | Git + GitHub |

---

## Team

| Member | Contributions |
|--------|--------------|
| David Muotoh-Francis | Frontend dashboard, backend API, data pipeline, custom algorithm, deployment config |
| Christian Mpano | Database design, data acquisition, testing |
| Umutoni Kenia | Data cleaning support, documentation |
| Liata Sifa Ornella | Frontend testing, quality assurance |
| Nathanaella Hirwa | Data analysis, visualization review |
