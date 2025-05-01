CREATE OR REPLACE FUNCTION public.apply_coupon_discount()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  coupon_rec RECORD;
  order_rec RECORD;
  discount_amount NUMERIC(10,2);
BEGIN
  -- Retrieve the coupon information based on the inserted coupon_redemptions row
  SELECT *
  INTO coupon_rec
  FROM public.coupons
  WHERE id = NEW.coupon_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Coupon with id % not found', NEW.coupon_id;
  END IF;
  
  -- Retrieve the order details using the order_id from the coupon_redemptions row
  SELECT *
  INTO order_rec
  FROM public.orders
  WHERE id = NEW.order_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order with id % not found', NEW.order_id;
  END IF;
  
  -- Calculate the discount amount
  IF coupon_rec.discount_type = 'percentage' THEN
    -- For percentage coupons, discount is (discount_value)% of the current total_amount
    discount_amount := order_rec.total_amount * coupon_rec.discount_value / 100;
  ELSIF coupon_rec.discount_type = 'fixed' THEN
    -- For fixed coupons, discount is simply the discount_value
    discount_amount := coupon_rec.discount_value;
  ELSE
    discount_amount := 0;
  END IF;
  
  -- Update the order's total_amount by deducting the discount amount
  -- We use GREATEST() to ensure that total_amount does not drop below zero
  UPDATE public.orders
  SET total_amount = GREATEST(total_amount - discount_amount, 0)
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$;

-- Create the trigger to call this function after a row is inserted into coupon_redemptions
CREATE TRIGGER trigger_apply_coupon_discount
AFTER INSERT ON public.coupon_redemptions FOR EACH ROW
EXECUTE PROCEDURE public.apply_coupon_discount ();