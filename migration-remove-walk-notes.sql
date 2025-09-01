-- Migration: Remove walk_notes column from dogs table
-- Run this in your Supabase SQL editor to clean up unused field

-- Remove walk_notes column from existing dogs table
ALTER TABLE dogs DROP COLUMN IF EXISTS walk_notes;
