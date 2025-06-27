#!/bin/bash

echo "🚀 Starting Farrin App with Docker..."

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# Remove old images to ensure fresh build
echo "Removing old images..."
docker-compose build --no-cache

# Start all services
echo "Starting all services..."
docker-compose up -d

echo "✅ Services started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8081"
echo "🗄️  Database: localhost:3307"
echo ""
echo "📊 View logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"