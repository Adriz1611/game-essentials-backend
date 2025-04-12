CREATE OR REPLACE FUNCTION public.restore_order_total_on_coupon_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_total NUMERIC(10,2);
  shipping_cost NUMERIC(10,2);
  order_shipping_id uuid;
BEGIN
  -- Recalculate the base_total from all order_items for the affected order.
  SELECT COALESCE(SUM(total_price), 0)
    INTO base_total
  FROM public.order_items
  WHERE order_id = OLD.order_id;

  -- Get the shipping_id for this order.
  SELECT shipping_id
    INTO order_shipping_id
  FROM public.orders
  WHERE id = OLD.order_id;

  -- If a shipping method is set, get its cost (casting cost since it is stored as bigint).
  IF order_shipping_id IS NOT NULL THEN
    SELECT cost::numeric(10,2)
      INTO shipping_cost
    FROM public.shipping
    WHERE id = order_shipping_id;
  ELSE
    shipping_cost := 0;
  END IF;

  -- Update the order total by adding back the shipping cost to the recalculated product subtotal.
  UPDATE public.orders
    SET total_amount = base_total + shipping_cost
  WHERE id = OLD.order_id;

  RETURN OLD;
END;
$$;

-- Create an AFTER DELETE trigger on coupon_redemptions that calls our function.
CREATE TRIGGER trigger_restore_order_total_on_coupon_delete
AFTER DELETE ON public.coupon_redemptions FOR EACH ROW
EXECUTE PROCEDURE public.restore_order_total_on_coupon_delete ();