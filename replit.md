# PokePao Poke Bowl Café

### Overview
PokePao is a full-stack e-commerce platform for a Hawaiian poke bowl restaurant, designed for production deployment. It enables customers to browse the menu, manage their cart, make reservations, and learn about the establishment. The platform includes a comprehensive admin panel for managing menu items, orders, reservations, and gallery content, aiming for a robust, scalable, and user-friendly solution in the food service e-commerce market.

### User Preferences
I prefer iterative development with clear, concise explanations for each step. Please ask for my approval before implementing major changes or architectural shifts. I value clean, readable code and prefer modern JavaScript/TypeScript practices. Do not make changes to the `shared/` folder without explicit instruction.

### System Architecture
The application follows a full-stack architecture with a React 18 (TypeScript) frontend and an Express.js (TypeScript) backend.

**UI/UX Decisions:**
- Modern, accessible component base using `shadcn/ui` (Radix UI) with Tailwind CSS for consistent and customizable design.
- Responsive design across desktop and mobile, including larger images in the gallery and improved mobile UX for dish detail dialogs.
- Custom favicon and modern styling in the admin panel with gradient backgrounds, larger input controls, and improved typography.

**Technical Implementations:**
- **Frontend:** React 18, Vite, Tailwind CSS, `shadcn/ui`, TanStack Query for server state, Zustand for client-side cart state, Wouter for routing.
- **Backend:** Express.js on Node.js (TypeScript), RESTful API, Drizzle ORM with `node-postgres`, Passport.js for authentication with `express-session` and CSRF protection.
- **Image Storage:** Organized in `/public/media/` with intelligent category-based routing for menu items, ingredients, gallery, and sliders. All ingredient image paths are standardized and URL encoded.
- **Authentication:** Secure authentication using bcrypt, with a Replit-specific auto-authentication bypass for development.
- **Node.js Compatibility:** Ensured compatibility with Node.js 18+ for Railway deployment.

**Feature Specifications:**
- **Customer Facing:** Database-driven menu browsing, cart management, online ordering, reservation system, restaurant information, and a database-driven gallery.
- **Admin Panel:** Full CRUD for menu categories, items (with variant pricing, ingredients, allergens), custom ingredients, orders management (status tracking), reservations management, dedicated "Startseite" management for Hero Slider and Gallery, and ingredients management. Includes a snapshot system and unified delete confirmation.
- **Notifications:** Telegram notifications for new orders and reservations.
- **Data Validation:** Zod schema validation for all CRUD endpoints.

**System Design Choices:**
- **Database:** PostgreSQL managed with Drizzle ORM for type-safe queries. All data is database-driven.
- **Database Initialization & Verification:** Automated initialization (`server/init-database.ts`) and comprehensive verification (`server/verify-database.ts`) using Drizzle Kit push.
- **Session Management:** `express-session` with `sameSite=strict` cookies.
- **Environment:** Optimized for cloud deployment (Railway.app, Render.com) with robust connection retry logic, secure database connections, and environment variable management.
- **Idempotent Scripts:** Database seeding, admin creation, and gallery import scripts.
- **Menu Ordering:** ID-based sorting in the storage layer for consistent display.
- **Health Monitoring:** `/api/health` endpoint for deployment platform monitoring.

### Recent Changes (November 22, 2025 - COMPLETE IMAGE SYSTEM SYNC)
**✅ COMPLETE IMAGE SYSTEM SYNCHRONIZATION**
- ✅ **134 Total Ingredients:** All paths 1-to-1 mapped to real files on disk
  - **Base Ingredients (67):** 4 bases + 6 proteins + 4 marinades + 30 fresh + 7 sauces + 17 toppings
  - **Extra Ingredients (67):** 4 extra bases + 6 extra proteins + 4 extra marinades + 30 extra fresh + 7 extra sauces + 17 extra toppings
  - **File Naming:** Extra files prefixed with `extra_` (e.g., `extra_rice.png`, `extra_almonds.png`)
- ✅ **Direct File Mapping:** Each ingredient has exact 1-to-1 mapping to file
  - Example: `Lanai` → `/extra_Lanai (Marinade).png` (for extras)
  - Example: `Gozo` → `/Gozo (Marinade).png` (for base)
- ✅ **Path Structure:** `/media/pages/Spaisekarte/Wunsch_Bowls/ingredients/{Ingridient_def|Ingridients_extra}/{category}/{filename}`
- ✅ **41 Menu Items:** All Gerichte photos synced with correct paths in all categories (Poke Bowls, Wraps, Vorspeisen, Desserts, Getränke)
- ✅ **Wunsch Bowl Main Photo:** `/media/pages/Spaisekarte/Wunsch_Bowls/main_photo/main.png`
- ✅ **Database:** All 134 ingredients + 41 menu items with verified image paths
- ✅ **API Ready:** All endpoints return correct file paths with proper URL encoding

### External Dependencies
- **Database:** PostgreSQL (via `node-postgres` driver, Drizzle ORM)
- **Deployment Platform:** Railway.app, Render.com
- **Notification Service:** Telegram Bot API
- **Authentication Libraries:** Passport.js, bcryptjs
- **Frontend Libraries:** React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Wouter