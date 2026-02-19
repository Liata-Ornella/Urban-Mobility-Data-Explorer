NYC Urban Mobility Data Explorer
Project Overview

This project is an interactive dashboard for exploring New York City Taxi Trips data. It demonstrates full-stack development skills, including:

Data preprocessing and enrichment

Relational database design (SQLite)

Backend API development (Flask)

Frontend interactive dashboards (HTML, CSS, JavaScript, Chart.js)

Analytical insights with dynamic charts, tables, and downloadable CSV

Users can explore trip durations, speeds, distances, and passenger metadata, and filter trips by vendor, passenger count, or date range.

Folder Structure
urban-mobility-data-explorer/
│
├── backend/
│   ├── app.py                # Flask API
│   ├── requirements.txt      # Python dependencies
│   ├── database/
│   │   ├── trips.db          # SQLite DB (auto-created)
│   │   ├── schema.sql
│   │   ├── init_db.py
│   │   └── insert_data.py
│   └── data_processing/      # Python scripts for cleaning/enriching CSV
│       ├── load_csv.py
│       ├── clean_data.py
│       └── enrich_data.py
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
│
└── data/
    └── train.csv

Setup Instructions
1. Install Python dependencies
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# or source venv/bin/activate # Mac/Linux
pip install flask

2. Initialize Database
cd backend/database
python init_db.py
python insert_data.py


init_db.py creates trips.db

insert_data.py reads data/train.csv and populates enriched data

3. Start Backend API
cd backend
python app.py


API runs at: http://127.0.0.1:5000/

Sample trips endpoint: http://127.0.0.1:5000/trips/sample

4. Open Frontend Dashboard

Open frontend/index.html in a browser

Dashboard features:

Vendor & Passenger filters

Date range filter

Speed & Duration bar charts

Speed vs Distance scatter plot

Top 5 longest trips table

Download filtered CSV
