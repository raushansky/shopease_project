CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    image_url VARCHAR(2048),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_products_category_id (category_id),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cart_user_product (user_id, product_id),
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS wishlist (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_wishlist_user_product (user_id, product_id),
    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_orders_user_created (user_id, created_at),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_order_items_order (order_id),
    KEY idx_order_items_product (product_id),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (name) VALUES
    ('Electronics'),
    ('Clothing'),
    ('Home & Kitchen'),
    ('Sports'),
    ('Toys');

INSERT INTO products (category_id, name, description, price, stock, image_url)
SELECT c.id, seed.name, seed.description, seed.price, seed.stock, seed.image_url
FROM (
    SELECT 'Electronics' AS category_name, 'Wireless Bluetooth Headphones' AS name,
        'Over-ear wireless headphones with clear sound and a comfortable fit.' AS description,
        2499.00 AS price, 30 AS stock,
        'https://placehold.co/600x600?text=Bluetooth+Headphones' AS image_url
    UNION ALL SELECT 'Electronics', 'Smart Fitness Watch',
        'Fitness watch with activity tracking and daily health metrics.',
        3299.00, 24, 'https://placehold.co/600x600?text=Fitness+Watch'
    UNION ALL SELECT 'Electronics', 'Fast USB-C Charger',
        'Compact USB-C fast charger for compatible phones and accessories.',
        899.00, 50, 'https://placehold.co/600x600?text=USB-C+Charger'
    UNION ALL SELECT 'Clothing', 'Classic Cotton T-Shirt',
        'Soft everyday cotton T-shirt with a relaxed fit.',
        699.00, 45, 'https://placehold.co/600x600?text=Cotton+T-Shirt'
    UNION ALL SELECT 'Clothing', 'Everyday Running Sneakers',
        'Lightweight sneakers designed for walking and everyday use.',
        2199.00, 20, 'https://placehold.co/600x600?text=Running+Sneakers'
    UNION ALL SELECT 'Home & Kitchen', 'Insulated Steel Water Bottle',
        'Reusable stainless-steel bottle for hot or cold drinks.',
        549.00, 60, 'https://placehold.co/600x600?text=Steel+Bottle'
    UNION ALL SELECT 'Home & Kitchen', 'Compact Coffee Maker',
        'Easy-to-use coffee maker for your home or office counter.',
        2799.00, 12, 'https://placehold.co/600x600?text=Coffee+Maker'
    UNION ALL SELECT 'Sports', 'Non-Slip Yoga Mat',
        'Cushioned exercise mat with a textured, non-slip surface.',
        999.00, 35, 'https://placehold.co/600x600?text=Yoga+Mat'
    UNION ALL SELECT 'Sports', 'Cricket Bat',
        'Durable cricket bat for casual practice and recreational play.',
        1599.00, 15, 'https://placehold.co/600x600?text=Cricket+Bat'
    UNION ALL SELECT 'Toys', 'Building Blocks Set',
        'Colorful creative building blocks for imaginative play.',
        799.00, 28, 'https://placehold.co/600x600?text=Building+Blocks'
) AS seed
JOIN categories c ON c.name = seed.category_name
LEFT JOIN products existing ON existing.name = seed.name
WHERE existing.id IS NULL;
