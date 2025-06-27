# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Farrin App is a comprehensive Travel Companion Application designed to simplify international trip planning for global travelers. It's built as a distributed microservices architecture using Spring Boot 3.5.0 with Java 17, implementing AI-powered personalized recommendations and comprehensive travel planning capabilities.

## Current Implementation Status

**✅ COMPLETED**: 
- Full MVC package structure implementation
- All domain entities with JPA mappings (45+ classes)
- Complete OCL specification-based entity modeling
- Database schema configuration for MySQL (gridsync schema)  
- Repository layer with Spring Data JPA
- Basic security configuration
- Project successfully compiles and builds

## Architecture Overview

### Microservices Architecture
The application is structured as independent microservices with clear domain boundaries:

- **User Management Service** (Port 8081): Authentication, user profiles, preferences, travel history
- **Trip Planning Service** (Port 8082): Trip creation, management, collaboration, travel requirements
- **Itinerary Service (Falls Under Trip Planning Service)** (Port 8083): Trip itineraries, events, bookings, transportation, accommodation
- **Recommendation Service** (Port 8084): AI-powered recommendations, filtering, sentiment analysis
- **External Integration Service** (Port 8085): External API management, data aggregation, currency conversion
- **Notification Service** (Port 8086): Cross-service messaging, email notifications, event handling

### Technology Stack
- **Framework**: Spring Boot 3.5.0 with Spring Security and Spring Data JPA
- **Build Tool**: Maven with Maven Wrapper (mvnw/mvnw.cmd)
- **Java Version**: 17
- **Databases**: MySQL (primary data), Redis (caching), PostgreSQL (analytics)
- **Message Queue**: Apache Kafka for event-driven communication
- **Container Platform**: Kubernetes with Istio service mesh
- **API Gateway**: Kong with OAuth 2.0/JWT authentication
- **Monitoring**: Prometheus + Grafana + Jaeger for observability
- **ML/AI**: TensorFlow Serving for recommendation engine
- **Security**: HashiCorp Vault for secrets management, Keycloak for identity management

## Development Environment Setup

### Prerequisites
- Java 17 JDK
- Maven 3.8+
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Git

### Local Development Stack
```bash
# Start local development environment
docker-compose -f docker-compose.dev.yml up -d

# This starts:
# - MySQL database (port 3306)
# - Redis cache (port 6379)
# - Kafka cluster (port 9092)
# - Local API Gateway (port 8080)
```

### Service Development Commands

#### Building and Running Individual Services
```bash
# Build all services
./mvnw clean compile

# Run specific service (replace {service-name} with actual service)
./mvnw spring-boot:run -pl {service-name}

# Run with specific profile and port
./mvnw spring-boot:run -pl user-management-service -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments=--server.port=8081

# Package all services
./mvnw clean package

# Build Docker images for all services
./mvnw clean package docker:build
```

#### Service-Specific Examples
```bash
# User Management Service
./mvnw spring-boot:run -pl user-management-service

# Trip Planning Service  
./mvnw spring-boot:run -pl trip-planning-service

# Recommendation Service (requires ML models)
./mvnw spring-boot:run -pl recommendation-service -Dspring-boot.run.profiles=dev,ml-local
```

### Testing
```bash
# Run all tests
./mvnw test

# Run tests for specific service
./mvnw test -pl user-management-service

# Run integration tests
./mvnw test -Dtest.groups=integration

# Run with coverage
./mvnw clean test jacoco:report

# Run contract tests
./mvnw test -Dtest.groups=contract
```

### Database Management
```bash
# Run Flyway migrations
./mvnw flyway:migrate -pl user-management-service

# Reset database (development only)
./mvnw flyway:clean flyway:migrate -pl user-management-service

# Generate database schema
./mvnw hibernate:hbm2ddl -pl user-management-service
```

## Configuration

### Application Properties Structure
```
src/main/resources/
├── application.properties          # Base configuration
├── application-dev.properties      # Development environment
├── application-staging.properties  # Staging environment  
├── application-prod.properties     # Production environment
└── application-test.properties     # Test environment
```

### Environment-Specific Configuration
- **Development**: Single-node setup with H2/MySQL, basic security
- **Staging**: Multi-service setup with Redis, full security, external API mocks
- **Production**: Full microservices, high availability, production APIs

### Key Configuration Properties
```properties
# Service Discovery
spring.application.name=farrin-{service-name}
server.port=808{x}

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/farrin_{service}
spring.datasource.username=${DB_USERNAME:farrin_user}
spring.datasource.password=${DB_PASSWORD:farrin_pass}

# Redis Configuration
spring.redis.host=${REDIS_HOST:localhost}
spring.redis.port=${REDIS_PORT:6379}

# Kafka Configuration
spring.kafka.bootstrap-servers=${KAFKA_BROKERS:localhost:9092}

# External API Configuration
farrin.api.amadeus.url=${AMADEUS_API_URL}
farrin.api.amadeus.key=${AMADEUS_API_KEY}
farrin.api.weather.url=${WEATHER_API_URL}
farrin.api.weather.key=${WEATHER_API_KEY}

# Security Configuration
spring.security.oauth2.resourceserver.jwt.issuer-uri=${JWT_ISSUER_URI:http://localhost:8080/auth/realms/farrin}

# ML/AI Configuration (Recommendation Service)
farrin.ml.model.path=${ML_MODEL_PATH:/models}
farrin.ml.tensorflow.serving.url=${TF_SERVING_URL:http://localhost:8501}
```

## Service Architecture Details

### User Management Service
- **Responsibilities**: Authentication, user profiles, preferences, travel history
- **Database**: MySQL (users, preferences, travel_goals, travel_history)
- **Key Features**: Multi-factor authentication, GDPR compliance, preference management
- **External Dependencies**: Keycloak for identity management

### Trip Planning Service
- **Responsibilities**: Trip CRUD operations, collaboration, travel requirements
- **Database**: MySQL (trips, destinations, travel_requirements, trip_members)
- **Key Features**: Group trip collaboration, travel requirement verification
- **External Dependencies**: Government APIs for travel requirements

### Recommendation Service
- **Responsibilities**: AI-powered recommendations, explainability, filtering
- **Database**: MySQL (metadata) + Redis (caching) + ML Model Store
- **Key Features**: Personalized recommendations, SHAP-based explainability
- **External Dependencies**: TensorFlow Serving, multiple travel data APIs

### External Integration Service
- **Responsibilities**: API gateway for external services, data aggregation
- **Database**: Redis Cluster (caching, rate limiting)
- **Key Features**: Circuit breakers, rate limiting, multi-provider fallback
- **External Dependencies**: Amadeus, Booking.com, Weather APIs, Currency APIs

## API Documentation

### Service Endpoints
Each service exposes REST APIs following OpenAPI 3.0 specification:

- **User Management**: `http://localhost:8081/api/v1/users/**`
- **Trip Planning**: `http://localhost:8082/api/v1/trips/**`
- **Recommendations**: `http://localhost:8084/api/v1/recommendations/**`
- **External Integration**: `http://localhost:8085/api/v1/external/**`

### Authentication
All services use JWT-based authentication with OAuth 2.0:
```bash
# Get access token (development)
curl -X POST http://localhost:8080/auth/realms/farrin/protocol/openid-connect/token \
  -d "grant_type=password&client_id=farrin-app&username=test@example.com&password=password"

# Use token in API calls
curl -H "Authorization: Bearer {token}" http://localhost:8081/api/v1/users/profile
```

## Development Workflows

### Feature Development
1. Create feature branch: `git checkout -b feature/trip-collaboration`
2. Implement changes in relevant service(s)
3. Write tests (unit, integration, contract)
4. Update API documentation
5. Test locally with Docker Compose
6. Create pull request

### Service Communication Testing
```bash
# Test service-to-service communication
curl -X POST http://localhost:8082/api/v1/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"destination": "Paris", "startDate": "2024-06-01", "endDate": "2024-06-07"}'
```

### Database Migrations
```bash
# Create new migration
./mvnw flyway:migrate -pl user-management-service

# Rollback migration (if supported)
./mvnw flyway:undo -pl user-management-service
```

## Quality Assurance

### Code Quality Requirements
- **Test Coverage**: Minimum 90% for all services
- **Code Style**: Google Java Style Guide
- **Security**: OWASP compliance, dependency vulnerability scanning
- **Performance**: <2 second response times for 95% of requests

### Testing Strategy
- **Unit Tests**: JUnit 5, Mockito for mocking
- **Integration Tests**: TestContainers for database testing
- **Contract Tests**: Spring Cloud Contract
- **End-to-End Tests**: Selenium/Playwright for UI testing
- **Performance Tests**: JMeter for load testing

### CI/CD Pipeline
The project uses GitHub Actions for continuous integration:
```bash
# Run CI pipeline locally
act push

# Run specific workflow
act -j test

# Run with secrets
act -s GITHUB_TOKEN=your_token
```

## Deployment

### Local Deployment
```bash
# Deploy to local Kubernetes
kubectl apply -f k8s/dev/

# Port forward to access services
kubectl port-forward svc/user-management-service 8081:8080
```

### Production Deployment
- **Infrastructure**: Kubernetes with Istio service mesh
- **Deployment Strategy**: Blue-green deployments via ArgoCD
- **Monitoring**: Prometheus + Grafana + Jaeger
- **Secrets**: HashiCorp Vault integration

## Troubleshooting

### Common Issues
1. **Service Discovery**: Ensure Kubernetes DNS is working
2. **Database Connections**: Check connection pools and timeouts
3. **External API Limits**: Monitor rate limiting and circuit breakers
4. **Memory Issues**: Tune JVM heap sizes for each service

### Debug Commands
```bash
# Check service health
curl http://localhost:8081/actuator/health

# View service metrics
curl http://localhost:8081/actuator/metrics

# Check database connectivity
./mvnw spring-boot:run -Dspring-boot.run.arguments=--debug
```

### Monitoring and Logging
- **Application Logs**: Structured JSON logging via Logback
- **Metrics**: Micrometer with Prometheus
- **Tracing**: Jaeger for distributed tracing
- **Alerts**: Grafana alerts for critical issues

## Security Considerations

### Authentication & Authorization
- **OAuth 2.0/JWT**: Token-based authentication
- **RBAC**: Role-based access control
- **Multi-Factor Authentication**: SMS/Email/Authenticator app

### Data Protection
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **GDPR Compliance**: Data minimization, right to be forgotten
- **Audit Logging**: Comprehensive audit trails

### API Security
- **Rate Limiting**: Per-user and per-IP limits
- **Input Validation**: Comprehensive request validation
- **CORS**: Proper cross-origin resource sharing configuration

## Performance Optimization

### Caching Strategy
- **L1 Cache**: Application-level caching (Caffeine)
- **L2 Cache**: Distributed caching (Redis)
- **L3 Cache**: CDN caching (CloudFlare)

### Database Optimization
- **Read Replicas**: Separate read/write workloads
- **Connection Pooling**: HikariCP for connection management
- **Query Optimization**: Indexed queries and materialized views

### External API Optimization
- **Circuit Breakers**: Prevent cascading failures
- **Request Batching**: Optimize API usage
- **Multi-Provider Fallback**: Redundancy for critical APIs

## Compliance and Governance

### Data Privacy
- **GDPR**: Full compliance with European data protection regulations
- **CCPA**: California Consumer Privacy Act compliance
- **Data Residency**: Regional data storage requirements

### Audit and Monitoring
- **Audit Trails**: Comprehensive logging of all data access
- **Compliance Reporting**: Automated compliance validation
- **Incident Response**: Automated breach detection and notification

## AI/ML Integration

### Recommendation Engine
- **Technology**: TensorFlow Serving with SHAP explainability
- **Features**: Personalized recommendations, budget estimation
- **Privacy**: User-controlled data sharing preferences

### Model Management
- **Training**: Automated model training and validation
- **Serving**: A/B testing for model performance
- **Explainability**: SHAP-based explanation generation

## External Dependencies

### Required APIs
- **Amadeus**: Flight and hotel data
- **OpenWeatherMap**: Weather information
- **Government APIs**: Travel requirements and visa information
- **Currency APIs**: Real-time exchange rates

### Development Dependencies
- **Keycloak**: Identity and access management
- **TensorFlow Serving**: ML model serving
- **Redis**: Distributed caching
- **Kafka**: Event streaming

For detailed API documentation, architecture diagrams, and deployment guides, refer to the `/docs` directory in the repository.