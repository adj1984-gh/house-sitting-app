-- Add video support to house instructions
-- Run this in your Supabase SQL editor

-- Add video_url column to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add comment to explain the video field
COMMENT ON COLUMN house_instructions.video_url IS 'YouTube or other video URL for instructional videos';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'house_instructions' 
  AND column_name = 'video_url';
