-- Migration: Enhance scheduling system with flexible frequency options
-- This removes the needs_scheduling checkbox and adds new frequency options

-- Remove the needs_scheduling column (no longer needed)
ALTER TABLE house_instructions 
DROP COLUMN IF EXISTS needs_scheduling;

-- Update the schedule_frequency constraint to include new options
ALTER TABLE house_instructions 
DROP CONSTRAINT IF EXISTS house_instructions_schedule_frequency_check;

ALTER TABLE house_instructions 
ADD CONSTRAINT house_instructions_schedule_frequency_check 
CHECK (schedule_frequency IN ('one_time', 'daily', 'weekly', 'days_per_week', 'monthly', 'custom'));

-- Update existing records to have proper frequency values
-- If they had needs_scheduling = true, set frequency to 'weekly' (most common)
-- If they had needs_scheduling = false or null, set frequency to 'one_time'
UPDATE house_instructions 
SET schedule_frequency = 'weekly' 
WHERE schedule_frequency IS NULL OR schedule_frequency = '';

-- For any existing records without a frequency, default to 'one_time'
UPDATE house_instructions 
SET schedule_frequency = 'one_time' 
WHERE schedule_frequency IS NULL;
