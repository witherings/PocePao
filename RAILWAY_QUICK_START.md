# Railway Deployment - Quick Start Guide

## Critical Configuration Fixed ✅

Your app is now configured for seamless Railway deployment with the following fixes:
- ✅ Database migrations run automatically on startup
- ✅ Data seeding happens automatically
- ✅ Admin user created with default credentials (can be customized)
- ✅ Startup won't fail if admin already exists
- ✅ Enhanced error logging for debugging

## Step 1: Railway Setup

### 1.1 Create PostgreSQL Database
1. Go to your Railway project dashboard
2. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway automatically injects `DATABASE_URL` and other database environment variables

### 1.2 Set Required Environment Variables

In your Railway project dashboard → **Variables** tab, add:

```bash
# Required
NODE_ENV=production
SESSION_SECRET=your-secure-random-string-here-change-this

# ⚠️ CRITICAL SECURITY: Set Custom Admin Password
# If not set, defaults to "admin123" which is a major security risk!
ADMIN_PASSWORD=YourSecurePassword123

# Optional: Custom Admin Username (defaults to "admin")
ADMIN_USERNAME=admin

# Optional: File Uploads (if using image uploads)
UPLOAD_DIR=/data/uploads
```

### 1.3 Create Volume for Image Uploads (Optional but Recommended)

If your app uses image uploads:
1. Click **"New"** → **"Volume"**
2. Name: `uploads`
3. Mount path: `/data`
4. Attach to your web service

## Step 2: Deploy

### Option A: Automatic Deployment (Recommended)
Connect your GitHub repository to Railway. It will automatically deploy on every push.

### Option B: Manual Deployment via CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

## Step 3: Railway Build/Start Commands

**✅ Already configured in `railway.json`** - No manual configuration needed!

The following commands are automatically executed:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run railway:start
```

This command automatically:
1. Runs database migrations (non-interactive, idempotent)
2. Seeds the database with initial data
3. Creates admin user
4. Starts the production server

## Step 4: Access Your Admin Panel

After deployment completes:

1. **URL:** `https://your-railway-app.up.railway.app/admin`

2. **Default Credentials:**
   - Username: `admin`
   - Password: `admin123` (only if you didn't set `ADMIN_PASSWORD` env var)

3. **🔒 CRITICAL SECURITY WARNING:**
   - The default password `admin123` is a **major security risk**
   - **ALWAYS set `ADMIN_PASSWORD` environment variable in Railway**
   - If you used the default, change it immediately after first login!

## How to Create/Reset Admin User Manually

If you need to create or reset the admin user after deployment:

### Method 1: Via Railway Shell
```bash
# Open Railway shell
railway shell

# Create admin with custom password
ADMIN_PASSWORD=YourNewPassword123 npm run db:create-admin
```

### Method 2: Add Environment Variable
1. Go to Railway Variables
2. Add `ADMIN_PASSWORD=YourNewPassword123`
3. Redeploy or restart the service

The script will:
- Skip creation if admin already exists
- Create new admin if none exists
- Use `ADMIN_PASSWORD` env var or default to `admin123`

## Troubleshooting

### 500 Errors on `/api/menu-items` or `/api/ingredients`

**Symptoms:** API endpoints return 500 errors, menu shows "Keine Produkte"

**Solutions:**
1. **Check Railway Logs:**
   ```bash
   railway logs
   ```
   The enhanced error logging will show exact error details.

2. **Verify Database Connection:**
   - Ensure PostgreSQL service is running
   - Check `DATABASE_URL` is set
   - Verify migrations ran successfully

3. **Manual Database Reset:**
   ```bash
   railway shell
   npm run db:push      # Run migrations
   npm run db:seed      # Seed data
   ```

### Database Tables Don't Exist

The startup command automatically runs migrations. If tables are still missing:

```bash
railway shell
npm run db:push
```

### Admin User Already Exists Error

This is now handled gracefully - the startup won't fail. The script will simply skip admin creation.

### Check Database Content

```bash
railway shell
npm run db:test    # Test database connection
```

## What's Included in Database Seed

The seed script automatically creates:
- ✅ 6 Categories (Wunsch Bowls, Poke Bowls, Wraps, Vorspeisen, Desserts, Getränke)
- ✅ Sample menu items for each category
- ✅ All ingredients (Protein, Base, Marinade, Fresh, Sauce, Topping, Extras)

**Note:** Seed script won't overwrite existing data - it skips if categories already exist.

## Summary: What You Need to Do

1. ✅ Create PostgreSQL database in Railway
2. ✅ Set `NODE_ENV=production` and `SESSION_SECRET` env vars
3. ✅ (Optional) Set `ADMIN_PASSWORD` for custom admin password
4. ✅ (Optional) Create `/data` volume for image uploads
5. ✅ Deploy to Railway
6. ✅ Access admin panel and change default password

**Everything else is automatic!** 🚀

## Support

Check Railway logs for detailed error messages:
```bash
railway logs --follow
```

All API errors now include stack traces and detailed error messages for easier debugging.
