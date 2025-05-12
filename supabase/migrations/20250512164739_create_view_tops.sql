CREATE OR REPLACE VIEW top_customers AS
SELECT
  c.id,
  -- full name
  c.first_name || ' ' || c.last_name             AS name,
  c.email,
  -- total spent, formatted with commas (no symbol), aliased to totalSpent
  to_char(
    COALESCE(SUM(o.total_amount), 0),
    'FM999,999,990.00'
  )                                               AS "totalSpent",
  -- order count, aliased to orderCount
  COUNT(o.id)                                     AS "orderCount",
  -- date of most recent order, aliased to lastOrder
  to_char(
    MAX(o.created_at)::date,
    'YYYY-MM-DD'
  )                                               AS "lastOrder"
FROM
  public.customers AS c
  LEFT JOIN public.orders AS o
    ON o.user_id = c.id
GROUP BY
  c.id,
  c.first_name,
  c.last_name,
  c.email;