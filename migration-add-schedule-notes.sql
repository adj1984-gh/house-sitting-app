-- Migration: Add schedule_notes field to house_instructions table
-- This migration adds a schedule_notes field for additional notes about scheduled services

-- Add schedule_notes field
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS schedule_notes TEXT;

-- Add comment for documentation
COMMENT ON COLUMN house_instructions.schedule_notes IS 'Additional notes for scheduled services (e.g., special instructions, access requirements, etc.)';
