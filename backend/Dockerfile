FROM python:3.12-slim

# Install core OS dependencies for OpenCV, ffmpeg, and sound signal processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source tree
COPY . .

EXPOSE 8000

# Run using ASGI production server on dynamic Railway port
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
