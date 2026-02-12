# GroceryCart Application - Database Schema

## Overview
This document provides the complete database schema for the GroceryCart application, including all required tables, columns, relationships, and indexes.

---

## 1. Users Table

### Table: `users`
Stores user account information for customers and delivery agents.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID for unique user identification |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| `mobile` | VARCHAR(20) | UNIQUE, NOT NULL | User's mobile number |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `role` | ENUM('customer', 'delivery_agent') | NOT NULL | User role type |
| `profile_image` | TEXT | NULL | URL to user's profile image |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account active status |
| `phone_verified` | BOOLEAN | DEFAULT FALSE | Phone verification status |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_mobile ON users(mobile);
CREATE INDEX idx_role ON users(role);
```

---

## 2. Categories Table

### Table: `categories`
Stores product categories.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Category identifier |
| `name` | VARCHAR(255) | NOT NULL | Category name |
| `description` | TEXT | NULL | Category description |
| `image` | TEXT | NOT NULL | Category image URL |
| `icon` | VARCHAR(50) | NULL | Category emoji/icon |
| `is_active` | BOOLEAN | DEFAULT TRUE | Category active status |
| `sort_order` | INT | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_is_active ON categories(is_active);
CREATE INDEX idx_sort_order ON categories(sort_order);
```

---

## 3. SubCategories Table

### Table: `sub_categories`
Stores subcategories under main categories.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Subcategory identifier |
| `category_id` | VARCHAR(50) | FOREIGN KEY | Reference to categories table |
| `name` | VARCHAR(255) | NOT NULL | Subcategory name |
| `description` | TEXT | NULL | Subcategory description |
| `is_active` | BOOLEAN | DEFAULT TRUE | Subcategory active status |
| `sort_order` | INT | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE sub_categories ADD CONSTRAINT fk_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_category_id ON sub_categories(category_id);
CREATE INDEX idx_is_active ON sub_categories(is_active);
```

---

## 4. Products Table

### Table: `products`
Stores product information.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Product UUID |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `description` | TEXT | NULL | Detailed product description |
| `category_id` | VARCHAR(50) | FOREIGN KEY | Reference to categories table |
| `subcategory_id` | VARCHAR(50) | FOREIGN KEY | Reference to sub_categories table |
| `price` | DECIMAL(10,2) | NOT NULL | Selling price |
| `mrp` | DECIMAL(10,2) | NOT NULL | Maximum retail price |
| `discount` | INT | DEFAULT 0 | Discount percentage |
| `unit` | VARCHAR(50) | NOT NULL | Unit of measurement (kg, pc, liter, etc) |
| `stock_quantity` | INT | DEFAULT 0 | Current stock level |
| `image` | TEXT | NOT NULL | Product image URL |
| `rating` | DECIMAL(3,2) | DEFAULT 0 | Average rating (0-5) |
| `review_count` | INT | DEFAULT 0 | Number of reviews |
| `in_stock` | BOOLEAN | DEFAULT TRUE | Stock availability status |
| `is_active` | BOOLEAN | DEFAULT TRUE | Product active status |
| `created_by` | VARCHAR(36) | FOREIGN KEY | Admin user ID who created |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE products ADD CONSTRAINT fk_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products ADD CONSTRAINT fk_subcategory_id 
FOREIGN KEY (subcategory_id) REFERENCES sub_categories(id);

ALTER TABLE products ADD CONSTRAINT fk_created_by 
FOREIGN KEY (created_by) REFERENCES users(id);
```

**Indexes:**
```sql
CREATE INDEX idx_category_id ON products(category_id);
CREATE INDEX idx_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_name ON products(name);
CREATE INDEX idx_in_stock ON products(in_stock);
CREATE INDEX idx_is_active ON products(is_active);
CREATE FULLTEXT INDEX idx_search ON products(name, description);
```

---

## 5. Product Reviews Table

### Table: `product_reviews`
Stores customer reviews for products.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Review UUID |
| `product_id` | VARCHAR(36) | FOREIGN KEY | Reference to products table |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `rating` | INT | CHECK (1-5) | Rating from 1 to 5 |
| `title` | VARCHAR(255) | NOT NULL | Review title |
| `comment` | TEXT | NULL | Detailed review text |
| `helpful_count` | INT | DEFAULT 0 | Number of helpful votes |
| `is_verified_purchase` | BOOLEAN | DEFAULT FALSE | Verified purchase indicator |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE product_reviews ADD CONSTRAINT fk_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE product_reviews ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_product_id ON product_reviews(product_id);
CREATE INDEX idx_user_id ON product_reviews(user_id);
CREATE INDEX idx_rating ON product_reviews(rating);
```

---

## 6. Cart Table

### Table: `carts`
Stores shopping cart information for users.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Cart UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `subtotal` | DECIMAL(10,2) | DEFAULT 0 | Cart subtotal |
| `tax` | DECIMAL(10,2) | DEFAULT 0 | Tax amount |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 0 | Delivery charge |
| `discount` | DECIMAL(10,2) | DEFAULT 0 | Total discount |
| `total` | DECIMAL(10,2) | DEFAULT 0 | Final total |
| `is_active` | BOOLEAN | DEFAULT TRUE | Cart active status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE carts ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON carts(user_id);
CREATE INDEX idx_is_active ON carts(is_active);
```

---

## 7. Cart Items Table

### Table: `cart_items`
Stores individual items in shopping carts.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Cart Item UUID |
| `cart_id` | VARCHAR(36) | FOREIGN KEY | Reference to carts table |
| `product_id` | VARCHAR(36) | FOREIGN KEY | Reference to products table |
| `quantity` | INT | NOT NULL | Item quantity |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price per unit at time of adding |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Quantity × unit_price |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE cart_items ADD CONSTRAINT fk_cart_id 
FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE;

ALTER TABLE cart_items ADD CONSTRAINT fk_product_id 
FOREIGN KEY (product_id) REFERENCES products(id);
```

**Indexes:**
```sql
CREATE INDEX idx_cart_id ON cart_items(cart_id);
CREATE INDEX idx_product_id ON cart_items(product_id);
```

---

## 8. Orders Table

### Table: `orders`
Stores order information.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Order UUID |
| `order_number` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable order number |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `delivery_address_id` | VARCHAR(36) | FOREIGN KEY | Reference to addresses table |
| `status` | ENUM('pending', 'confirmed', 'preparing', 'ready_for_delivery', 'in_transit', 'delivered', 'cancelled') | NOT NULL | Order status |
| `payment_status` | ENUM('pending', 'completed', 'failed', 'refunded') | NOT NULL | Payment status |
| `payment_method` | ENUM('credit_card', 'debit_card', 'wallet', 'upi', 'cash_on_delivery') | NOT NULL | Payment method used |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Order subtotal |
| `tax` | DECIMAL(10,2) | DEFAULT 0 | Tax amount |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 0 | Delivery fee |
| `discount` | DECIMAL(10,2) | DEFAULT 0 | Discount applied |
| `total` | DECIMAL(10,2) | NOT NULL | Final total |
| `delivery_agent_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table (delivery agent) |
| `estimated_delivery` | DATETIME | NULL | Estimated delivery time |
| `actual_delivery` | DATETIME | NULL | Actual delivery time |
| `notes` | TEXT | NULL | Special instructions |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE orders ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE orders ADD CONSTRAINT fk_delivery_address_id 
FOREIGN KEY (delivery_address_id) REFERENCES addresses(id);

ALTER TABLE orders ADD CONSTRAINT fk_delivery_agent_id 
FOREIGN KEY (delivery_agent_id) REFERENCES users(id);
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_order_number ON orders(order_number);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_payment_status ON orders(payment_status);
CREATE INDEX idx_delivery_agent_id ON orders(delivery_agent_id);
CREATE INDEX idx_created_at ON orders(created_at);
```

---

## 9. Order Items Table

### Table: `order_items`
Stores individual items in orders.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Order Item UUID |
| `order_id` | VARCHAR(36) | FOREIGN KEY | Reference to orders table |
| `product_id` | VARCHAR(36) | FOREIGN KEY | Reference to products table |
| `product_name` | VARCHAR(255) | NOT NULL | Product name snapshot |
| `quantity` | INT | NOT NULL | Quantity ordered |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price per unit at time of order |
| `discount` | DECIMAL(10,2) | DEFAULT 0 | Item discount |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Quantity × unit_price |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
```sql
ALTER TABLE order_items ADD CONSTRAINT fk_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items ADD CONSTRAINT fk_product_id 
FOREIGN KEY (product_id) REFERENCES products(id);
```

**Indexes:**
```sql
CREATE INDEX idx_order_id ON order_items(order_id);
CREATE INDEX idx_product_id ON order_items(product_id);
```

---

## 10. Addresses Table

### Table: `addresses`
Stores delivery and billing addresses for users.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Address UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `address_name` | VARCHAR(100) | NOT NULL | Address label (Home, Office, etc) |
| `street` | VARCHAR(255) | NOT NULL | Street address |
| `apartment` | VARCHAR(100) | NULL | Apartment/building number |
| `city` | VARCHAR(100) | NOT NULL | City |
| `state` | VARCHAR(100) | NOT NULL | State/Province |
| `postal_code` | VARCHAR(20) | NOT NULL | Postal/ZIP code |
| `country` | VARCHAR(100) | NOT NULL | Country |
| `latitude` | DECIMAL(10,8) | NULL | Geographic latitude |
| `longitude` | DECIMAL(11,8) | NULL | Geographic longitude |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone number |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default address flag |
| `is_delivery_address` | BOOLEAN | DEFAULT TRUE | Can be used for delivery |
| `is_billing_address` | BOOLEAN | DEFAULT FALSE | Can be used for billing |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE addresses ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON addresses(user_id);
CREATE INDEX idx_default ON addresses(is_default);
CREATE SPATIAL INDEX idx_location ON addresses(latitude, longitude);
```

---

## 11. Payment Methods Table

### Table: `payment_methods`
Stores saved payment methods for users.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Payment Method UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `payment_type` | ENUM('credit_card', 'debit_card', 'upi', 'digital_wallet') | NOT NULL | Payment type |
| `card_holder_name` | VARCHAR(255) | NULL | Name on card |
| `card_number_last4` | VARCHAR(4) | NULL | Last 4 digits of card (encrypted) |
| `card_expiry_month` | INT | NULL | Expiry month |
| `card_expiry_year` | INT | NULL | Expiry year |
| `upi_id` | VARCHAR(255) | NULL | UPI ID |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default payment method |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE payment_methods ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON payment_methods(user_id);
CREATE INDEX idx_default ON payment_methods(is_default);
```

---

## 12. Wallet Table

### Table: `wallet`
Stores wallet balance and transactions for users.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Wallet UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY UNIQUE | Reference to users table |
| `balance` | DECIMAL(10,2) | DEFAULT 0 | Current wallet balance |
| `currency` | VARCHAR(3) | DEFAULT 'USD' | Currency code |
| `total_credited` | DECIMAL(12,2) | DEFAULT 0 | Total amount credited |
| `total_debited` | DECIMAL(12,2) | DEFAULT 0 | Total amount debited |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE wallet ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON wallet(user_id);
```

---

## 13. Wallet Transactions Table

### Table: `wallet_transactions`
Stores wallet transaction history.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Transaction UUID |
| `wallet_id` | VARCHAR(36) | FOREIGN KEY | Reference to wallet table |
| `transaction_type` | ENUM('credit', 'debit') | NOT NULL | Transaction type |
| `amount` | DECIMAL(10,2) | NOT NULL | Transaction amount |
| `balance_before` | DECIMAL(10,2) | NOT NULL | Balance before transaction |
| `balance_after` | DECIMAL(10,2) | NOT NULL | Balance after transaction |
| `description` | VARCHAR(255) | NOT NULL | Transaction description |
| `reference_id` | VARCHAR(36) | NULL | Reference to order or other entity |
| `status` | ENUM('pending', 'completed', 'failed') | DEFAULT 'completed' | Transaction status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
```sql
ALTER TABLE wallet_transactions ADD CONSTRAINT fk_wallet_id 
FOREIGN KEY (wallet_id) REFERENCES wallet(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_transaction_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_created_at ON wallet_transactions(created_at);
```

---

## 14. Favorites Table

### Table: `favorites`
Stores user's favorite products.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Favorite UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `product_id` | VARCHAR(36) | FOREIGN KEY | Reference to products table |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Unique Constraint:**
```sql
ALTER TABLE favorites ADD CONSTRAINT uk_user_product UNIQUE(user_id, product_id);
```

**Foreign Keys:**
```sql
ALTER TABLE favorites ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE favorites ADD CONSTRAINT fk_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON favorites(user_id);
CREATE INDEX idx_product_id ON favorites(product_id);
```

---

## 15. Delivery Earnings Table

### Table: `delivery_earnings`
Stores earnings data for delivery agents.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Earnings UUID |
| `delivery_agent_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `order_id` | VARCHAR(36) | FOREIGN KEY | Reference to orders table |
| `earnings` | DECIMAL(10,2) | NOT NULL | Delivery earnings amount |
| `bonus` | DECIMAL(10,2) | DEFAULT 0 | Bonus amount if any |
| `status` | ENUM('pending', 'paid', 'cancelled') | DEFAULT 'pending' | Payment status |
| `payment_method` | VARCHAR(50) | NULL | Payment method used |
| `paid_at` | DATETIME | NULL | When payment was made |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE delivery_earnings ADD CONSTRAINT fk_delivery_agent_id 
FOREIGN KEY (delivery_agent_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE delivery_earnings ADD CONSTRAINT fk_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id);
```

**Indexes:**
```sql
CREATE INDEX idx_delivery_agent_id ON delivery_earnings(delivery_agent_id);
CREATE INDEX idx_order_id ON delivery_earnings(order_id);
CREATE INDEX idx_status ON delivery_earnings(status);
```

---

## 16. Order Tracking Table

### Table: `order_tracking`
Stores real-time tracking updates for orders.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Tracking UUID |
| `order_id` | VARCHAR(36) | FOREIGN KEY | Reference to orders table |
| `status` | VARCHAR(100) | NOT NULL | Current status |
| `latitude` | DECIMAL(10,8) | NULL | Current latitude |
| `longitude` | DECIMAL(11,8) | NULL | Current longitude |
| `location_name` | VARCHAR(255) | NULL | Location description |
| `description` | TEXT | NULL | Status description |
| `timestamp` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Update timestamp |

**Foreign Keys:**
```sql
ALTER TABLE order_tracking ADD CONSTRAINT fk_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
```

**Indexes:**
```sql
CREATE INDEX idx_order_id ON order_tracking(order_id);
CREATE INDEX idx_timestamp ON order_tracking(timestamp);
CREATE SPATIAL INDEX idx_location ON order_tracking(latitude, longitude);
```

---

## 17. Support/Complaints Table

### Table: `support_tickets`
Stores customer support tickets.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Ticket UUID |
| `ticket_number` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable ticket number |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `order_id` | VARCHAR(36) | FOREIGN KEY | Reference to orders table (if related) |
| `category` | VARCHAR(100) | NOT NULL | Issue category |
| `subject` | VARCHAR(255) | NOT NULL | Ticket subject |
| `description` | TEXT | NOT NULL | Detailed description |
| `status` | ENUM('open', 'in_progress', 'resolved', 'closed') | DEFAULT 'open' | Ticket status |
| `priority` | ENUM('low', 'medium', 'high', 'urgent') | DEFAULT 'medium' | Priority level |
| `assigned_to` | VARCHAR(36) | FOREIGN KEY | Support staff ID |
| `resolution` | TEXT | NULL | Resolution details |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |
| `resolved_at` | DATETIME | NULL | When ticket was resolved |

**Foreign Keys:**
```sql
ALTER TABLE support_tickets ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE support_tickets ADD CONSTRAINT fk_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id);

ALTER TABLE support_tickets ADD CONSTRAINT fk_assigned_to 
FOREIGN KEY (assigned_to) REFERENCES users(id);
```

**Indexes:**
```sql
CREATE INDEX idx_user_id ON support_tickets(user_id);
CREATE INDEX idx_ticket_number ON support_tickets(ticket_number);
CREATE INDEX idx_status ON support_tickets(status);
CREATE INDEX idx_priority ON support_tickets(priority);
```

---

## 18. Promotions/Coupons Table

### Table: `coupons`
Stores promotional coupons and discount codes.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Coupon UUID |
| `coupon_code` | VARCHAR(50) | UNIQUE, NOT NULL | Coupon code |
| `description` | TEXT | NULL | Coupon description |
| `discount_type` | ENUM('percentage', 'flat') | NOT NULL | Type of discount |
| `discount_value` | DECIMAL(10,2) | NOT NULL | Discount amount/percentage |
| `min_order_amount` | DECIMAL(10,2) | DEFAULT 0 | Minimum order amount |
| `max_discount` | DECIMAL(10,2) | NULL | Maximum discount cap |
| `applicable_categories` | JSON | NULL | Category IDs (JSON array) |
| `max_usage` | INT | NULL | Total usage limit |
| `max_usage_per_user` | INT | DEFAULT 1 | Usage limit per user |
| `used_count` | INT | DEFAULT 0 | Current usage count |
| `start_date` | DATE | NOT NULL | Coupon start date |
| `expiry_date` | DATE | NOT NULL | Coupon expiry date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Coupon active status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_coupon_code ON coupons(coupon_code);
CREATE INDEX idx_is_active ON coupons(is_active);
CREATE INDEX idx_expiry_date ON coupons(expiry_date);
```

---

## 19. Coupon Usage Table

### Table: `coupon_usage`
Tracks coupon usage history.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Usage UUID |
| `coupon_id` | VARCHAR(36) | FOREIGN KEY | Reference to coupons table |
| `user_id` | VARCHAR(36) | FOREIGN KEY | Reference to users table |
| `order_id` | VARCHAR(36) | FOREIGN KEY | Reference to orders table |
| `discount_amount` | DECIMAL(10,2) | NOT NULL | Actual discount applied |
| `used_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Usage timestamp |

**Foreign Keys:**
```sql
ALTER TABLE coupon_usage ADD CONSTRAINT fk_coupon_id 
FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE;

ALTER TABLE coupon_usage ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE coupon_usage ADD CONSTRAINT fk_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id);
```

**Indexes:**
```sql
CREATE INDEX idx_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_user_id ON coupon_usage(user_id);
CREATE INDEX idx_order_id ON coupon_usage(order_id);
```

---

## 20. Settings Table

### Table: `settings`
Stores application-wide settings and configurations.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Setting UUID |
| `key` | VARCHAR(255) | UNIQUE, NOT NULL | Setting key |
| `value` | LONGTEXT | NOT NULL | Setting value (JSON supported) |
| `description` | TEXT | NULL | Setting description |
| `is_system` | BOOLEAN | DEFAULT TRUE | System setting flag |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_key ON settings(key);
```

---

## Database Relationships Overview

```
users (1) -----> (N) carts
users (1) -----> (N) orders
users (1) -----> (N) addresses
users (1) -----> (N) payment_methods
users (1) -----> (1) wallet
users (1) -----> (N) product_reviews
users (1) -----> (N) favorites
users (1) -----> (N) support_tickets

categories (1) -----> (N) sub_categories
categories (1) -----> (N) products
sub_categories (1) -----> (N) products

products (1) -----> (N) cart_items
products (1) -----> (N) order_items
products (1) -----> (N) product_reviews
products (1) -----> (N) favorites

carts (1) -----> (N) cart_items
orders (1) -----> (N) order_items
orders (1) -----> (N) order_tracking
orders (1) -----> (N) delivery_earnings

wallet (1) -----> (N) wallet_transactions

coupons (1) -----> (N) coupon_usage

addresses (1) <---- (N) orders
payment_methods (1) <---- (N) orders
```

---

## SQL Constraints Summary

1. **NOT NULL Constraints**: Applied to mandatory fields
2. **UNIQUE Constraints**: Applied to email, mobile, order numbers, coupon codes
3. **PRIMARY KEY Constraints**: UUID or ID fields
4. **FOREIGN KEY Constraints**: All cross-table relationships
5. **CHECK Constraints**: For ENUMs and field validations
6. **DEFAULT VALUES**: Applied for timestamps, booleans, and numeric fields

---

## Performance Optimization Recommendations

1. **Indexing Strategy:**
   - Create indexes on frequently searched columns
   - Use composite indexes for common filter combinations
   - Use full-text indexes for product search
   - Use spatial indexes for location-based queries

2. **Partitioning:**
   - Partition large tables (orders, order_items) by date ranges
   - Partition wallet_transactions by year

3. **Caching:**
   - Cache categories and subcategories
   - Cache frequently accessed products
   - Cache user profile information

4. **Query Optimization:**
   - Use appropriate data types to minimize storage
   - Avoid N+1 queries with proper JOIN operations
   - Use pagination for large result sets

---

## Migration Notes

- Implement migrations in order of table dependencies
- Create all PRIMARY KEY and UNIQUE constraint indexes first
- Create FOREIGN KEY constraints after parent tables exist
- Test data integrity constraints before deployment

