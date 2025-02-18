-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('product-images', 'product-images', true),
    ('user-uploads', 'user-uploads', false);

-- Set up storage policies for product images
CREATE POLICY everyone_16wiy3a_0
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

CREATE POLICY everyone_16wiy3a_1
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY everyone_16wiy3a_2
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'product-images');

CREATE POLICY everyone_16wiy3a_3
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'product-images');

-- Set up storage policies for user uploads
CREATE POLICY users_can_view_own_uploads
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'user-uploads'
    AND auth.uid() = owner
);

CREATE POLICY users_can_upload_own_files
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'user-uploads'
    AND auth.uid() = owner
);
