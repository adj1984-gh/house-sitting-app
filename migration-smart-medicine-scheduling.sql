-- Migration: Smart Medicine Scheduling System
-- This migration updates the medicine_schedule JSONB structure to support:
-- - Frequency-based dosing (times per day)
-- - Remaining pills/doses tracking
-- - Auto-calculated end dates
-- - Multiple time slots for multiple daily doses

-- Update existing medicine schedules to new smart structure
-- This converts existing medicine schedules to the new format
UPDATE dogs 
SET medicine_schedule = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' 
      THEN jsonb_build_object(
        'medication', COALESCE(value->>'medication', ''),
        'notes', COALESCE(value->>'notes', ''),
        'frequency_per_day', 1, -- Default to once per day for existing medications
        'remaining_doses', 30, -- Default to 30 doses for existing medications
        'dose_times', jsonb_build_array(
          jsonb_build_object(
            'time', COALESCE(value->>'time', ''),
            'dose_amount', '1 dose'
          )
        ),
        'start_date', CURRENT_DATE,
        'calculated_end_date', '', -- Will be calculated by the app
        'legacy_data', value -- Keep original data for reference
      )
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
      AND NOT (value ? 'frequency_per_day')
  );

-- Note: The new medicine_schedule JSONB structure now supports:
-- {
--   "medication": "1 Benadryl (25mg)",
--   "notes": "With food",
--   "frequency_per_day": 2,           -- How many times per day
--   "remaining_doses": 10,            -- How many doses are left
--   "dose_times": [                   -- Array of dose times
--     {
--       "time": "08:00",
--       "dose_amount": "1 pill"
--     },
--     {
--       "time": "20:00", 
--       "dose_amount": "1 pill"
--     }
--   ],
--   "start_date": "2024-12-20",       -- When medication started
--   "calculated_end_date": "2024-12-25", -- Auto-calculated based on remaining_doses / frequency_per_day
--   "legacy_data": { ... }            -- Original data for reference
-- }
