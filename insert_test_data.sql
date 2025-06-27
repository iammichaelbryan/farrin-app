-- Insert minimal test data for ML service integration testing

-- Insert test continent
INSERT INTO continents (id, name) VALUES (1, 'North America');

-- Insert test country  
INSERT INTO countries (id, name, country_code, continent_id) VALUES (1, 'United States', 'USA', 1);

-- Insert test user
INSERT INTO users (id, email, password, first_name, last_name, dob, gender, created_at, updated_at) 
VALUES (1, 'test@example.com', '$2a$10$sample.password.hash', 'Test', 'User', '1990-01-01', 'MALE', NOW(), NOW());

-- Insert user citizenship
INSERT INTO user_citizenships (user_id, country_id) VALUES (1, 1);

-- Insert test preference for the user
INSERT INTO preferences (id, user_id, preferred_travel_season, avg_travel_duration, preferred_accommodation, 
                        accommodation_budget, transport_preference, transportation_budget, data_sharing, created_at, updated_at)
VALUES (1, 1, 'SUMMER', 7, 'HOTEL', 1200, 'FLIGHT', 800, true, NOW(), NOW());

-- Insert a few test destinations
INSERT INTO destinations (id, name, description, country_id, climate, latitude, longitude) VALUES 
(1, 'New York, USA', 'The city that never sleeps', 1, 'CONTINENTAL', 40.7128, -74.0060),
(2, 'Los Angeles, USA', 'City of Angels', 1, 'MEDITERRANEAN', 34.0522, -118.2437);