alter table public.customer_addresses
add column customer_id uuid references public.customers (id) on delete cascade;