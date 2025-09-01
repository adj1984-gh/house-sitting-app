-- Database setup for House & Pet Sitting Management System
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  wifi_ssid TEXT,
  wifi_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('danger', 'warning', 'info')),
  category TEXT NOT NULL CHECK (category IN ('pets', 'house', 'general')),
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT,
  photo_url TEXT,
  personality TEXT,
  feeding_schedule JSONB,
  feeding_location TEXT,
  feeding_notes TEXT,
  medicine_schedule JSONB,
  medicine_notes TEXT,
  potty_trained TEXT,
  potty_notes TEXT,
  walk_frequency TEXT,
  walk_notes TEXT,
  sleeping_location TEXT,
  sleeping_notes TEXT,
  special_instructions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service People table
CREATE TABLE IF NOT EXISTS service_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service_day TEXT,
  service_time TEXT,
  payment_amount TEXT,
  payment_status TEXT,
  notes TEXT,
  needs_access BOOLEAN DEFAULT false,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME,
  type TEXT NOT NULL,
  for_dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- House Instructions table
CREATE TABLE IF NOT EXISTS house_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  instructions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Logs table (for tracking who accessed when)
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_type TEXT CHECK (access_type IN ('password', 'qr_code')),
  ip_address TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_property_id ON alerts(property_id);
CREATE INDEX IF NOT EXISTS idx_dogs_property_id ON dogs(property_id);
CREATE INDEX IF NOT EXISTS idx_service_people_property_id ON service_people(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_house_instructions_property_id ON house_instructions(property_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_property_id ON access_logs(property_id);

-- Insert default property data
INSERT INTO properties (id, name, address, wifi_ssid, wifi_password) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '9441 Alto Drive',
  '9441 Alto Drive, La Mesa, CA 91941',
  'Frenchie Den / Frenchie Den2',
  'Fir3fly1'
) ON CONFLICT (id) DO NOTHING;

-- Insert default alerts
INSERT INTO alerts (property_id, type, category, text) VALUES
('00000000-0000-0000-0000-000000000001', 'danger', 'pets', 'COYOTES PRESENT IN BACKYARD - Never let dogs outside unattended'),
('00000000-0000-0000-0000-000000000001', 'warning', 'pets', 'No dogs on the Office Patio during this visit'),
('00000000-0000-0000-0000-000000000001', 'warning', 'pets', 'Keep patio steel door fully shut - Dogs will escape if left ajar'),
('00000000-0000-0000-0000-000000000001', 'info', 'house', 'Septic system - Only flush toilet paper')
ON CONFLICT DO NOTHING;

-- Insert default dogs data
INSERT INTO dogs (id, property_id, name, age, personality, feeding_schedule, feeding_location, feeding_notes, medicine_schedule, medicine_notes, potty_trained, potty_notes, walk_frequency, walk_notes, sleeping_location, sleeping_notes, special_instructions) VALUES
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Pâté',
  '1+ year',
  'Gets ''sharkey'' (goes crazy with mouth) but calms quickly. May run to hot tub area or bottom yard when let out. Likes to steal laundry.',
  '[{"time": "7:00 AM", "amount": "1½ cups refrigerated food"}, {"time": "6:00 PM", "amount": "1½ cups refrigerated food"}]',
  'Refrigerator',
  'When container empties: logs in bottom right refrigerator drawer, use black gloves to break up to ground beef consistency',
  '[{"time": "Evening", "medication": "1 Benadryl (25mg) with food"}]',
  '',
  '99% trained but needs frequent trips outside',
  'Often needs verbal command ''go potty''. May need baby wipes after.',
  'Optional walks only',
  'Leash in laundry room',
  'Normally sleeps with owners',
  'Alternative: Keep in kitchen',
  '{"whenLeaving": "Goes in small cage (office or dining room)", "management": "Keep bedroom doors closed to prevent accidents/mischief"}'
),
(
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Barolo',
  '5 years',
  'Can be territorial (watch for ears back - separate dogs if needed). Responds to shaking a dish towel at him.',
  '[{"time": "7:00 AM", "amount": "3/4 cup dry food"}, {"time": "6:00 PM", "amount": "3/4 cup dry food"}]',
  'Bottom drawer right of stove',
  'Separate dogs across room when feeding. Pick up and rinse bowls immediately.',
  '[{"time": "Morning", "medication": "1 Benadryl (25mg)"}, {"time": "Evening", "medication": "1 Benadryl (25mg) + 1 allergy pill from freezer (via pill pocket)"}]',
  'Wipe top of head once daily with wipes. Currently on medicine for diarrhea.',
  'Fully trained',
  'May whine to go outside at night. May need baby wipes for cleanup. If won''t come back, use leaf blower trigger.',
  'Loves long daily walks',
  'Use black harness on left side. Not good with other dogs - redirect if you see any.',
  'Normally sleeps with owners',
  'Alternative: Keep in kitchen',
  '{"whenLeaving": "Can stay in kitchen with gate closed", "management": "Use cage in living room if dogs need separation"}'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default house instructions
INSERT INTO house_instructions (property_id, category, subcategory, instructions) VALUES
('00000000-0000-0000-0000-000000000001', 'access', 'mudRoom', '{"text": "Keypad on wood panel outside. Enter code + red button to lock/unlock. Inside: turn cylinder right to lock."}'),
('00000000-0000-0000-0000-000000000001', 'access', 'patioDoor', '{"text": "Barolo can nudge it open - must be locked when not in use"}'),
('00000000-0000-0000-0000-000000000001', 'entertainment', 'tv', '{"text": "LG Remote left of TV. Press house button for apps. Apple TV is default. Use iPhone Remote app or small Apple remote by fireplace."}'),
('00000000-0000-0000-0000-000000000001', 'entertainment', 'sonos', '{"text": "Speakers in kitchen, living room, patio, office, guest bedroom. Auto-switches with TV. Control via SONOS app on WiFi."}'),
('00000000-0000-0000-0000-000000000001', 'utilities', 'lights', '{"text": "Kitchen: Say ''Alexa, turn on/off all kitchen''. Living room: Auto at sunset, off at 11:59pm."}'),
('00000000-0000-0000-0000-000000000001', 'utilities', 'thermostat', '{"text": "Set to heat/AC auto. Adjust via touchscreen. DO NOT turn completely off."}'),
('00000000-0000-0000-0000-000000000001', 'utilities', 'septic', '{"text": "Only flush toilet paper - nothing else!"}'),
('00000000-0000-0000-0000-000000000001', 'utilities', 'bathroom', '{"text": "Hall bathroom for your use. Turn on middle switch for shower. Other switches have motion sensors."}'),
('00000000-0000-0000-0000-000000000001', 'amenities', 'hotTub', '{"text": "Free to use. Undo 2 straps, fold cover in half into lifter. Towels in hall closet."}'),
('00000000-0000-0000-0000-000000000001', 'amenities', 'trash', '{"text": "Pickup early Monday AM. Put bins out Sunday night, return after emptying."}')
ON CONFLICT DO NOTHING;

-- Insert default service people
INSERT INTO service_people (property_id, name, service_day, service_time, payment_amount, payment_status, notes, needs_access) VALUES
('00000000-0000-0000-0000-000000000001', 'Hot Tub Maintenance', 'Tuesday', 'Varies', 'Pre-paid', 'Pre-paid', 'Comes to backyard. Will text you heads-up.', true),
('00000000-0000-0000-0000-000000000001', 'Antonio', 'Friday 9/6', 'TBD', '$125.00', 'Pending', 'Needs to be paid when done', true)
ON CONFLICT DO NOTHING;

-- Insert default appointment
INSERT INTO appointments (property_id, date, time, type, for_dog_id, location, notes) VALUES
('00000000-0000-0000-0000-000000000001', '2024-06-06', '09:30:00', 'Vet - Shot', '00000000-0000-0000-0000-000000000002', 'Regular Vet', 'Take ziplock bag from counter. Serum in refrigerator (top right next to jalapeños, marked #2). Dose: 1.0 ml')
ON CONFLICT DO NOTHING;
