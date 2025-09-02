-- Migration: Enhance Scheduling System for House Instructions
-- This migration simplifies the scheduling system and adds support for specific dates

-- Add schedule_date column for one-time events
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS schedule_date DATE;

-- Remove unused complex scheduling fields
ALTER TABLE house_instructions 
DROP COLUMN IF EXISTS schedule_custom,
DROP COLUMN IF EXISTS schedule_days_per_week;

-- Update any existing 'one_time' records to use the new default 'none' if no actual schedule
UPDATE house_instructions 
SET schedule_frequency = 'none' 
WHERE schedule_frequency = 'one_time' 
  AND (schedule_day IS NULL OR schedule_day = '')
  AND (schedule_time IS NULL OR schedule_time = '');

-- Update any existing complex frequency types to simplified versions
UPDATE house_instructions 
SET schedule_frequency = 'weekly' 
WHERE schedule_frequency IN ('days_per_week', 'monthly', 'custom');

-- Clean up any empty schedule_day values for daily schedules
UPDATE house_instructions 
SET schedule_day = NULL 
WHERE schedule_frequency = 'daily';

-- Add comment to explain the simplified scheduling system
COMMENT ON COLUMN house_instructions.schedule_frequency IS 'Simplified scheduling: none (info only), one_time (specific date), daily, weekly';
COMMENT ON COLUMN house_instructions.schedule_date IS 'Specific date for one-time events (stored in YYYY-MM-DD format)';