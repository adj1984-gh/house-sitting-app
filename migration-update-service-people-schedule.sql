-- Migration: Update Service People to use proper date/time scheduling
-- This migration updates the service_people table to use specific date/time fields
-- instead of text-based day/time fields for better scheduling integration

-- Add new columns for proper date/time scheduling
ALTER TABLE service_people 
ADD COLUMN IF NOT EXISTS service_date DATE,
ADD COLUMN IF NOT EXISTS service_start_time TIME,
ADD COLUMN IF NOT EXISTS service_end_time TIME;

-- Add index for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_service_people_service_date ON service_people(service_date);

-- Update existing data to use new format where possible
-- This is a best-effort migration - some data may need manual review
UPDATE service_people 
SET service_date = CURRENT_DATE + INTERVAL '1 day'
WHERE service_day IS NOT NULL AND service_date IS NULL;

-- Note: The old service_day and service_time columns are kept for backward compatibility
-- They can be removed in a future migration after data has been migrated
