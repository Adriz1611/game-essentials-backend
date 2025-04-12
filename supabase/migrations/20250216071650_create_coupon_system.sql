create table public.coupons (
    id uuid not null default extensions.uuid_generate_v4 (),
    code text not null unique, -- the coupon code (e.g., "SAVE20")
    discount_type text not null check (
        discount_type in ('percentage', 'fixed')
    ),
    discount_value numeric(10, 2) not null, -- e.g., 20.00 or 5.00
    start_date timestamp with time zone not null, -- when coupon becomes valid
    end_date timestamp with time zone not null, -- expiration date
    user_usage_limit integer null, -- how many times a single user can use this coupon (null = unlimited)
    total_usage_limit integer null, -- total times this coupon can be used (null = unlimited)
    usage_count integer not null default 0, -- how many times coupon has been used
    is_active boolean not null default true, -- toggle coupon on/off
    created_at timestamp with time zone not null default timezone ('utc', now()),
    updated_at timestamp with time zone not null default timezone ('utc', now()),
    constraint coupons_pkey primary key (id)
) tablespace pg_default;

create table public.coupon_redemptions (
    id uuid not null default extensions.uuid_generate_v4 (),
    coupon_id uuid not null,
    customer_id uuid not null, -- reference the customer who redeemed the coupon
    order_id uuid not null, -- reference the order where the coupon was applied
    redeemed_at timestamp with time zone not null default timezone ('utc', now()),
    constraint coupon_redemptions_pkey primary key (id),
    constraint coupon_redemptions_coupon_fkey foreign key (coupon_id) references public.coupons (id) on delete cascade,
    constraint coupon_redemptions_order_fkey foreign key (order_id) references public.orders (id) on delete cascade,
    constraint coupon_redemptions_customer_fkey foreign key (customer_id) references public.customers (id) on delete cascade
) tablespace pg_default;


create or replace function public.check_coupon_limits()
returns trigger as $$
declare
  per_limit int;
  total_limit int;
  user_count int;
  coupon_total int;
begin
  -- Retrieve limits for the coupon
  select user_usage_limit, total_usage_limit
    into per_limit, total_limit
  from public.coupons
  where id = NEW.coupon_id;
  
  -- Check per-user limit, if defined
  if per_limit is not null then
    select count(*) into user_count
    from public.coupon_redemptions
    where coupon_id = NEW.coupon_id
      and customer_id = NEW.customer_id;
    
    if user_count >= per_limit then
      raise exception 'Per-user coupon redemption limit reached for coupon % by customer %', NEW.coupon_id, NEW.customer_id;
    end if;
  end if;
  
  -- Check total usage limit, if defined
  if total_limit is not null then
    select count(*) into coupon_total
    from public.coupon_redemptions
    where coupon_id = NEW.coupon_id;
    
    if coupon_total >= total_limit then
      raise exception 'Total coupon usage limit reached for coupon %', NEW.coupon_id;
    end if;
  end if;
  
  return NEW;
end;
$$ language plpgsql;


create trigger trg_coupon_limits before insert on public.coupon_redemptions for each row
execute function public.check_coupon_limits ();