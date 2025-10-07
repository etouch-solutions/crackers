/*
  # Reverse Category Display Order

  1. Changes
    - Reverse the display_order values for all existing categories
    - Categories that were at the top (display_order = 1) will now be at the bottom
    - Categories that were at the bottom will now be at the top
    - Update the sort order to descending so first added categories appear first

  2. Implementation
    - Calculate max display_order
    - Update each category's display_order to (max_display_order + 1 - current_display_order)
*/

-- Reverse the display_order for all categories
DO $$
DECLARE
  max_order integer;
BEGIN
  -- Get the maximum display_order
  SELECT COALESCE(MAX(display_order), 0) INTO max_order FROM categories;
  
  -- Reverse the display_order for all categories
  -- Use a temporary offset to avoid conflicts during update
  UPDATE categories SET display_order = display_order + max_order + 1000;
  UPDATE categories SET display_order = (max_order + 1001) - display_order;
END $$;
