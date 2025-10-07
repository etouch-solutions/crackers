/*
  # Add Display Order to Categories

  1. Changes
    - Add `display_order` column to categories table
    - Set default value to 0
    - Create index for better sorting performance
    - Update existing categories with display order based on website order

  2. Notes
    - Categories will be displayed in ascending order by display_order
    - Lower numbers appear first
*/

-- Add display_order column to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN display_order integer DEFAULT 0;
  END IF;
END $$;

-- Create index for better sorting performance
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Update existing categories with display order based on website
-- Note: These are based on the reference website's category order
UPDATE categories SET display_order = 1 WHERE LOWER(name) LIKE '%sky king%' AND LOWER(name) LIKE '%2025%';
UPDATE categories SET display_order = 2 WHERE LOWER(name) = 'sparklers';
UPDATE categories SET display_order = 3 WHERE LOWER(name) LIKE '%ramesh%' OR (LOWER(name) LIKE '%colour%' AND LOWER(name) LIKE '%sparkler%');
UPDATE categories SET display_order = 4 WHERE LOWER(name) = 'flower pots';
UPDATE categories SET display_order = 5 WHERE LOWER(name) LIKE '%multi colour%' AND LOWER(name) LIKE '%flower pot%';
UPDATE categories SET display_order = 6 WHERE LOWER(name) = 'chakker';
UPDATE categories SET display_order = 7 WHERE LOWER(name) LIKE '%plastic chakker%';
UPDATE categories SET display_order = 8 WHERE LOWER(name) LIKE '%twinkling star%';
UPDATE categories SET display_order = 9 WHERE LOWER(name) LIKE '%one sound%';
UPDATE categories SET display_order = 10 WHERE LOWER(name) LIKE '%bijili%';
UPDATE categories SET display_order = 11 WHERE LOWER(name) LIKE '%sky rocket%' OR LOWER(name) = 'rockets';
UPDATE categories SET display_order = 12 WHERE LOWER(name) = 'bombs';
UPDATE categories SET display_order = 13 WHERE LOWER(name) LIKE '%wala cracker%';
UPDATE categories SET display_order = 14 WHERE LOWER(name) LIKE '%asok%';
UPDATE categories SET display_order = 15 WHERE LOWER(name) LIKE '%vanitha%' AND LOWER(name) LIKE '%2025%';
UPDATE categories SET display_order = 16 WHERE LOWER(name) LIKE '%vanitha%' AND LOWER(name) LIKE '%colour%';
UPDATE categories SET display_order = 17 WHERE LOWER(name) LIKE '%tank%';
UPDATE categories SET display_order = 18 WHERE LOWER(name) LIKE '%blue star%';
UPDATE categories SET display_order = 19 WHERE LOWER(name) LIKE '%wow star%';
UPDATE categories SET display_order = 20 WHERE LOWER(name) LIKE '%inf big%';
UPDATE categories SET display_order = 21 WHERE LOWER(name) LIKE '%sky king%' AND LOWER(name) LIKE '%3pcs%';
UPDATE categories SET display_order = 22 WHERE LOWER(name) LIKE '%cat brand%';
UPDATE categories SET display_order = 23 WHERE LOWER(name) LIKE '%wonder candle%';
UPDATE categories SET display_order = 24 WHERE LOWER(name) LIKE '%colour crackling gun%';
UPDATE categories SET display_order = 25 WHERE LOWER(name) LIKE '%mega multi colour shot%';
UPDATE categories SET display_order = 26 WHERE LOWER(name) LIKE '%multi colour shot%' AND NOT LOWER(name) LIKE '%mega%';
UPDATE categories SET display_order = 27 WHERE LOWER(name) LIKE '%mega sky display%';
UPDATE categories SET display_order = 28 WHERE LOWER(name) LIKE '%mega%' AND LOWER(name) LIKE '%display%' AND LOWER(name) LIKE '%series%';
UPDATE categories SET display_order = 29 WHERE LOWER(name) LIKE '%musical%';
UPDATE categories SET display_order = 30 WHERE LOWER(name) LIKE '%mini trail%';
UPDATE categories SET display_order = 31 WHERE LOWER(name) LIKE '%colour crackling fountain%';
UPDATE categories SET display_order = 32 WHERE LOWER(name) LIKE '%double wonder fountain%';
UPDATE categories SET display_order = 33 WHERE LOWER(name) LIKE '%double%' AND LOWER(name) LIKE '%attaction%';
UPDATE categories SET display_order = 34 WHERE LOWER(name) LIKE '%180%' AND LOWER(name) LIKE '%fountain%';
UPDATE categories SET display_order = 35 WHERE LOWER(name) LIKE '%crackling fountain%' AND NOT LOWER(name) LIKE '%colour%';
UPDATE categories SET display_order = 36 WHERE LOWER(name) LIKE '%new collection wala%';
UPDATE categories SET display_order = 37 WHERE LOWER(name) LIKE '%new main paper%';
UPDATE categories SET display_order = 38 WHERE LOWER(name) LIKE '%children%' OR LOWER(name) LIKE '%cnilorens%';
UPDATE categories SET display_order = 39 WHERE LOWER(name) LIKE '%colour budget%';
UPDATE categories SET display_order = 40 WHERE LOWER(name) = 'gift box' OR LOWER(name) = 'gift boxes';
UPDATE categories SET display_order = 41 WHERE LOWER(name) LIKE '%tin fountain%';
UPDATE categories SET display_order = 42 WHERE LOWER(name) LIKE '%ring cap%';
UPDATE categories SET display_order = 43 WHERE LOWER(name) LIKE '%colour match%';
UPDATE categories SET display_order = 44 WHERE LOWER(name) LIKE '%paper bomb%' OR LOWER(name) LIKE '%papper bomb%';
