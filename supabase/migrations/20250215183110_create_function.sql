create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.customers (id, email, created_at, updated_at)
  values (NEW.id, NEW.email, timezone('utc', now()), timezone('utc', now()));
  return NEW;
end;
$$ language plpgsql

security definer;


create trigger trigger_create_customer
after insert on auth.users for each row
execute function public.handle_new_auth_user ();