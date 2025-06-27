-- Add rating column to travel_history table
-- This allows users to rate destinations they've visited (1-5 stars)

ALTER TABLE travel_history 
ADD COLUMN rating INT DEFAULT NULL 
COMMENT 'User rating for the destination (1-5 stars)';

-- Add check constraint to ensure rating is between 1 and 5
ALTER TABLE travel_history 
ADD CONSTRAINT chk_rating_range 
CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

-- Update existing travel history records with random ratings for demo purposes
-- In production, this would be done through user input
UPDATE travel_history 
SET rating = FLOOR(3 + (RAND() * 3)) 
WHERE rating IS NULL 
AND trip_type = 'past_trip';

-- Create index for better performance on rating queries
CREATE INDEX idx_travel_history_rating ON travel_history(destination_id, rating);