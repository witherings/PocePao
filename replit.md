# PokePao Poke Bowl Café - Replit Project

## Overview
This repository contains a poke bowl restaurant website project with two main components:
1. **1_OLD_SITE_BACKEND** - Legacy PHP-based backend (not currently in use)
2. **2_NEW_SITE_DESIGN** - Modern full-stack React + Express application (active project)

The active application is a modern e-commerce platform for PokePao, a Hawaiian poke bowl restaurant in Hamburg, Germany. It enables customers to browse the menu, manage their cart, make reservations, and learn about the restaurant.

## Project Structure

### Active Application: 2_NEW_SITE_DESIGN
The main application is located in the `2_NEW_SITE_DESIGN` directory. This is a full-stack TypeScript application with:
- **Frontend**: React 18 with Vite, Wouter for routing, Tailwind CSS
- **Backend**: Express.js with RESTful API
- **Database**: PostgreSQL (via Neon) with fallback to in-memory storage
- **ORM**: Drizzle ORM

All development and deployment commands must be run from within the `2_NEW_SITE_DESIGN` directory.

## Development Setup

### Prerequisites
- Node.js 20 (already configured via Replit modules)
- PostgreSQL (optional - app has in-memory fallback)

### Running the Application
The application is configured to run automatically via Replit workflows:
- **Workflow Name**: "Start application"
- **Command**: `cd 2_NEW_SITE_DESIGN && npm run dev`
- **Port**: 5000 (webview enabled)

The server runs on `0.0.0.0:5000` and is configured to allow all hosts for Replit's proxy.

### Manual Commands
From the root directory:
```bash
cd 2_NEW_SITE_DESIGN
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Deployment

The project is configured for Replit Autoscale deployment:
- **Build**: `cd 2_NEW_SITE_DESIGN && npm run build`
- **Run**: `cd 2_NEW_SITE_DESIGN && npm run start`
- **Deployment Type**: Autoscale (stateless web application)

### Environment Variables
The application uses the following environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless)
- `PORT` - Server port (defaults to 5000)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token for notifications
- `TELEGRAM_CHAT_ID` - Telegram chat ID for restaurant notifications
- `ADMIN_USER` - Admin username (default: admin)
- `ADMIN_PASS` - Admin password (bcrypt hashed in database)
- `SESSION_SECRET` - Secret key for session encryption

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
- In-memory storage (MemStorage) with PostgreSQL support
- Drizzle ORM
- Session management support

### Data Storage
- **Primary**: PostgreSQL via Neon serverless (active)
- **ORM**: Drizzle ORM with type-safe queries
- **Cart Data**: Client-side localStorage via Zustand
- **Sessions**: express-session with CSRF protection (sameSite=strict)

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
- `POST /api/admin/login` - Admin login with Passport.js
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

## Legacy Backend (1_OLD_SITE_BACKEND)
This directory contains an old PHP-based administrative backend that is not currently active or integrated with the new React application. It's preserved for reference but is not used in the current setup.

## Recent Changes
- **November 12, 2025**: Major migration completed
  - Migrated from PHP/MySQL to TypeScript/Next.js/PostgreSQL
  - Database seeded with 6 categories, 48 menu items, 53 ingredients
  - Replaced email notifications with Telegram bot notifications
  - Implemented admin panel with Passport.js authentication
  - Added protected CRUD API endpoints for menu management
  - Frontend components (Menu, Reservations, Cart) connected to PostgreSQL
  - CSRF protection via sameSite=strict cookies
  - Created admin UI: login page and dashboard
- Initial Replit environment setup completed
- Node.js 20 and PostgreSQL modules configured
- Workflow configured for automatic dev server startup on port 5000
- Deployment configuration set for Autoscale deployment
- Vite configured with `allowedHosts: true` for Replit proxy compatibility

## User Preferences
None recorded yet.

## Admin Panel

### Access
- URL: `/admin/login`
- Default credentials: `admin` / (set via ADMIN_PASS env variable)
- Session-based authentication with Passport.js

### Features
- Menu management: CRUD for categories, menu items, ingredients
- Order viewing: See all customer orders
- Reservation viewing: See all table reservations
- Gallery management: Upload and delete images
- Secure authentication with bcrypt password hashing
- CSRF protection via sameSite cookies

## Notifications

The application sends notifications to Telegram instead of email:
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

## Notes
- The application uses PostgreSQL via Neon serverless
- All static assets and images are served from the Express server
- The Vite dev server is configured in middleware mode with HMR support
- Database migrations are managed via Drizzle ORM (`npm run db:push`)
