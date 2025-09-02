-- Migration: Add video support to house instructions
-- This migration adds video_url field to house_instructions table

-- Add video_url column to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add comment to explain the video field
COMMENT ON COLUMN house_instructions.video_url IS 'YouTube or other video URL for instructional videos';
