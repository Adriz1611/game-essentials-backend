ALTER TABLE public.customers
ADD COLUMN tokens NUMERIC(10, 2) NOT NULL DEFAULT 0;

CREATE TABLE public.customer_token_transactions (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4 (),
    customer_id UUID NOT NULL,
    transaction_type TEXT NOT NULL, -- e.g., 'credit' for adding tokens, 'debit' for spending tokens
    amount NUMERIC(10, 2) NOT NULL, -- always a positive value; used to increase or decrease the balance based on the type
    balance_after NUMERIC(10, 2) NOT NULL, -- customer's token balance after this transaction
    description TEXT, -- optional description (e.g., "Order payment", "Referral bonus", etc.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone ('utc', now()),
    CONSTRAINT customer_token_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT customer_token_transactions_customer_fkey FOREIGN KEY (customer_id) REFERENCES public.customers (id) ON DELETE CASCADE
);