# PokePao Restaurant Website

## Overview

PokePao is a full-stack restaurant website for a Poke Bowl restaurant in Hamburg, Germany. The application enables customers to browse the menu, customize bowls, place orders, and make reservations. It includes a comprehensive admin panel for managing all content, menu items, ingredients, and orders. The system has been fully migrated from hardcoded data to a database-driven architecture.

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Deployment:** Railway.app
- **Authentication:** Passport.js with session-based auth
- **Notifications:** Telegram Bot API

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single Page Application (SPA) with Wouter Router**
- Client-side routing using Wouter (lightweight React router)
- React Query (TanStack Query) for server state management and caching
- Zustand for client-side cart state management
- shadcn/ui components built on Radix UI primitives
- Responsive design with mobile-first approach using Tailwind CSS

**Key Design Patterns:**
- **Component Composition:** Reusable UI components from shadcn/ui library
- **Custom Hooks:** `useBodyScrollLock`, `useIsMobile` for cross-cutting concerns
- **State Management Strategy:**
  - Server state: React Query with automatic caching and revalidation
  - Client state: Zustand store for shopping cart (persisted to localStorage)
  - Form state: React Hook Form with Zod validation
- **Modal Management:** Dialog components with body scroll locking for better UX

**Bowl Builder System:**
- Multi-step wizard dialog for custom bowl creation (8 steps: size, protein, base, marinade, fresh ingredients, sauce, toppings, extras)
- Centralized pricing service (`pricingService.ts`) for consistent price calculations
- Support for editing existing cart items
- Real-time price updates based on selections

### Backend Architecture

**Express.js REST API with TypeScript**
- Modular route registration pattern separating concerns:
  - `routes.ts`: Public API endpoints (menu, orders, reservations)
  - `admin-routes.ts`: Protected admin CRUD operations
  - `snapshot-routes.ts`: Backup/restore functionality
- Middleware stack: JSON parsing, sessions, authentication, static file serving

**Database Layer (Drizzle ORM):**
- **Connection Management:** Singleton pattern with connection pooling for PostgreSQL
- **Schema-First Approach:** TypeScript schema definitions in `shared/schema.ts` generate both database schema and TypeScript types
- **Migration Strategy:** Drizzle Kit for schema migrations with version tracking
- **Retry Logic:** Database connection with exponential backoff for Railway deployment reliability

**Key Design Decisions:**

1. **Shared Schema Pattern:**
   - Single source of truth: `shared/schema.ts` used by both frontend and backend
   - Drizzle schema definitions generate SQL migrations and TypeScript types
   - Zod schemas for runtime validation derived from Drizzle schemas

2. **Storage Abstraction:**
   - `storage.ts` provides a clean interface for all database operations
   - Separates business logic from database implementation details
   - All queries use Drizzle ORM query builder (no raw SQL in routes)

3. **Authentication Strategy:**
   - Session-based authentication using Passport.js with Local Strategy
   - Sessions stored in PostgreSQL using connect-pg-simple
   - Admin-only routes protected with `ensureAuthenticated` middleware
   - Trust proxy enabled for Railway load balancer compatibility

4. **File Upload Handling:**
   - Multer middleware for multipart form data
   - Persistent storage using Railway Volumes mounted at `/data/uploads`
   - Environment variable `UPLOAD_DIR` for deployment flexibility
   - File type validation (images only) with 5MB size limit

5. **Snapshot System (Backup/Restore):**
   - Complete database state snapshots stored as JSON in database
   - Separate tables for snapshot metadata and snapshot data (categories, menu items, ingredients, gallery images, static content)
   - Atomic restore operations with transaction support
   - Published snapshot system for staging changes before going live

6. **Notification System:**
   - Telegram Bot API integration for order and reservation notifications
   - Dual bot/chat configuration support (separate or shared bots)
   - Graceful degradation: logs to console if Telegram not configured
   - HTML-formatted messages with order details

### Database Schema

**Core Entities:**

1. **Categories** - Menu organization (6 categories: Wunsch Bowls, Poke Bowls, Wraps, Vorspeisen, Desserts, Getränke)
2. **Menu Items** - 42 products with multilingual support (English/German)
   - Flexible pricing: standard price + optional small price for size options
   - Support for custom bowls with ingredient selection
   - Variant support for items with multiple flavors/bases
3. **Ingredients** - 97 ingredients (53 base + 44 extra)
   - Types: protein, base, marinade, fresh, sauce, topping (and extra_ variants)
   - Dual pricing: regular price + extra price for additional portions
4. **Product Variants** - Size/flavor options for consolidated menu items
5. **Orders & Order Items** - Order tracking with customer info and line items
6. **Reservations** - Table reservation management
7. **Admin Users** - Bcrypt-hashed credentials for admin panel access
8. **Gallery Images** - Photo gallery for homepage
9. **Page Images** - Homepage slider/header images
10. **Static Content** - Editable page content (About, Contact, Home sections)
11. **App Settings** - Global configuration (maintenance mode)
12. **Snapshots** - Backup/restore system with separate snapshot tables

**Key Relationships:**
- Menu Items → Categories (many-to-one)
- Product Variants → Menu Items (many-to-one)
- Order Items → Orders (many-to-one)
- Order Items reference Menu Items and Ingredients for custom bowls

**Data Migration:**
- Complete 5-phase migration from hardcoded data to PostgreSQL documented in `migration-docs/`
- Image reorganization from scattered structure to `/media/` with normalized naming
- 112 images migrated with slug-based naming convention

### Deployment Architecture (Railway.app)

**Bootstrap Sequence:**
1. Database connection with retry logic (5 attempts, exponential backoff)
2. Schema migration via Drizzle Kit (`db:push` or `db:migrate`)
3. Auto-seeding if database is empty (categories, menu items, ingredients, variants, slider images)
4. Auto-creation of admin user if none exists (username: "admin", password from env or default)
5. Express server startup with health check endpoint

**Critical Configuration:**
- `railway.json`: Build and deploy configuration with health check
- Environment variables:
  - `DATABASE_URL`: PostgreSQL connection (auto-injected by Railway)
  - `NODE_ENV`: production
  - `SESSION_SECRET`: Secure session encryption key
  - `ADMIN_PASSWORD`: Admin user password (defaults to "admin123" if not set)
  - `UPLOAD_DIR`: Persistent file storage path (`/data/uploads`)
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`: Notification configuration
- Volume mounting: `/data` volume required for persistent file uploads
- Automatic deployment on git push via Railway GitHub integration

**Session Persistence:**
- Sessions stored in PostgreSQL (not in-memory)
- Survives server restarts and horizontal scaling
- 7-day session expiration with HTTP-only secure cookies

## External Dependencies

### Third-Party Services

1. **Railway.app** - Cloud hosting platform
   - PostgreSQL database provisioning
   - Automatic deployments from GitHub
   - Volume storage for file uploads
   - Environment variable management

2. **Telegram Bot API** - Push notifications
   - Order notifications sent to restaurant staff
   - Reservation notifications
   - Optional dual-bot configuration (separate bots for orders/reservations)

### NPM Packages (Key Dependencies)

**Backend:**
- `express` - Web server framework
- `drizzle-orm` + `drizzle-kit` - TypeScript ORM with migration tools
- `pg` - PostgreSQL driver
- `passport` + `passport-local` - Authentication
- `express-session` + `connect-pg-simple` - Session management
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `archiver` - Snapshot archive creation
- `zod` - Runtime schema validation

**Frontend:**
- `react` + `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing
- `zustand` - Client state management (cart)
- `@radix-ui/*` - Headless UI primitives (26 packages)
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `react-hook-form` + `@hookform/resolvers` - Form management
- `date-fns` - Date utilities

**UI Component Library:**
- shadcn/ui components (custom implementation of Radix UI + Tailwind)
- `class-variance-authority` + `clsx` - Dynamic class name management
- `lucide-react` - Icon library

### Static Assets

**Image Storage:**
- Development: `public/media/` directory served by Express static middleware
- Production: Same structure with Railway volume persistence
- Categories: 32 product images organized by category
- Ingredients: 77 ingredient images (proteins, bases, marinades, fresh ingredients, sauces, toppings)
- Pages: 3 homepage slider images
- Total: 112 normalized images with slug-based naming

**Font Loading:**
- Google Fonts CDN: Poppins (headings) + Lato (body text)
- Preconnect optimization for faster font loading