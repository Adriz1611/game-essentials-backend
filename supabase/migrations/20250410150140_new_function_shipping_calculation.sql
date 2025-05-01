CREATE OR REPLACE FUNCTION public.update_order_shipping_total()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  new_shipping_cost numeric(10,2);
  old_shipping_cost numeric(10,2);
  base_total numeric(10,2);
BEGIN
  -- Only act if the shipping_id has changed
  IF NEW.shipping_id IS DISTINCT FROM OLD.shipping_id THEN
  
    -- Fetch the new shipping cost from the shipping table
    SELECT cost INTO new_shipping_cost 
      FROM public.shipping 
     WHERE id = NEW.shipping_id;
  
    -- Determine the old shipping cost (if any)
    IF OLD.shipping_id IS NOT NULL THEN
      SELECT cost INTO old_shipping_cost 
        FROM public.shipping 
       WHERE id = OLD.shipping_id;
    ELSE
      old_shipping_cost := 0;
    END IF;
    
    -- Assume that the order's total_amount currently is the product subtotal plus any old shipping cost.
    -- Remove the old shipping cost to derive the base subtotal.
    base_total := OLD.total_amount - old_shipping_cost;
    
    -- Then update the total_amount as base subtotal plus the new shipping cost.
    NEW.total_amount := base_total + new_shipping_cost;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create a trigger to call the function BEFORE UPDATE of shipping_id on orders
CREATE TRIGGER update_shipping_total_trigger BEFORE
UPDATE OF shipping_id ON public.orders FOR EACH ROW
EXECUTE PROCEDURE public.update_order_shipping_total ();