-- Migration to add delivery support to house instructions
-- Run this in your Supabase SQL editor

-- Add delivery-specific columns to house_instructions table
ALTER TABLE house_instructions 
ADD COLUMN IF NOT EXISTS delivery_window TEXT,
ADD COLUMN IF NOT EXISTS delivery_company TEXT,
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- Add check constraint for delivery_window
ALTER TABLE house_instructions 
ADD CONSTRAINT check_delivery_window 
CHECK (delivery_window IS NULL OR delivery_window IN ('morning', 'afternoon', 'evening', 'anytime'));

-- Add index for better performance on delivery queries
CREATE INDEX IF NOT EXISTS idx_house_instructions_delivery_company ON house_instructions(delivery_company);
CREATE INDEX IF NOT EXISTS idx_house_instructions_tracking_number ON house_instructions(tracking_number);

-- Insert sample delivery instructions
INSERT INTO house_instructions (property_id, category, subcategory, instructions, delivery_window, delivery_company, schedule_frequency, schedule_time, remind_day_before) VALUES
('00000000-0000-0000-0000-000000000001', 'deliveries', 'amazon', '{"text": "Check front porch daily for Amazon packages. Usually arrive between 2-5 PM. Bring inside immediately if raining. Take photo and text owners when packages arrive."}', 'afternoon', 'Amazon', 'daily', 'Afternoon', true),
('00000000-0000-0000-0000-000000000001', 'deliveries', 'ups', '{"text": "UPS packages typically arrive in the morning. Check front door and side gate area. Sign for packages if required. Store in mud room until owners return."}', 'morning', 'UPS', 'daily', 'Morning', false),
('00000000-0000-0000-0000-000000000001', 'deliveries', 'fedex', '{"text": "FedEx deliveries usually come in the afternoon. Check all entrances - front door, side gate, and back patio. Packages may be left in different locations."}', 'afternoon', 'FedEx', 'daily', 'Afternoon', false)
ON CONFLICT DO NOTHING;
