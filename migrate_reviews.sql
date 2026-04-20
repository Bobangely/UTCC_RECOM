-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor

ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS author_name  TEXT,
    ADD COLUMN IF NOT EXISTS place_type   TEXT,
    ADD COLUMN IF NOT EXISTS created_at   TIMESTAMP;

-- Fix existing rows: fill NULL values
UPDATE reviews SET created_at = NOW()    WHERE created_at IS NULL;
UPDATE reviews SET place_type = 'nearby' WHERE place_type IS NULL;
