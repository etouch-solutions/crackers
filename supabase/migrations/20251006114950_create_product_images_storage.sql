/*
  # Create Storage Bucket for Product Images

  1. Storage
    - Create a public bucket called `product-images` for storing product images
    - Enable public access for uploaded images
    - Set up RLS policies to allow:
      - Anyone can read/view images (public access)
      - Anyone can upload images (for admin functionality)
      - Anyone can update images (for admin functionality)
      - Anyone can delete images (for admin functionality)

  2. Security
    - Bucket is public for read access
    - Upload/update/delete policies allow public access for simplicity
    
  Note: In production, you should restrict upload/update/delete to authenticated admin users only.
*/

-- Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow public insert access (for uploading images)
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

-- Allow public update access (for updating images)
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow public delete access (for deleting images)
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'product-images');
