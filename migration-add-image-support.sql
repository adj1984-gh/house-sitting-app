-- Migration to add image support to house instructions and medicine schedules
-- Run this in your Supabase SQL editor

-- Add image columns to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image columns to dogs table for medicine schedules
ALTER TABLE dogs 
ADD COLUMN IF NOT EXISTS medicine_image_url TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_house_instructions_image_url ON house_instructions(image_url);
CREATE INDEX IF NOT EXISTS idx_dogs_medicine_image_url ON dogs(medicine_image_url);
