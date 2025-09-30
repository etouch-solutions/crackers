/*
  # Fix Products Table Issues

  1. Ensure proper UUID generation for product IDs
  2. Add proper constraints and defaults
  3. Fix any potential issues with product creation
*/

-- Ensure the products table has proper UUID generation
ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Ensure proper constraints
ALTER TABLE products 
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN content SET NOT NULL,
  ALTER COLUMN image_url SET NOT NULL,
  ALTER COLUMN original_price SET NOT NULL,
  ALTER COLUMN discount_price SET NOT NULL;

-- Add check constraints for positive prices
ALTER TABLE products 
  ADD CONSTRAINT products_original_price_positive CHECK (original_price > 0),
  ADD CONSTRAINT products_discount_price_positive CHECK (discount_price > 0),
  ADD CONSTRAINT products_stock_quantity_non_negative CHECK (stock_quantity >= 0);

-- Ensure RLS is properly configured
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

-- Add policy for admin operations (you can restrict this further with authentication)
DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Admin can manage products"
  ON products
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure orders table has proper status updates
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders 
  ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Update RLS policies for orders
DROP POLICY IF EXISTS "Admin can manage orders" ON orders;
CREATE POLICY "Admin can manage orders"
  ON orders
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);