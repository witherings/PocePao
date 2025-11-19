# 🚂 Railway Deployment Guide for PokePao

## Overview

This guide walks you through deploying your PokePao restaurant website to Railway with automatic database initialization, migrations, seeding, and admin user creation.

---

## Key Features

✅ **Automatic Admin Creation** - Admin user is created automatically on first server start  
✅ **Safe Seeding** - Database seeding only runs if database is empty  
✅ **Auto-migrations** - Schema changes are applied automatically  
✅ **Snapshot Restore** - Rollback content changes with one click  
✅ **Live Editing** - Admin changes appear immediately on the website  

---

## Prerequisites

Before deploying, ensure you have:
1. A Railway account
2. Your GitHub repository ready
3. Railway CLI installed (optional, for local development)

---

## Step-by-Step Deployment

### Step 1: Create New Project on Railway

1. Go to [Railway.app](https://railway.app) and sign in
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your PokePao repository
5. Railway will automatically detect the Node.js project

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **New**
2. Select **Database** → **Add PostgreSQL**
3. Railway automatically provisions a PostgreSQL database
4. The `DATABASE_URL` environment variable is automatically set

### Step 3: Configure Environment Variables

Railway automatically sets `DATABASE_URL`. You only need to add:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NODE_ENV` | `production` | Production mode |
| `SESSION_SECRET` | `your-random-secret-here` | Session encryption key (generate a random string) |
| `ADMIN_PASSWORD` | `your-secure-password` | Initial admin password |

**Optional (defaults work fine):**
- `ADMIN_USERNAME` - Default: `admin`

### Step 4: Configure Build & Start Commands

Railway auto-detects these from `package.json`, but verify:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run db:push && npm run db:seed && npm run db:create-admin && npm start`

### Step 5: Deploy

1. Click **Deploy**
2. Wait for the build to complete (3-5 minutes)
3. Check the deployment logs for success messages
4. Railway provides a public URL (e.g., `https://your-app.up.railway.app`)

---

## Expected Deployment Logs

A successful deployment shows:

```
✅ npm run db:push - Database migrations applied
✅ npm run db:seed - Database seeded with categories and menu items
✅ npm run db:create-admin - Admin user created
✅ Server starting on port XXXX
```

---

## Accessing Your Website

Once deployed, your website is available at:
- **Public URL**: Your Railway-provided URL (check Deployments tab)
- **Admin Panel**: `https://your-url.railway.app/admin/login`
- **Custom Domain**: Configure in Railway Settings → Domains

### Admin Credentials

- **Username**: Value from `ADMIN_USERNAME` (default: `admin`)
- **Password**: Value from `ADMIN_PASSWORD` environment variable

### 🔒 Security Best Practices

1. **Use strong admin password** - Set via `ADMIN_PASSWORD` environment variable
2. **Keep SESSION_SECRET secure** - Use a long random string
3. **Enable 2FA on Railway account** - Protect your deployment access
4. **Regular backups** - Railway provides automatic database backups

---

## Common Issues & Solutions

### Issue: Database connection errors

**Solution**: 
1. Verify PostgreSQL service is running in Railway dashboard
2. Check that `DATABASE_URL` environment variable exists
3. Ensure database and web service are in the same project

### Issue: "Admin user already exists"

**Solution**: This is normal! The system detects existing admin and skips creation. Your admin credentials remain unchanged.

### Issue: Build fails

**Solutions**:
1. Check build logs in Railway dashboard
2. Verify Node version compatibility (requires Node 18+)
3. Clear build cache by triggering a new deployment

---

## Updating Your Deployment

### For Code Changes

Push to your GitHub repository - Railway auto-deploys on every commit to your main branch.

### For Database Schema Changes

1. Update your schema in `shared/schema.ts`
2. Push to GitHub
3. Railway will automatically run `npm run db:push` during deployment

### For Adding New Menu Items

Use the admin panel at `/admin/menu` - changes are live immediately!

---

## Railway-Specific Features

### Automatic Port Detection

Railway automatically sets the `PORT` environment variable. The application listens on this port (configured in `server/index.ts`).

### SSL/TLS

Railway provides automatic HTTPS for all deployments - no configuration needed.

### Database Backups

Railway automatically backs up your PostgreSQL database. Access backups in:
1. Project → PostgreSQL service
2. Data → Backups tab

### Monitoring

Railway provides:
- Real-time logs
- Deployment history
- Resource usage metrics
- Custom domains support

---

## Production Best Practices

### 1. Environment Variables

Store all secrets in Railway environment variables:
- Never commit passwords to Git
- Use strong random strings for `SESSION_SECRET`
- Rotate credentials periodically

### 2. Regular Snapshots

Create snapshots before major content changes:
1. Go to `/admin/snapshots`
2. Click **Create Snapshot**
3. Add description (e.g., "Before menu redesign")
4. Restore anytime if needed

### 3. Monitor Logs

Check Railway logs regularly for:
- Database connection issues
- Upload errors
- Performance warnings

### 4. Database Maintenance

- Railway handles database updates automatically
- Use snapshots for content rollback
- Export data via psql if needed

---

## Architecture Notes

### Auto-Initialization Flow

1. **Server Starts** → `server/index.ts`
2. **Database Migrations** → `npm run db:push` applies schema
3. **Database Seeding** → `npm run db:seed` (only if empty)
4. **Admin Creation** → `npm run db:create-admin` (only if missing)
5. **Bootstrap Runs** → Ensures admin exists
6. **Routes Register** → All API endpoints available
7. **Frontend Serves** → React app

### Trust Proxy Configuration

The application is configured with `app.set("trust proxy", 1)` to work correctly behind Railway's load balancer. This ensures:
- Sessions work correctly
- Admin login functions properly
- Secure cookies are handled correctly

### Admin Panel → Live Data

- Admin edits directly modify live database tables
- Changes visible immediately on website
- Snapshots save current state for rollback
- No "publish" step needed

---

## Support & Troubleshooting

If you encounter issues:

1. Check Railway deployment logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure PostgreSQL database is active and accessible
4. Try redeploying from Railway dashboard

For development questions, refer to the project documentation in the repository.

---

**Last Updated**: November 19, 2025  
**Version**: 1.0 (Railway Migration)
