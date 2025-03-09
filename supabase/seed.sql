-- Seed data for categories, discounts, tags, products, product_tags, and coupons

WITH
    -- Categories
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
                'Smartphones and mobile phones',
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
                'High-performance laptops for work and play',
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
                'Fashionable clothing items'
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
-- Discounts (5 unique discounts so each product gets a unique discount)
disc1 AS (
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
            '15% off summer sale',
            'percentage',
            15.00,
            '2025-06-01 00:00:00+00',
            '2025-06-30 23:59:59+00'
        )
    RETURNING
        id
),
disc2 AS (
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
disc3 AS (
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
            '25% off Black Friday sale',
            'percentage',
            25.00,
            '2025-11-20 00:00:00+00',
            '2025-11-27 23:59:59+00'
        )
    RETURNING
        id
),
disc4 AS (
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
disc5 AS (
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
            '10% off Spring Special',
            'percentage',
            10.00,
            '2025-03-01 00:00:00+00',
            '2025-03-31 23:59:59+00'
        )
    RETURNING
        id
),
-- Tags (5 tags)
tag1 AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Featured',
            'Featured products'
        )
    RETURNING
        id
),
tag2 AS (
    INSERT INTO
        public.tags (name, description)
    VALUES ('Sale', 'Products on sale')
    RETURNING
        id
),
tag3 AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Bestseller',
            'Top selling products'
        )
    RETURNING
        id
),
tag4 AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'Limited Edition',
            'Limited edition products'
        )
    RETURNING
        id
),
tag5 AS (
    INSERT INTO
        public.tags (name, description)
    VALUES (
            'New Arrival',
            'Newly arrived products'
        )
    RETURNING
        id
),
-- Products (5 products, each referencing a unique discount)
prod1 AS (
    INSERT INTO
        public.products (
            name,
            description,
            price,
            stock_quantity,
            category_id,
            discount_id,
            is_digital
        )
    VALUES (
            'Smartphone X',
            'Latest smartphone with cutting-edge features',
            699.99,
            50,
            (
                SELECT id
                FROM mob
            ),
            (
                SELECT id
                FROM disc1
            ),
            false
        )
    RETURNING
        id
),
prod2 AS (
    INSERT INTO
        public.products (
            name,
            description,
            price,
            stock_quantity,
            category_id,
            discount_id,
            is_digital
        )
    VALUES (
            'Laptop Pro',
            'High-performance laptop designed for professionals',
            1299.99,
            30,
            (
                SELECT id
                FROM lap
            ),
            (
                SELECT id
                FROM disc2
            ),
            false
        )
    RETURNING
        id
),
prod3 AS (
    INSERT INTO
        public.products (
            name,
            description,
            price,
            stock_quantity,
            category_id,
            discount_id,
            is_digital
        )
    VALUES (
            'Designer Jeans',
            'Stylish and comfortable designer jeans',
            89.99,
            100,
            (
                SELECT id
                FROM cloth
            ),
            (
                SELECT id
                FROM disc3
            ),
            false
        )
    RETURNING
        id
),
prod4 AS (
    INSERT INTO
        public.products (
            name,
            description,
            price,
            stock_quantity,
            category_id,
            discount_id,
            is_digital
        )
    VALUES (
            'Wireless Headphones',
            'Noise-cancelling wireless headphones with high-fidelity sound',
            199.99,
            75,
            (
                SELECT id
                FROM elec
            ),
            (
                SELECT id
                FROM disc4
            ),
            false
        )
    RETURNING
        id
),
prod5 AS (
    INSERT INTO
        public.products (
            name,
            description,
            price,
            stock_quantity,
            category_id,
            discount_id,
            is_digital
        )
    VALUES (
            'Luxury Watch',
            'Elegant luxury watch with premium craftsmanship',
            499.99,
            25,
            (
                SELECT id
                FROM acc
            ),
            (
                SELECT id
                FROM disc5
            ),
            false
        )
    RETURNING
        id
)
-- Insert product-to-tag relationships in the join table
INSERT INTO
    public.product_tags (product_id, tags_id)
VALUES (
        (
            SELECT id
            FROM prod1
        ),
        (
            SELECT id
            FROM tag1
        )
    ),
    (
        (
            SELECT id
            FROM prod1
        ),
        (
            SELECT id
            FROM tag5
        )
    ),
    (
        (
            SELECT id
            FROM prod2
        ),
        (
            SELECT id
            FROM tag3
        )
    ),
    (
        (
            SELECT id
            FROM prod2
        ),
        (
            SELECT id
            FROM tag2
        )
    ),
    (
        (
            SELECT id
            FROM prod3
        ),
        (
            SELECT id
            FROM tag2
        )
    ),
    (
        (
            SELECT id
            FROM prod3
        ),
        (
            SELECT id
            FROM tag3
        )
    ),
    (
        (
            SELECT id
            FROM prod4
        ),
        (
            SELECT id
            FROM tag1
        )
    ),
    (
        (
            SELECT id
            FROM prod4
        ),
        (
            SELECT id
            FROM tag4
        )
    ),
    (
        (
            SELECT id
            FROM prod5
        ),
        (
            SELECT id
            FROM tag5
        )
    ),
    (
        (
            SELECT id
            FROM prod5
        ),
        (
            SELECT id
            FROM tag4
        )
    ),
    (
        (
            SELECT id
            FROM prod5
        ),
        (
            SELECT id
            FROM tag3
        )
    );

-- Insert 5 coupon records
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

INSERT INTO
    public.shipping (
        name,
        cost,
        estimated_delivery_days,
        is_active
    )
VALUES ('Standard', 0, 5, true),
    ('Express', 199, 2, false);