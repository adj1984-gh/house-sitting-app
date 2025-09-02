-- Migration: Add schedule_time_type field to house instructions
-- This allows house instructions to specify whether they use specific times (e.g., "8:00 PM") 
-- or general times (e.g., "Morning", "Evening") like the dog scheduling system

-- Add schedule_time_type field to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS schedule_time_type TEXT CHECK (schedule_time_type IN ('specific', 'general')) DEFAULT 'specific';

-- Update existing records to use 'specific' time type by default
UPDATE house_instructions 
SET schedule_time_type = 'specific' 
WHERE schedule_time_type IS NULL;

-- Create index for time type queries
CREATE INDEX IF NOT EXISTS idx_house_instructions_time_type ON house_instructions(schedule_time_type);

-- Example: Update existing records that use general time words to 'general' type
UPDATE house_instructions 
SET schedule_time_type = 'general' 
WHERE schedule_time IN ('Morning', 'Afternoon', 'Evening', 'Night');
