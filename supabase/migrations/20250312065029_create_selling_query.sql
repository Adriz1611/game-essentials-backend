CREATE TABLE public.selling_product_queries (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4 (),
    selling_product_id UUID NOT NULL, -- Reference to the selling_products record
    initial_price NUMERIC(10, 2) NOT NULL, -- Seller's original asking price
    negotiation_price NUMERIC(10, 2), -- Counteroffer price (if any)
    offered_price NUMERIC(10, 2), -- Price offered by the platform or admin
    status negotiation_status NOT NULL DEFAULT 'pending', -- Current negotiation status
    remarks TEXT, -- Optional comments or notes on negotiation
    updated_by UUID, -- Optional: user id of the last actor (seller/admin)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone ('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone ('utc', now()),
    CONSTRAINT selling_product_queries_pkey PRIMARY KEY (id),
    CONSTRAINT selling_product_queries_fk FOREIGN KEY (selling_product_id) REFERENCES public.selling_products (id) ON DELETE CASCADE
);