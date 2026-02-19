import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/nyc_db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SECRET_KEY = 'dev-key-for-nyc-taxi'