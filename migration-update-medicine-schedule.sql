-- Migration: Update medicine_schedule to include notes field
-- Run this in your Supabase SQL editor to update existing medicine schedule data

-- Update medicine_schedule for Pâté (add notes field to existing entries)
UPDATE dogs 
SET medicine_schedule = '[{"time": "Evening", "medication": "1 Benadryl (25mg) with food", "notes": ""}]'
WHERE name = 'Pâté' AND property_id = '00000000-0000-0000-0000-000000000001';

-- Update medicine_schedule for Barolo (add notes field to existing entries)
UPDATE dogs 
SET medicine_schedule = '[{"time": "Morning", "medication": "1 Benadryl (25mg)", "notes": ""}, {"time": "Evening", "medication": "1 Benadryl (25mg) + 1 allergy pill from freezer (via pill pocket)", "notes": ""}]'
WHERE name = 'Barolo' AND property_id = '00000000-0000-0000-0000-000000000001';

-- Optional: Update any other dogs that might have medicine schedules without notes
-- This will add empty notes field to any medicine schedule entries that don't have it
UPDATE dogs 
SET medicine_schedule = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' AND NOT (value ? 'notes') 
      THEN value || '{"notes": ""}'::jsonb
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
      AND NOT (value ? 'notes')
  );
