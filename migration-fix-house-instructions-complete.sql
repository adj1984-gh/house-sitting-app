-- Migration: Complete fix for house instructions schema
-- This adds all missing scheduling fields and the time type field

-- Add all missing scheduling fields to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS needs_scheduling BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly', 'custom')),
ADD COLUMN IF NOT EXISTS schedule_day TEXT,
ADD COLUMN IF NOT EXISTS schedule_time TEXT,
ADD COLUMN IF NOT EXISTS schedule_time_type TEXT CHECK (schedule_time_type IN ('specific', 'general')) DEFAULT 'specific',
ADD COLUMN IF NOT EXISTS schedule_notes TEXT,
ADD COLUMN IF NOT EXISTS remind_day_before BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_house_instructions_scheduling ON house_instructions(needs_scheduling, schedule_frequency, schedule_day);
CREATE INDEX IF NOT EXISTS idx_house_instructions_time_type ON house_instructions(schedule_time_type);

-- Update existing records to use 'specific' time type by default
UPDATE house_instructions 
SET schedule_time_type = 'specific' 
WHERE schedule_time_type IS NULL;

-- Update existing records that use general time words to 'general' type
UPDATE house_instructions 
SET schedule_time_type = 'general' 
WHERE schedule_time IN ('Morning', 'Afternoon', 'Evening', 'Night');

-- Example: Add some default scheduled services if they don't exist
INSERT INTO house_instructions (property_id, category, subcategory, instructions, needs_scheduling, schedule_frequency, schedule_day, schedule_time, schedule_time_type, schedule_notes, remind_day_before) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'amenities', 
  'trash', 
  '{"text": "Trash pickup every Monday morning. Put bins out Sunday night.", "maintenance": "Check bin condition weekly."}',
  true,
  'weekly',
  'monday',
  'Morning',
  'general',
  'Put bins out Sunday night for Monday morning pickup',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO house_instructions (property_id, category, subcategory, instructions, needs_scheduling, schedule_frequency, schedule_day, schedule_time, schedule_time_type, schedule_notes) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'amenities', 
  'hotTub', 
  '{"text": "Free to use. Undo 2 straps, fold cover in half into lifter. Towels in hall closet.", "maintenance": "Check chemical levels and clean filter weekly."}',
  true,
  'weekly',
  'sunday',
  '10:00 AM',
  'specific',
  'Weekly hot tub maintenance - check chemicals and clean filter'
) ON CONFLICT DO NOTHING;
