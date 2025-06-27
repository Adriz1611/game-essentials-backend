-- product_subscriptions table
CREATE TABLE public.product_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.customers (id) ON DELETE CASCADE,
    UNIQUE (product_id, user_id)
);

-- notify_stock_change trigger function
CREATE OR REPLACE FUNCTION public.notify_stock_change()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  threshold INT := 10;
BEGIN
  IF (NEW.stock_quantity <= threshold AND OLD.stock_quantity  > threshold)
   OR (NEW.stock_quantity  > threshold AND OLD.stock_quantity <= threshold)
  THEN
  END IF;
  RETURN NEW;
END;
$$;

-- attach trigger
CREATE TRIGGER trg_notify_stock_change
AFTER UPDATE OF stock_quantity
ON public.products
FOR EACH ROW
EXECUTE PROCEDURE public.notify_stock_change();