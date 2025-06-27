-- Create sellers table
CREATE TABLE public.sellers (
  id uuid NOT NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  seller_status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc', now())
);

-- Primary key and foreign key to auth.users
ALTER TABLE public.sellers
  ADD CONSTRAINT sellers_pkey PRIMARY KEY (id),
  ADD CONSTRAINT sellers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
