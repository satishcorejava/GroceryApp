# GroceryCart Application - PostgreSQL Quick Start Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- 8GB RAM available
- 20GB free disk space

### Step 1: Clone/Setup Repository
```bash
cd /path/to/GroceryApp
```

### Step 2: Create Environment File
```bash
cp .env.example .env
# Edit .env with your desired configuration
```

### Step 3: Start Services
```bash
# Start PostgreSQL, pgAdmin, and Redis
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f postgres
```

### Step 4: Verify Database Connection
```bash
# Check PostgreSQL is running
docker-compose exec postgres psql -U postgres -d groceryapp -c "SELECT version();"

# List tables
docker-compose exec postgres psql -U postgres -d groceryapp -c "\dt"

# Count products
docker-compose exec postgres psql -U postgres -d groceryapp -c "SELECT COUNT(*) FROM products;"
```

### Step 5: Access pgAdmin
- URL: http://localhost:5050
- Email: admin@groceryapp.com
- Password: admin_password_123

### Step 6: Connect to Database in Application

Update your application connection string:
```
postgresql://postgres:postgres_password_123@localhost:5432/groceryapp
```

## Manual PostgreSQL Setup (Without Docker)

### On Linux/Mac
```bash
# Install PostgreSQL
brew install postgresql@15

# Start service
brew services start postgresql@15

# Create database and user
psql -U postgres << EOF
CREATE DATABASE groceryapp WITH ENCODING 'UTF8';
CREATE USER grocery_app WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE groceryapp TO grocery_app;
\q
EOF

# Load schema
psql -U postgres -d groceryapp -f POSTGRESQL_SCHEMA.sql

# Verify
psql -U postgres -d groceryapp -c "SELECT COUNT(*) FROM categories;"
```

### On Windows
```powershell
# Using Windows Subsystem for Linux (WSL)
wsl
sudo apt-get install postgresql postgresql-contrib

# Or use PostgreSQL installer from postgresql.org

# Connect and setup
psql -U postgres
CREATE DATABASE groceryapp WITH ENCODING 'UTF8';
CREATE USER grocery_app WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE groceryapp TO grocery_app;
\q

# Load schema
psql -U postgres -d groceryapp -f POSTGRESQL_SCHEMA.sql
```

## Docker Commands Cheatsheet

### Container Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart postgres

# View logs
docker-compose logs -f postgres

# Execute command
docker-compose exec postgres psql -U postgres -d groceryapp -c "SELECT NOW();"
```

### Database Operations
```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d groceryapp

# Backup database
docker-compose exec postgres pg_dump -U postgres groceryapp > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres groceryapp < backup.sql

# Check database size
docker-compose exec postgres psql -U postgres -d groceryapp -c "SELECT pg_size_pretty(pg_database_size('groceryapp'));"
```

### View Management
```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Connecting from Node.js Application

### Install Dependencies
```bash
npm install pg dotenv
```

### Connection Code
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Connection error:', err);
  else console.log('Connected! Time:', res.rows[0]);
});

module.exports = pool;
```

### Environment Variables
```bash
# .env file
DATABASE_URL=postgresql://postgres:postgres_password_123@localhost:5432/groceryapp
NODE_ENV=development
```

## Connecting from React/Frontend

The frontend communicates with the backend API, not directly with PostgreSQL. Use your backend's REST or GraphQL API endpoints.

## Common Issues & Solutions

### Issue: "connection refused"
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Issue: "database does not exist"
```bash
# Create database
docker-compose exec postgres createdb -U postgres groceryapp

# Load schema
docker-compose exec postgres psql -U postgres -d groceryapp -f POSTGRESQL_SCHEMA.sql
```

### Issue: "permission denied"
```bash
# Check user permissions
docker-compose exec postgres psql -U postgres -c "\du"

# Re-grant permissions
docker-compose exec postgres psql -U postgres << EOF
GRANT ALL PRIVILEGES ON DATABASE groceryapp TO grocery_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO grocery_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO grocery_app;
\q
EOF
```

### Issue: "disk space full"
```bash
# Check volume usage
docker system df

# Clean old containers and volumes
docker-compose down -v
docker system prune -a

# Restart
docker-compose up -d
```

## Performance Monitor

```bash
# View live database stats
docker-compose exec postgres psql -U postgres -d groceryapp << EOF
SELECT 
  datname,
  usename,
  count(*) as connections
FROM pg_stat_activity
GROUP BY datname, usename;
\q
EOF
```

## Backup Strategy

### Automatic Backups
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump \
  -U postgres groceryapp | \
  gzip > $BACKUP_DIR/groceryapp_${DATE}.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "groceryapp_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/groceryapp_${DATE}.sql.gz"
```

Schedule with cron:
```bash
chmod +x backup.sh
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

## Production Deployment

### Pre-deployment Checklist
- [ ] Use environment-specific .env file
- [ ] Set strong passwords for all users
- [ ] Enable SSL/TLS connections
- [ ] Configure automated backups
- [ ] Set up monitoring and alerts
- [ ] Test disaster recovery procedures
- [ ] Document all configurations
- [ ] Set resource limits appropriately

### Production Docker Compose
```yaml
# Use production-optimized settings in docker-compose.yml
# Increase memory limits
# Enable persistent backups
# Configure external logging
# Set up health checks
```

## Monitoring & Maintenance

### Check Status
```bash
# Service health
docker-compose exec postgres pg_isready -U postgres

# Database size
docker-compose exec postgres psql -U postgres -d groceryapp -c "SELECT pg_size_pretty(pg_database_size('groceryapp'));"

# Table sizes
docker-compose exec postgres psql -U postgres -d groceryapp -c "
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### Maintenance
```bash
# Analyze and optimize
docker-compose exec postgres psql -U postgres -d groceryapp -c "VACUUM ANALYZE;"

# Check for unused indexes
docker-compose exec postgres psql -U postgres -d groceryapp -c "
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;"
```

## Support & Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/15/
- **Docker Docs**: https://docs.docker.com/
- **pgAdmin**: http://localhost:5050
- **Application Logs**: `docker-compose logs -f`

## Next Steps

1. Load sample data: `docker-compose exec postgres psql -U postgres -d groceryapp -f POSTGRESQL_UTILITIES.sql`
2. Verify data: `docker-compose exec postgres psql -U postgres -d groceryapp -c "SELECT COUNT(*) FROM products;"`
3. Connect your application
4. Run migrations/updates as needed
5. Set up automated backups
6. Monitor performance
7. Plan scaling strategy

---

**Created**: February 2026
**PostgreSQL Version**: 15+
**License**: MIT
