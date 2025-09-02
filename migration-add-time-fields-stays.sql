-- Migration: Add start_time and end_time fields to stays table
-- This migration adds time fields for more precise stay scheduling

-- Add start_time field
ALTER TABLE stays 
ADD COLUMN IF NOT EXISTS start_time TEXT;

-- Add end_time field  
ALTER TABLE stays 
ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Add comments for documentation
COMMENT ON COLUMN stays.start_time IS 'Start time for the stay (e.g., 2:00 PM, 14:00)';
COMMENT ON COLUMN stays.end_time IS 'End time for the stay (e.g., 10:00 AM, 10:00)';
