-- Travel Destinations Seed Data for Recommendation Service
-- 24 destinations for AI model recommendations

INSERT INTO destinations (name, description, country_id, climate, image_url, travel_advisory, latitude, longitude) VALUES

-- Amsterdam, Netherlands (ID: 36) - Has actual image file
('Amsterdam', 'Historic canals, world-class museums, and vibrant nightlife in the heart of Europe. Experience cycling culture, Anne Frank House, and unique architecture.', 
36, 'CONTINENTAL', '/images/destinations/amsterdam/58b6b0f863b55 (1).avif', 'Exercise normal precautions', 52.3676, 4.9041),

-- Athens, Greece (ID: 40) - No image available
('Athens', 'Ancient cradle of democracy with iconic ruins, Mediterranean cuisine, and rich cultural heritage. Explore the Acropolis, Parthenon, and vibrant neighborhoods.', 
40, 'MEDITERRANEAN', NULL, 'Exercise normal precautions', 37.9838, 23.7275),

-- Auckland, New Zealand (ID: 153) - No image available
('Auckland', 'Adventure capital with stunning harbors, volcanic landscapes, and outdoor activities. Gateway to New Zealand''s natural wonders and Maori culture.', 
153, 'CONTINENTAL', NULL, 'Exercise normal precautions', -36.8485, 174.7633),

-- Bali, Indonesia (ID: 66) - No image available
('Bali', 'Tropical paradise with ancient temples, lush rice terraces, and pristine beaches. Perfect blend of culture, spirituality, and natural beauty.', 
66, 'TROPICAL', NULL, 'Exercise increased caution', -8.3405, 115.0920),

-- Bangkok, Thailand (ID: 69) - No image available
('Bangkok', 'Bustling metropolis with golden temples, street food culture, and vibrant markets. Experience traditional Thai culture amidst modern city life.', 
69, 'TROPICAL', NULL, 'Exercise increased caution', 13.7563, 100.5018),

-- Barcelona, Spain (ID: 34) - No image available
('Barcelona', 'Architectural marvel with Gaudí masterpieces, Mediterranean beaches, and passionate culture. Art, food, and football in Catalonia''s capital.', 
34, 'MEDITERRANEAN', NULL, 'Exercise normal precautions', 41.3851, 2.1734),

-- Berlin, Germany (ID: 32) - No image available
('Berlin', 'Historic city with fascinating museums, vibrant arts scene, and rich history. Experience the remnants of the Cold War and modern German culture.', 
32, 'CONTINENTAL', NULL, 'Exercise normal precautions', 52.5200, 13.4050),

-- Cancun, Mexico (ID: 3) - No image available
('Cancun', 'Caribbean paradise with pristine beaches, ancient Mayan ruins, and vibrant nightlife. Perfect for beach lovers and history enthusiasts.', 
3, 'TROPICAL', NULL, 'Exercise increased caution', 21.1619, -86.8515),

-- Cape Town, South Africa (ID: 104) - No image available
('Cape Town', 'Dramatic landscapes with Table Mountain, wine regions, and stunning coastlines. Rich history, diverse culture, and wildlife experiences.', 
104, 'MEDITERRANEAN', NULL, 'Exercise increased caution', -33.9249, 18.4241),

-- Dubai, United Arab Emirates (ID: 88) - No image available
('Dubai', 'Futuristic city with luxury shopping, modern architecture, and desert adventures. Experience traditional souks alongside world-class attractions.', 
88, 'ARID', NULL, 'Exercise normal precautions', 25.2048, 55.2708),

-- Edinburgh, Scotland (part of United Kingdom) (ID: 30) - No image available
('Edinburgh', 'Medieval charm with historic castle, festivals, and Scottish culture. Explore cobblestone streets, whisky culture, and stunning architecture.', 
30, 'CONTINENTAL', NULL, 'Exercise normal precautions', 55.9533, -3.1883),

-- Honolulu, Hawaii (USA) (ID: 1) - No image available
('Honolulu', 'Pacific paradise with volcanic landscapes, surfing culture, and Polynesian heritage. Perfect beaches, hiking, and tropical island life.', 
1, 'TROPICAL', NULL, 'Exercise normal precautions', 21.3099, -157.8581),

-- London, United Kingdom (ID: 30) - No image available
('London', 'Historic capital with royal palaces, world-class museums, and diverse culture. Experience centuries of history alongside modern innovation.', 
30, 'CONTINENTAL', NULL, 'Exercise normal precautions', 51.5074, -0.1278),

-- Los Angeles, USA (ID: 1) - No image available
('Los Angeles', 'Entertainment capital with Hollywood glamour, beautiful beaches, and diverse neighborhoods. Experience movie magic and California lifestyle.', 
1, 'MEDITERRANEAN', NULL, 'Exercise normal precautions', 34.0522, -118.2437),

-- Marrakech, Morocco (ID: 109) - No image available
('Marrakech', 'Imperial city with vibrant souks, traditional riads, and Saharan culture. Experience the magic of North Africa in this historic desert city.', 
109, 'ARID', NULL, 'Exercise increased caution', 31.6295, -7.9811),

-- New York, USA (ID: 1) - No image available
('New York', 'The city that never sleeps with iconic skylines, world-class culture, and endless energy. Experience Broadway, Central Park, and diverse neighborhoods.', 
1, 'CONTINENTAL', NULL, 'Exercise normal precautions', 40.7128, -74.0060),

-- Paris, France (ID: 31) - No image available
('Paris', 'City of Light with romantic ambiance, world-renowned cuisine, and artistic heritage. Experience the Eiffel Tower, Louvre, and café culture.', 
31, 'CONTINENTAL', NULL, 'Exercise normal precautions', 48.8566, 2.3522),

-- Phuket, Thailand (ID: 69) - No image available
('Phuket', 'Tropical island paradise with stunning beaches, water sports, and vibrant nightlife. Perfect for relaxation and adventure in southern Thailand.', 
69, 'TROPICAL', NULL, 'Exercise increased caution', 7.8804, 98.3923),

-- Rio de Janeiro, Brazil (ID: 18) - No image available
('Rio de Janeiro', 'Carnival capital with iconic beaches, Christ the Redeemer, and infectious energy. Experience Brazilian culture, music, and natural beauty.', 
18, 'TROPICAL', NULL, 'Exercise increased caution', -22.9068, -43.1729),

-- Rome, Italy (ID: 33) - No image available
('Rome', 'Eternal City with ancient ruins, Vatican treasures, and culinary excellence. Walk through history from the Colosseum to modern Italian culture.', 
33, 'MEDITERRANEAN', NULL, 'Exercise normal precautions', 41.9028, 12.4964),

-- Seoul, South Korea (ID: 65) - No image available
('Seoul', 'Dynamic metropolis blending ancient traditions with cutting-edge technology. Experience K-culture, cuisine, and modern Asian lifestyle.', 
65, 'CONTINENTAL', NULL, 'Exercise normal precautions', 37.5665, 126.9780),

-- Sydney, Australia (ID: 151) - No image available
('Sydney', 'Harbor city with iconic Opera House, beautiful beaches, and laid-back lifestyle. Experience Australian culture and stunning coastal scenery.', 
151, 'MEDITERRANEAN', NULL, 'Exercise normal precautions', -33.8688, 151.2093),

-- Tokyo, Japan (ID: 64) - No image available
('Tokyo', 'Futuristic metropolis with ancient temples, cutting-edge technology, and unique culture. Experience traditional Japan alongside modern innovation.', 
64, 'CONTINENTAL', NULL, 'Exercise normal precautions', 35.6762, 139.6503),

-- Vancouver, Canada (ID: 2) - No image available
('Vancouver', 'Coastal city with mountains, forests, and multicultural atmosphere. Perfect blend of outdoor adventure and urban sophistication.', 
2, 'CONTINENTAL', NULL, 'Exercise normal precautions', 49.2827, -123.1207);

-- Activities will be added in a separate script after destinations are loaded