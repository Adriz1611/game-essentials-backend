-- Create storage buckets
insert into
    storage.buckets (id, name, public)
values (
        'product-images',
        'product-images',
        true
    ),
    (
        'user-uploads',
        'user-uploads',
        false
    );

-- Set up storage policies for product imagesCREATE POLICY "everyone 16wiy3a_0" ON storage.objects FOR
SELECT TO anon, authenticated USING (bucket_id = 'product-images');
CREATE POLICY "everyone 16wiy3a_1" ON storage.objects FOR INSERT TO anon,
authenticated
WITH
    CHECK (bucket_id = 'product-images');

CREATE POLICY "everyone 16wiy3a_2" ON storage.objects
FOR UPDATE
    TO anon,
    authenticated USING (bucket_id = 'product-images');

CREATE POLICY "everyone 16wiy3a_3" ON storage.objects FOR DELETE TO anon,
authenticated USING (bucket_id = 'product-images');

-- Set up storage policies for user uploads
create policy "Users can view own uploads" on storage.objects for
select using (
        bucket_id = 'user-uploads'
        and auth.uid () = owner
    );

create policy "Users can upload own files" on storage.objects for insert
with
    check (
        bucket_id = 'user-uploads'
        and auth.uid () = owner
    );