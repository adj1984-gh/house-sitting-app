-- Migration: Normalize all time formats to 24-hour format (HH:MM)
-- This ensures consistent time ordering and display across the application

-- Function to normalize time formats
CREATE OR REPLACE FUNCTION normalize_time_format(time_str TEXT) 
RETURNS TEXT AS $$
BEGIN
  -- Return empty string if input is null or empty
  IF time_str IS NULL OR time_str = '' THEN
    RETURN '';
  END IF;
  
  -- If already in HH:MM format (24-hour), return as-is
  IF time_str ~ '^\d{2}:\d{2}$' THEN
    RETURN time_str;
  END IF;
  
  -- Handle general time periods (don't convert these)
  IF time_str IN ('Morning', 'Afternoon', 'Evening', 'Night', 'TBD', 'No time specified') THEN
    RETURN time_str;
  END IF;
  
  -- Handle flexible descriptions for daily tasks (don't convert these)
  IF time_str ~* '(before|after|during|when|while|around)' THEN
    RETURN time_str;
  END IF;
  
  -- Parse and convert 12-hour format to 24-hour format
  -- Handle formats like "7:00 AM", "2:30 PM", "12:00 PM", etc.
  IF time_str ~* '^\d{1,2}:?\d{0,2}\s*(AM|PM)$' THEN
    DECLARE
      hour_part INTEGER;
      minute_part INTEGER;
      period_part TEXT;
      time_parts TEXT[];
    BEGIN
      -- Extract AM/PM
      period_part = UPPER(SUBSTRING(time_str FROM '(AM|PM)'));
      
      -- Remove AM/PM and clean up
      time_str = TRIM(REGEXP_REPLACE(time_str, '\s*(AM|PM)', '', 'i'));
      
      -- Split by colon
      time_parts = STRING_TO_ARRAY(time_str, ':');
      hour_part = time_parts[1]::INTEGER;
      
      -- Handle minutes (default to 00 if not provided)
      IF array_length(time_parts, 1) > 1 THEN
        minute_part = time_parts[2]::INTEGER;
      ELSE
        minute_part = 0;
      END IF;
      
      -- Convert to 24-hour format
      IF period_part = 'PM' AND hour_part != 12 THEN
        hour_part = hour_part + 12;
      ELSIF period_part = 'AM' AND hour_part = 12 THEN
        hour_part = 0;
      END IF;
      
      -- Format as HH:MM
      RETURN LPAD(hour_part::TEXT, 2, '0') || ':' || LPAD(minute_part::TEXT, 2, '0');
    END;
  END IF;
  
  -- If we can't parse it, return original
  RETURN time_str;
END;
$$ LANGUAGE plpgsql;

-- Update appointment times
UPDATE appointments 
SET time = normalize_time_format(time::TEXT)::TIME 
WHERE time IS NOT NULL;

-- Update daily task times (only for specific times, leave descriptions as-is)
UPDATE daily_tasks 
SET time = normalize_time_format(time)
WHERE time IS NOT NULL 
  AND time != normalize_time_format(time); -- Only update if it would actually change

-- Update house instruction schedule times
UPDATE house_instructions 
SET schedule_time = normalize_time_format(schedule_time)
WHERE schedule_time IS NOT NULL 
  AND schedule_time != normalize_time_format(schedule_time); -- Only update if it would actually change

-- Update feeding schedules in dog JSONB data
UPDATE dogs 
SET feeding_schedule = (
  SELECT jsonb_agg(
    jsonb_set(
      feeding_item, 
      '{time}', 
      to_jsonb(normalize_time_format(feeding_item->>'time'))
    )
  )
  FROM jsonb_array_elements(feeding_schedule) AS feeding_item
)
WHERE feeding_schedule IS NOT NULL 
  AND jsonb_typeof(feeding_schedule) = 'array';

-- Update medicine schedules in dog JSONB data
UPDATE dogs 
SET medicine_schedule = (
  SELECT jsonb_agg(
    jsonb_set(
      medicine_item,
      '{dose_times}',
      (
        SELECT jsonb_agg(
          jsonb_set(
            dose_item,
            '{time}',
            to_jsonb(normalize_time_format(dose_item->>'time'))
          )
        )
        FROM jsonb_array_elements(medicine_item->'dose_times') AS dose_item
      )
    )
  )
  FROM jsonb_array_elements(medicine_schedule) AS medicine_item
)
WHERE medicine_schedule IS NOT NULL 
  AND jsonb_typeof(medicine_schedule) = 'array'
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(medicine_schedule) AS medicine_item
    WHERE jsonb_typeof(medicine_item->'dose_times') = 'array'
  );

-- Clean up the function
DROP FUNCTION normalize_time_format(TEXT);
