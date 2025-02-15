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

-- Set up storage policies for product images
create policy "Public can view product images" on storage.objects for
select using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images" on storage.objects for insert
with
    check (
        bucket_id = 'product-images'
        and auth.role () = 'authenticated'
        and (
            true
        )
    );

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