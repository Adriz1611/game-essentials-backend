create table public.storefront_settings (
    id uuid not null default extensions.uuid_generate_v4 (),
    site_type text not null check (
        site_type in ('main', 'digital', 'resell')
    ),
    hero_image_url text null,
    hero_redirect_url text null,
    -- Array of category IDs for sub-navigation
    sub_navigation_categories uuid [] null,
    created_at timestamp with time zone not null default timezone ('utc', now()),
    updated_at timestamp with time zone not null default timezone ('utc', now()),
    constraint storefront_settings_pkey primary key (id)
);

INSERT INTO
    storage.buckets (id, name, public)
VALUES (
        'hero-images',
        'hero-images',
        true
    );

CREATE POLICY "everyone 16wiy5a_0" ON storage.objects FOR
SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "everyone 16wiy5a_1" ON storage.objects FOR INSERT TO anon,
authenticated
WITH
    CHECK (bucket_id = 'hero-images');

CREATE POLICY everyone_16wiy5a_1 ON storage.objects FOR INSERT TO anon,
authenticated
WITH
    CHECK (bucket_id = 'hero-images');

CREATE POLICY everyone_16wiy5a_2 ON storage.objects
FOR UPDATE
    TO anon,
    authenticated USING (bucket_id = 'hero-images');

CREATE POLICY everyone_16wiy5a_3 ON storage.objects FOR DELETE TO anon,
authenticated USING (bucket_id = 'hero-images');