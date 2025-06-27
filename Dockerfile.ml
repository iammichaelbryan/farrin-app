#Dockerfile for Python ML Model Service
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY src/main/python/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all Python files
COPY src/main/python/ .

# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_APP=model_service.py
ENV FLASK_ENV=production

# Expose the port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Run the application
CMD ["python", "model_service.py"]