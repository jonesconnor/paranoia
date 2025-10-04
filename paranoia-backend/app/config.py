"""Configuration settings for the ParaNoia application backend."""

import os


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/paranoialocal")
