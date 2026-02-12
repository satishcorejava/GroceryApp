-- ============================================================================
-- GroceryCart Application - Subscription Feature Schema
-- Created: February 11, 2026
-- ============================================================================

-- ============================================================================
-- ENUM TYPES FOR SUBSCRIPTIONS
-- ============================================================================

CREATE TYPE subscription_frequency AS ENUM (
    'daily',
    'alternate_days',
    'weekly',
    'bi_weekly',
    'monthly'
);

CREATE TYPE subscription_status AS ENUM (
    'active',
    'paused',
    'cancelled',
    'expired'
);

CREATE TYPE subscription_delivery_status AS ENUM (
    'scheduled',
    'processing',
    'out_for_delivery',
    'delivered',
    'skipped',
    'failed'
);

-- ============================================================================
-- TABLE: subscriptions
-- Main table storing user product subscriptions
-- ============================================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    
    -- Subscription configuration
    frequency subscription_frequency NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    
    -- Pricing (locked at subscription time for price protection)
    unit_price DECIMAL(10,2) NOT NULL,
    subscription_discount DECIMAL(5,2) DEFAULT 5.00, -- 5% subscription discount
    
    -- Scheduling
    start_date DATE NOT NULL,
    next_delivery_date DATE NOT NULL,
    last_delivery_date DATE,
    
    -- Delivery preferences
    preferred_time_slot VARCHAR(50), -- e.g., "morning", "afternoon", "evening"
    delivery_address_id UUID,
    delivery_instructions TEXT,
    
    -- Status tracking
    status subscription_status NOT NULL DEFAULT 'active',
    paused_at TIMESTAMP,
    paused_until DATE,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Statistics
    total_deliveries INT DEFAULT 0,
    total_amount_saved DECIMAL(10,2) DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_subscriptions_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_address_id 
        FOREIGN KEY (delivery_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    
    -- Unique constraint: one active subscription per user per product
    CONSTRAINT unique_active_subscription 
        UNIQUE (user_id, product_id) 
        DEFERRABLE INITIALLY DEFERRED
);

-- Indexes for subscriptions table
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);
CREATE INDEX idx_subscriptions_frequency ON subscriptions(frequency);

-- ============================================================================
-- TABLE: subscription_deliveries
-- Tracks individual delivery instances for each subscription
-- ============================================================================
CREATE TABLE subscription_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    order_id UUID, -- Link to orders table when order is created
    
    -- Delivery details
    scheduled_date DATE NOT NULL,
    actual_delivery_date TIMESTAMP,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_applied DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status subscription_delivery_status NOT NULL DEFAULT 'scheduled',
    skip_reason TEXT, -- If user skips a delivery
    failure_reason TEXT, -- If delivery fails
    
    -- Tracking
    tracking_id VARCHAR(100),
    delivery_agent_id UUID,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_sub_deliveries_subscription_id 
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_deliveries_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    CONSTRAINT fk_sub_deliveries_agent_id 
        FOREIGN KEY (delivery_agent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for subscription_deliveries table
CREATE INDEX idx_sub_deliveries_subscription_id ON subscription_deliveries(subscription_id);
CREATE INDEX idx_sub_deliveries_scheduled_date ON subscription_deliveries(scheduled_date);
CREATE INDEX idx_sub_deliveries_status ON subscription_deliveries(status);
CREATE INDEX idx_sub_deliveries_order_id ON subscription_deliveries(order_id);

-- ============================================================================
-- TABLE: subscription_history
-- Audit log for subscription changes
-- ============================================================================
CREATE TABLE subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    -- Change details
    action VARCHAR(50) NOT NULL, -- 'created', 'paused', 'resumed', 'cancelled', 'modified'
    old_values JSONB, -- Previous state before change
    new_values JSONB, -- New state after change
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sub_history_subscription_id 
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_history_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sub_history_subscription_id ON subscription_history(subscription_id);
CREATE INDEX idx_sub_history_user_id ON subscription_history(user_id);
CREATE INDEX idx_sub_history_action ON subscription_history(action);
CREATE INDEX idx_sub_history_created_at ON subscription_history(created_at);

-- ============================================================================
-- TABLE: subscription_skip_calendar
-- Allows users to skip specific delivery dates in advance
-- ============================================================================
CREATE TABLE subscription_skip_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    skip_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_skip_calendar_subscription_id 
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    
    -- Unique: can't skip same date twice
    CONSTRAINT unique_subscription_skip_date 
        UNIQUE (subscription_id, skip_date)
);

CREATE INDEX idx_skip_calendar_subscription_id ON subscription_skip_calendar(subscription_id);
CREATE INDEX idx_skip_calendar_skip_date ON subscription_skip_calendar(skip_date);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate next delivery date based on frequency
CREATE OR REPLACE FUNCTION calculate_next_delivery_date(
    p_frequency subscription_frequency,
    p_from_date DATE DEFAULT CURRENT_DATE
) RETURNS DATE AS $$
BEGIN
    CASE p_frequency
        WHEN 'daily' THEN
            RETURN p_from_date + INTERVAL '1 day';
        WHEN 'alternate_days' THEN
            RETURN p_from_date + INTERVAL '2 days';
        WHEN 'weekly' THEN
            RETURN p_from_date + INTERVAL '7 days';
        WHEN 'bi_weekly' THEN
            RETURN p_from_date + INTERVAL '14 days';
        WHEN 'monthly' THEN
            RETURN p_from_date + INTERVAL '1 month';
        ELSE
            RETURN p_from_date + INTERVAL '7 days';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscription statistics after delivery
CREATE OR REPLACE FUNCTION update_subscription_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE subscriptions
        SET 
            total_deliveries = total_deliveries + 1,
            total_amount_saved = total_amount_saved + NEW.discount_applied,
            last_delivery_date = NEW.actual_delivery_date::DATE,
            next_delivery_date = calculate_next_delivery_date(
                (SELECT frequency FROM subscriptions WHERE id = NEW.subscription_id)
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.subscription_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update subscription stats on delivery completion
CREATE TRIGGER trg_update_subscription_stats
    AFTER UPDATE ON subscription_deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_stats();

-- Function to auto-create next scheduled delivery
CREATE OR REPLACE FUNCTION create_next_scheduled_delivery()
RETURNS TRIGGER AS $$
DECLARE
    v_subscription RECORD;
    v_next_date DATE;
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        SELECT * INTO v_subscription 
        FROM subscriptions 
        WHERE id = NEW.subscription_id AND status = 'active';
        
        IF FOUND THEN
            v_next_date := calculate_next_delivery_date(v_subscription.frequency);
            
            -- Check if date is not in skip calendar
            IF NOT EXISTS (
                SELECT 1 FROM subscription_skip_calendar 
                WHERE subscription_id = NEW.subscription_id 
                AND skip_date = v_next_date
            ) THEN
                INSERT INTO subscription_deliveries (
                    subscription_id,
                    scheduled_date,
                    quantity,
                    unit_price,
                    discount_applied,
                    total_amount,
                    status
                ) VALUES (
                    NEW.subscription_id,
                    v_next_date,
                    v_subscription.quantity,
                    v_subscription.unit_price,
                    v_subscription.unit_price * v_subscription.quantity * (v_subscription.subscription_discount / 100),
                    v_subscription.unit_price * v_subscription.quantity * (1 - v_subscription.subscription_discount / 100),
                    'scheduled'
                );
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create next delivery
CREATE TRIGGER trg_create_next_delivery
    AFTER UPDATE ON subscription_deliveries
    FOR EACH ROW
    EXECUTE FUNCTION create_next_scheduled_delivery();

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

-- Procedure: Create a new subscription
CREATE OR REPLACE PROCEDURE create_subscription(
    p_user_id UUID,
    p_product_id UUID,
    p_frequency subscription_frequency,
    p_quantity INT,
    p_start_date DATE,
    p_address_id UUID DEFAULT NULL,
    p_time_slot VARCHAR(50) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_product_price DECIMAL(10,2);
    v_subscription_id UUID;
    v_next_date DATE;
    v_discount DECIMAL(5,2) := 5.00;
BEGIN
    -- Get product price
    SELECT price INTO v_product_price 
    FROM products 
    WHERE id = p_product_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found or inactive';
    END IF;
    
    -- Calculate next delivery date
    v_next_date := calculate_next_delivery_date(p_frequency, p_start_date);
    
    -- Insert subscription
    INSERT INTO subscriptions (
        user_id, product_id, frequency, quantity,
        unit_price, subscription_discount,
        start_date, next_delivery_date,
        delivery_address_id, preferred_time_slot,
        status
    ) VALUES (
        p_user_id, p_product_id, p_frequency, p_quantity,
        v_product_price, v_discount,
        p_start_date, v_next_date,
        p_address_id, p_time_slot,
        'active'
    ) RETURNING id INTO v_subscription_id;
    
    -- Create first scheduled delivery
    INSERT INTO subscription_deliveries (
        subscription_id, scheduled_date, quantity,
        unit_price, discount_applied, total_amount, status
    ) VALUES (
        v_subscription_id, p_start_date, p_quantity,
        v_product_price, 
        v_product_price * p_quantity * (v_discount / 100),
        v_product_price * p_quantity * (1 - v_discount / 100),
        'scheduled'
    );
    
    -- Log history
    INSERT INTO subscription_history (
        subscription_id, user_id, action, new_values
    ) VALUES (
        v_subscription_id, p_user_id, 'created',
        jsonb_build_object(
            'product_id', p_product_id,
            'frequency', p_frequency,
            'quantity', p_quantity,
            'start_date', p_start_date
        )
    );
    
    RAISE NOTICE 'Subscription created with ID: %', v_subscription_id;
END;
$$;

-- Procedure: Pause a subscription
CREATE OR REPLACE PROCEDURE pause_subscription(
    p_subscription_id UUID,
    p_user_id UUID,
    p_pause_until DATE DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_old_values JSONB;
BEGIN
    -- Get current state
    SELECT jsonb_build_object('status', status) INTO v_old_values
    FROM subscriptions
    WHERE id = p_subscription_id AND user_id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Subscription not found';
    END IF;
    
    -- Update subscription
    UPDATE subscriptions
    SET 
        status = 'paused',
        paused_at = CURRENT_TIMESTAMP,
        paused_until = p_pause_until,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_subscription_id AND user_id = p_user_id;
    
    -- Cancel any pending deliveries
    UPDATE subscription_deliveries
    SET status = 'skipped', skip_reason = 'Subscription paused'
    WHERE subscription_id = p_subscription_id 
    AND status = 'scheduled';
    
    -- Log history
    INSERT INTO subscription_history (
        subscription_id, user_id, action, old_values, new_values
    ) VALUES (
        p_subscription_id, p_user_id, 'paused',
        v_old_values,
        jsonb_build_object('status', 'paused', 'paused_until', p_pause_until)
    );
END;
$$;

-- Procedure: Resume a subscription
CREATE OR REPLACE PROCEDURE resume_subscription(
    p_subscription_id UUID,
    p_user_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_subscription RECORD;
    v_next_date DATE;
BEGIN
    SELECT * INTO v_subscription
    FROM subscriptions
    WHERE id = p_subscription_id AND user_id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Subscription not found';
    END IF;
    
    v_next_date := calculate_next_delivery_date(v_subscription.frequency);
    
    -- Update subscription
    UPDATE subscriptions
    SET 
        status = 'active',
        paused_at = NULL,
        paused_until = NULL,
        next_delivery_date = v_next_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_subscription_id;
    
    -- Create new scheduled delivery
    INSERT INTO subscription_deliveries (
        subscription_id, scheduled_date, quantity,
        unit_price, discount_applied, total_amount, status
    ) VALUES (
        p_subscription_id, v_next_date, v_subscription.quantity,
        v_subscription.unit_price,
        v_subscription.unit_price * v_subscription.quantity * (v_subscription.subscription_discount / 100),
        v_subscription.unit_price * v_subscription.quantity * (1 - v_subscription.subscription_discount / 100),
        'scheduled'
    );
    
    -- Log history
    INSERT INTO subscription_history (
        subscription_id, user_id, action, old_values, new_values
    ) VALUES (
        p_subscription_id, p_user_id, 'resumed',
        jsonb_build_object('status', 'paused'),
        jsonb_build_object('status', 'active', 'next_delivery_date', v_next_date)
    );
END;
$$;

-- Procedure: Cancel a subscription
CREATE OR REPLACE PROCEDURE cancel_subscription(
    p_subscription_id UUID,
    p_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE subscriptions
    SET 
        status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        cancellation_reason = p_reason,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_subscription_id AND user_id = p_user_id;
    
    -- Cancel pending deliveries
    UPDATE subscription_deliveries
    SET status = 'skipped', skip_reason = 'Subscription cancelled'
    WHERE subscription_id = p_subscription_id 
    AND status = 'scheduled';
    
    -- Log history
    INSERT INTO subscription_history (
        subscription_id, user_id, action, new_values
    ) VALUES (
        p_subscription_id, p_user_id, 'cancelled',
        jsonb_build_object('reason', p_reason)
    );
END;
$$;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: User subscription summary
CREATE OR REPLACE VIEW v_user_subscription_summary AS
SELECT 
    s.user_id,
    COUNT(*) FILTER (WHERE s.status = 'active') as active_subscriptions,
    COUNT(*) FILTER (WHERE s.status = 'paused') as paused_subscriptions,
    SUM(s.total_amount_saved) as total_savings,
    SUM(s.total_deliveries) as total_deliveries,
    MIN(s.next_delivery_date) FILTER (WHERE s.status = 'active') as next_delivery
FROM subscriptions s
GROUP BY s.user_id;

-- View: Subscription details with product info
CREATE OR REPLACE VIEW v_subscription_details AS
SELECT 
    s.id as subscription_id,
    s.user_id,
    s.product_id,
    p.name as product_name,
    p.image as product_image,
    p.unit as product_unit,
    s.frequency,
    s.quantity,
    s.unit_price,
    s.subscription_discount,
    s.unit_price * s.quantity as line_total,
    s.unit_price * s.quantity * (1 - s.subscription_discount / 100) as discounted_total,
    s.start_date,
    s.next_delivery_date,
    s.status,
    s.total_deliveries,
    s.total_amount_saved,
    s.created_at
FROM subscriptions s
JOIN products p ON p.id = s.product_id;

-- View: Upcoming deliveries (for admin/delivery management)
CREATE OR REPLACE VIEW v_upcoming_deliveries AS
SELECT 
    sd.id as delivery_id,
    sd.subscription_id,
    sd.scheduled_date,
    sd.quantity,
    sd.total_amount,
    s.user_id,
    u.name as customer_name,
    u.mobile as customer_phone,
    p.name as product_name,
    a.street as delivery_street,
    a.city as delivery_city,
    a.state as delivery_state,
    a.pincode as delivery_pincode,
    s.preferred_time_slot
FROM subscription_deliveries sd
JOIN subscriptions s ON s.id = sd.subscription_id
JOIN users u ON u.id = s.user_id
JOIN products p ON p.id = s.product_id
LEFT JOIN addresses a ON a.id = s.delivery_address_id
WHERE sd.status = 'scheduled'
AND sd.scheduled_date <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY sd.scheduled_date, s.preferred_time_slot;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Note: Run this only after users and products are created
-- Example: Create a sample subscription
-- CALL create_subscription(
--     'user-uuid-here',
--     'product-uuid-here',
--     'daily',
--     2,
--     CURRENT_DATE + INTERVAL '1 day',
--     'address-uuid-here',
--     'morning'
-- );

-- ============================================================================
-- CRON JOB QUERIES (for scheduled tasks)
-- ============================================================================

-- Query: Get subscriptions due for delivery today
-- SELECT * FROM v_upcoming_deliveries WHERE scheduled_date = CURRENT_DATE;

-- Query: Auto-expire paused subscriptions (if paused > 30 days)
-- UPDATE subscriptions 
-- SET status = 'expired', updated_at = CURRENT_TIMESTAMP
-- WHERE status = 'paused' 
-- AND paused_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Query: Get subscriptions with no upcoming deliveries (needs regeneration)
-- SELECT s.* FROM subscriptions s
-- WHERE s.status = 'active'
-- AND NOT EXISTS (
--     SELECT 1 FROM subscription_deliveries sd 
--     WHERE sd.subscription_id = s.id AND sd.status = 'scheduled'
-- );

-- ============================================================================
-- END OF SUBSCRIPTION SCHEMA
-- ============================================================================
