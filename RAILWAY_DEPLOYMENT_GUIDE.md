# Railway.app Deployment Guide - PokePao Restaurant

This guide provides complete instructions for deploying PokePao to Railway.app with all features working correctly.

## Prerequisites

1. A Railway.app account
2. A PostgreSQL database provisioned in Railway
3. Telegram Bot tokens (optional, for notifications)

## Required Environment Variables

### Database Configuration
Railway automatically provides these when you add a PostgreSQL database:
- `DATABASE_URL` - Complete PostgreSQL connection string
- Other `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` vars are also provided

### Application Settings
```bash
NODE_ENV=production
PORT=5000  # Railway will set this automatically
SESSION_SECRET=your-secure-random-string-change-in-production
```

### File Upload Storage (CRITICAL)
**Required for image uploads to persist across restarts:**
```bash
UPLOAD_DIR=/data/uploads
```

**Important**: You MUST create a Railway Volume and mount it to `/data`:
1. Go to your Railway project dashboard
2. Click on "Volumes" in the left sidebar
3. Click "New Volume"
4. Name: `uploads`
5. Mount path: `/data`
6. Size: 1GB (or more as needed)

Without this volume, all uploaded images will be lost when the container restarts.

### Telegram Notifications (Optional)

#### Option 1: Single Bot for Everything (Simplest)
Use the same Telegram bot for both orders and reservations:
```bash
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_CHAT_ID=your-chat-id-here
```

#### Option 2: Separate Bots (Advanced)
Send orders to one Telegram account and reservations to another:
```bash
# For orders (goes to one Telegram account/channel)
TELEGRAM_ORDER_BOT_TOKEN=order-bot-token
TELEGRAM_ORDER_CHAT_ID=order-chat-id

# For reservations (goes to another Telegram account/channel)
TELEGRAM_RESERVATION_BOT_TOKEN=reservation-bot-token
TELEGRAM_RESERVATION_CHAT_ID=reservation-chat-id
```

**Note**: If you use Option 2, both sets of tokens must be configured. The system will fall back to `TELEGRAM_BOT_TOKEN` if the specific tokens are not found.

## Deployment Steps

### 1. Create New Railway Project
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project or create new one
railway link
```

### 2. Add PostgreSQL Database
1. In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically inject database connection environment variables

### 3. Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add all required environment variables listed above.

### 4. Create Volume for Uploads
1. Click "New" → "Volume"
2. Name: `uploads`
3. Mount path: `/data`
4. Attach to your web service

### 5. Deploy
Railway will automatically deploy when you push to your connected Git repository, or you can deploy manually:
```bash
railway up
```

### 6. Run Database Migrations
After first deployment:
```bash
# SSH into Railway container
railway shell

# Run migrations
npx drizzle-kit push
```

Or use Railway's built-in database console to run migrations.

### 7. Create Admin User
After migrations, create your admin user:
```bash
railway shell
npm run create-admin
```

Or the system will automatically create a default admin on first startup (username: `admin`, password: `admin123` - CHANGE THIS IMMEDIATELY).

## Post-Deployment Verification

### 1. Check Image Uploads
1. Log in to admin panel
2. Go to Gallery management
3. Upload a test image
4. Verify image displays correctly in admin panel
5. Verify image displays on public gallery page
6. Restart your Railway service
7. Verify image still displays (tests persistence)

### 2. Check Menu Item Images
1. In admin panel, create or edit a menu item
2. Upload an image for the menu item
3. Save the menu item
4. Open the menu on the public site
5. Click on the menu item to open detail view
6. Verify correct image displays (not the default tea image)

### 3. Check Dual Pricing (Pokebowls)
1. Create or edit a Pokebowl menu item
2. Set "Preis Standard (€)" to 14.75
3. Set "Preis Klein (€)" to 9.90
4. Save the item
5. On public site, open the Pokebowl item
6. Verify size selection buttons appear
7. Verify "Klein" shows €9.90
8. Verify "Standard" shows €14.75

### 4. Check Snapshots
1. In admin panel, go to Content Snapshots
2. Click "Neuer Snapshot"
3. Create a snapshot with a test name
4. Make changes to menu items (change prices, descriptions)
5. Return to Snapshots and click "Wiederherstellen" on your snapshot
6. Verify all changes reverted exactly

### 5. Check Telegram Notifications
1. Place a test order on the website
2. Verify you receive a Telegram notification with order details
3. Make a test reservation
4. Verify you receive a Telegram notification with reservation details

## Troubleshooting

### Images Show as Blank/White Sheets
**Problem**: Uploaded images appear as white rectangles or broken images.

**Solution**:
1. Verify `/data` volume is created and mounted
2. Check `UPLOAD_DIR=/data/uploads` is set in environment variables
3. Check Railway logs for upload errors
4. Ensure volume has sufficient space

### Images Disappear After Restart
**Problem**: Images work initially but vanish after Railway restarts the container.

**Solution**: You forgot to create the persistent volume. See "File Upload Storage" section above.

### Menu Items Show Tea Image
**Problem**: All menu items show the same tea/default image in detail view.

**Solution**: This was a bug that has been fixed. Make sure you're running the latest version of the code.

### Klein Price Not Saving
**Problem**: You enter a Klein price but it doesn't save or display.

**Solution**: This was a bug that has been fixed. Ensure you're running the latest version. The system now automatically sets `hasSizeOptions=1` when you provide a Klein price.

### Telegram Notifications Not Working
**Problem**: Orders or reservations don't send Telegram notifications.

**Solutions**:
1. Check Railway logs for Telegram errors
2. Verify your bot token and chat ID are correct
3. Ensure bot has permission to send messages to the chat/channel
4. Check if you're using Option 1 or Option 2 configuration (see above)
5. For Option 2, verify BOTH sets of tokens are configured

### Database Errors on Startup
**Problem**: Application crashes with "relation does not exist" errors.

**Solution**:
1. Run database migrations: `railway shell` then `npx drizzle-kit push`
2. Check that DATABASE_URL is correctly set
3. Verify PostgreSQL addon is running

## Important Notes for Railway

1. **Read-Only Filesystem**: Railway's container filesystem is read-only except for mounted volumes. This is why the `/data` volume is essential for uploads.

2. **Automatic Restarts**: Railway may restart your container for various reasons. Persistent data MUST be stored in volumes or external databases.

3. **Environment Variables**: Railway provides many environment variables automatically. Don't override them unless necessary.

4. **Build Process**: Railway builds your application on every deployment. Ensure `npm run build` completes successfully.

5. **Port Configuration**: Railway sets the PORT environment variable automatically. The application is configured to use it.

## Support

If you encounter issues not covered in this guide:
1. Check Railway logs in the dashboard
2. Review application logs for specific errors
3. Verify all environment variables are correctly set
4. Ensure database migrations have run successfully

## Security Recommendations

1. Change default admin credentials immediately after first login
2. Use strong, unique SESSION_SECRET in production
3. Keep your Telegram bot tokens secure
4. Regularly update dependencies for security patches
5. Enable Railway's built-in monitoring and alerts
