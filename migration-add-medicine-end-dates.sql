-- Migration: Add end date/time fields to medicine schedule
-- This migration updates the medicine_schedule JSONB structure to include end_date and end_time
-- for tracking when medications should stop (e.g., 5-day courses)

-- Update existing medicine schedules to include end_date and end_time fields
-- This adds empty end_date and end_time to existing medicine schedule entries
UPDATE dogs 
SET medicine_schedule = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' 
      THEN value || '{"end_date": "", "end_time": ""}'::jsonb
      ELSE value
    END
  )
  FROM jsonb_array_elements(medicine_schedule)
)
WHERE medicine_schedule IS NOT NULL 
  AND jsonb_typeof(medicine_schedule) = 'array'
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(medicine_schedule) 
    WHERE jsonb_typeof(value) = 'object' 
      AND NOT (value ? 'end_date')
  );

-- Note: The medicine_schedule JSONB structure now supports:
-- {
--   "time": "Morning",
--   "medication": "1 Benadryl (25mg)",
--   "notes": "With food",
--   "end_date": "2024-12-25",  -- New field for when medication stops
--   "end_time": "08:00"        -- New field for end time (optional)
-- }
