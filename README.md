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


1. Open a new terminal window (keep the API running)

2. Navigate to the frontend directory:

```
cd frontend
```

3. Open index.html in your browser:
