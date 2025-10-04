"""Configuration settings for the ParaNoia application backend."""

import os


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/paranoialocal")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")
