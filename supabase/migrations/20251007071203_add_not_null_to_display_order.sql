/*
  # Update display_order column to NOT NULL with default

  1. Changes
    - Set any NULL display_order values to 0
    - Add NOT NULL constraint to display_order column
    - Ensure default value is set to 0
  
  2. Purpose
    - Ensure all existing and future categories have a display_order value
    - Prevent NULL values in display_order column
*/

-- First, update any NULL values to 0
UPDATE categories 
SET display_order = 0 
WHERE display_order IS NULL;

-- Add NOT NULL constraint
ALTER TABLE categories 
ALTER COLUMN display_order SET NOT NULL;

-- Ensure default is set
ALTER TABLE categories 
ALTER COLUMN display_order SET DEFAULT 0;
