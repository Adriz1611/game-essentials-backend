create table public.shipping (
    id uuid not null default gen_random_uuid (),
    name text not null,
    cost bigint not null,
    estimated_delivery_days text null,
    is_active boolean not null,
    created_at timestamp with time zone not null default now(),
    constraint shipping_pkey primary key (id)
) tablespace pg_default;

ALTER TABLE public.orders ADD COLUMN shipping_id UUID;

ALTER TABLE public.orders
ADD CONSTRAINT orders_shipping_fkey FOREIGN KEY (shipping_id) REFERENCES public.shipping (id);