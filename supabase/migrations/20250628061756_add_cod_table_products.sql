-- Add cod_enabled column to products table
ALTER TABLE public.products 
ADD COLUMN "cod_enabled" boolean NOT NULL DEFAULT true;