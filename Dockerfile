# ==========================================
# STAGE 1: Build React Frontend
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Python Backend & Unified Server
# ==========================================
FROM python:3.12-slim

# Install system libraries for OpenCV, audio codecs, and signal processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy Backend codebase
COPY backend/ ./backend/

# Copy compiled Frontend assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8000

# Start Unified ASGI server with dynamic Railway PORT binding
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
