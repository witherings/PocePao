# Production Deployment Guide - PokePao Database Migration

## Overview
This document provides step-by-step instructions for deploying PokePao to production after the complete database migration.

## Pre-Deployment Checklist

### ✅ Development Environment Verification
- [x] All 42 menu items migrated to PostgreSQL
- [x] All 97 ingredients migrated (including 44 extras)
- [x] All 6 categories migrated
- [x] All 29 product variants migrated
- [x] Admin panel CRUD operations working via API
- [x] Wunsch Bowl calculator reads from database
- [x] Image paths normalized in `/media/` structure
- [x] Server health check passing (`/api/health`)
- [x] No hardcoded data in frontend components

## Deployment Steps

### 1. Deploy to Railway.app

```bash
# 1. Push code to repository
git add .
git commit -m "Migration complete: hardcoded data → PostgreSQL"
git push origin main

# 2. Railway detects changes and auto-deploys
# (or manually trigger deployment in Railway dashboard)

# 3. Railway will:
#    - Install dependencies
#    - Run build process
#    - Start server on PORT 5000
```

### 2. Database Initialization on Railway

Railway will automatically:
1. Create PostgreSQL database from connection string
2. Run initialization script (if configured in Procfile or deployment config)

**Manual initialization (if needed):**
```bash
# SSH into Railway container
railway shell

# Run migration script
npx tsx server/migrate-hardcoded-data.ts

# Verify database
psql $DATABASE_URL -c "SELECT COUNT(*) as items FROM menu_items;"
```

### 3. Health Check

```bash
# Verify deployment
curl https://pokepao-production.railway.app/api/health

# Expected response:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": "2025-11-22T10:09:50.639Z"
# }
```

### 4. Admin Panel Login

```
URL: https://pokepao-production.railway.app/admin
Username: admin
Password: (auto-generated, check Railway logs or reset via /api/admin/reset-password)
```

## Post-Deployment Verification

### ✅ Frontend Tests
- [ ] Homepage loads menu items from API (no hardcoded data)
- [ ] Wunsch Bowl constructor works and calculates prices correctly
- [ ] Admin panel loads and displays all menu items, categories, ingredients
- [ ] Image paths resolve correctly (serve from `/media/` CDN)

### ✅ Database Tests
```sql
-- Count items
SELECT COUNT(*) FROM menu_items;  -- Should be 42

-- Count ingredients
SELECT COUNT(*) FROM ingredients;  -- Should be 97

-- Check extra ingredients
SELECT COUNT(*) FROM ingredients WHERE type LIKE 'extra%';  -- Should be 44

-- Verify Wunsch Bowl prices
SELECT name, priceSmall, priceStandard FROM ingredients 
WHERE type = 'protein' LIMIT 5;
```

### ✅ Admin Panel Tests
1. Create new menu item via admin
2. Upload image for menu item
3. Edit category
4. Delete ingredient
5. Verify changes appear on frontend

### ✅ Wunsch Bowl Tests
1. Load custom bowl page
2. Select different proteins (verify prices update)
3. Add extras
4. Verify total price calculation is correct

## Environment Variables

Required in Railway:
```
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
TELEGRAM_BOT_TOKEN=xxx (optional)
TELEGRAM_CHAT_ID=xxx (optional)
```

## Rollback Plan

If issues occur:

### 1. Code Rollback
```bash
git revert <commit-hash>
git push origin main
# Railway auto-deploys the reverted code
```

### 2. Database Rollback
```bash
# Railway provides automatic daily backups
# Access backups via Railway dashboard:
# 1. Go to Postgres addon
# 2. Click "Backups" tab
# 3. Select date and restore
```

### 3. Hardcoded Data Fallback
If database fails, the system will:
1. Return error on API calls
2. Frontend will show cached data or error message
3. Admin panel will show "Database connection error"

**Recovery:**
- Ensure `DATABASE_URL` is correct
- Check Postgres addon status in Railway
- Verify connection permissions

## Monitoring

### Production Health Checks
```bash
# Monitor health endpoint
while true; do
  curl https://pokepao-production.railway.app/api/health
  sleep 60
done
```

### Log Monitoring
In Railway dashboard:
1. Go to Deployment logs
2. Filter by ERROR level
3. Set up alerts for critical errors

### Database Monitoring
In Railway dashboard:
1. Postgres addon → Metrics
2. Monitor CPU, memory, connections
3. Check query performance

## Common Issues & Solutions

### Issue: "Database connection refused"
**Solution:**
1. Check `DATABASE_URL` environment variable
2. Verify Postgres addon is running in Railway
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Issue: "Menu items not showing"
**Solution:**
1. Run migration script: `npx tsx server/migrate-hardcoded-data.ts`
2. Verify data: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM menu_items"`
3. Clear browser cache and refresh

### Issue: "Image paths broken (404)"
**Solution:**
1. Verify files exist in `/public/media/`
2. Check image paths in database: `SELECT DISTINCT image FROM menu_items`
3. Ensure web server serves `/public/` directory

### Issue: "Admin panel won't load"
**Solution:**
1. Check authentication: `curl https://pokepao-production.railway.app/api/health`
2. Check admin user exists: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM users"`
3. Reset admin password: `npx tsx server/reset-admin-password.ts`

## Performance Optimization

### 1. Enable Database Connection Pooling
```typescript
// Already configured in server/db.ts
// Uses node-postgres connection pooling
```

### 2. Enable CDN for Images
```
Configure Railway CDN or Cloudflare:
1. Set Cache-Control headers on /media/ routes
2. TTL: 7 days for images
3. Always revalidate on admin updates
```

### 3. Optimize API Responses
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Monitor slow queries

## Maintenance

### Daily Tasks
- Monitor error logs
- Check database backup completion
- Verify health endpoint

### Weekly Tasks
- Review slow query logs
- Check disk usage
- Verify image CDN performance

### Monthly Tasks
- Database cleanup (remove old sessions)
- Update dependencies
- Review and optimize queries

## Success Criteria

✅ Deployment is successful when:
1. `/api/health` returns `{"status":"healthy","database":"connected"}`
2. Menu items load on frontend (no hardcoded data visible)
3. Admin panel loads with full CRUD functionality
4. All images display correctly
5. Wunsch Bowl calculator works with DB prices
6. No errors in production logs

## Support

For deployment issues:
1. Check Railway documentation: https://docs.railway.app
2. Review server logs: `railway logs`
3. Test locally first: `npm run dev`
4. Contact database provider for connectivity issues
