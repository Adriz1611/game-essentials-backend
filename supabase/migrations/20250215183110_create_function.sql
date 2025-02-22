create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.customers (id, email, first_name, last_name)
  values (new.id, NEW.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  return new;
end;
$$;


create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();