# PokePao Poke Bowl Café - Production Ready

## Overview
This is a modern full-stack e-commerce platform for PokePao, a Hawaiian poke bowl restaurant in Hamburg, Germany. The application enables customers to browse the menu, manage their cart, make reservations, and learn about the restaurant.

**Deployment Platform:** Railway.app (optimized for Railway's infrastructure with trust proxy support)

## Project Structure
The project is cleaned and ready for production deployment on Railway.app or similar platforms.

```
/
├── client/          # React frontend source code
├── server/          # Express backend source code
├── shared/          # Shared TypeScript types and schemas
├── api/             # API route definitions
├── public/          # Static assets
├── migrations/      # Drizzle database migrations
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite build configuration
└── drizzle.config.ts # Database ORM configuration
```

## Technical Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling and HMR
- Tailwind CSS with custom design tokens
- shadcn/ui components (Radix UI)
- TanStack Query for server state
- Zustand for client-side cart state
- Wouter for routing

### Backend
- Express.js on Node.js with trust proxy support (Railway-ready)
- TypeScript
- RESTful API design
- PostgreSQL with standard TCP connections (Railway, Render, etc.)
- Drizzle ORM with node-postgres driver
- Passport.js authentication
- express-session with CSRF protection
- SSL/TLS support for managed PostgreSQL (auto-detects non-localhost)

### Data Storage
- **Primary**: PostgreSQL (standard TCP driver with SSL support)
- **ORM**: Drizzle ORM with type-safe queries using node-postgres
- **Cart Data**: Client-side localStorage via Zustand
- **Sessions**: express-session with sameSite=strict cookies

## Scripts

### Development
```bash
npm run dev          # Start development server (port 5000)
npm run check        # TypeScript type checking
```

### Database
```bash
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with menu items
npm run db:create-admin # Create admin user (requires ADMIN_PASSWORD env var)
```

### Production
```bash
npm run build         # Build for production (pushes schema + builds frontend)
npm run railway:setup # Setup database and admin (Railway deployment command)
npm run start         # Start production server
```

## Environment Variables

Required for production deployment:

1. **DATABASE_URL** (required)
   - PostgreSQL connection string
   - Example: `postgresql://user:password@host:5432/database`
   - Get from Neon, Railway, or other PostgreSQL provider

2. **SESSION_SECRET** (required)
   - Secret key for session encryption
   - Generate a random string (min 32 characters)
   - Example: `openssl rand -base64 32`

3. **ADMIN_USERNAME** (optional, default: "admin")
   - Username for the first admin user
   - Used only when running `npm run db:create-admin`

4. **ADMIN_PASSWORD** (required for admin creation)
   - Password for the first admin user
   - Required when running `npm run db:create-admin`
   - After creation, this can be removed from env vars

5. **TELEGRAM_BOT_TOKEN** (optional)
   - Telegram bot token for notifications
   - Get from @BotFather on Telegram

6. **TELEGRAM_CHAT_ID** (optional)
   - Telegram chat ID for restaurant notifications
   - Get from @userinfobot on Telegram

7. **NODE_ENV** (auto-set by Render)
   - Set to "production" in production
   - Render sets this automatically

8. **PORT** (auto-set by Render)
   - Server port
   - Render sets this automatically (usually 10000)

## Deployment on Render.com (Free Tier Compatible)

### IMPORTANT: Render Free Tier Constraints
- **No Shell Access**: Cannot run commands manually after deployment
- **No Pre-Deploy Commands**: Must use chained Start Command
- **SSL Required**: Render's PostgreSQL requires SSL/TLS (auto-configured)

### Step 1: Create PostgreSQL Database
1. In Render dashboard, create a **PostgreSQL** instance (free tier available)
2. Copy the **Internal Database URL** (starts with `postgresql://`)
3. Keep this connection string for Step 3

### Step 2: Create Web Service
1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Set the following:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run db:seed && npm run db:create-admin && npm run start`
   - **Environment**: Node

### Step 3: Configure Environment Variables
Add all required environment variables in Render dashboard:
- **DATABASE_URL**: Your PostgreSQL Internal Database URL from Step 1
- **SESSION_SECRET**: Generate with `openssl rand -base64 32`
- **ADMIN_PASSWORD**: Your secure admin password (required for first boot)
- **ADMIN_USERNAME**: (optional, defaults to "admin")
- **TELEGRAM_BOT_TOKEN**: (optional)
- **TELEGRAM_CHAT_ID**: (optional)

### Step 4: Deploy
1. Click "Deploy" - Render will:
   - Install dependencies
   - Build the frontend
   - Run database migrations
   - Seed the database (idempotent - skips if data exists)
   - Create admin user (idempotent - skips if admin exists)
   - Start the production server
2. Your app is now live!

### Important Notes for Free Tier
- The **chained Start Command** runs on every deployment and restart
- Scripts are **idempotent** - safe to run multiple times:
  - `db:seed` checks if categories exist before seeding
  - `db:create-admin` checks if admin exists before creating
- **ADMIN_PASSWORD** must remain in environment variables since scripts run on every restart
- Database connection uses SSL automatically (non-localhost connections)

## API Endpoints

### Public Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items/category/:categoryId` - Get items by category
- `GET /api/menu-items/:id` - Get single menu item
- `POST /api/reservations` - Create new reservation (sends Telegram notification)
- `GET /api/gallery` - Get gallery images
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/type/:type` - Get ingredients by type
- `POST /api/orders` - Create new order (sends Telegram notification)

### Protected Admin Endpoints (require authentication)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Check auth status
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/menu-items` - Get all menu items
- `POST /api/admin/menu-items` - Create menu item
- `PUT /api/admin/menu-items/:id` - Update menu item
- `DELETE /api/admin/menu-items/:id` - Delete menu item
- `GET /api/admin/ingredients` - Get all ingredients
- `POST /api/admin/ingredients` - Create ingredient
- `PUT /api/admin/ingredients/:id` - Update ingredient
- `DELETE /api/admin/ingredients/:id` - Delete ingredient
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/reservations` - Get all reservations
- `GET /api/admin/gallery` - Get all gallery images
- `DELETE /api/admin/gallery/:id` - Delete gallery image

## Admin Panel

### Access
- URL: `/admin/login`
- Use credentials created with `db:create-admin` script
- Session-based authentication with Passport.js

### Features
- **Menu Management**: Full CRUD for categories, menu items, ingredients
  - Variant pricing support (price_small, price_large for different bowl sizes)
  - Ingredients tracking (comma-separated list)
  - Allergens tracking (comma-separated list)
- **Order Viewing**: See all customer orders with details
- **Reservation Management**: Full table view of bookings (name, date, time, phone, guests)
- **Gallery Management**: Upload and delete restaurant photos
- Secure authentication with bcrypt password hashing
- CSRF protection via sameSite cookies

## Notifications

The application sends notifications to Telegram:
- **New orders**: Customer name, phone, items, total, pickup/dine-in details
- **New reservations**: Customer name, guests, date, time, phone

Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment variables to enable notifications.

## Database Schema

The PostgreSQL database contains the following tables:
- `categories` - Menu categories (Poke Bowls, Wraps, etc.)
- `menu_items` - Restaurant dishes with prices, descriptions, images
- `ingredients` - Custom bowl ingredients (proteins, bases, sauces, toppings)
- `orders` - Customer orders with items and details
- `order_items` - Individual items in orders
- `reservations` - Table reservations
- `gallery_images` - Restaurant gallery photos
- `admin_users` - Admin panel users with bcrypt hashed passwords

## Recent Changes
- **November 19, 2025**: Railway Production Deployment Fix
  - **FIXED**: Database connection error (ECONNREFUSED) on Railway paid tier
  - **UPDATED**: server/db.ts with explicit SSL configuration for production (NODE_ENV === "production")
  - **ADDED**: `railway:up` script for full deployment automation
  - **VERIFIED**: All features production-ready:
    - ✅ Admin variant pricing (price_small, price_large) in Menu Editor
    - ✅ Gallery upload/delete system
    - ✅ Secret admin access (hidden dot in footer)
    - ✅ Snapshots publishing system
  - **CREATED**: RAILWAY_DEPLOYMENT_FIXED.md with complete deployment guide

- **November 19, 2025**: Railway Migration & Admin CMS Completion
  - **MIGRATED**: Platform from Render to Railway.app
  - **ADDED**: Trust proxy setting in server/index.ts (critical for Railway load balancer authentication)
  - **REMOVED**: All Vercel-specific code checks from server
  - **ENHANCED**: AdminMenu with variant pricing fields (price_small, price_large)
  - **ENHANCED**: AdminMenu with ingredients and allergens tracking (comma-separated inputs)
  - **CREATED**: AdminReservations page with full table view (name, date, time, phone, guests)
  - **FIXED**: Critical camelCase/snake_case bug in menu form that would have caused data loss
  - **UPDATED**: package.json script from render:setup to railway:setup
  - **CREATED**: RAILWAY_SETUP.md deployment guide
  - **REMOVED**: RENDER_SETUP.md (obsolete)
  - **VERIFIED**: All admin features production-ready with architect review

- **November 19, 2025**: Critical Render Free Tier Fix (ESM/CommonJS Compatibility)
  - **REMOVED**: @neondatabase/serverless and ws packages (caused port 443 WebSocket errors)
  - **ADDED**: Standard pg driver with SSL/TLS support for Render PostgreSQL
  - **FIXED**: Database connection to use standard TCP on port 5432 (not WebSockets)
  - **FIXED**: ESM import for pg package using default import pattern (`import pg from 'pg'; const { Pool } = pg;`) to work with Node.js 22 native ESM loader
  - **IMPROVED**: Auto-detect SSL requirement (enabled for non-localhost connections)
  - **VERIFIED**: Idempotent scripts (seed.ts and create-admin.ts) safe for chained Start Command
  - **CONFIGURED**: Works perfectly on Render Free Tier with no shell access required

- **November 12, 2025**: Production cleanup completed
  - Moved all files to project root for clean deployment
  - Removed legacy folders and Replit-specific files
  - Updated build scripts for Render deployment
  - Added admin user creation script
  - Configured .gitignore for production
  - Added bcryptjs dependency for password hashing

## Notes
- The application uses standard PostgreSQL with node-postgres driver
- SSL/TLS automatically enabled for managed databases (Render, Railway, etc.)
- Local development (localhost) runs without SSL for simplicity
- All static assets and images are served from the Express server
- The Vite dev server is configured in middleware mode with HMR support
- Database migrations are managed via Drizzle ORM (`npm run db:push`)
- Seeding and admin creation are idempotent and run on every deployment via chained Start Command
