-- Migration: Add birthdate column to dogs table
-- Run this in your Supabase SQL editor to fix the photo upload issue

-- Add birthdate column to existing dogs table
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS birthdate DATE;

-- Update existing dogs with birthdate if age is provided
-- This is optional - you can manually set birthdates for existing dogs
-- UPDATE dogs SET birthdate = '2023-01-01' WHERE name = 'Pâté' AND birthdate IS NULL;
-- UPDATE dogs SET birthdate = '2019-01-01' WHERE name = 'Barolo' AND birthdate IS NULL;
