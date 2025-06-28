-- Add CASCADE DELETE to order_items when orders are deleted
-- First drop the existing foreign key constraint
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

-- Add the foreign key constraint with CASCADE DELETE
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
