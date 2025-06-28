create table "public"."cart_items" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "product_id" uuid not null,
    "quantity" integer not null default 1,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."categories" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "parent_id" uuid,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."customer_addresses" (
    "id" uuid not null default uuid_generate_v4(),
    "full_name" text not null,
    "company_name" text,
    "street_address1" text not null,
    "street_address2" text,
    "city" text,
    "state_province" text not null,
    "postal_code" text not null,
    "country" text not null,
    "phone" text not null,
    "delivery_instructions" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."customers" (
    "id" uuid not null,
    "first_name" text,
    "last_name" text,
    "email" text not null,
    "phone" text,
    "date_of_birth" date,
    "customer_status" text default 'active'::text,
    "marketing_consent" boolean default false,
    "notes" text,
    "billing_address" uuid,
    "shipping_address" uuid,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."discounts" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "discount_type" text not null,
    "discount_value" numeric(10,2) not null,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."order_items" (
    "id" uuid not null default uuid_generate_v4(),
    "order_id" uuid not null,
    "product_id" uuid not null,
    "quantity" integer not null,
    "unit_price" numeric(10,2) not null,
    "total_price" numeric(10,2) not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."orders" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "status" text not null default 'pending'::text,
    "total_amount" numeric(10,2) not null,
    "payment_intent_id" text,
    "tracking_number" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "shipping_address" uuid
);


create table "public"."product_tags" (
    "product_id" uuid not null,
    "tags_id" uuid not null,
    "applied_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."products" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "price" real not null,
    "currency" text default 'INR'::text,
    "stock_quantity" integer not null default 0,
    "category_id" uuid,
    "images" text[] null default '{}'::text [] ,
    "specifications" jsonb,
    "is_digital" boolean default false,
    "is_active" boolean default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "discount_id" uuid
);


create table "public"."tags" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX cart_items_pkey ON public.cart_items USING btree (id);

CREATE UNIQUE INDEX cart_items_user_id_product_id_key ON public.cart_items USING btree (user_id, product_id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX customer_addresses_pkey ON public.customer_addresses USING btree (id);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX discounts_pkey ON public.discounts USING btree (id);

CREATE INDEX idx_cart_items_user ON public.cart_items USING btree (user_id);

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);

CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);

CREATE INDEX idx_products_category ON public.products USING btree (category_id);

CREATE INDEX idx_products_discount_unique ON public.products USING btree (discount_id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX product_facets_pkey ON public.product_tags USING btree (product_id, tags_id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."cart_items" add constraint "cart_items_pkey" PRIMARY KEY using index "cart_items_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."customer_addresses" add constraint "customer_addresses_pkey" PRIMARY KEY using index "customer_addresses_pkey";

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."discounts" add constraint "discounts_pkey" PRIMARY KEY using index "discounts_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."product_tags" add constraint "product_facets_pkey" PRIMARY KEY using index "product_facets_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."cart_items" add constraint "cart_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."cart_items" validate constraint "cart_items_product_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES customers(id) ON UPDATE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_user_id_fkey1";

alter table "public"."cart_items" add constraint "cart_items_user_id_product_id_key" UNIQUE using index "cart_items_user_id_product_id_key";

alter table "public"."categories" add constraint "categories_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES categories(id) not valid;

alter table "public"."categories" validate constraint "categories_parent_id_fkey";

alter table "public"."customers" add constraint "customers_billing_address_fkey" FOREIGN KEY (billing_address) REFERENCES customer_addresses(id) not valid;

alter table "public"."customers" validate constraint "customers_billing_address_fkey";

alter table "public"."customers" add constraint "customers_customer_status_check" CHECK ((customer_status = ANY (ARRAY['active'::text, 'inactive'::text, 'blocked'::text]))) not valid;

alter table "public"."customers" validate constraint "customers_customer_status_check";

alter table "public"."customers" add constraint "customers_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "customers_id_fkey";

alter table "public"."customers" add constraint "customers_shipping_address_fkey" FOREIGN KEY (shipping_address) REFERENCES customer_addresses(id) not valid;

alter table "public"."customers" validate constraint "customers_shipping_address_fkey";

alter table "public"."discounts" add constraint "discounts_discount_type_check" CHECK ((discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text]))) not valid;

alter table "public"."discounts" validate constraint "discounts_discount_type_check";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."orders" add constraint "orders_shipping_address_fkey" FOREIGN KEY (shipping_address) REFERENCES customer_addresses(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_shipping_address_fkey";

alter table "public"."orders" add constraint "orders_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES customers(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey1";

alter table "public"."product_tags" add constraint "product_facets_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."product_tags" validate constraint "product_facets_product_id_fkey";

alter table "public"."product_tags" add constraint "product_facets_tags_id_fkey" FOREIGN KEY (tags_id) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."product_tags" validate constraint "product_facets_tags_id_fkey";

alter table "public"."products" add constraint "fk_product_discount" FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "fk_product_discount";

alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."products" validate constraint "products_category_id_fkey";

alter table "public"."tags" add constraint "tags_name_key" UNIQUE using index "tags_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_image_file(filename text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  bucket text;
  object_name text;
BEGIN
  -- Expecting the URL format:
  -- http://<host>/storage/v1/object/public/<bucket>/<object_name>
  --
  -- Extract the bucket from the URL.
  bucket := substring(filename from '^https?://[^/]+/storage/v1/object/public/([^/]+)/');
  
  -- Extract the object name (the rest of the URL after the bucket).
  object_name := substring(filename from '^https?://[^/]+/storage/v1/object/public/[^/]+/(.*)$');
  
  IF bucket IS NULL OR object_name IS NULL THEN
    RAISE NOTICE 'Failed to parse bucket or object name from filename: %', filename;
    RETURN;
  END IF;
  
  RAISE NOTICE 'Deleting storage object: bucket_id = %, name = %', bucket, object_name;
  
  DELETE FROM storage.objects
  WHERE bucket_id = bucket
    AND name = object_name;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error deleting image: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_removed_images()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  image text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    -- For DELETE, remove every image from OLD.images.
    FOREACH image IN ARRAY OLD.images
    LOOP
      PERFORM delete_image_file(image);
    END LOOP;
  
  ELSIF TG_OP = 'UPDATE' THEN
    -- For UPDATE, if NEW.images is NULL or the image is not in NEW.images, delete it.
    FOREACH image IN ARRAY OLD.images
    LOOP
      IF NEW.images IS NULL OR NOT (image = ANY(NEW.images)) THEN
        PERFORM delete_image_file(image);
      END IF;
    END LOOP;
  END IF;
  
  RETURN NULL;  -- AFTER triggers return NULL.
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_stock_quantity()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    update products
    set stock_quantity = stock_quantity - NEW.quantity
    where id = NEW.product_id;
    return NEW;
end;
$function$
;

grant delete on table "public"."cart_items" to "anon";

grant insert on table "public"."cart_items" to "anon";

grant references on table "public"."cart_items" to "anon";

grant select on table "public"."cart_items" to "anon";

grant trigger on table "public"."cart_items" to "anon";

grant truncate on table "public"."cart_items" to "anon";

grant update on table "public"."cart_items" to "anon";

grant delete on table "public"."cart_items" to "authenticated";

grant insert on table "public"."cart_items" to "authenticated";

grant references on table "public"."cart_items" to "authenticated";

grant select on table "public"."cart_items" to "authenticated";

grant trigger on table "public"."cart_items" to "authenticated";

grant truncate on table "public"."cart_items" to "authenticated";

grant update on table "public"."cart_items" to "authenticated";

grant delete on table "public"."cart_items" to "service_role";

grant insert on table "public"."cart_items" to "service_role";

grant references on table "public"."cart_items" to "service_role";

grant select on table "public"."cart_items" to "service_role";

grant trigger on table "public"."cart_items" to "service_role";

grant truncate on table "public"."cart_items" to "service_role";

grant update on table "public"."cart_items" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."customer_addresses" to "anon";

grant insert on table "public"."customer_addresses" to "anon";

grant references on table "public"."customer_addresses" to "anon";

grant select on table "public"."customer_addresses" to "anon";

grant trigger on table "public"."customer_addresses" to "anon";

grant truncate on table "public"."customer_addresses" to "anon";

grant update on table "public"."customer_addresses" to "anon";

grant delete on table "public"."customer_addresses" to "authenticated";

grant insert on table "public"."customer_addresses" to "authenticated";

grant references on table "public"."customer_addresses" to "authenticated";

grant select on table "public"."customer_addresses" to "authenticated";

grant trigger on table "public"."customer_addresses" to "authenticated";

grant truncate on table "public"."customer_addresses" to "authenticated";

grant update on table "public"."customer_addresses" to "authenticated";

grant delete on table "public"."customer_addresses" to "service_role";

grant insert on table "public"."customer_addresses" to "service_role";

grant references on table "public"."customer_addresses" to "service_role";

grant select on table "public"."customer_addresses" to "service_role";

grant trigger on table "public"."customer_addresses" to "service_role";

grant truncate on table "public"."customer_addresses" to "service_role";

grant update on table "public"."customer_addresses" to "service_role";

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

grant delete on table "public"."discounts" to "anon";

grant insert on table "public"."discounts" to "anon";

grant references on table "public"."discounts" to "anon";

grant select on table "public"."discounts" to "anon";

grant trigger on table "public"."discounts" to "anon";

grant truncate on table "public"."discounts" to "anon";

grant update on table "public"."discounts" to "anon";

grant delete on table "public"."discounts" to "authenticated";

grant insert on table "public"."discounts" to "authenticated";

grant references on table "public"."discounts" to "authenticated";

grant select on table "public"."discounts" to "authenticated";

grant trigger on table "public"."discounts" to "authenticated";

grant truncate on table "public"."discounts" to "authenticated";

grant update on table "public"."discounts" to "authenticated";

grant delete on table "public"."discounts" to "service_role";

grant insert on table "public"."discounts" to "service_role";

grant references on table "public"."discounts" to "service_role";

grant select on table "public"."discounts" to "service_role";

grant trigger on table "public"."discounts" to "service_role";

grant truncate on table "public"."discounts" to "service_role";

grant update on table "public"."discounts" to "service_role";

grant delete on table "public"."order_items" to "anon";

grant insert on table "public"."order_items" to "anon";

grant references on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "anon";

grant trigger on table "public"."order_items" to "anon";

grant truncate on table "public"."order_items" to "anon";

grant update on table "public"."order_items" to "anon";

grant delete on table "public"."order_items" to "authenticated";

grant insert on table "public"."order_items" to "authenticated";

grant references on table "public"."order_items" to "authenticated";

grant select on table "public"."order_items" to "authenticated";

grant trigger on table "public"."order_items" to "authenticated";

grant truncate on table "public"."order_items" to "authenticated";

grant update on table "public"."order_items" to "authenticated";

grant delete on table "public"."order_items" to "service_role";

grant insert on table "public"."order_items" to "service_role";

grant references on table "public"."order_items" to "service_role";

grant select on table "public"."order_items" to "service_role";

grant trigger on table "public"."order_items" to "service_role";

grant truncate on table "public"."order_items" to "service_role";

grant update on table "public"."order_items" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."product_tags" to "anon";

grant insert on table "public"."product_tags" to "anon";

grant references on table "public"."product_tags" to "anon";

grant select on table "public"."product_tags" to "anon";

grant trigger on table "public"."product_tags" to "anon";

grant truncate on table "public"."product_tags" to "anon";

grant update on table "public"."product_tags" to "anon";

grant delete on table "public"."product_tags" to "authenticated";

grant insert on table "public"."product_tags" to "authenticated";

grant references on table "public"."product_tags" to "authenticated";

grant select on table "public"."product_tags" to "authenticated";

grant trigger on table "public"."product_tags" to "authenticated";

grant truncate on table "public"."product_tags" to "authenticated";

grant update on table "public"."product_tags" to "authenticated";

grant delete on table "public"."product_tags" to "service_role";

grant insert on table "public"."product_tags" to "service_role";

grant references on table "public"."product_tags" to "service_role";

grant select on table "public"."product_tags" to "service_role";

grant trigger on table "public"."product_tags" to "service_role";

grant truncate on table "public"."product_tags" to "service_role";

grant update on table "public"."product_tags" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

CREATE TRIGGER update_stock_after_order AFTER INSERT ON public.order_items FOR EACH ROW EXECUTE FUNCTION update_stock_quantity();

CREATE TRIGGER trigger_handle_removed_images AFTER DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION handle_removed_images();


