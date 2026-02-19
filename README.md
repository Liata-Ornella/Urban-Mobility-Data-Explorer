<<<<<<< HEAD
# 🚖 NYC Urban Mobility Data Explorer

An interactive dashboard for exploring New York City taxi trip data with dynamic visualizations and analytics.

## 📋 Project Overview

This full-stack application demonstrates:
- **Data Preprocessing**: Cleaning and enriching 7.6M taxi trip records
- **Database Design**: Flexible SQLite/PostgreSQL support
- **Backend API**: Flask REST API with filtering and analytics
- **Frontend Dashboard**: Interactive HTML/CSS/JS with Chart.js
- **Analytical Insights**: Dynamic charts, tables, and CSV export

Users can explore trip patterns, filter by multiple criteria, and visualize urban mobility trends.

---

## 🏗️ Project Structure

```
nyc-urban-mobility-explorer/
│
├── backend/
│ ├── app/ # Flask application
│ │ ├── init.py
│ │ ├── models.py # Database models
│ │ ├── routes/ # API endpoints
│ │ │ ├── trips.py
│ │ │ └── zones.py
│ │ └── services/ # Business logic
│ │ ├── data_processor.py
│ │ ├── feature_engineering.py
│ │ └── custom_algorithm.py
│ │
│ ├── scripts/ # Data processing scripts
│ │ ├── clean_data.py
│ │ └── load_data.py
│ │
│ ├── config.py # Configuration (DB_TYPE support)
│ ├── requirements.txt # Python dependencies
│ ├── run.py # Start Flask app
│ └── .env # Environment variables (create this)
│
├── frontend/
│ ├── index.html # Main dashboard
│ ├── css/
│ │ └── style.css # Dashboard styling
│ └── js/
│ └── main.js # Dashboard interactivity
│
├── data/
│ ├── raw/ # Place raw CSV files here
│ │ ├── yellow_tripdata_2019-01.csv
│ │ └── taxi_zone_lookup.csv
│ └── processed/ # Cleaned data (auto-created)
│
└── README.md # This file
```


---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Docker (optional, for PostgreSQL)
- Modern web browser (Chrome, Firefox, Edge)

---

## 🔧 Setup Instructions

### Step 1: Clone the Repository

```bash
git https://github.com/Liata-Ornella/Urban-Mobility-Data-Explorer.git
cd Urban-Mobility-Data-Explorer
```
### Step 2: Set Up Python Virtual Environment

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

### Step 3: Choose Your Database
This project supports two database options. Choose one:

Option A: SQLite (Default - Simple, No Setup)
SQLite works out of the box with zero configuration. Perfect for local development.

No additional steps required! Just proceed to Step 4.

###  Option B: PostgreSQL with Docker (Production-like)
This option gives you a real PostgreSQL database running in a Docker container.

- 3B.1: Pull and Run PostgreSQL 17

# Pull PostgreSQL 17 image and run container
```
docker run --name nyc-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=nyc_db \
  -p 5432:5432 \
  -d postgres:17
```
# Verify container is running
docker ps
You should see the nyc-postgres container in the list.

- 3B.2: Configure Environment Variables
Create a .env file in the backend/ directory:

# backend/.env

# Set database type to postgres
DB_TYPE=postgres

# PostgreSQL connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nyc_db

# Flask settings
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

Note: If you ever want to switch back to SQLite, simply set DB_TYPE=sqlite in your .env file or delete the file entirely.

### Step 4: Prepare Your Data
Place the raw data files in the data/raw/ directory:

```
data/raw/
├── yellow_tripdata_2019-01.csv    # Main trip data
└── taxi_zone_lookup.csv            # Zone lookup table
```

If you don't have these files, download them from the NYC TLC website.

### Step 5: Initialize the Database

Now we'll create the database tables based on your chosen database type.

```
# Make sure you're in the backend directory with venv activated
cd backend

# The database tables will be created automatically when you run:
python scripts/load_data.py
```

This script will:

1. Check your database configuration (SQLite or PostgreSQL)

2. Create the necessary tables

3. Load and process the data

### Step 6: Clean and Load Data
Run the data processing pipeline:

```
# Clean the raw data and add engineered features
python scripts/clean_data.py

# Load the cleaned data into your database
python scripts/load_data.py
```

Expected output:
```
🚀 Starting data cleaning...
📊 Columns in CSV: ['VendorID', 'tpep_pickup_datetime', ...]
✅ Cleaning complete!
   Original: 7,667,792 trips
   Cleaned:  7,535,237 trips
   Removed:  132,555 trips

🚀 Starting database load...
✅ Database connection successful!
📦 Loading zones... ✅ Loaded 263 zones
📦 Loading trips... ✅ Loaded 10,000 trips (test batch)
```

### Step 7: Start the backend API

# Make sure you're in the backend directory with venv activated
python run.py

You should see

```
* Running on http://127.0.0.1:5000
* Database connected: postgresql://postgres:****@localhost:5432/nyc_db (or SQLite)
* Swagger UI available at http://127.0.0.1:5000/apidocs/
* Press CTRL+C to quit
```

### Step 8: Open the Frontend Dashboard
=======
# Urban Pulse — NYC Taxi Mobility Explorer

A fullstack data analytics platform for exploring urban movement patterns across 7.6 million NYC Yellow Taxi trips (January 2019).

**Video Walkthrough:** [INSERT YOUR VIDEO LINK HERE]

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
>>>>>>> 2822984 (docs: add README)

```bash
# SQLite (default — zero config)
python run.py

<<<<<<< HEAD
1. Open a new terminal window (keep the API running)

2. Navigate to the frontend directory:

```
cd frontend
```

3. Open index.html in your browser:
=======
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
>>>>>>> 2822984 (docs: add README)
