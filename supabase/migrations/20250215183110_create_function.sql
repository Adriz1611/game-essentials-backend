CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  first_name text := NEW.raw_user_meta_data ->> 'first_name';
  last_name  text := NEW.raw_user_meta_data ->> 'last_name';
  user_email text := NEW.email;
BEGIN
  -- If this signup came via an “invited” flow (we expect a flag in raw_user_meta_data)
  IF (NEW.raw_user_meta_data ->> 'role') = 'seller' THEN
    INSERT INTO public.sellers (id, email, first_name, last_name)
    VALUES (NEW.id, user_email, first_name, last_name);
  ELSE
    INSERT INTO public.customers (id, email, first_name, last_name)
    VALUES (NEW.id, user_email, first_name, last_name);
  END IF;

  RETURN NEW;
END;
$$;

-- 3) Re-attach trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
