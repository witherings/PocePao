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

### Recent Changes (November 23, 2025 - MOBILE UX OPTIMIZATION)
**✅ MOBILE INTERFACE REDESIGNED - TWO-STEP WIZARD + COMPACT LAYOUT**
- ✅ **Two-Step Mobile Dialog:**
  - **Step 1:** Large size selection buttons (Klein/Standard) fill screen - more space per button
  - **Step 2:** Horizontal scrollable base/flavor selection - efficient use of space
  - **Step 3:** Summary display before adding to cart
  - Back button on each step for navigation
  
- ✅ **Removed Product Description on Mobile:**
  - Description hidden on mobile views (only shown on desktop)
  - Saves vertical space for better button/form layouts
  - Info is already visible at bottom of menu

- ✅ **Cart Widget Hidden on Mobile with Open Dialogs:**
  - Cart button disappears when MenuItem dialog is open on mobile
  - Still visible on desktop
  - Prevents clutter when customer is making selections

- ✅ **Compact Mobile Layout:**
  - Larger clickable targets for touch interactions
  - Horizontal scroll for base selection (carousel-style)
  - Better spacing on small screens
  - Preserves all functionality in minimal space

### Recent Changes (November 23, 2025 - TELEGRAM BOT MESSAGING OVERHAUL)
**✅ TELEGRAM BOT - COMPLETE GERMAN NOTIFICATIONS WITH FULL ORDER DETAILS**
- ✅ **Complete Telegram Integration:** Restructured `server/notifications.ts` with detailed German messaging
  - **For Wunsch Bowl (Custom Bowls):** Full customization details (base, protein, marinade, fresh, sauce, toppings + all extras)
  - **For Standard Menu Items:** Shows selectedVariant/selectedBase and size information
  - **Price Calculation:** Correctly computes item totals (quantity × price) and order sum
  - **German Format:** Structured, professional German text with clear sections, no filler content
  - **Order Info:** Customer name, phone, service type (Abholung/Im Restaurant), time/table, comments
  - **Extras Breakdown:** Clearly separated extras section with item count and details
  - **Time Format:** German locale formatting for date/time display

- ✅ **Message Structure:** Clean sections with emoji dividers, easy to read in Telegram
- ✅ **Price Verification:** Validates totals match, includes item-by-item price breakdown
- ✅ **Error Handling:** Falls back to console if Telegram not configured, non-blocking for orders

### Recent Changes (November 22, 2025 - COMPLETE IMAGE SYSTEM SYNC)
**✅ COMPLETE IMAGE SYSTEM SYNCHRONIZATION - VERIFIED & NO DUPLICATES**
- ✅ **134 Total Ingredients:** All paths 1-to-1 mapped to real files on disk - ZERO DUPLICATES
  - **Base Ingredients (67):** 4 base + 6 protein + 4 marinade + 29 fresh + 7 sauce + 17 topping
  - **Extra Ingredients (67):** 4 extra_base + 6 extra_protein + 4 extra_marinade + 29 extra_fresh + 7 extra_sauce + 17 extra_topping
  - **File Structure:** Base files without prefix, Extra files prefixed with `extra_` (e.g., `rice.png` vs `extra_rice.png`)
  - **Path Structure:** `/media/pages/Spaisekarte/Wunsch_Bowls/ingredients/{Ingridient_def|Ingridients_extra}/{category}/{filename}`
  - **Ingredient Type Schema:** `base`, `fresh`, `protein`, `marinade`, `sauce`, `topping` for base; `extra_base`, `extra_fresh`, etc. for extras

- ✅ **46 Total Menu Items:** All with image paths correctly synced to disk files
  - **Poke Bowls (9):** All paths synced with base + size variants (e.g., `falafel-freude.webp`, `lachs-lust-quinoa.png`)
  - **Wraps (4):** All synced (e.g., `wrap-haehnchen.webp`, `wrap-tofu.png`)
  - **Vorspeisen (6):** All synced (e.g., `green-salat.webp`, `wakame-salat.webp`)
  - **Desserts (4):** All synced (e.g., `acai-bowl.webp`, `kokoskugel-deluxe.webp`)
  - **Getränke (18):** All synced with correct filenames (e.g., `CAPPUCCINO.jpg`, `Kokostraum.jpg`, `Beck 's Blue.jpg`)
  - **Custom Bowls (1):** Wunsch Bowl with main photo `/media/pages/Spaisekarte/Wunsch_Bowls/main_photo/main.png`

- ✅ **Path Structure:** `/media/pages/Spaisekarte/{Category}/{filename}`
- ✅ **Database:** All 134 ingredients + 46 menu items with verified image paths (no duplicates)
- ✅ **API Ready:** All endpoints return correct file paths with proper URL encoding

### External Dependencies
- **Database:** PostgreSQL (via `node-postgres` driver, Drizzle ORM)
- **Deployment Platform:** Railway.app, Render.com
- **Notification Service:** Telegram Bot API
- **Authentication Libraries:** Passport.js, bcryptjs
- **Frontend Libraries:** React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Wouter