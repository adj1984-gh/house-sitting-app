-- Migration: Add vet_visits field to dogs table
-- Run this in your Supabase SQL editor to add vet visits support to existing databases

-- Add vet_visits JSONB column to dogs table
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS vet_visits JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the field
COMMENT ON COLUMN dogs.vet_visits IS 'Array of vet visit objects with scheduling and reminder information';

-- Update any existing dogs that might have NULL vet_visits to have empty array
UPDATE dogs SET vet_visits = '[]'::jsonb WHERE vet_visits IS NULL;

-- Create index for better performance on vet_visits queries (optional)
CREATE INDEX IF NOT EXISTS idx_dogs_vet_visits ON dogs USING GIN (vet_visits);

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'dogs' 
  AND column_name = 'vet_visits';
