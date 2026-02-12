# PostgreSQL Database Setup Guide for GroceryCart Application

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Creation](#database-creation)
4. [Schema Initialization](#schema-initialization)
5. [User Setup](#user-setup)
6. [Connection Testing](#connection-testing)
7. [Backup and Recovery](#backup-and-recovery)
8. [Performance Tuning](#performance-tuning)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- PostgreSQL 12.0 or higher
- 2GB RAM minimum (4GB recommended)
- 10GB free disk space minimum
- Ubuntu/Debian, macOS, or Windows

### Tools Required
- `psql` command-line client
- `pg_dump` and `pg_restore` utilities
- Node.js (for application)

---

## Installation

### On Ubuntu/Debian

```bash
# Update package manager
sudo apt update
sudo apt upgrade

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### On macOS (using Homebrew)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### On Windows

1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the on-screen instructions
3. Remember the superuser (postgres) password
4. Choose port 5432 (default)
5. Verify installation:
   ```cmd
   psql --version
   ```

---

## Database Creation

### Method 1: Using psql Command Line

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Inside psql prompt, create database
CREATE DATABASE groceryapp
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0;

# Verify database creation
\l

# Exit psql
\q
```

### Method 2: Using createdb Command

```bash
# As superuser
sudo -u postgres createdb -E UTF8 groceryapp

# Verify
sudo -u postgres psql -l
```

### Method 3: Using Connection String

```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/groceryapp"
psql $DATABASE_URL -c "\l"
```

---

## Schema Initialization

### Step 1: Connect to Database

```bash
psql -U postgres -d groceryapp -h localhost
```

Or use the connection string:

```bash
psql "postgresql://postgres:password@localhost:5432/groceryapp"
```

### Step 2: Execute Schema SQL Script

```bash
# From command line
psql -U postgres -d groceryapp -h localhost -f POSTGRESQL_SCHEMA.sql

# From inside psql
\i /path/to/POSTGRESQL_SCHEMA.sql
```

### Step 3: Verify Table Creation

```sql
-- List all tables
\dt

-- Count tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';

-- List specific table structure
\d products

-- List all indexes
\di

-- List views
\dv

-- List functions
\df
```

### Step 4: Load Sample Data

```bash
psql -U postgres -d groceryapp -h localhost -f POSTGRESQL_UTILITIES.sql
```

Or run the INSERT statements directly in psql.

### Step 5: Verify Data

```sql
-- Check products count
SELECT COUNT(*) FROM products;

-- Check categories
SELECT * FROM categories;

-- Check order summary view
SELECT * FROM order_summary;
```

---

## User Setup

### Create Application User

```sql
-- Connect as superuser first
psql -U postgres -d groceryapp

-- Create application user
CREATE USER grocery_app WITH PASSWORD 'secure_password_123';

-- Grant necessary permissions
GRANT CONNECT ON DATABASE groceryapp TO grocery_app;
GRANT USAGE ON SCHEMA public TO grocery_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO grocery_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO grocery_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO grocery_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO grocery_app;
```

### Create Read-Only User

```sql
CREATE USER grocery_readonly WITH PASSWORD 'readonly_password_123';
GRANT CONNECT ON DATABASE groceryapp TO grocery_readonly;
GRANT USAGE ON SCHEMA public TO grocery_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO grocery_readonly;
```

### Verify User Permissions

```sql
-- List all users
\du

-- Check specific user privileges
SELECT grantee, privilege_type 
FROM role_table_grants 
WHERE table_name = 'products';
```

---

## Connection Testing

### Test Connection with psql

```bash
# Test as superuser
psql -U postgres -d groceryapp -h localhost -c "SELECT version();"

# Test as application user
psql -U grocery_app -d groceryapp -h localhost -c "SELECT COUNT(*) FROM products;"

# Test as readonly user
psql -U grocery_readonly -d groceryapp -h localhost -c "SELECT COUNT(*) FROM products;"
```

### Connection String for Application

Use this connection string in your application:

```
postgresql://grocery_app:secure_password_123@localhost:5432/groceryapp
```

Or with environment variable:

```bash
export DATABASE_URL="postgresql://grocery_app:secure_password_123@localhost:5432/groceryapp"
```

### Test from Node.js Application

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected! Current time:', res.rows[0]);
  }
  pool.end();
});
```

---

## Backup and Recovery

### Full Database Backup

```bash
# Using pg_dump (SQL format)
pg_dump -U postgres -h localhost -d groceryapp -f groceryapp_backup.sql

# Using pg_dump (Custom format - more flexible)
pg_dump -U postgres -h localhost -d groceryapp -F c -b -v -f groceryapp_backup.dump

# Using pg_dump (Compressed)
pg_dump -U postgres -h localhost -d groceryapp -F c -Z 9 -f groceryapp_backup.dump
```

### Backup Specific Tables

```bash
# Backup single table
pg_dump -U postgres -h localhost -d groceryapp -t products -f products_backup.sql

# Backup multiple tables
pg_dump -U postgres -h localhost -d groceryapp -t products -t orders -t users -f multi_table_backup.sql

# Backup schema only (no data)
pg_dump -U postgres -h localhost -d groceryapp -s -f schema_only.sql
```

### Restore from Backup

```bash
# From SQL file
psql -U postgres -d groceryapp -f groceryapp_backup.sql

# From custom dump file
pg_restore -U postgres -h localhost -d groceryapp -v groceryapp_backup.dump

# Restore with verbose output
pg_restore -U postgres -h localhost -d groceryapp -v --single-transaction groceryapp_backup.dump
```

### Automated Backup Script

```bash
#!/bin/bash
# backup_postgres.sh

BACKUP_DIR="/backups/postgres"
DATABASE="groceryapp"
USER="postgres"
HOST="localhost"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DATABASE}_${DATE}.dump"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $USER -h $HOST -d $DATABASE -F c -Z 9 -f $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "${DATABASE}_*.dump" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

Make it executable and schedule with cron:
```bash
chmod +x backup_postgres.sh
# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup_postgres.sh
```

---

## Performance Tuning

### PostgreSQL Configuration

Edit `/etc/postgresql/{version}/main/postgresql.conf`:

```conf
# Memory settings
shared_buffers = 256MB          # 25% of RAM, min 128MB
effective_cache_size = 1GB      # 50-75% of RAM
work_mem = 4MB                  # shared_buffers / max_connections

# Connection settings
max_connections = 200
max_parallel_workers = 4

# Logging
log_min_duration_statement = 1000  # Log queries > 1 second
log_connections = on
log_disconnections = on

# Update statistics
autovacuum = on
autovacuum_naptime = 10s
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
```

After changes, restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Index Optimization

```sql
-- Creating composite indexes for common queries
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX idx_cart_items_cart_product ON cart_items(cart_id, product_id);

-- Partial index for active products
CREATE INDEX idx_active_products ON products(id) WHERE is_active = true;

-- BRIN index for time-series data
CREATE INDEX idx_orders_created_brin ON orders 
USING BRIN (created_at);
```

### Query Analysis

```sql
-- Enable query analysis
EXPLAIN ANALYZE 
SELECT * FROM products LIMIT 10;

-- Use EXPLAIN ANALYZE with query visualization
\x on
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT * FROM products WHERE category_id = 'vegetables';
```

### Vacuum and Analyze

```bash
# Manual vacuum
psql -U postgres -d groceryapp -c "VACUUM ANALYZE;"

# Analyze specific table
psql -U postgres -d groceryapp -c "ANALYZE products;"

# Reindex all
psql -U postgres -d groceryapp -c "REINDEX DATABASE groceryapp;"
```

---

## Troubleshooting

### Connection Issues

#### Problem: "could not connect to server"

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### Problem: "FATAL: password authentication failed"

```bash
# Reset password for postgres user
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'new_password';"

# Update connection string with new password
postgresql://postgres:new_password@localhost:5432/groceryapp
```

### Permission Issues

#### Problem: "permission denied for schema public"

```sql
-- As superuser
GRANT USAGE ON SCHEMA public TO grocery_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO grocery_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO grocery_app;
```

#### Problem: "Cannot execute INSERT/UPDATE/DELETE as readonly user"

```sql
-- Recreate as admin user
CREATE USER grocery_app WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE groceryapp TO grocery_app;
```

### Performance Issues

#### Slow Queries

```sql
-- Find slow queries
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Clear query statistics
SELECT pg_stat_statements_reset();
```

#### High Disk Usage

```bash
# Check database size
psql -U postgres -d groceryapp -c "SELECT pg_size_pretty(pg_database_size('groceryapp'));"

# Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Data Issues

#### Check Data Integrity

```sql
-- Check for orphaned foreign keys
SELECT oi.* FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.id IS NULL;

-- Check for duplicate data
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

#### Fix Constraint Violations

```sql
-- Identify violated constraints
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';

-- Re-validate constraints
ALTER TABLE orders VALIDATE CONSTRAINT fk_orders_user_id;
```

### Replication/Cluster Setup

For production with high availability:

```bash
# Install replication tools
sudo apt install postgresql-contrib

# Configure primary server in postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB

# Configure standby server for streaming replication
standby_mode = 'on'
primary_conninfo = 'host=primary_host user=replication password=password'
```

---

## Environment Variables for Application

Create `.env` file in your application root:

```env
DATABASE_URL=postgresql://grocery_app:secure_password_123@localhost:5432/groceryapp
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20
DATABASE_TIMEOUT=2000
NODE_ENV=production
```

---

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d groceryapp

# Inside psql:
\l              # List databases
\dt             # List tables
\di             # List indexes
\dv             # List views
\df             # List functions
\dn             # List schemas
\du             # List users
\d table_name   # Describe table
\q              # Quit

# Backup
pg_dump -U postgres -d groceryapp > backup.sql

# Restore
psql -U postgres -d groceryapp < backup.sql

# Execute script
psql -U postgres -d groceryapp -f script.sql

# Command line execution
psql -U postgres -d groceryapp -c "SELECT COUNT(*) FROM users;"
```

---

## Production Checklist

- [ ] Set strong passwords for all database users
- [ ] Configure automated backups (daily)
- [ ] Enable SSL connections
- [ ] Configure firewall to restrict PostgreSQL access
- [ ] Monitor disk space and set alerts
- [ ] Enable query logging for slow queries
- [ ] Configure max_connections appropriately
- [ ] Set up replication for high availability
- [ ] Document backup and recovery procedures
- [ ] Test restore procedures regularly
- [ ] Monitor database performance metrics
- [ ] Plan for capacity growth

---

## Support and Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Performance Wiki](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [pgAdmin Web UI](https://www.pgadmin.org/)
- [DBeaver Database Tool](https://dbeaver.io/)

---

## Version History

- **v1.0** - Initial PostgreSQL setup guide (Feb 2026)
- Database version: PostgreSQL 12.0+
- Schema version: 001

