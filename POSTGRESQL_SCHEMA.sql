-- ============================================================================
-- GroceryCart Application - PostgreSQL Database Schema
-- Created: February 11, 2026
-- ============================================================================

-- Drop existing database if needed (use with caution)
-- DROP DATABASE IF EXISTS groceryapp;
-- CREATE DATABASE groceryapp;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'delivery_agent', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready_for_delivery', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method_type AS ENUM ('credit_card', 'debit_card', 'wallet', 'upi', 'cash_on_delivery');
CREATE TYPE payment_type AS ENUM ('credit_card', 'debit_card', 'upi', 'digital_wallet');
CREATE TYPE wallet_transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE discount_type AS ENUM ('percentage', 'flat');
CREATE TYPE coupon_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE delivery_status AS ENUM ('pending', 'paid', 'cancelled');

-- ============================================================================
-- TABLE: users
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    profile_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- TABLE: categories
-- ============================================================================
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- ============================================================================
-- TABLE: sub_categories
-- ============================================================================
CREATE TABLE sub_categories (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sub_categories_category_id 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_sub_categories_category_id ON sub_categories(category_id);
CREATE INDEX idx_sub_categories_is_active ON sub_categories(is_active);

-- ============================================================================
-- TABLE: products
-- ============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(50) NOT NULL,
    subcategory_id VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    discount INT DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category_id 
        FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_subcategory_id 
        FOREIGN KEY (subcategory_id) REFERENCES sub_categories(id),
    CONSTRAINT fk_products_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Full-text search index for PostgreSQL
CREATE INDEX idx_products_search ON products USING GIN(
    to_tsvector('english', name) || to_tsvector('english', COALESCE(description, ''))
);

-- ============================================================================
-- TABLE: product_reviews
-- ============================================================================
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT,
    helpful_count INT DEFAULT 0,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_reviews_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_reviews_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);

-- ============================================================================
-- TABLE: carts
-- ============================================================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_is_active ON carts(is_active);

-- ============================================================================
-- TABLE: cart_items
-- ============================================================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_cart_id 
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- ============================================================================
-- TABLE: addresses
-- ============================================================================
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    address_name VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_delivery_address BOOLEAN DEFAULT TRUE,
    is_billing_address BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(is_default);

-- ============================================================================
-- TABLE: payment_methods
-- ============================================================================
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    payment_type payment_type NOT NULL,
    card_holder_name VARCHAR(255),
    card_number_last4 VARCHAR(4),
    card_expiry_month INT,
    card_expiry_year INT,
    upi_id VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_methods_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(is_default);

-- ============================================================================
-- TABLE: wallet
-- ============================================================================
CREATE TABLE wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    total_credited DECIMAL(12,2) DEFAULT 0,
    total_debited DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_wallet_user_id ON wallet(user_id);

-- ============================================================================
-- TABLE: wallet_transactions
-- ============================================================================
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    transaction_type wallet_transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    reference_id VARCHAR(36),
    status transaction_status DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_transactions_wallet_id 
        FOREIGN KEY (wallet_id) REFERENCES wallet(id) ON DELETE CASCADE
);

CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- ============================================================================
-- TABLE: orders
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    delivery_address_id UUID,
    status order_status NOT NULL,
    payment_status payment_status NOT NULL,
    payment_method payment_method_type NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    delivery_agent_id UUID,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_delivery_address_id 
        FOREIGN KEY (delivery_address_id) REFERENCES addresses(id),
    CONSTRAINT fk_orders_delivery_agent_id 
        FOREIGN KEY (delivery_agent_id) REFERENCES users(id)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_delivery_agent_id ON orders(delivery_agent_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- TABLE: order_items
-- ============================================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- TABLE: order_tracking
-- ============================================================================
CREATE TABLE order_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    status VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    location_name VARCHAR(255),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_tracking_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_timestamp ON order_tracking(timestamp);

-- ============================================================================
-- TABLE: delivery_earnings
-- ============================================================================
CREATE TABLE delivery_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_agent_id UUID NOT NULL,
    order_id UUID NOT NULL,
    earnings DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2) DEFAULT 0,
    status delivery_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_delivery_earnings_delivery_agent_id 
        FOREIGN KEY (delivery_agent_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_delivery_earnings_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX idx_delivery_earnings_delivery_agent_id ON delivery_earnings(delivery_agent_id);
CREATE INDEX idx_delivery_earnings_order_id ON delivery_earnings(order_id);
CREATE INDEX idx_delivery_earnings_status ON delivery_earnings(status);

-- ============================================================================
-- TABLE: favorites
-- ============================================================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_favorites_user_product UNIQUE(user_id, product_id),
    CONSTRAINT fk_favorites_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- ============================================================================
-- TABLE: coupons
-- ============================================================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    applicable_categories JSONB,
    max_usage INT,
    max_usage_per_user INT DEFAULT 1,
    used_count INT DEFAULT 0,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_coupon_code ON coupons(coupon_code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_expiry_date ON coupons(expiry_date);

-- ============================================================================
-- TABLE: coupon_usage
-- ============================================================================
CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL,
    user_id UUID NOT NULL,
    order_id UUID,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_coupon_usage_coupon_id 
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    CONSTRAINT fk_coupon_usage_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_coupon_usage_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_order_id ON coupon_usage(order_id);

-- ============================================================================
-- TABLE: support_tickets
-- ============================================================================
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    order_id UUID,
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status coupon_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    assigned_to UUID,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_support_tickets_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_support_tickets_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_support_tickets_assigned_to 
        FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);

-- ============================================================================
-- TABLE: settings
-- ============================================================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Order Summary with User Details
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    u.name AS customer_name,
    u.email AS customer_email,
    u.mobile AS customer_mobile,
    o.status,
    o.payment_status,
    o.total,
    o.created_at,
    COUNT(oi.id) AS item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.id;

-- View: Product Inventory Low Stock
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    p.id,
    p.name,
    c.name AS category,
    sc.name AS subcategory,
    p.stock_quantity,
    p.price,
    p.unit
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN sub_categories sc ON p.subcategory_id = sc.id
WHERE p.stock_quantity < 10 AND p.is_active = TRUE;

-- View: Delivery Agent Performance
CREATE OR REPLACE VIEW delivery_agent_performance AS
SELECT 
    u.id,
    u.name,
    u.mobile,
    COUNT(DISTINCT o.id) AS total_deliveries,
    SUM(de.earnings + COALESCE(de.bonus, 0)) AS total_earnings,
    AVG(o.created_at - orders.created_at)::INTERVAL AS avg_delivery_time
FROM users u
LEFT JOIN orders o ON u.id = o.delivery_agent_id AND o.status = 'delivered'
LEFT JOIN delivery_earnings de ON o.id = de.order_id
WHERE u.role = 'delivery_agent'
GROUP BY u.id;

-- View: Monthly Revenue
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    DATE_TRUNC('month', o.created_at)::DATE AS month,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(o.total) AS revenue,
    SUM(o.total) FILTER (WHERE o.status = 'delivered') AS completed_revenue,
    AVG(o.total) AS avg_order_value
FROM orders o
WHERE o.status != 'cancelled'
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY month DESC;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Calculate Product Discount
CREATE OR REPLACE FUNCTION calculate_discount(mrp DECIMAL, price DECIMAL)
RETURNS INT AS $$
BEGIN
    RETURN CASE 
        WHEN mrp <= 0 THEN 0
        ELSE ROUND(((mrp - price) / mrp * 100)::NUMERIC)::INT
    END;
END;
$$ LANGUAGE plpgsql;

-- Function: Update Cart Total
CREATE OR REPLACE FUNCTION update_cart_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE carts 
    SET 
        subtotal = COALESCE((
            SELECT SUM(subtotal) FROM cart_items WHERE cart_id = NEW.cart_id
        ), 0),
        total = COALESCE((
            SELECT SUM(subtotal) FROM cart_items WHERE cart_id = NEW.cart_id
        ), 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.cart_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Update Product Rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET 
        rating = COALESCE((
            SELECT AVG(rating)::DECIMAL(3,2) FROM product_reviews WHERE product_id = NEW.product_id
        ), 0),
        review_count = COALESCE((
            SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id
        ), 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Create Wallet on User Registration
CREATE OR REPLACE FUNCTION create_wallet_on_user_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallet (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update cart total when items change
CREATE TRIGGER trigger_update_cart_total
AFTER INSERT OR UPDATE OR DELETE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_cart_total();

-- Trigger: Update product rating when reviews change
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Trigger: Create wallet on user creation
CREATE TRIGGER trigger_create_wallet
AFTER INSERT ON users
FOR EACH ROW
WHEN (NEW.role = 'customer')
EXECUTE FUNCTION create_wallet_on_user_creation();

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================

-- Insert Categories
INSERT INTO categories (id, name, description, image, icon, is_active, sort_order) VALUES
('vegetables', 'Vegetables', 'Fresh and organic vegetables', 'https://images.unsplash.com/photo-1634731201932-9bd92839bea2', '🥬', TRUE, 1),
('fruits', 'Fruits', 'Fresh and juicy fruits', 'https://images.unsplash.com/photo-1767040023611-53996d500ee8', '🍎', TRUE, 2),
('bakery', 'Bakery', 'Freshly baked products', 'https://images.unsplash.com/photo-1608220874995-aa3e5301c676', '🥖', TRUE, 3),
('dairy', 'Dairy', 'Dairy products and milk', 'https://images.unsplash.com/photo-1635714293982-65445548ac42', '🥛', TRUE, 4),
('meat', 'Meat', 'Premium quality meat', 'https://images.unsplash.com/photo-1630334337820-84afb05acf3a', '🥩', TRUE, 5),
('seafood', 'Seafood', 'Fresh seafood products', 'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7', '🐟', TRUE, 6),
('stationary-office', 'Stationary & Office', 'Office supplies and stationery', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', '📝', TRUE, 7),
('groceries', 'Groceries', 'Grocery essentials', 'https://images.unsplash.com/photo-1488459716781-6918f33427d7', '🛒', TRUE, 8);

-- Insert Sub-categories for Vegetables
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('leafy-greens', 'vegetables', 'Leafy Greens', TRUE, 1),
('root-vegetables', 'vegetables', 'Root Vegetables', TRUE, 2),
('cruciferous', 'vegetables', 'Cruciferous', TRUE, 3),
('other-vegetables', 'vegetables', 'Other Vegetables', TRUE, 4);

-- Insert Sub-categories for Fruits
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('citrus', 'fruits', 'Citrus', TRUE, 1),
('berries', 'fruits', 'Berries', TRUE, 2),
('tropical', 'fruits', 'Tropical', TRUE, 3),
('stone-fruits', 'fruits', 'Stone Fruits', TRUE, 4);

-- Insert Sub-categories for Bakery
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('bread', 'bakery', 'Bread', TRUE, 1),
('pastries', 'bakery', 'Pastries', TRUE, 2),
('cakes', 'bakery', 'Cakes', TRUE, 3),
('rolls', 'bakery', 'Rolls', TRUE, 4);

-- Insert Sub-categories for Dairy
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('milk', 'dairy', 'Milk', TRUE, 1),
('yogurt', 'dairy', 'Yogurt', TRUE, 2),
('cheese', 'dairy', 'Cheese', TRUE, 3),
('butter', 'dairy', 'Butter & Spreads', TRUE, 4);

-- Insert Sub-categories for Meat
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('beef', 'meat', 'Beef', TRUE, 1),
('pork', 'meat', 'Pork', TRUE, 2),
('poultry', 'meat', 'Poultry', TRUE, 3),
('processed-meat', 'meat', 'Processed Meat', TRUE, 4);

-- Insert Sub-categories for Seafood
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('fish', 'seafood', 'Fish', TRUE, 1),
('shellfish', 'seafood', 'Shellfish', TRUE, 2),
('frozen-seafood', 'seafood', 'Frozen Seafood', TRUE, 3);

-- Insert Sub-categories for Stationary & Office
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('notebooks', 'stationary-office', 'Notebooks', TRUE, 1),
('pens-pencils', 'stationary-office', 'Pens & Pencils', TRUE, 2),
('paper-products', 'stationary-office', 'Paper Products', TRUE, 3),
('desk-accessories', 'stationary-office', 'Desk Accessories', TRUE, 4);

-- Insert Sub-categories for Groceries
INSERT INTO sub_categories (id, category_id, name, is_active, sort_order) VALUES
('grains-cereals', 'groceries', 'Grains & Cereals', TRUE, 1),
('cooking-oils', 'groceries', 'Cooking Oils', TRUE, 2),
('spices-condiments', 'groceries', 'Spices & Condiments', TRUE, 3),
('canned-foods', 'groceries', 'Canned Foods', TRUE, 4);

-- ============================================================================
-- SECURITY: Row Level Security (Optional - Uncomment to enable)
-- ============================================================================

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- -- Policy: Users can only see their own data
-- CREATE POLICY user_isolation ON users
--   USING (id = current_user_id());

-- -- Policy: Orders visible to user and admin
-- CREATE POLICY order_visibility ON orders
--   USING (user_id = current_user_id() OR 
--          EXISTS (SELECT 1 FROM users WHERE id = current_user_id() AND role = 'admin'));

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Verify table creation
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
