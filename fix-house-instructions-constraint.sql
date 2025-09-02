-- Fix house instructions constraint to allow 'none' value
-- Run this in your Supabase SQL editor

-- Drop the existing constraint
ALTER TABLE house_instructions 
DROP CONSTRAINT IF EXISTS house_instructions_schedule_frequency_check;

-- Add the updated constraint that includes 'none'
ALTER TABLE house_instructions 
ADD CONSTRAINT house_instructions_schedule_frequency_check 
CHECK (schedule_frequency IN ('none', 'one_time', 'daily', 'weekly'));

-- Verify the constraint was updated
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'house_instructions_schedule_frequency_check';
