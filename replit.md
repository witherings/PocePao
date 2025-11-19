# PokePao Poke Bowl Café - Production Ready

### Overview
PokePao is a full-stack e-commerce platform for a Hawaiian poke bowl restaurant, enabling customers to browse the menu, manage their cart, make reservations, and learn about the establishment. It includes a comprehensive admin panel for managing menu items, orders, reservations, and gallery content. The project is designed for production deployment on platforms like Railway.app.

### User Preferences
I prefer iterative development with clear, concise explanations for each step. Please ask for my approval before implementing major changes or architectural shifts. I value clean, readable code and prefer modern JavaScript/TypeScript practices. Do not make changes to the `shared/` folder without explicit instruction.

### System Architecture
The application follows a full-stack architecture with a React 18 (TypeScript) frontend and an Express.js (TypeScript) backend.

**Frontend:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design tokens, `shadcn/ui` components (Radix UI)
- **State Management:** TanStack Query for server state, Zustand for client-side cart state
- **Routing:** Wouter

**Backend:**
- **Framework:** Express.js on Node.js (TypeScript) with trust proxy support
- **API Design:** RESTful
- **Database ORM:** Drizzle ORM with `node-postgres` driver
- **Authentication:** Passport.js with `express-session` and CSRF protection
- **Deployment Optimizations:** Robust connection retry logic, 3-second initialization delay, comprehensive error diagnostics, and IPv6 support for Railway.app.

**UI/UX Decisions:**
- Uses `shadcn/ui` for a modern, accessible component base.
- Tailwind CSS ensures a consistent and customizable design system.

**Feature Specifications:**
- **Customer Facing:** Menu browsing, cart management, online ordering, reservation system, restaurant information, and gallery.
- **Admin Panel:**
    - Full CRUD for menu categories, items (with variant pricing, ingredients, allergens), and custom ingredients.
    - Order viewing with detailed customer and item information.
    - Reservation management with a table view.
    - Gallery management (upload and delete photos).
    - Secure authentication with bcrypt and CSRF protection.
- **Notifications:** Telegram notifications for new orders and reservations.

**System Design Choices:**
- **Database:** PostgreSQL as the primary data store, managed with Drizzle ORM for type-safe queries.
- **Session Management:** `express-session` with `sameSite=strict` cookies.
- **Environment:** Optimized for cloud deployment, specifically Railway.app, with configurations for secure database connections (SSL/TLS auto-detection) and environment variable management.
- **Idempotent Scripts:** Database seeding and admin creation scripts are designed to be idempotent for safe execution on repeated deployments (e.g., Render's free tier `Start Command` chaining).

### External Dependencies
- **Database:** PostgreSQL (via `node-postgres` driver, Drizzle ORM)
- **Deployment Platform:** Railway.app, Render.com
- **Notification Service:** Telegram Bot API (requires `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
- **Authentication Libraries:** Passport.js, bcryptjs
- **Frontend Libraries:** React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Wouter