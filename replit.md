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

### Recent Changes (November 23, 2025 - MOBILE UX OPTIMIZATION - COMPLETE REDESIGN)
**✅ MOBILE INTERFACE COMPLETELY REDESIGNED - RESPONSIVE LAYOUT FITS ANY SCREEN**
- ✅ **Step 1: Size Selection - FILLS 100% AVAILABLE SPACE**
  - Klein/Standard buttons use CSS Grid (grid-rows-2) - fills all space between image & footer
  - Zero gap, minimal padding - maximum space for touch targets
  - Works perfectly on iPhone SE, iPad, all screen sizes
  - Shows price on each size button
  - Auto-skips if item has no size options

- ✅ **Step 2: Base/Variant Selection - DYNAMIC GRID (scales to content)**
  - Vertical buttons use CSS Grid with dynamic row count
  - Single base/flavor only: full grid for maximum button size
  - Multiple variants: scales down but no scrolling needed
  - All buttons visible at once on screen
  - Auto-skips if item has no base/variant selection

- ✅ **Step 3: Beautiful Summary with ALL Details**
  - Selected Size (Klein/Standard) shown at top with badge
  - Selected Variant/Base shown with badge
  - Then full ingredient list in clean vertical format:
    - **Protein** (text)
    - **Marinade** (text)
    - **Frische Zutaten** (tags/badges)
    - **Sauce** (text)
    - **Toppings** (tags/badges)
    - **Allergene** (red tags/badges)
  - This section scrolls if needed (summary is secondary)
  - Perfect information hierarchy

- ✅ **NO SCROLLING on Selection Steps:**
  - Step 1 (Size): Always fits without scroll (2 buttons = 50% each)
  - Step 2 (Base): Adapts to number of variants, no scroll
  - Works on tiny screens (iPhone SE) up to tablets

- ✅ **Removed Product Description on Mobile:**
  - Description only shown on desktop (saves critical space)
  - Info already visible at menu level
  
- ✅ **Cart Widget Hidden on Mobile with Open Dialogs:**
  - Disappears when menu item dialog is open on mobile
  - Prevents visual clutter during selection
  
- ✅ **Smart Auto-Skip Logic:**
  - Items WITHOUT size options skip directly to base selection
  - Items WITHOUT base/variant skip directly to summary
  - Items with neither skip all steps, go straight to add-to-cart

**Technical Implementation:**
- Uses CSS Grid for precise responsive scaling
- `min-h-0` on flex containers for proper height distribution
- Dynamic `gridTemplateRows: repeat(N, 1fr)` for button counts
- Minimal spacing: `gap-1`, padding `px-2 py-1` for compact layout
- All buttons use `flex items-center justify-center` for perfect text centering

### Recent Changes (November 23, 2025 - VARIANT SELECTION FIX - ALWAYS SHOWS WHEN ENABLED)
**✅ PRODUCT VARIANTS NOW ALWAYS VISIBLE WHEN ENABLED IN ADMIN**
- ✅ **Fixed mobile variant selection display:** Items like Fritz-Kola now show flavor selection immediately when the dialog opens on mobile
  - Previously: Mobile dialogs could appear blank if item had no size options but HAD variants
  - Now: Dialog correctly skips size step (if not needed) and goes directly to variant selection
- ✅ **Removed variant rendering conditions:** Desktop and mobile now show variants whenever they exist in the database
  - Previously: Variants only showed if `item.hasVariants === 1` AND `item.variantType === 'flavor'`
  - Now: Variants show if they exist (`flavorVariants.length > 0`), regardless of item flags
- ✅ **Unified logic across mobile and desktop:** Both views now consistently check for variant existence
- ✅ **Solution:** Fixed `MenuItemDialog.tsx`:
  - Step initialization now uses `determineNextStep()` to set correct initial step based on what selections are needed
  - Flavor variants always render on desktop when `flavorVariants.length > 0`
  - Base variants always render when available and no flavor variants exist
  - Mobile variant selection step properly displays and fills available space

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