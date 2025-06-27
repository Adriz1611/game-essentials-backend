/* ======================================================================
FULL SEED FILE — 30 PRODUCTS
PostgreSQL 16-compatible
----------------------------------------------------------------------
Tables touched:
categories · discounts · tags · products · product_tags
coupons · shipping
Run in a fresh database (or after TRUNCATE … CASCADE) for a clean seed.
====================================================================== */

BEGIN;

-- Seed an admin user
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'authenticated',
  'admin',
  'admin@mail.com',
  crypt('1234', gen_salt('bf', 8)),
  now(),
  now(),
  '{"role":"seller"}'
);

/* ─────────────────────────────
1. CATEGORIES (5 rows, 2 levels)
───────────────────────────── */
WITH
    elec AS (
        INSERT INTO
            public.categories (name, description)
        VALUES (
                'Electronics',
                'Electronic devices and gadgets'
            )
        RETURNING
            id
    ),
    mob AS (
        INSERT INTO
            public.categories (name, description, parent_id)
        VALUES (
                'Mobile Phones',
                'Smartphones and feature phones',
                (
                    SELECT id
                    FROM elec
                )
            )
        RETURNING
            id
    ),
    lap AS (
        INSERT INTO
            public.categories (name, description, parent_id)
        VALUES (
                'Laptops',
                'Portable computers for work and play',
                (
                    SELECT id
                    FROM elec
                )
            )
        RETURNING
            id
    ),
    cloth AS (
        INSERT INTO
            public.categories (name, description)
        VALUES (
                'Clothing',
                'Apparel and fashion items'
            )
        RETURNING
            id
    ),
    acc AS (
        INSERT INTO
            public.categories (name, description, parent_id)
        VALUES (
                'Accessories',
                'Fashion accessories and more',
                (
                    SELECT id
                    FROM cloth
                )
            )
        RETURNING
            id
    ),
/* ─────────────────────────────
2. DISCOUNTS (5 rows)
───────────────────────────── */
disc_summer AS (
    INSERT INTO
        public.discounts (
            name,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date
        )
    VALUES (
            'Summer Sale',
            '15 % off summer sale',
            'percentage',
            15.00,
            '2025-06-01 00:00:00+00',
            '2025-06-30 23:59:59+00'
        )
    RETURNING
        id
),
disc_clearance AS (
    INSERT INTO
        public.discounts (
            name,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date
        )
    VALUES (
            'Clearance',
            'Flat $50 off clearance sale',
            'fixed',
            50.00,
            '2025-01-01 00:00:00+00',
            '2025-01-31 23:59:59+00'
        )
    RETURNING
        id
),
disc_black AS (
    INSERT INTO
        public.discounts (
            name,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date
        )
    VALUES (
            'Black Friday',
            '25 % off Black Friday sale',
            'percentage',
            25.00,
            '2025-11-20 00:00:00+00',
            '2025-11-27 23:59:59+00'
        )
    RETURNING
        id
),
disc_newyear AS (
    INSERT INTO
        public.discounts (
            name,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date
        )
    VALUES (
            'New Year',
            'Flat $30 off New Year sale',
            'fixed',
            30.00,
            '2025-12-25 00:00:00+00',
            '2026-01-05 23:59:59+00'
        )
    RETURNING
        id
),
disc_spring AS (
    INSERT INTO
        public.discounts (
            name,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date
        )
    VALUES (
            'Spring Special',
            '10 % off spring special',
            'percentage',
            10.00,
            '2025-03-01 00:00:00+00',
            '2025-03-31 23:59:59+00'
        )
    RETURNING
        id
),
/* ─────────────────────────────
3. TAGS (5 rows)
───────────────────────────── */
tag_feat AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Featured',
            'Highlighted products of the month'
        )
    RETURNING
        id
),
tag_sale AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Sale',
            'Products currently on promotion'
        )
    RETURNING
        id
),
tag_best AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Bestseller',
            'Top-selling products'
        )
    RETURNING
        id
),
tag_lim AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Limited Edition',
            'Limited stock products'
        )
    RETURNING
        id
),
tag_new AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'New Arrival',
            'Recently added products'
        )
    RETURNING
        id
),
/* ─────────────────────────────
4. PRODUCTS (30 rows)
───────────────────────────── */
inserted_products AS (
    INSERT INTO public.products
        (name, description, price, stock_quantity,
         category_id,                      discount_id,         is_digital)
    VALUES
    /* Mobile Phones (6) */
    ('Smartphone Alpha',   'Mid-range smartphone with OLED display',                 549.99,  60, (SELECT id FROM mob),   (SELECT id FROM disc_summer),    FALSE),
    ('Smartphone Beta',    'Compact phone with long-lasting battery',                379.99,  80, (SELECT id FROM mob),   (SELECT id FROM disc_spring),    FALSE),
    ('Smartphone Gamma',   'Flagship camera phone with AI imaging',                  929.99,  35, (SELECT id FROM mob),   (SELECT id FROM disc_black),     FALSE),
    ('Smartphone Delta',   'Budget 5 G phone with great value',                      289.99, 120, (SELECT id FROM mob),   (SELECT id FROM disc_clearance), FALSE),
    ('Smartphone Epsilon', 'Premium foldable phone, ultra-thin design',             1299.99,  25, (SELECT id FROM mob),   (SELECT id FROM disc_newyear),   FALSE),
    ('Smartphone Zeta',    'Rugged smartphone built for outdoor adventures',         649.99,  50, (SELECT id FROM mob),   (SELECT id FROM disc_summer),    FALSE),

/* Laptops (6) */
(
    'Ultrabook Slim 13',
    '13-inch ultraportable with 18-hour battery',
    999.99,
    40,
    (
        SELECT id
        FROM lap
    ),
    (
        SELECT id
        FROM disc_clearance
    ),
    FALSE
),
(
    'Ultrabook Plus 15',
    '15-inch creator laptop with discrete GPU',
    1399.99,
    30,
    (
        SELECT id
        FROM lap
    ),
    (
        SELECT id
        FROM disc_black
    ),
    FALSE
),
(
    'Gaming Notebook X',
    'RTX graphics, per-key RGB, 240 Hz display',
    1799.99,
    20,
    (
        SELECT id
        FROM lap
    ),
    (
        SELECT id
        FROM disc_newyear
    ),
    FALSE
),
(
    'Workstation Pro 17',
    '17-inch workstation for CAD & 3-D rendering',
    2199.99,
    15,
    (
        SELECT id
        FROM lap
    ),
    (
        SELECT id
        FROM disc_spring
    ),
    FALSE
),
(
    'Convertible Flex 14',
    '2-in-1 touchscreen laptop with stylus support',
    849.99,
    55,
    (
        SELECT id
        FROM lap
    ),
    (
        SELECT id
        FROM disc_summer
    ),
    FALSE
),
(
    'Student Laptop Basic',
    'Affordable laptop for everyday tasks',
    499.99,
    100,
    (
        SELECT id
        FROM lap
    ),
    (
        SELECT id
        FROM disc_clearance
    ),
    FALSE
),
/* Electronics (6) */
(
    'Bluetooth Speaker Boom',
    'Portable speaker with deep bass',
    59.99,
    180,
    (
        SELECT id
        FROM elec
    ),
    (
        SELECT id
        FROM disc_spring
    ),
    FALSE
),
(
    'Action Camera 4 K',
    'Water-proof 4 K action cam with stabilization',
    199.99,
    60,
    (
        SELECT id
        FROM elec
    ),
    (
        SELECT id
        FROM disc_black
    ),
    FALSE
),
(
    'Smart Home Hub',
    'Voice-controlled smart-home center',
    89.99,
    150,
    (
        SELECT id
        FROM elec
    ),
    (
        SELECT id
        FROM disc_summer
    ),
    FALSE
),
(
    'Tablet Lite 10"',
    '10-inch FHD tablet, 128 GB storage',
    249.99,
    70,
    (
        SELECT id
        FROM elec
    ),
    (
        SELECT id
        FROM disc_newyear
    ),
    FALSE
),
(
    'Noise-Cancelling Earbuds',
    'ANC earbuds with wireless-charging case',
    129.99,
    140,
    (
        SELECT id
        FROM elec
    ),
    (
        SELECT id
        FROM disc_clearance
    ),
    FALSE
),
(
    'Fitness Tracker Pro',
    'Advanced fitness tracker with ECG sensor',
    99.99,
    160,
    (
        SELECT id
        FROM elec
    ),
    (
        SELECT id
        FROM disc_spring
    ),
    FALSE
),
/* Clothing (6) */
(
    'Cotton Hoodie',
    'Soft fleece hoodie, unisex fit',
    39.99,
    180,
    (
        SELECT id
        FROM cloth
    ),
    (
        SELECT id
        FROM disc_summer
    ),
    FALSE
),
(
    'Running Shorts',
    'Lightweight quick-dry running shorts',
    24.99,
    220,
    (
        SELECT id
        FROM cloth
    ),
    (
        SELECT id
        FROM disc_black
    ),
    FALSE
),
(
    'Formal Shirt',
    'Slim-fit wrinkle-resistant formal shirt',
    34.99,
    140,
    (
        SELECT id
        FROM cloth
    ),
    (
        SELECT id
        FROM disc_newyear
    ),
    FALSE
),
(
    'Denim Jacket',
    'Classic denim jacket with modern cut',
    69.99,
    90,
    (
        SELECT id
        FROM cloth
    ),
    (
        SELECT id
        FROM disc_spring
    ),
    FALSE
),
(
    'Athleisure Leggings',
    'High-stretch leggings with phone pocket',
    29.99,
    200,
    (
        SELECT id
        FROM cloth
    ),
    (
        SELECT id
        FROM disc_clearance
    ),
    FALSE
),
(
    'Polo T-Shirt',
    'Breathable cotton-piqué polo',
    27.99,
    160,
    (
        SELECT id
        FROM cloth
    ),
    (
        SELECT id
        FROM disc_summer
    ),
    FALSE
),
/* Accessories (6) */
    
    ('Leather Wallet',      'Genuine leather bifold wallet',                         49.99, 130, (SELECT id FROM acc),   (SELECT id FROM disc_spring),    FALSE),
    ('Steel Bracelet',      'Stainless-steel link bracelet',                         39.99, 120, (SELECT id FROM acc),   (SELECT id FROM disc_black),     FALSE),
    ('Sports Cap',          'Moisture-wicking adjustable sports cap',                19.99, 200, (SELECT id FROM acc),   (SELECT id FROM disc_summer),    FALSE),
    ('Travel Backpack',     '35 L travel backpack with laptop sleeve',               89.99,  70, (SELECT id FROM acc),   (SELECT id FROM disc_newyear),   FALSE),
    ('Wool Beanie',         'Merino-wool beanie for cold weather',                   21.99, 160, (SELECT id FROM acc),   (SELECT id FROM disc_clearance), FALSE),
    ('Designer Belt',       'Premium leather belt with metal buckle',                59.99, 110, (SELECT id FROM acc),   (SELECT id FROM disc_black),     FALSE)
    RETURNING id, name
)

/* ─────────────────────────────
5. PRODUCT_TAGS (≥ 30 rows)
───────────────────────────── */
INSERT INTO
    public.product_tags (product_id, tags_id)
SELECT p.id, t.id
FROM (
        VALUES (
                'Smartphone Alpha',
                'New Arrival'
            ),
            ('Smartphone Beta', 'Sale'),
            (
                'Smartphone Gamma',
                'Featured'
            ),
            ('Smartphone Delta', 'Sale'),
            (
                'Smartphone Epsilon',
                'Limited Edition'
            ),
            ('Smartphone Zeta', 'Featured'),
            (
                'Ultrabook Slim 13',
                'Featured'
            ),
            (
                'Ultrabook Plus 15',
                'Bestseller'
            ),
            (
                'Gaming Notebook X',
                'Limited Edition'
            ),
            (
                'Workstation Pro 17',
                'Bestseller'
            ),
            (
                'Convertible Flex 14',
                'New Arrival'
            ),
            (
                'Student Laptop Basic',
                'Sale'
            ),
            (
                'Bluetooth Speaker Boom',
                'Sale'
            ),
            (
                'Action Camera 4 K',
                'Featured'
            ),
            (
                'Smart Home Hub',
                'New Arrival'
            ),
            ('Tablet Lite 10"', 'Sale'),
            (
                'Noise-Cancelling Earbuds',
                'Bestseller'
            ),
            (
                'Fitness Tracker Pro',
                'New Arrival'
            ),
            (
                'Cotton Hoodie',
                'New Arrival'
            ),
            ('Running Shorts', 'Sale'),
            ('Formal Shirt', 'Bestseller'),
            ('Denim Jacket', 'Featured'),
            ('Athleisure Leggings', 'Sale'),
            ('Polo T-Shirt', 'New Arrival'),
            (
                'Leather Wallet',
                'Limited Edition'
            ),
            (
                'Steel Bracelet',
                'Bestseller'
            ),
            ('Sports Cap', 'Sale'),
            ('Travel Backpack', 'Featured'),
            ('Wool Beanie', 'Sale'),
            ('Designer Belt', 'Bestseller')
    ) AS m (prod_name, tag_name)
    JOIN inserted_products p ON p.name = m.prod_name
    JOIN public.tags t ON t.name = m.tag_name;

/* ─────────────────────────────
6. COUPONS (5 rows)
───────────────────────────── */
INSERT INTO
    public.coupons (
        code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        user_usage_limit,
        total_usage_limit
    )
VALUES (
        'SUMMER2025',
        'percentage',
        20.00,
        '2025-06-01 00:00:00+00',
        '2025-06-30 23:59:59+00',
        1,
        100
    ),
    (
        'BLACKFRIDAY',
        'percentage',
        30.00,
        '2025-11-20 00:00:00+00',
        '2025-11-27 23:59:59+00',
        2,
        150
    ),
    (
        'NEWYEAR2026',
        'fixed',
        25.00,
        '2025-12-25 00:00:00+00',
        '2026-01-05 23:59:59+00',
        1,
        100
    ),
    (
        'CLEARANCE',
        'fixed',
        50.00,
        '2025-01-01 00:00:00+00',
        '2025-01-31 23:59:59+00',
        1,
        50
    ),
    (
        'EXTRA10',
        'percentage',
        10.00,
        '2025-07-01 00:00:00+00',
        '2025-07-31 23:59:59+00',
        3,
        200
    );

/* ─────────────────────────────
7. SHIPPING OPTIONS (2 rows)
───────────────────────────── */
INSERT INTO
    public.shipping (
        name,
        cost,
        estimated_delivery_days,
        is_active
    )
VALUES ('Standard', 0, 5, TRUE),
    ('Express', 199, 2, FALSE);

/* All done */
COMMIT;