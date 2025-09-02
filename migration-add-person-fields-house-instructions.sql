-- Migration: Add person_name and person_phone fields to house_instructions table
-- This migration adds fields for tracking the person responsible for scheduled house services

-- Add person_name field
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS person_name TEXT;

-- Add person_phone field  
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS person_phone TEXT;

-- Add video_url field if it doesn't exist (for completeness)
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN house_instructions.person_name IS 'Person responsible for the scheduled service';
COMMENT ON COLUMN house_instructions.person_phone IS 'Phone number of the person responsible for the service';
COMMENT ON COLUMN house_instructions.video_url IS 'URL for video instructions (YouTube, Vimeo, etc.)';
