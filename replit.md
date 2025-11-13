# PokePao Poke Bowl Café - Production Ready

## Overview
This is a modern full-stack e-commerce platform for PokePao, a Hawaiian poke bowl restaurant in Hamburg, Germany. The application enables customers to browse the menu, manage their cart, make reservations, and learn about the restaurant.

## Project Structure
The project is now cleaned and ready for production deployment on Render.com or similar platforms.

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
- Express.js on Node.js
- TypeScript
- RESTful API design
- PostgreSQL via Neon serverless
- Drizzle ORM
- Passport.js authentication
- express-session with CSRF protection

### Data Storage
- **Primary**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with type-safe queries
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
npm run build        # Build for production (pushes schema + builds frontend)
npm run start        # Start production server
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

## Deployment on Render.com

### Step 1: Create Web Service
1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Set the following:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: Node

### Step 2: Configure Environment Variables
Add all required environment variables in Render dashboard:
- DATABASE_URL (from your PostgreSQL provider)
- SESSION_SECRET (generate with `openssl rand -base64 32`)
- TELEGRAM_BOT_TOKEN (optional)
- TELEGRAM_CHAT_ID (optional)

### Step 3: Set up PostgreSQL Database
1. Create a PostgreSQL database (Neon, Render, Railway, etc.)
2. Copy the connection string to DATABASE_URL
3. The build script will automatically push schema to database

### Step 4: Create Admin User
After first deployment:
1. Go to Render dashboard → Shell
2. Run: `ADMIN_PASSWORD=your_secure_password npm run db:create-admin`
3. Save credentials securely
4. (Optional) Remove ADMIN_PASSWORD from environment variables

### Step 5: Seed Database (Optional)
To populate the database with initial menu items:
```bash
npm run db:seed
```

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
- Menu management: CRUD for categories, menu items, ingredients
- Order viewing: See all customer orders
- Reservation viewing: See all table reservations
- Gallery management: Upload and delete images
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
- **November 12, 2025**: Production cleanup completed
  - Moved all files to project root for clean deployment
  - Removed legacy folders and Replit-specific files
  - Updated build scripts for Render deployment
  - Added admin user creation script
  - Configured .gitignore for production
  - Added bcryptjs dependency for password hashing
  - Ready for deployment on Render.com or similar platforms

## Notes
- The application uses PostgreSQL via Neon serverless
- All static assets and images are served from the Express server
- The Vite dev server is configured in middleware mode with HMR support
- Database migrations are managed via Drizzle ORM (`npm run db:push`)
- Admin users must be created via CLI script after first deployment
