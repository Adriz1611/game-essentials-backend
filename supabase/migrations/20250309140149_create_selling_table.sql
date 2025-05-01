-- 1. Create simpler enum types for selling type and product quality
CREATE TYPE selling_type AS ENUM('list_on_site', 'sell_to_us');

CREATE TYPE product_quality AS ENUM(
    'new_with_tag',
    'like_new',
    'good',
    'used',
    'digital'
);

-- 2. Create the user_products table using the simplified enum types
CREATE TABLE public.selling_products (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4 (),
    seller_id UUID NOT NULL, -- ID of the seller, referenced from customers table
    name TEXT NOT NULL,
    original_mrp NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    weight NUMERIC(10, 2),
    description TEXT,
    selling_type selling_type NOT NULL,
    quality product_quality NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone ('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone ('utc', now()),
    CONSTRAINT user_products_pkey PRIMARY KEY (id)
);

-- 3. Add a foreign key constraint linking seller_id to customers table
ALTER TABLE public.selling_products
ADD CONSTRAINT selling_products_seller_fkey FOREIGN KEY (seller_id) REFERENCES public.customers (id) ON DELETE CASCADE;