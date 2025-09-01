-- Database Testing Scripts for House & Pet Sitting Management System
-- Run these in your Supabase SQL editor to test the database setup

-- 1. Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'alerts', 'dogs', 'service_people', 'appointments', 'house_instructions', 'daily_tasks', 'stays', 'contacts', 'access_logs')
ORDER BY table_name;

-- 2. Check if the default property exists
SELECT * FROM properties WHERE id = '00000000-0000-0000-0000-000000000001';

-- 3. Check stays table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'stays' 
ORDER BY ordinal_position;

-- 4. Check foreign key constraints on stays table
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'stays';

-- 5. Test creating a stay manually (this should work)
INSERT INTO stays (property_id, sitter_name, start_date, end_date, notes, active) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Sitter',
    '2024-12-20',
    '2024-12-25',
    'Test stay for debugging',
    true
) RETURNING *;

-- 6. Check if the stay was created
SELECT * FROM stays WHERE sitter_name = 'Test Sitter';

-- 7. Check current stays
SELECT * FROM stays ORDER BY created_at DESC LIMIT 5;

-- 8. Test the hasActiveStay function logic manually
SELECT 
    id,
    sitter_name,
    start_date,
    end_date,
    active,
    CASE 
        WHEN active = true 
        AND start_date <= CURRENT_DATE 
        AND end_date >= CURRENT_DATE 
        THEN 'ACTIVE'
        ELSE 'INACTIVE'
    END as status
FROM stays 
WHERE property_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;

-- 9. Check if there are any RLS policies that might be blocking inserts
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'stays';

-- 10. Check table permissions
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_name = 'stays';

-- 11. Clean up test data (run this after testing)
-- DELETE FROM stays WHERE sitter_name = 'Test Sitter';

-- 12. Check for any existing stays
SELECT COUNT(*) as total_stays FROM stays;

-- 13. Check if the property has any related data
SELECT 
    'alerts' as table_name, COUNT(*) as count FROM alerts WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'dogs', COUNT(*) FROM dogs WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'service_people', COUNT(*) FROM service_people WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'house_instructions', COUNT(*) FROM house_instructions WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'daily_tasks', COUNT(*) FROM daily_tasks WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'stays', COUNT(*) FROM stays WHERE property_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts WHERE property_id = '00000000-0000-0000-0000-000000000001';
