# Farrin Travel Companion - User Manual

## Table of Contents
1. [Development Setup](#development-setup)
2. [User Management](#user-management)
3. [Trip Creation & Planning](#trip-creation--planning)
4. [Personalized Recommendations](#personalized-recommendations)
5. [External Integration](#external-integration)
6. [Troubleshooting](#troubleshooting)

---

## Development Setup

### Prerequisites
- **Docker** and **Docker Compose**
- **Git** (for cloning the repository)

### Quick Start
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/farrin-app.git
   cd farrin-app
   ```

2. **Start All Services**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - **MySQL Database** (Port 3307)
   - **Backend API** (Port 8081) 
   - **Frontend** (Port 3000)
   - **ML Service** (Port 5000)

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8081

*[Picture Placeholder: Docker services running in terminal]*

### Service Management
```bash
# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs [service-name]
```

*[Picture Placeholder: Docker compose commands]*

---

## User Management

### Account Registration
The system supports user registration with the following required fields:

1. **Personal Information**
   - First Name
   - Last Name
   - Email Address
   - Password
   - Date of Birth
   - Gender (Optional)
   - Citizenship(s) - Select from available countries

*[Picture Placeholder: Registration form with all fields]*

### Authentication
- **Login**: Email and password authentication
- **Session Management**: JWT token-based authentication
- **Password Reset**: Email-based password reset flow

*[Picture Placeholder: Login page]*

### Profile Management
Once logged in, users can:

1. **Update Profile Information**
   - Modify personal details
   - Update contact information
   - Change citizenship information

*[Picture Placeholder: Profile edit form]*

2. **Travel Preferences Questionnaire**
   - Budget preferences (accommodation, transportation, total trip)
   - Travel interests: Adventure, Relaxation, Cultural Experience, Nature
   - Travel style: Casual, Frequent, Business, Enthusiast, Organizer
   - Preferred climate types
   - Preferred seasons
   - Accommodation type preferences: Hotel, Airbnb, Lodge
   - Transportation preferences (currently flights only)
   - Average travel duration

*[Picture Placeholder: Questionnaire interface]*

3. **Travel History Management**
   - Add past travel experiences
   - Rate previous trips (1-5 stars)
   - Categorize trip types: Business, Leisure, Adventure, Cultural, Relaxation
   - Track visited destinations

*[Picture Placeholder: Travel history interface]*

---

## Trip Creation & Planning

### Trip Creation Process

1. **Basic Trip Setup**
   - Select destination from available destinations database
   - Choose trip type: Solo, Family, Friends
   - Set start date and duration
   - Specify number of travelers

*[Picture Placeholder: Trip creation form]*

2. **Trip Types Supported**
   - **Solo Travel**: Individual trip planning
   - **Family Travel**: Family-oriented trip planning
   - **Friends Travel**: Group trip coordination

### Trip Management

1. **Trip Dashboard**
   - View all created trips
   - Trip status tracking: Planned, Ongoing, Completed, Cancelled
   - Quick access to trip details

*[Picture Placeholder: Trip dashboard showing multiple trips]*

2. **Itinerary Management**
   The itinerary view provides comprehensive trip planning:

   **Overview Tab**
   - Trip summary information
   - Destination details
   - Trip duration and dates
   - Quick daily overview

   *[Picture Placeholder: Itinerary overview tab]*

   **Daily Timeline Tab**
   - Day-by-day schedule management
   - Event types: Sightseeing, Dining, Activity, Transport, Accommodation
   - Time-based organization
   - Cost tracking per event
   - Event status (confirmed/unconfirmed)

   *[Picture Placeholder: Daily timeline with events]*

   **Bookings Tab**
   - **Flight Bookings**: Track flight reservations
   - **Accommodation Bookings**: Hotel and lodging confirmations
   - **Car Rentals & Transport**: Vehicle and transport bookings
   - Full CRUD operations: Create, Read, Update, Delete bookings
   - Status tracking: Confirmed, Pending, Cancelled
   - Confirmation code management

   *[Picture Placeholder: Bookings management interface]*

   **Weather Tab**
   - 7-day weather forecast
   - Daily high/low temperatures
   - Precipitation probability
   - Wind speed and humidity
   - UV index
   - Weather-based activity recommendations

   *[Picture Placeholder: Weather forecast display]*

   **Budget Tab**
   - Total trip budget tracking
   - Category-based spending: Accommodation, Food, Activities, Transport
   - Daily budget breakdown
   - Cost visualization with charts

   *[Picture Placeholder: Budget tracking interface]*

### Event Management
- **Add Events**: Create new activities, dining, transport, or accommodation events
- **Edit Events**: Modify existing event details
- **Time Management**: Schedule events with specific times and durations
- **Cost Tracking**: Track costs associated with each event
- **Location Integration**: Add location details for each event

*[Picture Placeholder: Add event modal]*

---

## Personalized Recommendations

### Destination Recommendations

1. **Feed View**
   - AI-powered destination recommendations based on user preferences
   - Destination cards showing:
     - High-quality destination images
     - Destination name and country
     - Brief descriptions
     - Recommendation scores

*[Picture Placeholder: Destination feed with recommendation cards]*

2. **Recommendation Algorithm**
   The system uses user preferences from the questionnaire to generate personalized recommendations:
   - Budget preferences
   - Travel interests and style
   - Climate preferences
   - Historical travel data
   - Seasonal preferences

3. **User Interactions**
   - **Like Destinations**: Mark destinations of interest
   - **Bucket List**: Save destinations for future planning
   - **Plan Trip**: Direct trip creation from recommendations

*[Picture Placeholder: Destination card with interaction buttons]*

### Machine Learning Integration
- **ML Service**: Python-based recommendation engine (Port 5000)
- **Real-time Processing**: Dynamic recommendation updates
- **Preference Learning**: System learns from user interactions

---

## External Integration

### Travel Requirements API

1. **Country and Destination Data**
   - Complete database of countries and destinations
   - Continent-based organization
   - Destination details and information

*[Picture Placeholder: Destination database structure]*

2. **Travel Requirements Information**
   - Visa requirements between countries
   - Travel documentation needs
   - API endpoint: `/trips/requirements`
   - Parameters: Origin country ID, Destination country ID

3. **API Endpoints Available**
   ```
   GET /trips/countries - All countries
   GET /trips/continents - All continents
   GET /trips/destinations - All destinations
   GET /trips/destinations/{id} - Specific destination
   GET /trips/requirements - Travel requirements
   ```

*[Picture Placeholder: API documentation or Postman interface]*

### Database Integration
- **MySQL Database**: Primary data storage
- **Destinations Table**: Comprehensive destination information
- **Countries Table**: Global country database
- **Travel Requirements**: Visa and documentation requirements

### Current Limitations
- **External Booking APIs**: Not yet integrated (users book externally and add details manually)
- **Real-time Flight Data**: Not available (mock data used for demonstration)
- **Hotel Booking Integration**: Not implemented (manual booking entry)

---

## Current Application Flow

### 1. User Registration & Setup
1. Register new account with personal information
2. Complete travel preferences questionnaire
3. Add travel history (optional)

### 2. Discover Destinations
1. Browse personalized recommendations in Feed
2. Like destinations or add to bucket list
3. Search for specific destinations

### 3. Plan Trips
1. Create new trip from destination or manually
2. Set trip details (dates, type, travelers)
3. Build itinerary with daily events
4. Track bookings and confirmations
5. Monitor weather and budget

### 4. Manage Travel Data
1. Update preferences as they change
2. Add completed trips to travel history
3. Rate and review destinations

*[Picture Placeholder: Application flow diagram]*

---

## Technical Architecture

### Frontend (React + TypeScript)
- **Port**: 3000
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend (Spring Boot)
- **Port**: 8081
- **Framework**: Spring Boot 3.5.0
- **Java Version**: 17
- **Database**: MySQL (Port 3307)
- **API**: RESTful endpoints

### ML Service (Python)
- **Port**: 5000
- **Framework**: FastAPI/Flask
- **Purpose**: Recommendation engine
- **Integration**: HTTP API calls

*[Picture Placeholder: Architecture diagram]*

---

## Known Limitations

### Current Gaps
1. **External Booking Integration**: No real-time flight or hotel booking APIs
2. **Payment Processing**: No payment gateway integration
3. **Real-time Data**: Weather and pricing data are mock/static
4. **Group Collaboration**: Trip sharing features not fully implemented
5. **Mobile App**: Web-only interface currently
6. **Offline Access**: No offline capability

### Workarounds
- **Booking Management**: Users book externally and manually add confirmation details
- **Data Updates**: Mock data provides visual representation of features
- **Group Planning**: Single-user experience currently

---

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MySQL container
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Connect to database
docker exec -it farrin-mysql mysql -u root -p
```

#### Authentication Issues
- **Login Failed**: Verify email and password
- **Session Expired**: Re-login to refresh token
- **Registration Issues**: Check email format and password requirements

#### API Errors
- **500 Internal Server Error**: Check backend logs
- **404 Not Found**: Verify API endpoints are available
- **CORS Issues**: Check frontend-backend communication

#### Performance Issues
```bash
# Clear Docker cache
docker system prune

# Restart specific service
docker-compose restart [service-name]

# Check resource usage
docker stats
```

### Getting Help
- **Logs**: Check `docker-compose logs` for error details
- **Database**: Verify data integrity with MySQL console
- **Network**: Ensure all services are running on correct ports

---

## Future Enhancements

### Planned Features
1. **Real External API Integration**
   - Amadeus API for flights
   - Booking.com for accommodations
   - Weather API integration

2. **Enhanced User Experience**
   - Mobile application
   - Offline capability
   - Push notifications

3. **Advanced Features**
   - Group trip collaboration
   - Real-time pricing
   - Advanced budget analytics
   - Travel document management

### Development Roadmap
- Phase 1: External API integration
- Phase 2: Mobile application
- Phase 3: Advanced collaboration features
- Phase 4: AI/ML enhancements

*[Picture Placeholder: Roadmap timeline]*

---

**Version**: 1.0 - Current Implementation  
**Last Updated**: December 2024  
**Status**: Development/Demo Version  
**© 2024 Farrin Travel Companion. All rights reserved.**