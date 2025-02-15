-- Seed data for categories
INSERT INTO
    public.categories (
        id,
        name,
        description,
        parent_id,
        created_at
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Electronics',
        'Electronic gadgets and devices',
        NULL,
        NOW()
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Smartphones',
        'Smartphones and mobile devices',
        '11111111-1111-1111-1111-111111111111',
        NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Clothing',
        'Apparel and accessories',
        NULL,
        NOW()
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Books',
        'Books and stationery',
        NULL,
        NOW()
    );

-- Seed data for discounts
INSERT INTO
    public.discounts (
        id,
        name,
        description,
        discount_type,
        discount_value,
        start_date,
        end_date,
        is_active,
        created_at,
        updated_at
    )
VALUES (
        '55555555-5555-5555-5555-555555555555',
        'Summer Sale',
        '10% off summer sale',
        'percentage',
        10.00,
        '2025-06-01 00:00:00+00',
        '2025-06-30 23:59:59+00',
        true,
        NOW(),
        NOW()
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Clearance',
        'Flat discount for clearance items',
        'fixed',
        100.00,
        '2025-03-01 00:00:00+00',
        '2025-03-31 23:59:59+00',
        true,
        NOW(),
        NOW()
    );

-- Seed data for products
INSERT INTO
    public.products (
        id,
        name,
        description,
        price,
        currency,
        stock_quantity,
        category_id,
        images,
        specifications,
        is_digital,
        is_active,
        discount_id
    )
VALUES (
        '77777777-7777-7777-7777-777777777777',
        'Smartphone X',
        'Latest smartphone with advanced features',
        699.99,
        'USD',
        50,
        '22222222-2222-2222-2222-222222222222',
        ARRAY[
            'smartphone1.jpg',
            'smartphone2.jpg'
        ],
        '{"color": "black", "memory": "128GB"}',
        false,
        true,
        '55555555-5555-5555-5555-555555555555'
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Laptop Pro',
        'High-performance laptop for professionals',
        1499.99,
        'USD',
        30,
        '11111111-1111-1111-1111-111111111111',
        ARRAY['laptop1.jpg', 'laptop2.jpg'],
        '{"processor": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}',
        false,
        true,
        '66666666-6666-6666-6666-666666666666'
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'Online Course: Mastering SQL',
        'Learn SQL with hands-on exercises',
        49.99,
        'USD',
        0,
        NULL,
        ARRAY['course.jpg'],
        '{"duration": "10 hours", "level": "Beginner"}',
        true,
        true,
        NULL
    );

-- Seed data for tags
INSERT INTO
    public.tags (
        id,
        name,
        description,
        is_active,
        created_at,
        updated_at
    )
VALUES (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'New Arrival',
        'Newly arrived products',
        true,
        NOW(),
        NOW()
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Best Seller',
        'Top selling products',
        true,
        NOW(),
        NOW()
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Discounted',
        'Products currently discounted',
        true,
        NOW(),
        NOW()
    );

-- Seed data for product_tags (linking products with tags)
INSERT INTO
    public.product_tags (
        product_id,
        tags_id,
        applied_at
    )
VALUES
    -- Smartphone X gets "New Arrival" and "Discounted" tags
    (
        '77777777-7777-7777-7777-777777777777',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        NOW()
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        NOW()
    ),
    -- Laptop Pro gets the "Best Seller" tag
    (
        '88888888-8888-8888-8888-888888888888',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        NOW()
    ),
    -- Online Course gets the "New Arrival" tag
    (
        '99999999-9999-9999-9999-999999999999',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        NOW()
    );