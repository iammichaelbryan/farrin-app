-- Add more destinations to support travel planning
-- Note: Assuming countries are already populated with basic data
-- This script adds 2 destinations per major country

-- United States (assuming country_id = 1)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('New York City, USA', 'The city that never sleeps - iconic skyline, world-class museums, Broadway shows, and diverse neighborhoods.', 1, 'CONTINENTAL', '/images/nyc.jpg', 'Low Risk', 40.7128, -74.0060),
('Los Angeles, USA', 'Entertainment capital with beautiful beaches, Hollywood glamour, and year-round sunshine.', 1, 'MEDITERRANEAN', '/images/la.jpg', 'Low Risk', 34.0522, -118.2437);

-- Canada (assuming country_id = 2)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Toronto, Canada', 'Cosmopolitan city with diverse culture, CN Tower, and vibrant arts scene.', 2, 'CONTINENTAL', '/images/toronto.jpg', 'Low Risk', 43.6532, -79.3832),
('Vancouver, Canada', 'Stunning coastal city surrounded by mountains, known for outdoor activities and multicultural cuisine.', 2, 'OCEANIC', '/images/vancouver.jpg', 'Low Risk', 49.2827, -123.1207);

-- United Kingdom (assuming country_id = 3)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('London, UK', 'Historic capital with royal palaces, world-class museums, and iconic landmarks like Big Ben.', 3, 'OCEANIC', '/images/london.jpg', 'Low Risk', 51.5074, -0.1278),
('Edinburgh, UK', 'Scottish capital with medieval Old Town, impressive castle, and rich cultural heritage.', 3, 'OCEANIC', '/images/edinburgh.jpg', 'Low Risk', 55.9533, -3.1883);

-- Germany (assuming country_id = 4)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Berlin, Germany', 'Historic capital with rich history, vibrant nightlife, and world-class museums.', 4, 'CONTINENTAL', '/images/berlin.jpg', 'Low Risk', 52.5200, 13.4050),
('Munich, Germany', 'Bavarian charm with Oktoberfest, beautiful architecture, and gateway to the Alps.', 4, 'CONTINENTAL', '/images/munich.jpg', 'Low Risk', 48.1351, 11.5820);

-- France (assuming country_id = 5)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Paris, France', 'City of Light with romantic ambiance, Eiffel Tower, Louvre Museum, and exquisite cuisine.', 5, 'OCEANIC', '/images/paris.jpg', 'Low Risk', 48.8566, 2.3522),
('Nice, France', 'French Riviera jewel with stunning Mediterranean coastline and glamorous atmosphere.', 5, 'MEDITERRANEAN', '/images/nice.jpg', 'Low Risk', 43.7102, 7.2620);

-- Japan (assuming country_id = 6)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Tokyo, Japan', 'Ultra-modern metropolis blending traditional culture with cutting-edge technology.', 6, 'CONTINENTAL', '/images/tokyo.jpg', 'Low Risk', 35.6762, 139.6503),
('Kyoto, Japan', 'Ancient capital with thousands of temples, traditional gardens, and preserved historic districts.', 6, 'CONTINENTAL', '/images/kyoto.jpg', 'Low Risk', 35.0116, 135.7681);

-- Australia (assuming country_id = 7)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Sydney, Australia', 'Harbor city with iconic Opera House, beautiful beaches, and vibrant cultural scene.', 7, 'OCEANIC', '/images/sydney.jpg', 'Low Risk', -33.8688, 151.2093),
('Melbourne, Australia', 'Cultural capital known for coffee culture, street art, and diverse culinary scene.', 7, 'OCEANIC', '/images/melbourne.jpg', 'Low Risk', -37.8136, 144.9631);

-- Brazil (assuming country_id = 8)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Rio de Janeiro, Brazil', 'Vibrant city with stunning beaches, Christ the Redeemer statue, and carnival atmosphere.', 8, 'TROPICAL', '/images/rio.jpg', 'Moderate Risk', -22.9068, -43.1729),
('São Paulo, Brazil', 'Bustling metropolis with world-class museums, diverse neighborhoods, and incredible food scene.', 8, 'TROPICAL', '/images/sao_paulo.jpg', 'Moderate Risk', -23.5558, -46.6396);

-- India (assuming country_id = 9)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Mumbai, India', 'Commercial capital with Bollywood glamour, colonial architecture, and vibrant street life.', 9, 'TROPICAL', '/images/mumbai.jpg', 'Moderate Risk', 19.0760, 72.8777),
('Jaipur, India', 'Pink City with magnificent palaces, forts, and rich Rajasthani culture and crafts.', 9, 'ARID', '/images/jaipur.jpg', 'Moderate Risk', 26.9124, 75.7873);

-- China (assuming country_id = 10)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Beijing, China', 'Historic capital with Forbidden City, Great Wall access, and rich imperial heritage.', 10, 'CONTINENTAL', '/images/beijing.jpg', 'Moderate Risk', 39.9042, 116.4074),
('Shanghai, China', 'Modern financial hub with futuristic skyline, historic Bund, and dynamic culture.', 10, 'CONTINENTAL', '/images/shanghai.jpg', 'Moderate Risk', 31.2304, 121.4737);

-- Mexico (assuming country_id = 11)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Mexico City, Mexico', 'Vibrant capital with ancient Aztec ruins, colonial architecture, and incredible cuisine.', 11, 'TROPICAL', '/images/mexico_city.jpg', 'Moderate Risk', 19.4326, -99.1332),
('Cancun, Mexico', 'Paradise destination with pristine beaches, Mayan ruins, and turquoise Caribbean waters.', 11, 'TROPICAL', '/images/cancun.jpg', 'Moderate Risk', 21.1619, -86.8515);

-- Italy (assuming country_id = 12)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Rome, Italy', 'Eternal City with ancient Roman ruins, Vatican treasures, and incredible culinary traditions.', 12, 'MEDITERRANEAN', '/images/rome.jpg', 'Low Risk', 41.9028, 12.4964),
('Venice, Italy', 'Floating city with romantic canals, stunning architecture, and unique cultural heritage.', 12, 'MEDITERRANEAN', '/images/venice.jpg', 'Low Risk', 45.4408, 12.3155);

-- Spain (assuming country_id = 13)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Barcelona, Spain', 'Artistic city with Gaudí architecture, Mediterranean beaches, and vibrant nightlife.', 13, 'MEDITERRANEAN', '/images/barcelona.jpg', 'Low Risk', 41.3851, 2.1734),
('Madrid, Spain', 'Royal capital with world-class art museums, beautiful parks, and lively tapas culture.', 13, 'MEDITERRANEAN', '/images/madrid.jpg', 'Low Risk', 40.4168, -3.7038);

-- Netherlands (assuming country_id = 14)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Amsterdam, Netherlands', 'Canal city with historic charm, world-famous museums, and liberal cultural atmosphere.', 14, 'OCEANIC', '/images/amsterdam.jpg', 'Low Risk', 52.3676, 4.9041),
('Rotterdam, Netherlands', 'Modern port city with innovative architecture and dynamic cultural scene.', 14, 'OCEANIC', '/images/rotterdam.jpg', 'Low Risk', 51.9244, 4.4777);

-- Greece (assuming country_id = 15)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Athens, Greece', 'Cradle of civilization with ancient Acropolis, rich history, and Mediterranean charm.', 15, 'MEDITERRANEAN', '/images/athens.jpg', 'Low Risk', 37.9838, 23.7275),
('Santorini, Greece', 'Volcanic island paradise with stunning sunsets, white-washed villages, and crystal-clear waters.', 15, 'MEDITERRANEAN', '/images/santorini.jpg', 'Low Risk', 36.3932, 25.4615);

-- Turkey (assuming country_id = 16)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Istanbul, Turkey', 'Transcontinental city bridging Europe and Asia with rich Byzantine and Ottoman heritage.', 16, 'MEDITERRANEAN', '/images/istanbul.jpg', 'Moderate Risk', 41.0082, 28.9784),
('Cappadocia, Turkey', 'Fairy-tale landscape with hot air balloons, underground cities, and unique rock formations.', 16, 'CONTINENTAL', '/images/cappadocia.jpg', 'Moderate Risk', 38.6431, 34.8287);

-- Thailand (assuming country_id = 17)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Bangkok, Thailand', 'Vibrant capital with ornate temples, bustling markets, and incredible street food.', 17, 'TROPICAL', '/images/bangkok.jpg', 'Low Risk', 13.7563, 100.5018),
('Phuket, Thailand', 'Tropical paradise with pristine beaches, luxury resorts, and vibrant nightlife.', 17, 'TROPICAL', '/images/phuket.jpg', 'Low Risk', 7.8804, 98.3923);

-- South Korea (assuming country_id = 18)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Seoul, South Korea', 'Dynamic capital blending ancient palaces with K-pop culture and technological innovation.', 18, 'CONTINENTAL', '/images/seoul.jpg', 'Low Risk', 37.5665, 126.9780),
('Busan, South Korea', 'Coastal city with beautiful beaches, seafood markets, and colorful hillside villages.', 18, 'CONTINENTAL', '/images/busan.jpg', 'Low Risk', 35.1796, 129.0756);

-- Singapore (assuming country_id = 19)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Singapore City, Singapore', 'Modern city-state with futuristic gardens, diverse cuisine, and efficient urban planning.', 19, 'TROPICAL', '/images/singapore.jpg', 'Low Risk', 1.3521, 103.8198),
('Sentosa Island, Singapore', 'Resort island with theme parks, beaches, and luxury entertainment complexes.', 19, 'TROPICAL', '/images/sentosa.jpg', 'Low Risk', 1.2494, 103.8303);

-- New Zealand (assuming country_id = 20)
INSERT IGNORE INTO farrin.destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES
('Auckland, New Zealand', 'Sailing city with volcanic cones, beautiful harbors, and Polynesian cultural influences.', 20, 'OCEANIC', '/images/auckland.jpg', 'Low Risk', -36.8485, 174.7633),
('Queenstown, New Zealand', 'Adventure capital with stunning alpine scenery and world-class outdoor activities.', 20, 'OCEANIC', '/images/queenstown.jpg', 'Low Risk', -45.0312, 168.6626);

-- Add popular activities for each destination
INSERT IGNORE INTO farrin.destination_activities (destination_id, activity) VALUES
-- New York City
((SELECT id FROM farrin.destinations WHERE name = 'New York City, USA'), 'Museums'),
((SELECT id FROM farrin.destinations WHERE name = 'New York City, USA'), 'Broadway Shows'),
((SELECT id FROM farrin.destinations WHERE name = 'New York City, USA'), 'Architecture Tours'),
((SELECT id FROM farrin.destinations WHERE name = 'New York City, USA'), 'Shopping'),

-- Los Angeles
((SELECT id FROM farrin.destinations WHERE name = 'Los Angeles, USA'), 'Beaches'),
((SELECT id FROM farrin.destinations WHERE name = 'Los Angeles, USA'), 'Hollywood Tours'),
((SELECT id FROM farrin.destinations WHERE name = 'Los Angeles, USA'), 'Theme Parks'),
((SELECT id FROM farrin.destinations WHERE name = 'Los Angeles, USA'), 'Nightlife'),

-- Tokyo
((SELECT id FROM farrin.destinations WHERE name = 'Tokyo, Japan'), 'Temple Visits'),
((SELECT id FROM farrin.destinations WHERE name = 'Tokyo, Japan'), 'Technology Tours'),
((SELECT id FROM farrin.destinations WHERE name = 'Tokyo, Japan'), 'Cuisine Tasting'),
((SELECT id FROM farrin.destinations WHERE name = 'Tokyo, Japan'), 'Cherry Blossom Viewing'),

-- Paris
((SELECT id FROM farrin.destinations WHERE name = 'Paris, France'), 'Art Museums'),
((SELECT id FROM farrin.destinations WHERE name = 'Paris, France'), 'Architecture Tours'),
((SELECT id FROM farrin.destinations WHERE name = 'Paris, France'), 'Seine River Cruise'),
((SELECT id FROM farrin.destinations WHERE name = 'Paris, France'), 'Cuisine Tasting'),

-- Rome
((SELECT id FROM farrin.destinations WHERE name = 'Rome, Italy'), 'Historical Sites'),
((SELECT id FROM farrin.destinations WHERE name = 'Rome, Italy'), 'Vatican Tours'),
((SELECT id FROM farrin.destinations WHERE name = 'Rome, Italy'), 'Cuisine Tasting'),
((SELECT id FROM farrin.destinations WHERE name = 'Rome, Italy'), 'Architecture Tours');