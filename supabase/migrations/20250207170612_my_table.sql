create table "public"."product_tags" (
    "product_id" uuid not null,
    "tags_id" uuid not null,
    "applied_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."tags" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."orders" alter column "billing_address" drop not null;

alter table "public"."orders" alter column "billing_address" set data type uuid using "billing_address"::uuid;

alter table "public"."orders" alter column "shipping_address" drop not null;

alter table "public"."orders" alter column "shipping_address" set data type uuid using "shipping_address"::uuid;

alter table "public"."products" alter column "price" set data type real using "price"::real;

CREATE UNIQUE INDEX product_facets_pkey ON public.product_tags USING btree (product_id, tags_id);

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."product_tags" add constraint "product_facets_pkey" PRIMARY KEY using index "product_facets_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."orders" add constraint "orders_billing_address_fkey" FOREIGN KEY (billing_address) REFERENCES customer_addresses(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_billing_address_fkey";

alter table "public"."orders" add constraint "orders_shipping_address_fkey" FOREIGN KEY (shipping_address) REFERENCES customer_addresses(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_shipping_address_fkey";

alter table "public"."product_tags" add constraint "product_facets_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."product_tags" validate constraint "product_facets_product_id_fkey";

alter table "public"."product_tags" add constraint "product_facets_tags_id_fkey" FOREIGN KEY (tags_id) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."product_tags" validate constraint "product_facets_tags_id_fkey";

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

CREATE TRIGGER trigger_handle_removed_images AFTER DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION handle_removed_images();


