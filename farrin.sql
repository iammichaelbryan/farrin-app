-- Drop database if exists and create a new one
DROP DATABASE IF EXISTS farrin;
CREATE DATABASE farrin;
USE farrin;

-- ==============================================================================
-- GEOGRAPHIC ENTITIES
-- ==============================================================================

-- CONTINENTS TABLE
DROP TABLE IF EXISTS continents;
CREATE TABLE continents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    INDEX idx_continent_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- COUNTRIES TABLE
DROP TABLE IF EXISTS countries;
CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) NOT NULL UNIQUE,
    continent_id INT NOT NULL,
    INDEX idx_country_name (name),
    INDEX idx_country_code (country_code),
    INDEX idx_country_continent (continent_id),
    FOREIGN KEY (continent_id) REFERENCES continents(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DESTINATIONS TABLE
DROP TABLE IF EXISTS destinations;
CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    country_id INT NOT NULL,
    climate ENUM('TROPICAL', 'DRY', 'CONTINENTAL', 'POLAR', 'MEDITERRANEAN', 'ARID', 'SEMI_ARID', 'MONSOON', 'TUNDRA'),
    image_url VARCHAR(500),
    travel_advisory TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    INDEX idx_destination_name (name),
    INDEX idx_destination_country (country_id),
    INDEX idx_destination_climate (climate),
    INDEX idx_destination_coords (latitude, longitude),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DESTINATION ACTIVITIES TABLE
DROP TABLE IF EXISTS destination_activities;
CREATE TABLE destination_activities (
    destination_id INT NOT NULL,
    activity VARCHAR(100) NOT NULL,
    PRIMARY KEY (destination_id, activity),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- USER MANAGEMENT
-- ==============================================================================

-- USERS TABLE
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY'),
    date_of_birth DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logged_in BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at DATETIME,
    login_count INT NOT NULL DEFAULT 0,
    verification_code VARCHAR(10),
    INDEX idx_user_email (email),
    INDEX idx_user_verified (is_verified),
    INDEX idx_user_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PREFERENCES TABLE
DROP TABLE IF EXISTS preferences;
CREATE TABLE preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    accommodation_budget INT,
    transportation_budget INT,
    total_budget INT,
    avg_travel_duration INT,
    primary_interest ENUM('ADVENTURE', 'RELAXATION', 'CULTURAL_EXPERIENCE', 'NATURE'),
    primary_travel_style ENUM('CASUAL', 'FREQUENT', 'BUSINESS', 'ENTHUSIAST', 'ORGANIZER'),
    preferred_climate ENUM('TROPICAL', 'DRY', 'CONTINENTAL', 'POLAR', 'MEDITERRANEAN', 'ARID', 'SEMI_ARID', 'MONSOON', 'TUNDRA'),
    preferred_travel_season ENUM('SPRING', 'SUMMER', 'AUTUMN', 'WINTER'),
    preferred_accommodation ENUM('HOTEL', 'AIRBNB', 'LODGE'),
    transport_preference ENUM('FLIGHTS'),
    data_sharing BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_preferred_accommodation CHECK (preferred_accommodation IN ('HOTEL', 'AIRBNB', 'LODGE') OR preferred_accommodation IS NULL),
    CONSTRAINT chk_transport_preference CHECK (transport_preference IN ('FLIGHTS') OR transport_preference IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TRAVEL GOALS TABLE
DROP TABLE IF EXISTS travel_goals;
CREATE TABLE travel_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT NOT NULL,
    target_date DATETIME,
    progress DECIMAL(3,2) DEFAULT 0.00,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    INDEX idx_goal_user (user_id),
    INDEX idx_goal_completion (is_completed),
    INDEX idx_goal_target_date (target_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- USER RELATIONSHIPS
-- ==============================================================================

-- USER CITIZENSHIPS TABLE
DROP TABLE IF EXISTS user_citizenships;
CREATE TABLE user_citizenships (
    user_id INT NOT NULL,
    country_id INT NOT NULL,
    PRIMARY KEY (user_id, country_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USER TRAVEL HISTORY TABLE
DROP TABLE IF EXISTS user_travel_history;
CREATE TABLE user_travel_history (
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    PRIMARY KEY (user_id, destination_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USER BUCKET LIST TABLE
DROP TABLE IF EXISTS user_bucket_list;
CREATE TABLE user_bucket_list (
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    PRIMARY KEY (user_id, destination_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USER RECOMMENDATIONS TABLE
DROP TABLE IF EXISTS user_recommendations;
CREATE TABLE user_recommendations (
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    PRIMARY KEY (user_id, destination_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TRIP MANAGEMENT
-- ==============================================================================

-- TRIPS TABLE
DROP TABLE IF EXISTS trips;
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    destination_id INT NOT NULL,
    trip_type ENUM('SOLO', 'GROUP') NOT NULL,
    start_date DATETIME NOT NULL,
    duration_days INT NOT NULL,
    status ENUM('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    INDEX idx_trip_owner (owner_id),
    INDEX idx_trip_destination (destination_id),
    INDEX idx_trip_status (status),
    INDEX idx_trip_start_date (start_date),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ITINERARIES TABLE
DROP TABLE IF EXISTS itineraries;
CREATE TABLE itineraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ITINERARY MEMBERS TABLE
DROP TABLE IF EXISTS itinerary_members;
CREATE TABLE itinerary_members (
    itinerary_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (itinerary_id, user_id),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EVENTS TABLE
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    event_date_time DATETIME NOT NULL,
    location VARCHAR(200),
    description TEXT,
    created_by INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_itinerary (itinerary_id),
    INDEX idx_event_datetime (event_date_time),
    INDEX idx_event_creator (created_by),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- BOOKING SYSTEM
-- ==============================================================================

-- BOOKINGS TABLE
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id INT NOT NULL,
    provider_name VARCHAR(100),
    cost INT NOT NULL,
    status ENUM('BOOKED', 'CANCELLED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    user_notes TEXT,
    confirmation_code VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    INDEX idx_booking_itinerary (itinerary_id),
    INDEX idx_booking_status (status),
    INDEX idx_booking_confirmation (confirmation_code),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FLIGHTS TABLE
DROP TABLE IF EXISTS flights;
CREATE TABLE flights (
    id INT PRIMARY KEY,
    classification ENUM('ONE_WAY', 'TWO_WAY'),
    departure DATETIME NOT NULL,
    arrival DATETIME NOT NULL,
    flight_number VARCHAR(20),
    departure_location VARCHAR(100),
    arrival_location VARCHAR(100),
    duration INT,
    available_seats INT,
    FOREIGN KEY (id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ACCOMMODATIONS TABLE
DROP TABLE IF EXISTS accommodations;
CREATE TABLE accommodations (
    id INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,
    price_per_night DECIMAL(10,2),
    currency ENUM('JMD', 'USD', 'EUR', 'AUS', 'GBP', 'CAD'),
    address VARCHAR(300),
    rating DECIMAL(3,2),
    available_rooms INT,
    room_type VARCHAR(50),
    children_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ACCOMMODATION AMENITIES TABLE
DROP TABLE IF EXISTS accommodation_amenities;
CREATE TABLE accommodation_amenities (
    accommodation_id INT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    PRIMARY KEY (accommodation_id, amenity),
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ACCOMMODATION IMAGES TABLE
DROP TABLE IF EXISTS accommodation_images;
CREATE TABLE accommodation_images (
    accommodation_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (accommodation_id, image_url),
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- WEATHER INFORMATION
-- ==============================================================================

-- WEATHER INFO TABLE
DROP TABLE IF EXISTS weather_info;
CREATE TABLE weather_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    temperature DECIMAL(5,2),
    `condition` VARCHAR(50),
    humidity INT,
    wind_speed DECIMAL(5,2),
    precipitation_probability DECIMAL(5,2),
    season ENUM('SPRING', 'SUMMER', 'AUTUMN', 'WINTER'),
    uv_index INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    INDEX idx_weather_itinerary (itinerary_id),
    INDEX idx_weather_date (date),
    INDEX idx_weather_location (location),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TRAVEL REQUIREMENTS
-- ==============================================================================

-- TRAVEL REQUIREMENTS TABLE
DROP TABLE IF EXISTS travel_requirements;
CREATE TABLE travel_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origin_country_id INT NOT NULL,
    destination_country_id INT NOT NULL,
    visa_required BOOLEAN NOT NULL DEFAULT FALSE,
    visa_type VARCHAR(50),
    min_passport_validity INT,
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_travel_req_origin (origin_country_id),
    INDEX idx_travel_req_destination (destination_country_id),
    INDEX idx_travel_req_visa (visa_required),
    UNIQUE KEY unique_travel_requirement (origin_country_id, destination_country_id),
    FOREIGN KEY (origin_country_id) REFERENCES countries(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TRAVEL REQUIREMENT DOCUMENTS TABLE
DROP TABLE IF EXISTS travel_requirement_documents;
CREATE TABLE travel_requirement_documents (
    travel_requirement_id INT NOT NULL,
    document VARCHAR(100) NOT NULL,
    PRIMARY KEY (travel_requirement_id, document),
    FOREIGN KEY (travel_requirement_id) REFERENCES travel_requirements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TRAVEL REQUIREMENT VACCINATIONS TABLE
DROP TABLE IF EXISTS travel_requirement_vaccinations;
CREATE TABLE travel_requirement_vaccinations (
    travel_requirement_id INT NOT NULL,
    vaccination VARCHAR(100) NOT NULL,
    PRIMARY KEY (travel_requirement_id, vaccination),
    FOREIGN KEY (travel_requirement_id) REFERENCES travel_requirements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- EXTERNAL API MANAGEMENT
-- ==============================================================================

-- API PROVIDERS TABLE
DROP TABLE IF EXISTS api_providers;
CREATE TABLE api_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    data_provided ENUM('WEATHER', 'CURRENCY_RATE', 'ACCOMMODATION', 'FLIGHTS', 'TRAVEL_REQUIREMENTS'),
    base_url VARCHAR(500),
    api_key VARCHAR(255),
    cost_per_request DECIMAL(10,4),
    last_health_check DATETIME,
    response_time_avg DECIMAL(8,2),
    INDEX idx_api_provider_name (name),
    INDEX idx_api_provider_data_type (data_provided)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CURRENCY RATES TABLE
DROP TABLE IF EXISTS currency_rates;
CREATE TABLE currency_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    base_currency ENUM('JMD', 'USD', 'EUR', 'AUS', 'GBP', 'CAD') NOT NULL,
    target_currency ENUM('JMD', 'USD', 'EUR', 'AUS', 'GBP', 'CAD') NOT NULL,
    rate DECIMAL(15,6) NOT NULL,
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100),
    valid_until DATETIME,
    provider_id INT,
    INDEX idx_currency_pair (base_currency, target_currency),
    INDEX idx_currency_updated (last_updated),
    FOREIGN KEY (provider_id) REFERENCES api_providers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RATE LIMIT CONFIGS TABLE
DROP TABLE IF EXISTS rate_limit_configs;
CREATE TABLE rate_limit_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    limit_type ENUM('USER', 'IP', 'API_KEY', 'GLOBAL') NOT NULL,
    identifier VARCHAR(100) NOT NULL,
    requests_per_minute INT,
    requests_per_hour INT,
    requests_per_day INT,
    current_count INT NOT NULL DEFAULT 0,
    reset_time DATETIME,
    provider_id INT,
    INDEX idx_rate_limit_type (limit_type),
    INDEX idx_rate_limit_identifier (identifier),
    FOREIGN KEY (provider_id) REFERENCES api_providers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API HEALTH METRICS TABLE
DROP TABLE IF EXISTS api_health_metrics;
CREATE TABLE api_health_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    status ENUM('HEALTHY', 'DEGRADED', 'DOWN', 'MAINTENANCE') NOT NULL,
    response_time DECIMAL(8,2),
    error_rate DECIMAL(5,2),
    last_checked DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uptime_percentage DECIMAL(5,2),
    consecutive_failures INT NOT NULL DEFAULT 0,
    INDEX idx_health_provider (provider_id),
    INDEX idx_health_status (status),
    INDEX idx_health_checked (last_checked),
    FOREIGN KEY (provider_id) REFERENCES api_providers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- NOTIFICATION SYSTEM
-- ==============================================================================

-- NOTIFICATIONS TABLE
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    type ENUM('EMAIL', 'SMS', 'PUSH', 'IN_APP') NOT NULL,
    subject VARCHAR(200),
    message TEXT,
    sent_at DATETIME,
    delivered_at DATETIME,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    priority INT NOT NULL DEFAULT 0,
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    INDEX idx_notification_recipient (recipient_id),
    INDEX idx_notification_type (type),
    INDEX idx_notification_sent (sent_at),
    INDEX idx_notification_read (is_read),
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EMAILS TABLE
DROP TABLE IF EXISTS emails;
CREATE TABLE emails (
    id INT PRIMARY KEY,
    email_to VARCHAR(100) NOT NULL,
    body TEXT,
    is_html BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_email_to (email_to),
    FOREIGN KEY (id) REFERENCES notifications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EMAIL ATTACHMENTS TABLE
DROP TABLE IF EXISTS email_attachments;
CREATE TABLE email_attachments (
    email_id INT NOT NULL,
    attachment_path VARCHAR(500) NOT NULL,
    PRIMARY KEY (email_id, attachment_path),
    FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- EVENT LOGGING
-- ==============================================================================

-- ACTION EVENTS TABLE
DROP TABLE IF EXISTS action_events;
CREATE TABLE action_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event ENUM('USER_REGISTERED', 'PROFILE_UPDATED', 'PREFERENCES_CHANGED', 'TRIP_CREATED', 'TRIP_UPDATED', 'TRIP_DELETED', 'TRIP_COMPLETED', 'EVENT_CREATED', 'BOOKING_CREATED', 'WEATHER_UPDATED', 'RECOMMENDATION_GENERATED', 'MODEL_UPDATED', 'EXTERNAL_DATA_UPDATED', 'API_HEALTH_CHANGED', 'NOTIFICATION_SENT', 'NOTIFICATION_FAILED', 'RECOMMENDATION_CLICKED') NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processing_error TEXT,
    INDEX idx_action_event_user (user_id),
    INDEX idx_action_event_type (event),
    INDEX idx_action_event_timestamp (timestamp),
    INDEX idx_action_event_processed (processed),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ACTION EVENT LOGS TABLE
DROP TABLE IF EXISTS action_event_logs;
CREATE TABLE action_event_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_events INT NOT NULL DEFAULT 0,
    last_processed DATETIME,
    INDEX idx_event_log_processed (last_processed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- COMPREHENSIVE SAMPLE DATA INSERTION
-- ==============================================================================

-- Insert sample continents
INSERT INTO continents (name) VALUES 
('North America'),
('South America'),
('Europe'),
('Asia'),
('Africa'),
('Australia'),
('Antarctica');

-- Insert comprehensive list of countries
INSERT INTO countries (name, country_code, continent_id) VALUES 
-- North America
('United States', 'USA', 1),
('Canada', 'CAN', 1),
('Mexico', 'MEX', 1),
('Guatemala', 'GTM', 1),
('Belize', 'BLZ', 1),
('El Salvador', 'SLV', 1),
('Honduras', 'HND', 1),
('Nicaragua', 'NIC', 1),
('Costa Rica', 'CRI', 1),
('Panama', 'PAN', 1),
('Cuba', 'CUB', 1),
('Jamaica', 'JM', 1),
('Haiti', 'HTI', 1),
('Dominican Republic', 'DOM', 1),
('Bahamas', 'BHS', 1),
('Barbados', 'BRB', 1),
('Trinidad and Tobago', 'TTO', 1),

-- South America
('Brazil', 'BRA', 2),
('Argentina', 'ARG', 2),
('Chile', 'CHL', 2),
('Peru', 'PER', 2),
('Colombia', 'COL', 2),
('Venezuela', 'VEN', 2),
('Ecuador', 'ECU', 2),
('Bolivia', 'BOL', 2),
('Paraguay', 'PRY', 2),
('Uruguay', 'URY', 2),
('Guyana', 'GUY', 2),
('Suriname', 'SUR', 2),

-- Europe
('United Kingdom', 'GBR', 3),
('France', 'FRA', 3),
('Germany', 'DEU', 3),
('Italy', 'ITA', 3),
('Spain', 'ESP', 3),
('Portugal', 'PRT', 3),
('Netherlands', 'NLD', 3),
('Belgium', 'BEL', 3),
('Switzerland', 'CHE', 3),
('Austria', 'AUT', 3),
('Greece', 'GRC', 3),
('Poland', 'POL', 3),
('Czech Republic', 'CZE', 3),
('Hungary', 'HUN', 3),
('Romania', 'ROU', 3),
('Bulgaria', 'BGR', 3),
('Croatia', 'HRV', 3),
('Serbia', 'SRB', 3),
('Slovenia', 'SVN', 3),
('Slovakia', 'SVK', 3),
('Denmark', 'DNK', 3),
('Sweden', 'SWE', 3),
('Norway', 'NOR', 3),
('Finland', 'FIN', 3),
('Iceland', 'ISL', 3),
('Ireland', 'IRL', 3),
('Russia', 'RUS', 3),
('Ukraine', 'UKR', 3),
('Belarus', 'BLR', 3),
('Lithuania', 'LTU', 3),
('Latvia', 'LVA', 3),
('Estonia', 'EST', 3),

-- Asia
('China', 'CHN', 4),
('India', 'IND', 4),
('Japan', 'JPN', 4),
('South Korea', 'KOR', 4),
('Indonesia', 'IDN', 4),
('Philippines', 'PHL', 4),
('Vietnam', 'VNM', 4),
('Thailand', 'THA', 4),
('Malaysia', 'MYS', 4),
('Singapore', 'SGP', 4),
('Myanmar', 'MMR', 4),
('Cambodia', 'KHM', 4),
('Laos', 'LAO', 4),
('Bangladesh', 'BGD', 4),
('Pakistan', 'PAK', 4),
('Afghanistan', 'AFG', 4),
('Iran', 'IRN', 4),
('Iraq', 'IRQ', 4),
('Turkey', 'TUR', 4),
('Saudi Arabia', 'SAU', 4),
('Israel', 'ISR', 4),
('Jordan', 'JOR', 4),
('Lebanon', 'LBN', 4),
('Syria', 'SYR', 4),
('Kuwait', 'KWT', 4),
('Qatar', 'QAT', 4),
('United Arab Emirates', 'ARE', 4),
('Oman', 'OMN', 4),
('Yemen', 'YEM', 4),
('Kazakhstan', 'KAZ', 4),
('Uzbekistan', 'UZB', 4),
('Turkmenistan', 'TKM', 4),
('Kyrgyzstan', 'KGZ', 4),
('Tajikistan', 'TJK', 4),
('Mongolia', 'MNG', 4),
('Nepal', 'NPL', 4),
('Bhutan', 'BTN', 4),
('Sri Lanka', 'LKA', 4),
('Maldives', 'MDV', 4),

-- Africa
('Nigeria', 'NGA', 5),
('Ethiopia', 'ETH', 5),
('Egypt', 'EGY', 5),
('South Africa', 'ZAF', 5),
('Kenya', 'KEN', 5),
('Uganda', 'UGA', 5),
('Algeria', 'DZA', 5),
('Sudan', 'SDN', 5),
('Morocco', 'MAR', 5),
('Angola', 'AGO', 5),
('Ghana', 'GHA', 5),
('Mozambique', 'MOZ', 5),
('Madagascar', 'MDG', 5),
('Cameroon', 'CMR', 5),
('Ivory Coast', 'CIV', 5),
('Niger', 'NER', 5),
('Burkina Faso', 'BFA', 5),
('Mali', 'MLI', 5),
('Malawi', 'MWI', 5),
('Zambia', 'ZMB', 5),
('Senegal', 'SEN', 5),
('Somalia', 'SOM', 5),
('Chad', 'TCD', 5),
('Zimbabwe', 'ZWE', 5),
('Guinea', 'GIN', 5),
('Rwanda', 'RWA', 5),
('Benin', 'BEN', 5),
('Tunisia', 'TUN', 5),
('Burundi', 'BDI', 5),
('South Sudan', 'SSD', 5),
('Togo', 'TGO', 5),
('Sierra Leone', 'SLE', 5),
('Libya', 'LBY', 5),
('Liberia', 'LBR', 5),
('Central African Republic', 'CAF', 5),
('Mauritania', 'MRT', 5),
('Eritrea', 'ERI', 5),
('Gambia', 'GMB', 5),
('Botswana', 'BWA', 5),
('Namibia', 'NAM', 5),
('Gabon', 'GAB', 5),
('Lesotho', 'LSO', 5),
('Guinea-Bissau', 'GNB', 5),
('Equatorial Guinea', 'GNQ', 5),
('Mauritius', 'MUS', 5),
('Eswatini', 'SWZ', 5),
('Djibouti', 'DJI', 5),
('Comoros', 'COM', 5),
('Cape Verde', 'CPV', 5),
('Seychelles', 'SYC', 5),

-- Oceania/Australia
('Australia', 'AUS', 6),
('Papua New Guinea', 'PNG', 6),
('New Zealand', 'NZL', 6),
('Fiji', 'FJI', 6),
('Solomon Islands', 'SLB', 6),
('Vanuatu', 'VUT', 6),
('Samoa', 'WSM', 6),
('Micronesia', 'FSM', 6),
('Tonga', 'TON', 6),
('Kiribati', 'KIR', 6),
('Palau', 'PLW', 6),
('Marshall Islands', 'MHL', 6),
('Tuvalu', 'TUV', 6),
('Nauru', 'NRU', 6);

-- Insert sample destinations
INSERT INTO destinations (name, description, country_id, climate, latitude, longitude) VALUES 
('New York City', 'The city that never sleeps', 1, 'CONTINENTAL', 40.7128, -74.0060),
('Paris', 'City of Light', 4, 'MEDITERRANEAN', 48.8566, 2.3522),
('Tokyo', 'Modern metropolis with traditional culture', 6, 'CONTINENTAL', 35.6762, 139.6503),
('Sydney', 'Iconic harbor city', 7, 'MEDITERRANEAN', -33.8688, 151.2093),
('Kingston', 'Capital of Jamaica', 8, 'TROPICAL', 17.9712, -76.7936),
('London', 'Historic capital', 3, 'CONTINENTAL', 51.5074, -0.1278);

-- Insert sample destination activities
INSERT INTO destination_activities (destination_id, activity) VALUES 
(1, 'Sightseeing'), (1, 'Museums'), (1, 'Shopping'), (1, 'Theater'),
(2, 'Art Museums'), (2, 'Wine Tasting'), (2, 'Architecture'), (2, 'Romance'),
(3, 'Traditional Culture'), (3, 'Modern Technology'), (3, 'Food'), (3, 'Nightlife'),
(4, 'Harbor Tours'), (4, 'Beaches'), (4, 'Opera'), (4, 'Wildlife'),
(5, 'Music'), (5, 'Beaches'), (5, 'Culture'), (5, 'Adventure Sports'),
(6, 'History'), (6, 'Museums'), (6, 'Royal Sites'), (6, 'Pubs');

-- Insert sample users
INSERT INTO users (first_name, last_name, gender, date_of_birth, email, password_hash, is_verified, logged_in, login_count) VALUES 
('John', 'Doe', 'MALE', '1990-05-15', 'john.doe@email.com', 'hashed_password_123', TRUE, FALSE, 5),
('Jane', 'Smith', 'FEMALE', '1988-03-22', 'jane.smith@email.com', 'hashed_password_456', TRUE, FALSE, 12),
('Michael', 'Brown', 'MALE', '1985-11-08', 'michael.brown@email.com', 'hashed_password_789', FALSE, FALSE, 0),
('Emily', 'Davis', 'FEMALE', '1992-07-30', 'emily.davis@email.com', 'hashed_password_101', TRUE, TRUE, 8),
('Robert', 'Wilson', 'MALE', '1983-09-12', 'robert.wilson@email.com', 'hashed_password_112', TRUE, FALSE, 3);

-- Insert sample preferences with new budget structure
INSERT INTO preferences (user_id, accommodation_budget, transportation_budget, total_budget, avg_travel_duration, primary_interest, primary_travel_style, preferred_climate, preferred_travel_season, preferred_accommodation, transport_preference, data_sharing) VALUES 
(1, 3000, 2000, 5000, 7, 'ADVENTURE', 'ENTHUSIAST', 'MEDITERRANEAN', 'SPRING', 'HOTEL', 'FLIGHTS', TRUE),
(2, 4800, 3200, 8000, 10, 'CULTURAL_EXPERIENCE', 'FREQUENT', 'CONTINENTAL', 'AUTUMN', 'AIRBNB', 'FLIGHTS', TRUE),
(3, 1800, 1200, 3000, 5, 'RELAXATION', 'CASUAL', 'TROPICAL', 'SUMMER', 'LODGE', 'FLIGHTS', FALSE),
(4, 3600, 2400, 6000, 14, 'NATURE', 'ORGANIZER', 'MEDITERRANEAN', 'SPRING', 'LODGE', 'FLIGHTS', TRUE),
(5, 6000, 4000, 10000, 21, 'ADVENTURE', 'BUSINESS', 'CONTINENTAL', 'WINTER', 'HOTEL', 'FLIGHTS', FALSE);

-- Insert sample travel goals
INSERT INTO travel_goals (user_id, description, target_date, progress, is_completed) VALUES 
(1, 'Visit 10 European countries', '2024-12-31 00:00:00', 0.30, FALSE),
(2, 'Experience traditional Japanese culture', '2024-06-30 00:00:00', 0.00, FALSE),
(3, 'Relax on tropical beaches for 2 weeks', '2024-08-15 00:00:00', 0.50, FALSE),
(4, 'Hike major mountain trails worldwide', '2025-12-31 00:00:00', 0.20, FALSE),
(5, 'Business networking tour across Asia', '2024-10-01 00:00:00', 0.75, FALSE);

-- Insert sample user citizenships
INSERT INTO user_citizenships (user_id, country_id) VALUES 
(1, 1), (1, 2),  -- John: US, Canada
(2, 3),          -- Jane: UK
(3, 1),          -- Michael: US
(4, 4), (4, 5),  -- Emily: France, Germany
(5, 8);          -- Robert: Jamaica

-- Insert sample user travel history
INSERT INTO user_travel_history (user_id, destination_id) VALUES 
(1, 1), (1, 6),  -- John visited NYC, London
(2, 2), (2, 3),  -- Jane visited Paris, Tokyo
(3, 5),          -- Michael visited Kingston
(4, 2), (4, 4),  -- Emily visited Paris, Sydney
(5, 1), (5, 3);  -- Robert visited NYC, Tokyo

-- Insert sample user bucket lists
INSERT INTO user_bucket_list (user_id, destination_id) VALUES 
(1, 3), (1, 4), (1, 5),  -- John wants to visit Tokyo, Sydney, Kingston
(2, 1), (2, 4),          -- Jane wants to visit NYC, Sydney
(3, 2), (3, 6),          -- Michael wants to visit Paris, London
(4, 1), (4, 3), (4, 5),  -- Emily wants to visit NYC, Tokyo, Kingston
(5, 2), (5, 6);          -- Robert wants to visit Paris, London

-- Insert sample user recommendations
INSERT INTO user_recommendations (user_id, destination_id) VALUES 
(1, 2), (1, 5),  -- John recommended Paris, Kingston
(2, 4), (2, 6),  -- Jane recommended Sydney, London
(3, 1), (3, 3),  -- Michael recommended NYC, Tokyo
(4, 2), (4, 6),  -- Emily recommended Paris, London
(5, 4), (5, 5);  -- Robert recommended Sydney, Kingston

-- Insert sample trips
INSERT INTO trips (owner_id, destination_id, trip_type, start_date, duration_days, status) VALUES 
(1, 2, 'SOLO', '2024-07-15 10:00:00', 7, 'PLANNED'),
(2, 3, 'SOLO', '2024-08-01 08:00:00', 14, 'PLANNED'),
(3, 4, 'GROUP', '2024-06-20 12:00:00', 10, 'ONGOING'),
(4, 1, 'SOLO', '2024-09-10 14:00:00', 5, 'PLANNED'),
(5, 6, 'GROUP', '2024-05-25 09:00:00', 12, 'COMPLETED');

-- Insert sample itineraries
INSERT INTO itineraries (trip_id) VALUES 
(1), (2), (3), (4), (5);

-- Insert sample itinerary members
INSERT INTO itinerary_members (itinerary_id, user_id) VALUES 
(1, 1),          -- John's solo trip
(2, 2),          -- Jane's solo trip
(3, 3), (3, 4),  -- Michael and Emily's group trip
(4, 4),          -- Emily's solo trip
(5, 5), (5, 1);  -- Robert and John's group trip

-- Insert sample events
INSERT INTO events (itinerary_id, name, event_date_time, location, description, created_by) VALUES 
(1, 'Visit Eiffel Tower', '2024-07-16 14:00:00', 'Paris, France', 'Iconic landmark visit', 1),
(2, 'Tokyo Food Tour', '2024-08-02 18:00:00', 'Shibuya, Tokyo', 'Traditional Japanese cuisine experience', 2),
(3, 'Sydney Opera House Tour', '2024-06-21 10:00:00', 'Sydney, Australia', 'Architectural marvel tour', 3),
(4, 'Central Park Walk', '2024-09-11 09:00:00', 'New York City, USA', 'Morning stroll in the park', 4),
(5, 'Tower Bridge Visit', '2024-05-26 15:00:00', 'London, UK', 'Historic bridge exploration', 5);

-- Insert sample bookings
INSERT INTO bookings (itinerary_id, provider_name, cost, status, confirmation_code) VALUES 
(1, 'Air France', 650, 'BOOKED', 'AF12345'),
(2, 'Japan Airlines', 1200, 'BOOKED', 'JL67890'),
(3, 'Qantas', 800, 'PENDING', 'QF11111'),
(4, 'Delta Airlines', 350, 'BOOKED', 'DL22222'),
(5, 'British Airways', 450, 'BOOKED', 'BA33333');

-- Insert sample flights
INSERT INTO flights (id, classification, departure, arrival, flight_number, departure_location, arrival_location, duration, available_seats) VALUES 
(1, 'TWO_WAY', '2024-07-15 10:00:00', '2024-07-15 18:00:00', 'AF123', 'JFK Airport', 'CDG Airport', 480, 250),
(2, 'TWO_WAY', '2024-08-01 08:00:00', '2024-08-02 10:00:00', 'JL456', 'LAX Airport', 'NRT Airport', 660, 300),
(4, 'TWO_WAY', '2024-09-10 14:00:00', '2024-09-10 17:00:00', 'DL789', 'ATL Airport', 'LGA Airport', 180, 180),
(5, 'TWO_WAY', '2024-05-25 09:00:00', '2024-05-25 21:00:00', 'BA012', 'JFK Airport', 'LHR Airport', 420, 200);

-- Insert sample accommodations
INSERT INTO accommodations (id, name, check_in, check_out, price_per_night, currency, address, rating, available_rooms, room_type, children_allowed) VALUES 
(1, 'Hotel Parisien', '2024-07-15 15:00:00', '2024-07-22 11:00:00', 180.00, 'EUR', '123 Rue de Rivoli, Paris', 4.2, 50, 'Standard Double', TRUE),
(2, 'Tokyo Grand Hotel', '2024-08-01 14:00:00', '2024-08-15 12:00:00', 220.00, 'USD', '456 Shibuya, Tokyo', 4.5, 75, 'Deluxe Suite', TRUE),
(4, 'Manhattan Plaza', '2024-09-10 16:00:00', '2024-09-15 11:00:00', 350.00, 'USD', '789 Broadway, New York', 4.0, 100, 'Executive Room', TRUE),
(5, 'London Bridge Hotel', '2024-05-25 15:00:00', '2024-06-06 10:00:00', 250.00, 'GBP', '321 Tower Bridge Rd, London', 4.3, 60, 'Premium Double', FALSE);

-- Insert sample accommodation amenities
INSERT INTO accommodation_amenities (accommodation_id, amenity) VALUES 
(1, 'Free WiFi'), (1, 'Breakfast'), (1, 'Gym'), (1, 'Concierge'),
(2, 'Free WiFi'), (2, 'Spa'), (2, 'Restaurant'), (2, 'Business Center'),
(4, 'Free WiFi'), (4, 'Pool'), (4, 'Room Service'), (4, 'Valet Parking'),
(5, 'Free WiFi'), (5, 'Restaurant'), (5, 'Bar'), (5, 'Meeting Rooms');

-- Insert sample accommodation images
INSERT INTO accommodation_images (accommodation_id, image_url) VALUES 
(1, 'https://example.com/hotel-parisien-1.jpg'), (1, 'https://example.com/hotel-parisien-2.jpg'),
(2, 'https://example.com/tokyo-grand-1.jpg'), (2, 'https://example.com/tokyo-grand-2.jpg'),
(4, 'https://example.com/manhattan-plaza-1.jpg'), (4, 'https://example.com/manhattan-plaza-2.jpg'),
(5, 'https://example.com/london-bridge-1.jpg'), (5, 'https://example.com/london-bridge-2.jpg');

-- Insert sample weather info
INSERT INTO weather_info (itinerary_id, location, date, temperature, `condition`, humidity, wind_speed, precipitation_probability, season, uv_index) VALUES 
(1, 'Paris, France', '2024-07-16', 24.5, 'Partly Cloudy', 65, 10.2, 20.0, 'SUMMER', 6),
(2, 'Tokyo, Japan', '2024-08-02', 28.0, 'Sunny', 70, 8.5, 10.0, 'SUMMER', 8),
(3, 'Sydney, Australia', '2024-06-21', 18.5, 'Rainy', 80, 15.0, 75.0, 'WINTER', 3),
(4, 'New York, USA', '2024-09-11', 22.0, 'Clear', 55, 12.0, 5.0, 'AUTUMN', 5),
(5, 'London, UK', '2024-05-26', 16.0, 'Overcast', 75, 18.0, 40.0, 'SPRING', 4);

-- Insert sample travel requirements
INSERT INTO travel_requirements (origin_country_id, destination_country_id, visa_required, visa_type, min_passport_validity) VALUES 
(1, 4, FALSE, NULL, 90),      -- US to France: No visa, 90 days passport validity
(1, 6, FALSE, NULL, 90),      -- US to Japan: No visa, 90 days passport validity
(3, 1, TRUE, 'ESTA', 180),    -- UK to US: ESTA required, 180 days passport validity
(8, 1, FALSE, NULL, 180),     -- Jamaica to US: No visa, 180 days passport validity
(1, 8, FALSE, NULL, 90);      -- US to Jamaica: No visa, 90 days passport validity

-- Insert sample travel requirement documents
INSERT INTO travel_requirement_documents (travel_requirement_id, document) VALUES 
(3, 'Valid Passport'), (3, 'ESTA Authorization'),
(4, 'Valid Passport'), (4, 'Return Ticket'),
(5, 'Valid Passport'), (5, 'Proof of Accommodation');

-- Insert sample travel requirement vaccinations
INSERT INTO travel_requirement_vaccinations (travel_requirement_id, vaccination) VALUES 
(4, 'Yellow Fever'), (4, 'Hepatitis A'),
(5, 'Hepatitis A'), (5, 'Typhoid');

-- Insert sample API providers
INSERT INTO api_providers (name, data_provided, base_url, cost_per_request, response_time_avg) VALUES 
('OpenWeatherMap', 'WEATHER', 'https://api.openweathermap.org', 0.001, 250.50),
('ExchangeRate-API', 'CURRENCY_RATE', 'https://api.exchangerate-api.com', 0.002, 180.25),
('Amadeus', 'FLIGHTS', 'https://api.amadeus.com', 0.050, 400.75),
('Booking.com', 'ACCOMMODATION', 'https://distribution-xml.booking.com', 0.030, 350.00);

-- Insert sample currency rates
INSERT INTO currency_rates (base_currency, target_currency, rate, source, provider_id) VALUES 
('USD', 'EUR', 0.85, 'ExchangeRate-API', 2),
('USD', 'GBP', 0.73, 'ExchangeRate-API', 2),
('USD', 'JMD', 155.50, 'ExchangeRate-API', 2),
('USD', 'CAD', 1.25, 'ExchangeRate-API', 2),
('EUR', 'USD', 1.18, 'ExchangeRate-API', 2),
('GBP', 'USD', 1.37, 'ExchangeRate-API', 2);

-- Insert sample rate limit configs
INSERT INTO rate_limit_configs (limit_type, identifier, requests_per_minute, requests_per_hour, requests_per_day, provider_id) VALUES 
('API_KEY', 'weather_api_key_1', 60, 1000, 10000, 1),
('API_KEY', 'currency_api_key_1', 100, 5000, 50000, 2),
('API_KEY', 'flight_api_key_1', 30, 500, 2000, 3),
('API_KEY', 'booking_api_key_1', 50, 1000, 5000, 4),
('GLOBAL', 'system_global', 1000, 50000, 500000, NULL);

-- Insert sample API health metrics
INSERT INTO api_health_metrics (provider_id, status, response_time, error_rate, uptime_percentage, consecutive_failures) VALUES 
(1, 'HEALTHY', 245.30, 0.02, 99.95, 0),
(2, 'HEALTHY', 175.80, 0.01, 99.98, 0),
(3, 'DEGRADED', 450.20, 0.05, 98.50, 1),
(4, 'HEALTHY', 325.60, 0.03, 99.80, 0);

-- Insert sample notifications
INSERT INTO notifications (recipient_id, type, subject, message, sent_at, is_read, priority) VALUES 
(1, 'EMAIL', 'Trip Confirmation', 'Your trip to Paris has been confirmed!', '2024-06-01 10:00:00', TRUE, 1),
(2, 'EMAIL', 'Weather Update', 'Weather forecast for your Tokyo trip', '2024-07-15 09:00:00', FALSE, 2),
(3, 'PUSH', 'Booking Reminder', 'Don''t forget to check-in for your flight', '2024-06-19 08:00:00', TRUE, 3),
(4, 'EMAIL', 'Travel Tips', 'Essential travel tips for New York', '2024-08-30 14:00:00', FALSE, 1),
(5, 'EMAIL', 'Trip Completed', 'How was your London experience?', '2024-06-07 16:00:00', TRUE, 1);

-- Insert sample emails
INSERT INTO emails (id, email_to, body, is_html) VALUES 
(1, 'john.doe@email.com', 'Dear John, Your trip to Paris from July 15-22 has been confirmed. Enjoy your adventure!', FALSE),
(2, 'jane.smith@email.com', '<h1>Weather Update</h1><p>Sunny skies expected for your Tokyo trip!</p>', TRUE),
(4, 'emily.davis@email.com', 'Hi Emily, Here are some great tips for your upcoming New York trip...', FALSE),
(5, 'robert.wilson@email.com', 'Hi Robert, Thanks for traveling with us! How was your London experience?', FALSE);

-- Insert sample email attachments
INSERT INTO email_attachments (email_id, attachment_path) VALUES 
(1, '/attachments/paris_itinerary.pdf'),
(2, '/attachments/tokyo_weather_forecast.pdf'),
(4, '/attachments/nyc_travel_guide.pdf'),
(5, '/attachments/london_feedback_form.pdf');

-- Insert sample action events
INSERT INTO action_events (user_id, event, metadata, processed) VALUES 
(1, 'TRIP_CREATED', '{"trip_id": 1, "destination": "Paris"}', TRUE),
(2, 'TRIP_CREATED', '{"trip_id": 2, "destination": "Tokyo"}', TRUE),
(3, 'BOOKING_CREATED', '{"booking_id": 3, "type": "flight"}', FALSE),
(4, 'PROFILE_UPDATED', '{"fields_updated": ["email", "preferences"]}', TRUE),
(5, 'TRIP_COMPLETED', '{"trip_id": 5, "destination": "London"}', TRUE),
(1, 'RECOMMENDATION_CLICKED', '{"destination_id": 2, "recommendation_type": "destination"}', FALSE);

-- Insert sample action event logs
INSERT INTO action_event_logs (total_events, last_processed) VALUES 
(6, '2024-06-14 12:00:00');