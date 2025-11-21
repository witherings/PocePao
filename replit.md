# PokePao Poke Bowl Café - Production Ready

### Overview
PokePao is a full-stack e-commerce platform for a Hawaiian poke bowl restaurant. It enables customers to browse the menu, manage their cart, make reservations, and learn about the establishment. The platform includes a comprehensive admin panel for managing menu items, orders, reservations, and gallery content. The project is designed for production deployment on platforms like Railway.app, aiming for a robust, scalable, and user-friendly solution in the food service e-commerce market.

### Recent Changes (November 21, 2025)
**File Organization & Category-Based Image Management System**
- ✅ **Complete folder restructuring** — organized `/public/images/` into comprehensive hierarchy:
  - **Categories**: `Wunsch Bowls`, `Poke Bowls`, `Wraps`, `Vorspeisen`, `Desserts`, `Getränke`
  - **Pages**: `Startseite`, `Speisekarte`, `Über Uns`, `Reservierung`, `Kontakt`
  - **Wunsch Bowls nested structure**: `main/` (for hero image 23.jpeg), `zutaten/` (6 ingredient types), `zutaten extra/` (duplicated ingredient types)
- ✅ **Distributed 102 Wunsch Bowl ingredient files** across 6 ingredient types (protein, fresh, marinade, base, sauce, topping) in both `zutaten` and `zutaten extra` folders
- ✅ **Updated all 52 ingredient image paths** in `server/data/ingredients.ts` — changed from `/images/wunschbowl/` to `/images/categories/Wunsch Bowls/zutaten/[type]/`
- ✅ **Enhanced `/api/upload` endpoint** — now supports category-based folder storage with automatic duplication to `zutaten extra` folders
- ✅ **Updated AdminMenu.tsx** — ingredient uploads now pass `type`, `category`, and `duplicateToExtra` parameters for automatic folder organization
- ✅ **Created 23.jpeg** — main hero image placeholder in `public/images/categories/Wunsch Bowls/main/`
- ✅ Server running and all changes hot-reloaded successfully

### User Preferences
I prefer iterative development with clear, concise explanations for each step. Please ask for my approval before implementing major changes or architectural shifts. I value clean, readable code and prefer modern JavaScript/TypeScript practices. Do not make changes to the `shared/` folder without explicit instruction.

### System Architecture
The application follows a full-stack architecture with a React 18 (TypeScript) frontend and an Express.js (TypeScript) backend.

**UI/UX Decisions:**
- Modern, accessible component base using `shadcn/ui` (Radix UI).
- Consistent and customizable design system implemented with Tailwind CSS.
- Responsive design ensuring optimal experience across desktop and mobile, including larger images in the gallery and improved mobile UX for dish detail dialogs.
- Custom favicon and modern styling in the admin panel with gradient backgrounds, larger input controls, and improved typography.

**Technical Implementations:**
- **Frontend:** React 18, Vite, Tailwind CSS, `shadcn/ui`, TanStack Query for server state, Zustand for client-side cart state, Wouter for routing.
- **Backend:** Express.js on Node.js (TypeScript), RESTful API, Drizzle ORM with `node-postgres`, Passport.js for authentication with `express-session` and CSRF protection.
- **Image Uploads:** Configured for persistent storage on Railway.app using a volume mount (`/data/uploads`) with dynamic upload directory resolution for production and development environments.
- **Authentication:** Secure authentication using bcrypt; includes a Replit-specific auto-authentication bypass for development.
- **Node.js Compatibility:** Ensured compatibility with Node.js 18+ for Railway deployment, addressing `import.meta.dirname` issues.

**Feature Specifications:**
- **Customer Facing:** Menu browsing, cart management, online ordering, reservation system, restaurant information, and a database-driven gallery.
- **Admin Panel:**
    - Full CRUD operations for menu categories, items (with variant pricing, ingredients, allergens), and custom ingredients.
    - Order viewing with detailed customer and item information.
    - Reservation management with a table view.
    - Gallery management (upload, view, and delete photos with disk cleanup).
    - Ingredients management with categorization (Protein, Base, Marinade, Fresh, Sauce, Topping).
    - Snapshot system for restoring menu, gallery, and static content while preserving order history.
- **Notifications:** Telegram notifications for new orders and reservations, with flexible bot token configuration.
- **Data Validation:** Zod schema validation implemented for all CRUD endpoints to ensure data integrity.

**System Design Choices:**
- **Database:** PostgreSQL managed with Drizzle ORM for type-safe queries.
- **Database Initialization:** Automated initialization system (`server/init-database.ts`) using Drizzle Kit push for schema creation from `shared/schema.ts` as single source of truth. Includes connection testing, schema creation, data seeding, admin user creation, and verification steps.
- **Database Verification:** Comprehensive verification script (`server/verify-database.ts`) that validates all tables, data integrity, and ingredient types.
- **Session Management:** `express-session` with `sameSite=strict` cookies.
- **Environment:** Optimized for cloud deployment (Railway.app, Render.com) with robust connection retry logic, secure database connections (SSL/TLS), fail-fast error handling, and environment variable management.
- **Idempotent Scripts:** Database seeding, admin creation, and gallery import scripts are idempotent for safe, repeated execution.
- **Menu Ordering:** Implemented ID-based sorting in the storage layer for consistent menu item display.
- **Health Monitoring:** `/api/health` endpoint for deployment platform monitoring and database connection validation.

### External Dependencies
- **Database:** PostgreSQL (via `node-postgres` driver, Drizzle ORM)
- **Deployment Platform:** Railway.app, Render.com
- **Notification Service:** Telegram Bot API (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_ORDER_BOT_TOKEN`, `TELEGRAM_RESERVATION_BOT_TOKEN`)
- **Authentication Libraries:** Passport.js, bcryptjs
- **Frontend Libraries:** React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Wouter
**File Organization Implementation Details:**
- **Storage Structure**: `/public/images/categories/[CategoryName]/[SubFolder]/[IngredientType]/[filename]`
- **Wunsch Bowls Layout**:
  ```
  public/images/categories/Wunsch Bowls/
  ├── main/                              (Hero images)
  │   └── 23.jpeg                       (Main Wunsch Bowl hero image)
  ├── zutaten/                          (Base ingredients for selection)
  │   ├── protein/                      (6 files: Tofu, Falafel, Chicken, Salmon, Shrimp, Tuna)
  │   ├── fresh/                        (16 files: vegetables, greens, etc.)
  │   ├── marinade/                     (4 files: Lanai, Gozo, Capri, Maui)
  │   ├── base/                         (4 files: Rice, Couscous, Quinoa, Zucchini)
  │   ├── sauce/                        (7 files: Teriyaki, Truffle, Mango-Dill, etc.)
  │   └── topping/                      (14 files: Sesame, Nori, Pomegranate, etc.)
  └── zutaten extra/                    (Extra ingredients for cart expansion)
      ├── extra protein/                (Duplicated protein files)
      ├── extra fresh/                  (Duplicated fresh ingredient files)
      ├── extra marinade/               (Duplicated marinades)
      ├── extra base/                   (Duplicated bases)
      ├── extra sauce/                  (Duplicated sauces)
      └── extra topping/                (Duplicated toppings)
  ```
- **Auto-Duplication**: When uploading ingredient images through admin panel with `duplicateToExtra=true`, files are automatically saved to both `zutaten` and `zutaten extra` folders
- **API Behavior**: `/api/upload` endpoint now accepts `type` (ingredient type), `category`, and `duplicateToExtra` parameters for intelligent folder routing
