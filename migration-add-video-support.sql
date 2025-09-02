-- Migration: Add Video Support to Medicine Schedule
-- This migration updates the medicine_schedule JSONB structure to support video uploads
-- for medication instructions and demonstrations

-- Update existing medicine schedules to include video_url field
-- This adds empty video_url to existing medicine schedule entries
UPDATE dogs 
SET medicine_schedule = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' 
      THEN value || '{"video_url": "", "video_thumbnail": ""}'::jsonb
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
      AND NOT (value ? 'video_url')
  );

-- Note: The medicine_schedule JSONB structure now supports:
-- {
--   "medication": "1 Benadryl (25mg)",
--   "notes": "With food",
--   "frequency_per_day": 2,
--   "remaining_doses": 10,
--   "dose_times": [
--     {
--       "time": "08:00",
--       "dose_amount": "1 pill"
--     }
--   ],
--   "start_date": "2024-12-01",
--   "calculated_end_date": "2024-12-11",
--   "video_url": "https://supabase-storage-url/video.mp4",  -- New field for video URL
--   "video_thumbnail": "https://supabase-storage-url/thumb.jpg"  -- New field for video thumbnail
-- }

-- Also add video support to other JSONB fields that might benefit from video instructions
-- Update feeding_schedule to support video_url
UPDATE dogs 
SET feeding_schedule = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' 
      THEN value || '{"video_url": "", "video_thumbnail": ""}'::jsonb
      ELSE value
    END
  )
  FROM jsonb_array_elements(feeding_schedule)
)
WHERE feeding_schedule IS NOT NULL 
  AND jsonb_typeof(feeding_schedule) = 'array'
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(feeding_schedule) 
    WHERE jsonb_typeof(value) = 'object' 
      AND NOT (value ? 'video_url')
  );

-- Update walk_schedule to support video_url
UPDATE dogs 
SET walk_schedule = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' 
      THEN value || '{"video_url": "", "video_thumbnail": ""}'::jsonb
      ELSE value
    END
  )
  FROM jsonb_array_elements(walk_schedule)
)
WHERE walk_schedule IS NOT NULL 
  AND jsonb_typeof(walk_schedule) = 'array'
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(walk_schedule) 
    WHERE jsonb_typeof(value) = 'object' 
      AND NOT (value ? 'video_url')
  );

-- Update special_instructions to support video_url
UPDATE dogs 
SET special_instructions = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(value) = 'object' 
      THEN value || '{"video_url": "", "video_thumbnail": ""}'::jsonb
      ELSE value
    END
  )
  FROM jsonb_array_elements(special_instructions)
)
WHERE special_instructions IS NOT NULL 
  AND jsonb_typeof(special_instructions) = 'array'
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(special_instructions) 
    WHERE jsonb_typeof(value) = 'object' 
      AND NOT (value ? 'video_url')
  );
