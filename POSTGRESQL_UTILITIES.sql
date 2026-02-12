-- ============================================================================
-- GroceryCart Application - PostgreSQL Utility Scripts
-- Additional Scripts for Data Operations and Maintenance
-- ============================================================================

-- ============================================================================
-- SECTION 1: SAMPLE DATA INSERTION SCRIPTS
-- ============================================================================

-- Insert Sample Products
INSERT INTO products (
    name, description, category_id, subcategory_id, 
    price, mrp, discount, unit, stock_quantity, image, in_stock
) VALUES
-- Vegetables
('Fresh Tomatoes', 'Organic, locally grown tomatoes', 'vegetables', 'other-vegetables', 3.99, 4.99, 20, 'kg', 100, 'https://images.unsplash.com/photo-1767978529638-ff1faefa00c5', true),
('Red Carrots', 'Fresh organic carrots', 'vegetables', 'root-vegetables', 2.49, 2.99, 10, 'kg', 150, 'https://images.unsplash.com/photo-1599599810694-cb5d0f9a4b7a', true),
('Fresh Broccoli', 'Fresh green broccoli heads', 'vegetables', 'cruciferous', 3.49, 4.49, 22, 'head', 80, 'https://images.unsplash.com/photo-1599599810694-cb94dee8f006', true),
('Spinach Salad Mix', 'Fresh spinach salad mix', 'vegetables', 'leafy-greens', 4.99, 6.49, 23, 'pack', 120, 'https://images.unsplash.com/photo-1553530666-ba2a7ce3ddae', true),

-- Fruits
('Green Apples', 'Crisp and fresh Granny Smith apples', 'fruits', 'stone-fruits', 4.49, 5.49, 18, 'kg', 90, 'https://images.unsplash.com/photo-1545252058-5b679e86032e', true),
('Fresh Oranges', 'Fresh juicy oranges', 'fruits', 'citrus', 5.99, 7.49, 20, 'pack', 110, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', true),

-- Bakery
('Whole Wheat Bread', 'Freshly baked whole wheat bread', 'bakery', 'bread', 3.29, 3.99, 15, 'loaf', 60, 'https://images.unsplash.com/photo-1608220874995-aa3e5301c676', true),

-- Dairy
('Organic Milk', '100% organic whole milk', 'dairy', 'milk', 5.99, 7.49, 20, 'gallon', 75, 'https://images.unsplash.com/photo-1635714293982-65445548ac42', true),

-- Meat
('Fresh Chicken Breast', 'Premium quality chicken breast', 'meat', 'poultry', 8.99, 10.99, 18, 'kg', 50, 'https://images.unsplash.com/photo-1630334337820-84afb05acf3a', true),

-- Seafood
('Wild Salmon Fillet', 'Fresh wild-caught salmon', 'seafood', 'fish', 14.99, 18.99, 21, 'kg', 40, 'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7', true),

-- Stationary & Office
('Premium Notebook', '100 pages premium quality notebook', 'stationary-office', 'notebooks', 4.99, 6.99, 28, 'pc', 200, 'https://images.unsplash.com/photo-1507842217343-583f20270319', true),
('Ballpoint Pen Set', 'Set of 10 smooth writing ballpoint pens', 'stationary-office', 'pens-pencils', 3.99, 5.49, 27, 'pack', 300, 'https://images.unsplash.com/photo-1578085284519-98f0b59e9e37', true),
('A4 Paper Ream', '500 sheets of high quality A4 paper', 'stationary-office', 'paper-products', 5.99, 7.99, 25, 'ream', 150, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', true),
('Desk Organizer', 'Wooden desk organizer with multiple compartments', 'stationary-office', 'desk-accessories', 12.99, 15.99, 19, 'pc', 80, 'https://images.unsplash.com/photo-1589939705882-0a92181e1260', true),
('Pencil Set', 'Set of 12 HB pencils', 'stationary-office', 'pens-pencils', 4.49, 5.99, 25, 'pack', 250, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8', true),

-- Groceries
('Brown Rice', 'Organic brown rice, high in fiber', 'groceries', 'grains-cereals', 3.49, 4.99, 30, 'kg', 180, 'https://images.unsplash.com/photo-1586080266690-05ef18b0c6a4', true),
('Extra Virgin Olive Oil', 'Cold-pressed extra virgin olive oil', 'groceries', 'cooking-oils', 12.99, 16.99, 23, 'liter', 60, 'https://images.unsplash.com/photo-1596040694741-75cded5e0213', true),
('Spice Mix Combo', 'Premium mix of Indian spices', 'groceries', 'spices-condiments', 5.99, 7.99, 25, 'pack', 140, 'https://images.unsplash.com/photo-1596040694741-75cded5e0213', true),
('Baked Beans', 'Ready to eat baked beans in tomato sauce', 'groceries', 'canned-foods', 2.49, 3.49, 28, 'can', 220, 'https://images.unsplash.com/photo-1599599810694-cb1aea4b39f4', true),
('Whole Wheat Flour', 'Premium wholemeal flour for baking', 'groceries', 'grains-cereals', 2.99, 3.99, 25, 'kg', 160, 'https://images.unsplash.com/photo-1599599810815-db8da036e752', true),
('Tomato Ketchup', 'Organic tomato ketchup without added sugar', 'groceries', 'spices-condiments', 3.49, 4.99, 30, 'bottle', 175, 'https://images.unsplash.com/photo-1599599810817-4d38e48c3bfe', true);

-- ============================================================================
-- SECTION 2: USEFUL QUERIES FOR ANALYTICS AND REPORTING
-- ============================================================================

-- Query 1: Get Top 10 Best-Selling Products
-- SELECT 
--     p.id, p.name, p.price, p.category_id,
--     SUM(oi.quantity) as total_quantity_sold,
--     SUM(oi.subtotal) as total_revenue
-- FROM products p
-- JOIN order_items oi ON p.id = oi.product_id
-- JOIN orders o ON oi.order_id = o.id
-- WHERE o.status = 'delivered' 
--   AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY p.id, p.name, p.price, p.category_id
-- ORDER BY total_quantity_sold DESC
-- LIMIT 10;

-- Query 2: Get Products by Category with Review Counts
-- SELECT 
--     c.name as category,
--     COUNT(p.id) as product_count,
--     AVG(p.rating) as avg_rating,
--     SUM(p.review_count) as total_reviews,
--     SUM(p.stock_quantity) as total_stock
-- FROM categories c
-- LEFT JOIN products p ON c.id = p.category_id
-- WHERE p.is_active = true
-- GROUP BY c.id, c.name
-- ORDER BY product_count DESC;

-- Query 3: Customer Order History with Total Spent
-- SELECT 
--     u.id, u.name, u.email, u.mobile,
--     COUNT(DISTINCT o.id) as total_orders,
--     SUM(o.total) FILTER (WHERE o.status = 'delivered') as total_spent,
--     MAX(o.created_at) as last_order_date,
--     AVG(o.total) FILTER (WHERE o.status = 'delivered') as avg_order_value
-- FROM users u
-- LEFT JOIN orders o ON u.id = o.user_id
-- WHERE u.role = 'customer'
-- GROUP BY u.id, u.name, u.email, u.mobile
-- ORDER BY total_spent DESC;

-- Query 4: Delivery Agent Performance Report
-- SELECT 
--     u.id, u.name, u.mobile,
--     COUNT(DISTINCT o.id) as total_deliveries,
--     COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'delivered') as completed_deliveries,
--     SUM(de.earnings + COALESCE(de.bonus, 0)) as total_earnings,
--     AVG(EXTRACT(EPOCH FROM (o.actual_delivery - o.created_at))/3600)::INT as avg_delivery_hours
-- FROM users u
-- LEFT JOIN orders o ON u.id = o.delivery_agent_id
-- LEFT JOIN delivery_earnings de ON o.id = de.order_id
-- WHERE u.role = 'delivery_agent'
-- GROUP BY u.id, u.name, u.mobile
-- ORDER BY total_earnings DESC;

-- Query 5: Low Stock Alert
-- SELECT 
--     p.id, p.name, p.unit, p.stock_quantity,
--     c.name as category,
--     p.price,
--     p.mrp
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE p.stock_quantity < 20 AND p.is_active = true
-- ORDER BY p.stock_quantity ASC;

-- Query 6: Recent Orders Status Summary
-- SELECT 
--     o.status,
--     o.payment_status,
--     COUNT(*) as count,
--     AVG(o.total) as avg_order_value,
--     MIN(o.created_at) as oldest_order,
--     MAX(o.created_at) as latest_order
-- FROM orders o
-- WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY o.status, o.payment_status
-- ORDER BY count DESC;

-- Query 7: Coupon Performance Analysis
-- SELECT 
--     c.coupon_code,
--     c.discount_type,
--     c.discount_value,
--     COUNT(cu.id) as usage_count,
--     SUM(cu.discount_amount) as total_discount_given,
--     COUNT(DISTINCT cu.user_id) as unique_users
-- FROM coupons c
-- LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id
-- WHERE c.is_active = true
-- GROUP BY c.id, c.coupon_code, c.discount_type, c.discount_value
-- ORDER BY usage_count DESC;

-- Query 8: Product Search with Filters
-- SELECT 
--     p.id, p.name, p.price, p.mrp, p.discount, 
--     c.name as category, p.rating, p.review_count,
--     p.stock_quantity
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE p.is_active = true
--   AND p.in_stock = true
--   AND p.name ILIKE '%keyword%'
--   AND (p.category_id = 'category_id' OR true)
--   AND p.price BETWEEN 0 AND 100
-- ORDER BY p.rating DESC, p.review_count DESC
-- LIMIT 20;

-- Query 9: Daily Revenue Report
-- SELECT 
--     DATE(o.created_at) as order_date,
--     COUNT(DISTINCT o.id) as total_orders,
--     SUM(o.total) as daily_revenue,
--     SUM(o.total) FILTER (WHERE o.status = 'delivered') as completed_revenue,
--     AVG(o.total) as avg_order_value,
--     COUNT(DISTINCT o.user_id) as unique_customers
-- FROM orders o
-- WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY DATE(o.created_at)
-- ORDER BY order_date DESC;

-- Query 10: Support Tickets Status Report
-- SELECT 
--     st.status,
--     st.priority,
--     COUNT(*) as count,
--     ROUND(AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - st.created_at))/3600), 2) as avg_hours_open
-- FROM support_tickets st
-- WHERE st.created_at >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY st.status, st.priority
-- ORDER BY count DESC;

-- ============================================================================
-- SECTION 3: MAINTENANCE AND DATABASE OPTIMIZATION
-- ============================================================================

-- Analyze all tables for query optimization
-- ANALYZE;

-- Vacuum to reclaim storage and optimize
-- VACUUM ANALYZE;

-- Reindex all indexes (run during maintenance window)
-- REINDEX DATABASE groceryapp;

-- Check table sizes
-- SELECT 
--     schemaname,
--     tablename,
--     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index sizes
-- SELECT 
--     schemaname,
--     tablename,
--     indexname,
--     pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================================================
-- SECTION 4: BACKUP AND RESTORE COMMANDS
-- ============================================================================

-- Backup entire database (run from shell):
-- pg_dump -U postgres -h localhost -d groceryapp -F c -b -v -f "/path/to/backup/groceryapp_backup.dump"

-- Backup specific table:
-- pg_dump -U postgres -h localhost -d groceryapp -t products -F c -b -v -f "/path/to/backup/products_backup.dump"

-- Restore database:
-- pg_restore -U postgres -h localhost -d groceryapp "/path/to/backup/groceryapp_backup.dump"

-- Backup as SQL script:
-- pg_dump -U postgres -h localhost -d groceryapp -f "/path/to/backup/groceryapp_backup.sql"

-- ============================================================================
-- SECTION 5: USER AND PERMISSION MANAGEMENT
-- ============================================================================

-- Create application user (run as superuser)
-- CREATE USER grocery_app WITH PASSWORD 'secure_password_123';

-- Grant permissions to application user
-- GRANT CONNECT ON DATABASE groceryapp TO grocery_app;
-- GRANT USAGE ON SCHEMA public TO grocery_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO grocery_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO grocery_app;

-- Create read-only user
-- CREATE USER grocery_readonly WITH PASSWORD 'readonly_password_123';
-- GRANT CONNECT ON DATABASE groceryapp TO grocery_readonly;
-- GRANT USAGE ON SCHEMA public TO grocery_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO grocery_readonly;

-- Create admin user
-- CREATE USER grocery_admin WITH PASSWORD 'admin_password_123';
-- GRANT ALL ON DATABASE groceryapp TO grocery_admin;

-- ============================================================================
-- SECTION 6: MIGRATION HELPERS
-- ============================================================================

-- Create migration tracking table
-- CREATE TABLE IF NOT EXISTS schema_migrations (
--     id SERIAL PRIMARY KEY,
--     version VARCHAR(50) UNIQUE NOT NULL,
--     description VARCHAR(255),
--     type VARCHAR(10),
--     executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Record initial schema version
-- INSERT INTO schema_migrations (version, description, type) 
-- VALUES ('001', 'Initial schema creation', 'UP');

-- ============================================================================
-- SECTION 7: STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================================================

-- Procedure: Create Order from Cart
-- CREATE OR REPLACE FUNCTION create_order_from_cart(
--     p_user_id UUID,
--     p_delivery_address_id UUID,
--     p_payment_method payment_method_type,
--     p_notes TEXT DEFAULT NULL
-- ) RETURNS UUID AS $$
-- DECLARE
--     v_order_id UUID;
--     v_cart_id UUID;
--     v_order_number VARCHAR(50);
--     v_subtotal DECIMAL;
-- BEGIN
--     -- Get user's active cart
--     SELECT id INTO v_cart_id FROM carts 
--     WHERE user_id = p_user_id AND is_active = true LIMIT 1;
    
--     IF v_cart_id IS NULL THEN
--         RAISE EXCEPTION 'No active cart found for user';
--     END IF;
    
--     -- Get cart total
--     SELECT COALESCE(SUM(subtotal), 0) INTO v_subtotal 
--     FROM cart_items WHERE cart_id = v_cart_id;
    
--     -- Generate order number
--     v_order_number := 'ORD' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
    
--     -- Create order
--     INSERT INTO orders (
--         order_number, user_id, delivery_address_id, status, 
--         payment_status, payment_method, subtotal, total, notes
--     ) VALUES (
--         v_order_number, p_user_id, p_delivery_address_id, 
--         'pending', 'pending', p_payment_method, v_subtotal, v_subtotal, p_notes
--     ) RETURNING id INTO v_order_id;
    
--     -- Copy cart items to order items
--     INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
--     SELECT v_order_id, ci.product_id, p.name, ci.quantity, ci.unit_price, ci.subtotal
--     FROM cart_items ci
--     JOIN products p ON ci.product_id = p.id
--     WHERE ci.cart_id = v_cart_id;
    
--     -- Update cart status
--     UPDATE carts SET is_active = false WHERE id = v_cart_id;
    
--     -- Create new empty cart
--     INSERT INTO carts (user_id) VALUES (p_user_id);
    
--     RETURN v_order_id;
-- END;
-- $$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 8: PERFORMANCE MONITORING QUERIES
-- ============================================================================

-- Monitor slow queries
-- SELECT 
--     query,
--     calls,
--     total_time,
--     mean_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 20;

-- Check active connections
-- SELECT 
--     datname,
--     usename,
--     count(*) as connections
-- FROM pg_stat_activity
-- GROUP BY datname, usename
-- ORDER BY connections DESC;

-- Monitor cache hit ratio
-- SELECT 
--     sum(heap_blks_read) as heap_read,
--     sum(heap_blks_hit) as heap_hit,
--     sum(heap_blks_hit)::FLOAT / (sum(heap_blks_hit) + sum(heap_blks_read)) as cache_ratio
-- FROM pg_statio_user_tables;

-- ============================================================================
-- END OF UTILITY SCRIPTS
-- ============================================================================
