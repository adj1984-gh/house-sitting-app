-- Migration: Remove medicine_notes column from dogs table
-- Run this in your Supabase SQL editor to clean up unused field

-- Remove medicine_notes column from existing dogs table
ALTER TABLE dogs DROP COLUMN IF EXISTS medicine_notes;
