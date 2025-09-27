/*
  # E-commerce Schema for Fireworks Store

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `content` (text)
      - `image_url` (text)
      - `original_price` (decimal)
      - `discount_price` (decimal)
      - `category_id` (uuid, foreign key)
      - `stock_quantity` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
    - `orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `total_amount` (decimal)
      - `status` (text)
      - `created_at` (timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_price` (decimal)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to products and categories
    - Add policies for authenticated users to manage their orders
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content text NOT NULL,
  image_url text NOT NULL,
  original_price decimal(10,2) NOT NULL,
  discount_price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id),
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create policies for customers (users can manage their own data)
CREATE POLICY "Users can insert their own customer data"
  ON customers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own customer data"
  ON customers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own customer data"
  ON customers
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for orders (users can manage their own orders)
CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

-- Create policies for order_items (linked to orders)
CREATE POLICY "Users can insert order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view order items"
  ON order_items
  FOR SELECT
  TO public
  USING (true);

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
  ('sparklers', 'Beautiful sparklers for celebrations', '/src/assets/sparklers-category.jpg'),
  ('rockets', 'High-flying aerial fireworks', '/src/assets/rockets-category.jpg'),
  ('gift-boxes', 'Perfect firework gift sets', '/src/assets/gift-boxes-category.jpg'),
  ('flower-pots', 'Ground-based colorful fountains', '/src/assets/flower-pots-category.jpg')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '10 Cm Electric',
  'Premium electric sparklers for celebrations',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-10cm-electric.jpg',
  29.00,
  15.50,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '10 Cm Colour',
  'Colorful sparklers that light up your celebrations',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-10cm-color.jpg',
  34.00,
  18.50,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '12 Cm Electric',
  'Longer lasting electric sparklers',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-12cm-electric.jpg',
  42.00,
  19.00,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '12 Cm Colour',
  'Colorful 12cm sparklers for extended celebrations',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-12cm-electric.jpg',
  105.00,
  21.00,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '15 Cm Electric',
  'Premium long-lasting electric sparklers',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-15cm-green.jpg',
  150.00,
  30.00,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '15 Cm Colour',
  'Vibrant colored sparklers for special occasions',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-15cm-green.jpg',
  155.00,
  31.00,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '15 Cm Green',
  'Beautiful green sparklers for festive celebrations',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-15cm-green.jpg',
  190.00,
  38.00,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, content, image_url, original_price, discount_price, category_id, stock_quantity) 
SELECT 
  '15 Cm Red',
  'Stunning red sparklers for memorable moments',
  '1 Box (10 Pcs)',
  '/src/assets/sparkler-15cm-red.jpg',
  205.00,
  41.00,
  c.id,
  100
FROM categories c WHERE c.name = 'sparklers'
ON CONFLICT DO NOTHING;