-- Migration: Add scheduling support to house instructions
-- This allows house services (like trash pickup, hot tub maintenance) to be scheduled

-- Add scheduling fields to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS needs_scheduling BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly', 'custom')),
ADD COLUMN IF NOT EXISTS schedule_day TEXT, -- For weekly: 'monday', 'tuesday', etc. For monthly: '1st', '2nd', etc.
ADD COLUMN IF NOT EXISTS schedule_time TEXT, -- Time of day for the service
ADD COLUMN IF NOT EXISTS schedule_notes TEXT, -- Additional scheduling notes
ADD COLUMN IF NOT EXISTS remind_day_before BOOLEAN DEFAULT false; -- Show reminder the day before

-- Create index for scheduled house instructions
CREATE INDEX IF NOT EXISTS idx_house_instructions_scheduling ON house_instructions(needs_scheduling, schedule_frequency, schedule_day);

-- Update existing house instructions that should be scheduled
UPDATE house_instructions 
SET needs_scheduling = true,
    schedule_frequency = 'weekly',
    schedule_day = 'sunday',
    schedule_time = '8:00 PM',
    schedule_notes = 'Put bins out Sunday night, return after Monday morning pickup',
    remind_day_before = true
WHERE category = 'amenities' AND subcategory = 'trash';

-- Add a new scheduled service example
INSERT INTO house_instructions (property_id, category, subcategory, instructions, needs_scheduling, schedule_frequency, schedule_day, schedule_time, schedule_notes) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'amenities', 
  'hotTub', 
  '{"text": "Free to use. Undo 2 straps, fold cover in half into lifter. Towels in hall closet. Check chemical levels weekly.", "maintenance": "Test water pH and chlorine levels. Add chemicals as needed. Clean filter monthly."}',
  true,
  'weekly',
  'sunday',
  '10:00 AM',
  'Weekly hot tub maintenance - check chemicals and clean filter'
) ON CONFLICT DO NOTHING;
