-- Migration: Add service duration field to house instructions
-- This adds support for setting expected duration for house services

-- Add the schedule_duration column to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN schedule_duration INTEGER;

-- Add a comment to explain the field
COMMENT ON COLUMN house_instructions.schedule_duration IS 'Expected duration of the service in minutes';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_house_instructions_schedule_duration 
ON house_instructions(schedule_duration) 
WHERE schedule_duration IS NOT NULL;
