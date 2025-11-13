# 🚀 Render Deployment Guide for PokePao

## Overview

This guide walks you through deploying your PokePao restaurant website to Render with zero manual configuration required. The system automatically handles database initialization, migrations, seeding, and admin user creation.

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
1. A Render account
2. A PostgreSQL database created in Render
3. Your GitHub repository connected to Render

---

## Step-by-Step Deployment

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → **Databases**
2. Click **New PostgreSQL**
3. Choose:
   - **Name**: `pokepao-db` (or any name you prefer)
   - **Region**: Same as your web service (e.g., Frankfurt)
   - **PostgreSQL Version**: 16 or later
4. Click **Create Database**
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Create Web Service

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pokepao` (or any name)
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run db:push && npm start`

**Why this command works for all deployments:**
- `npm run db:push` applies database migrations
- `npm start` boots the server
- **Bootstrap automatically handles**:
  - Database seeding (only if empty)
  - Admin user creation (only if missing)
- No manual changes needed between deployments!

### Step 3: Set Environment Variables

In the **Environment** section, add:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your PostgreSQL Internal Database URL |
| `NODE_ENV` | `production` | Production mode |
| `SESSION_SECRET` | `your-random-secret-here` | Session encryption key (generate a random string) |

**Note**: You do NOT need to set `ADMIN_USERNAME` or `ADMIN_PASSWORD` - the admin user is created automatically with default credentials.

### Step 4: Deploy

1. Click **Create Web Service**
2. Wait for the build to complete (3-5 minutes)
3. Check the logs for success messages

---

## Expected Deployment Logs

A successful deployment shows:

```
✅ npm run db:push - Database migrations applied
✅ npm run db:seed - Database seeded with 6 categories, 48 menu items
✅ Server starting...
🔐 Creating default admin user...
✅ Admin user created successfully!
   Username: admin
   Password: ********
🚀 Server running on port 5000
```

---

## Accessing Your Website

Once deployed, your website is available at:
- **Public URL**: `https://your-app-name.onrender.com`
- **Admin Panel**: `https://your-app-name.onrender.com/admin/login`

### Admin Credentials (Default)

- **Username**: `admin`
- **Password**: `mk509918`

### 🔒 CRITICAL SECURITY WARNING

**⚠️ The admin password is HARDCODED in the source code for initial setup.**

**YOU MUST change it immediately after first deployment:**

1. **Option A - Change via Database** (Recommended):
   - Connect to your PostgreSQL database via Render Dashboard
   - Open psql console
   - Run: `UPDATE admin_users SET password_hash = crypt('YOUR_NEW_PASSWORD', gen_salt('bf')) WHERE username = 'admin';`
   - Replace `YOUR_NEW_PASSWORD` with a strong password

2. **Option B - Implement Password Change Feature** (Future):
   - Add admin settings page in the admin panel
   - Implement password change form
   - Hash password with bcrypt before saving

**⚠️ Leaving the default password in production is a SERIOUS SECURITY RISK!**

---

## Common Issues & Solutions

### Issue: "Database seeding completed successfully" but menu is empty

**Solution**: This is normal on first deploy. The seed script only runs once. If you need to re-seed:
1. Go to your Postgres database in Render
2. Use the psql console to delete data: `DELETE FROM menu_items; DELETE FROM categories;`
3. Redeploy the service

### Issue: "Admin user already exists"

**Solution**: This is normal! The system detects existing admin and skips creation. Your admin credentials remain unchanged.

### Issue: Connection refused or database errors

**Solutions**:
1. Verify `DATABASE_URL` is correct (copy from Render database settings)
2. Ensure database and web service are in the same region
3. Check database status in Render Dashboard

### Issue: Build fails with "npm ERR!"

**Solutions**:
1. Check Node version compatibility (requires Node 18+)
2. Clear build cache: **Settings** → **Clear build cache & deploy**
3. Verify all dependencies in `package.json`

---

## Updating Your Deployment

### For Code Changes

Just push to GitHub - Render auto-deploys on every commit to `main` branch.

### For Database Schema Changes

1. Update your schema in `shared/schema.ts`
2. Push to GitHub
3. Render will automatically run `npm run db:push` during deployment

### For Adding New Menu Items

Use the admin panel at `/admin/menu` - changes are live immediately!

---

## Production Best Practices

### 1. Change Admin Password

After first login:
1. This feature will be added soon
2. For now, change password in database directly or contact developer

### 2. Regular Snapshots

Create snapshots before major content changes:
1. Go to `/admin/snapshots`
2. Click **Create Snapshot**
3. Add description (e.g., "Before menu redesign")
4. Restore anytime if needed

### 3. Monitor Logs

Check Render logs regularly for:
- Database connection issues
- Upload errors
- Performance warnings

### 4. Database Backups

Render provides automatic backups for paid plans. For free tier:
1. Use snapshots feature for content rollback
2. Export data manually via psql if needed

---

## Start Command Explained

### The One Command for All Deployments

```bash
npm run db:push && npm start
```

**What it does:**
1. **`npm run db:push`** - Applies database migrations (schema changes)
2. **`npm start`** - Starts the Express server

**What happens automatically during `npm start`:**
- **Bootstrap runs** (`server/bootstrap.ts`):
  - Checks if database is empty
  - If empty: seeds with menu data, categories, gallery
  - Creates admin user if not exists (username: admin, password: mk509918)
- **Routes register** - All API endpoints become available
- **Server starts** on port 5000

**Why you don't need to change commands between deploys:**
- First deploy: Bootstrap seeds empty database + creates admin
- Subsequent deploys: Bootstrap skips seeding (data exists) + skips admin creation (already exists)
- Zero manual intervention required!

### Alternative Commands (Advanced)

**If you need explicit seeding control:**
```bash
npm run render:setup && npm start
```
Runs `npm run db:push && npm run db:seed && npm run db:create-admin && npm start`
- Useful for debugging or migrating from another system
- Not needed normally - bootstrap handles everything

**Minimal (Troubleshooting only):**
```bash
npm start
```
- Skips migrations (dangerous if schema changed!)
- Use only if `db:push` fails and you need to investigate

---

## Architecture Notes

### Auto-Initialization Flow

1. **Server Starts** → `server/index.ts`
2. **Bootstrap Runs** → `server/bootstrap.ts`
   - Checks if database is empty
   - If empty: runs seeding automatically
   - Creates admin user if missing (default: admin / mk509918)
   - **⚠️ Admin credentials are HARDCODED - change password after first login!**
3. **Routes Register** → All API endpoints available
4. **Frontend Serves** → Vite-built React app

This means:
- **No manual seeding needed** - handled automatically
- **No manual admin creation needed** - handled automatically
- **Just run `npm run db:push && npm start`** - everything else is automatic

### Admin Panel → Live Data

- Admin edits directly modify live database tables
- Changes visible immediately on website
- Snapshots save current state for rollback
- No "publish" step needed

### Snapshot System

- **Create**: Saves current menu, categories, gallery to snapshot tables
- **Restore**: Overwrites live data with snapshot data
- **Delete**: Removes snapshot (does not affect live data)

---

## Support & Troubleshooting

If you encounter issues not covered here:

1. Check Render logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure PostgreSQL database is active and accessible
4. Try "Clear build cache & deploy" in Render settings

For development questions, contact your technical team.

---

**Last Updated**: November 13, 2025  
**Version**: 3.0 (Auto-admin, German UI, Live editing)
