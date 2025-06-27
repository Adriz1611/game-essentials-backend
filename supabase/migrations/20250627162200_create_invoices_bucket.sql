INSERT INTO
    storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', FALSE);

CREATE POLICY invoices_insert ON storage.objects FOR
INSERT
WITH
    CHECK (bucket_id = 'invoices');

CREATE POLICY invoices_select ON storage.objects FOR
SELECT USING (bucket_id = 'invoices');